import express from "express";
import bodyParser from "body-parser";
import { Pool } from "pg";
import dotevn from "dotenv";
import bcrypt from "bcryptjs";
import { Validation } from "./validators.js";
import { emailExists, usernameExists, insertUser, login } from "./dbHelpers.js";
import session from "express-session";
dotevn.config();

const db = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});


const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use(session({
    secret: process.env.SECRET, // Change this to a strong, random string in production!
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    res.locals.isLoggedIn = !!req.session.user;
    res.locals.user = req.session.user || null;
    next();
});

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/sign-up", async (req, res) => {
    res.render("signup.ejs");
});

app.get("/sign-in", async (req, res) => {
    res.render("signin.ejs");
});

app.get("/explore", async (req, res) => {
    res.render("explore.ejs");
});


app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const userCredentials = {
        username: username,
        password: password,
    };
    const errors = [];
    
    if(await login(db, userCredentials)) {
        console.log("User logged in successfully:", userCredentials);
        req.session.user = userCredentials.username; // Store the username in the session
        return res.redirect("/explore");
    } else {
        console.log("Invalid username or password:", userCredentials);
        errors.push("Invalid username or password.");
        return res.render("signin.ejs", { errors });
    }
});


app.post("/register", async (req, res) => {
    const { email, username, password, firstName, lastName, matchPassword, phoneNumber} = req.body;
    const user = {
        email: email,
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        matchPassword: matchPassword,
    };
    const errors = Validation(user);
    console.log(errors);
    console.log(email, username, password , firstName, lastName, matchPassword);
    try {
        
        if (await emailExists(db, email)) {
            errors.push("Email already exists.");
        } 
        if (await usernameExists(db, username)) {
            errors.push("Username already exists.");
        }
        if (errors.length > 0) {
            return res.render("signup.ejs", { errors });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const userWithHashedPassword = {
                email: email,
                username: username,
                password: hashedPassword,
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber,
            };
            const newUser = await insertUser(db, userWithHashedPassword);
            console.log("User registered successfully:", newUser);
            return res.redirect("/");
        }

    } catch (err) {
        console.error("Error inserting user:", err);
        errors.push("An error occurred while registering. Please try again later.");
        return res.render("signup.ejs", { errors });
    }
});

app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

app.listen(port, '0.0.0.0',() => {
    console.log("The Server is running on port " + port);
});

