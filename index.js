import express from "express";
import pg, { Pool } from "pg";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import {Strategy} from "passport-local"
import cors from "cors";
import connectPgSimple from "connect-pg-simple";

const app = express();
const port = 3000;
const saltRounds= 10;

dotenv.config();

app.use(cors({ 
    origin: "http://localhost:5173", credentials: true 
}));

app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        secure: false
    }
  }));

app.use(passport.session())


const db = new Pool({
    host: process.env.DB_HOST,
    user:process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password:process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})

app.get("/expenses", async (req,res) => {
    if(req.isAuthenticated()) {
        const user = parseInt(req.user.id);
        const expenses = await db.query("SELECT * FROM expenses WHERE user_id=$1", [user]);
        res.json({ success: true, expenses: expenses.rows })
    } else {
        res.status(401).json({ success: false })
    }
})

app.get("/expenses/summary", async(req,res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false })
    };
    const user = parseInt(req.user.id);

    try {
        const sum= await db.query("SELECT category, type, SUM(amount) as total FROM expenses WHERE user_id=$1 GROUP BY category, type", [user]);
        res.json({success:true, summary: sum.rows});
    } catch(err) {
        console.error(err);
    }
})

app.post("/expenses", async(req,res) => {
    const title = req.body.title;
    const amount= req.body.amount;
    const category= req.body.category;
    const type= req.body.type;
    
    try {
        if(req.isAuthenticated()) {
            const user= parseInt(req.user.id);
            const expense = await db.query("INSERT INTO expenses(title,amount, category, type,user_id) VALUES($1,$2,$3,$4,$5) RETURNING id", [title,amount,category, type, user,]);
            res.json({ success: true, id: expense.rows[0].id })            
        } else {
            res.json({ success: false });

        }
    } catch(err) {
        res.status(501).json({error: "Cant add to database"})
        console.log(err)
    }
})

app.post("/register", async (req,res) => {
    const username= req.body.username;
    const password= req.body.password;

    try {
        const task = await db.query("SELECT * FROM users WHERE email=$1", [username]);

        if(task.rows.length > 0) {
            res.status(500).send("Email already exists");
        } else {
            bcrypt.hash(password, saltRounds, async (err,hash) => {
               await db.query("INSERT INTO users(email,password) VALUES($1,$2)", [username, hash]);
                res.json({success:true});
            })
        }
    } catch(err) {
        console.error(err)
    }
})

app.post("/login", passport.authenticate("local"), (req,res) => {
    res.json({ success: true })
})

passport.use(new Strategy(async function verify(username, password, cb) {
    try{
        const result = await db.query("SELECT * FROM users WHERE email=$1",[username]);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            const storedPassword = user.password; 
            bcrypt.compare(password, storedPassword, async (err, result) => {
                if(err) {
                    return cb(err)
                    console.error(err)
                } else {
                    if(result) {
                        return cb(null, user)
                    } else {
                        return cb(null,false)
                    }
                }
            } )
        } else {
            return cb(null,false)
        }
        
    } catch(err) {
        cb(err);
        console.log(err);
    }
}))

app.post("/logout", (req,res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.json({ success: true });
    });
})

app.delete("/expenses/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false })
    };
    const id = parseInt(req.params.id); 
    const userId = parseInt(req.user.id);
    await db.query("DELETE FROM expenses WHERE id=$1 AND user_id=$2", [id, userId]);
    res.json({ success: true });
  });

passport.serializeUser((user,cb) => {
    cb(null,user)
});

passport.deserializeUser((user,cb) => {
    cb(null,user)
});

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})