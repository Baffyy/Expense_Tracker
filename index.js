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

app.use(express.json());

const db = new Pool({
    host: process.env.DB_HOST,
    user:process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password:process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})

app.post("/register", async (req,res) => {
    const email= req.body.email;
    const password= req.body.password;

    try {
        const task = await db.query("SELECT * FROM users WHERE email=$1", [email]);

        if(task.rows.length > 0) {
            res.status(500).send("Email already exists");
        } else {
            bcrypt.hash(password, saltRounds, async (err,hash) => {
               await db.query("INSERT INTO users(email,password) VALUES($1,$2)", [email, hash]);
                res.json({success:true});
            })
        }
    } catch(err) {
        console.error(err)
    }
})


app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})