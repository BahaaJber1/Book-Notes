import express from "express";
import bodyParser from "body-parser";
import { Pool } from "pg";
import dotevn from "dotenv";
import bcrypt from "bcryptjs";
import { Validation } from "./validators.js";
import { emailExists, usernameExists, insertUser, login } from "./dbHelpers.js";
import session from "express-session";
import axios from "axios";
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
    res.locals.userId = req.session.userId || null;
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

app.get("/add-note", async (req, res) => {
    const { bookTitle, bookAuthor, coverUrl } = req.query;
    if (bookTitle && bookAuthor && coverUrl) {
        // Show the note form with book details
        return res.render("booknote.ejs", {
            isExists: true,
            bookTitle,
            bookAuthor,
            coverUrl,
            note: ""
        });
    }
    // Show the initial form to enter a book title
    res.render("booknote.ejs", { isExists: false });
});

app.post('/booknote', async (req, res) => {
    const userId = req.session.userId;
    const { bookTitle, bookAuthor, coverUrl, note } = req.body;
    const result = await db.query(
        "INSERT INTO books (user_id, title, author, cover_url, note) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [userId, bookTitle, bookAuthor, coverUrl, note]
    );
    const book = result.rows[0];
    res.redirect("/explore");
});
    


app.post("/get-cover", async (req, res) => {
    const bookTitle = req.body.title;
    if (!bookTitle) {
        return res.render("booknote.ejs", { isExists: false, error: "Please enter a book title." });
    }
    const searchURL = `https://openlibrary.org/search.json?title=${encodeURIComponent(bookTitle)}`;
    const size = 'M';
    try {
        const response = await axios.get(searchURL);
        const data = response.data;
        if (data.docs.length > 0) {
            const bookWithCover = data.docs.find(doc => doc.cover_i);
            const bookAuthor = bookWithCover.author_name ? bookWithCover.author_name.join(", ") : "Unknown";
            const coverUrl = `https://covers.openlibrary.org/b/id/${bookWithCover.cover_i}-${size}.jpg`;
            const bookTitle = bookWithCover.title;
            return res.render("booknote.ejs", {
                isExists: true,
                bookTitle,
                bookAuthor,
                coverUrl,
                note: ""
            });
        } else {
            return res.render("booknote.ejs", { isExists: false, error: "No cover found for this book." });
        }
    } catch (error) {
        console.error('Error fetching book cover:', error.message);
        return res.status(500).json({ error: 'Failed to fetch book cover.' });
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const userCredentials = { username, password };
    const errors = [];

    // Check credentials
    if (await login(db, userCredentials)) {
        // Fetch user row to get the user ID
        const userRow = await db.query("SELECT id FROM users WHERE username = $1", [username]);
        if (userRow.rows.length > 0) {
            req.session.userId = userRow.rows[0].id;
            req.session.user = username;
            return res.redirect("/explore");
        } else {
            errors.push("User not found.");
            return res.render("signin.ejs", { errors });
        }
    } else {
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

