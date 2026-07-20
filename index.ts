import express from "express";
import pg, { Pool } from "pg";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import connectPgSimple from "connect-pg-simple";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const port = process.env.PORT;
const saltRounds = parseInt(process.env.SALTROUNDS!);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PgSession = connectPgSimple(session);


app.set("trust proxy", 1);
app.use(express.json());

app.use(session({
    store: new PgSession({
        conString: process.env.DATABASE_URL,  
        createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        secure: true
    }
}));

app.use(passport.session());

const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// fix — was missing /dist
app.use(express.static(path.join(__dirname, "expense_tracker_ui/dist")));

app.get("/expenses", async (req, res) => {
    if (req.isAuthenticated()) {
        const user = parseInt(req.user.id);
        const expenses = await db.query("SELECT * FROM expenses WHERE user_id=$1", [user]);
        res.json({ success: true, expenses: expenses.rows })
    } else {
        res.status(401).json({ success: false })
    }
})

app.get("/expenses/summary", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ success: false });
    const user = parseInt(req.user.id);
    try {
        const sum = await db.query("SELECT category, type, SUM(amount) as total FROM expenses WHERE user_id=$1 GROUP BY category, type", [user]);
        res.json({ success: true, summary: sum.rows });
    } catch (err) {
        console.error(err);
    }
})

app.post("/expenses", async (req, res) => {
    const { title, amount, category, type } = req.body;
    try {
        if (req.isAuthenticated()) {
            const user = parseInt(req.user.id);
            const expense = await db.query(
                "INSERT INTO expenses(title,amount,category,type,user_id) VALUES($1,$2,$3,$4,$5) RETURNING id",
                [title, amount, category, type, user]
            );
            res.json({ success: true, id: expense.rows[0].id })
        } else {
            res.json({ success: false });
        }
    } catch (err) {
        res.status(500).json({ error: "Can't add to database" });
        console.log(err);
    }
})

app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        const task = await db.query("SELECT * FROM users WHERE email=$1", [username]);
        if (task.rows.length > 0) {
            res.status(409).send("Email already exists");
        } else {
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                await db.query("INSERT INTO users(email,password) VALUES($1,$2)", [username, hash]);
                res.json({ success: true });
            })
        }
    } catch (err) {
        console.error(err);
    }
})

app.post("/login", passport.authenticate("local"), (req, res) => {
    res.json({ success: true })
})

app.post("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.json({ success: true });
    });
})

app.delete("/expenses/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ success: false });
    const id = parseInt(req.params.id);
    const userId = parseInt(req.user.id);
    try {
        await db.query("DELETE FROM expenses WHERE id=$1 AND user_id=$2", [id, userId]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

passport.use(new Strategy(async function verify(username: string, password:string | number, cb) {
    try {
        const result = await db.query("SELECT * FROM users WHERE email=$1", [username]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) return cb(err);
                return result ? cb(null, user) : cb(null, false);
            })
        } else {
            return cb(null, false);
        }
    } catch (err) {
        cb(err);
    }
}))

passport.serializeUser((user: string, cb) => { cb(null, user) });
passport.deserializeUser((user:string, cb) => { cb(null, user) });

app.get("/*splat", (req, res) => {
    res.sendFile(path.join(__dirname, "expense_tracker_ui/dist/index.html"));
});

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})