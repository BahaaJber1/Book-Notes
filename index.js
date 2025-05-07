import express from "express";
import bodyParser from "body-parser";
import { Pool } from "pg";
import dotevn from "dotenv";
import { isValidEmail, isValidPassword, isValidUsername, isValidFirstName, isValidLastName, isPasswordMatch } from "./validators.js";
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

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/signup", (req, res) => {
    res.render("signup.ejs");
});

app.post("/register", (req, res) => {
    const { email, username, password, firstName, lastName, matchPassword } = req.body;
    let errors = [];

    if (!isValidEmail(email)) {
        errors.push("Invalid email format");
    }
    if(!isValidPassword(password)) {
        errors.push("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
    }
    if(!isValidUsername(username)) {
        errors.push("Username must be at least 3 characters long and can only contain letters, numbers, and underscores.");
    }
    if(!isValidFirstName(req.body.firstName)) {
        errors.push("First name must be at least 2 characters long and can only contain letters.");
    }
    if(!isValidLastName(req.body.lastName)) {
        errors.push("Last name must be at least 2 characters long and can only contain letters.");
    }
    if(!isPasswordMatch(password, matchPassword)) {
        errors.push("Passwords do not match.");
    }
    // if(!isValidPhoneNumber(req.body.phoneNumber)) {
    //     errors.push("Invalid phone number format.");
    // }

    console.log(email, username, password);
    
    if(errors.length > 0) {
        return res.render("signup.ejs", { errors });
    }
    
});

app.listen(port, () => {
    console.log("The Server is running on port " + port);
});

