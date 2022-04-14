require("dotenv").config();
const compression = require('compression')
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const Book = require("./models/book");
const adminRoutes = require("./routes/adminRoutes");
const app = express();

const hash = (password) => crypto.createHash("sha256").update(password).digest("base64");

mongoose
    .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(process.env.PORT))
    .catch((err) => console.log(err));

const msgs = {
    1: "Successfully printed a book",
    2: "Successfully reprinted a book",
    3: "Book cover couldn't be uploaded",
};

app.use(compression())
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
    req.isVerified = req.cookies.access_token == hash(process.env.ADMIN_PASSWORD);
    req.msg = req.query.msg && msgs[req.query.msg] ? msgs[req.query.msg] : "";
    next();
});

app.set("view engine", "ejs");

app.get("/", (req, res, next) => {
    Book.find()
        .sort({ title: 1 })
        .limit(8)
        .then((result) => res.render("index", { books: result }))
        .catch((err) => res.render("404", { err }));
});

app.post("/findBook", (req, res) => {
    res.redirect("/books/" + req.body.title)
});

app.get("/books/:title", (req, res) => {
    const reg = new RegExp(req.params.title, "i");
    Book.find({ title: { $in: reg } })
        .sort({ title: 1 })
        .then((result) => res.render("books", { books: result }))
        .catch((err) => res.render("404", { err }));
});

app.get("/book/:id", (req, res) => {
    Book.findById(req.params.id).then((result) => {
        res.render("book", { book: result });
    });
});

app.get("/login", (req, res) => {
    if (req.isVerified) {
        res.redirect("/admin");
    } else {
        res.render("login");
    }
});

app.post("/api/login", (req, res) => {
    const { password } = req.body;
    if (!password) {
        return res.sendStatus(400);
    }
    if (password !== process.env.ADMIN_PASSWORD) {
        return res.sendStatus(401);
    }
    const passHash = hash(password);
    res.cookie("access_token", passHash);
    res.redirect("/admin");
});

app.use("/admin", adminRoutes);

app.use((req, res) => {
    res.render("404");
});
