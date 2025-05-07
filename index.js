import express from "express";
import bodyParser from "body-parser";
import { Pool } from "pg";

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
    const { email, username, password } = req.body;
    console.log(email, username, password);
});

app.listen(port, () => {
    console.log("The Server is running on port " + port);
});

