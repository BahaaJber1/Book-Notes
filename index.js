import express from "express";
import bodyParser from "body-parser";
import { Pool } from "pg";
import dotevn from "dotenv";
import bcrypt from "bcryptjs";
import { isValidEmail, isValidPassword, isValidUsername, isValidFirstName, isValidLastName, isPasswordMatch } from "./validators.js";
import { emailExists, usernameExists, insertUser } from "./dbHelpers.js";
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

app.get("/signup", async (req, res) => {
    res.render("signup.ejs");
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
    };

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
    if(!isValidFirstName(firstName)) {
        errors.push("First name must be at least 2 characters long and can only contain letters.");
    }
    if(!isValidLastName(lastName)) {
        errors.push("Last name must be at least 2 characters long and can only contain letters.");
    }
    if(!isPasswordMatch(password, matchPassword)) {
        errors.push("Passwords do not match.");
    }
    // if(!isValidPhoneNumber(phoneNumber)) {
    //     errors.push("Invalid phone number format.");
    // }

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

app.listen(port, () => {
    console.log("The Server is running on port " + port);
});

