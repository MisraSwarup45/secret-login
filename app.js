//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRound = 10;
const { urlencoded } = require("body-parser");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});


app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {

    bcrypt.hash(req.body.password, saltRound, function (err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });

        newUser.save((err) => {
            if (err) {
                console.log(err);
            }
            else {
                res.render("secrets");
            }
        });
    });

});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, (err, foundUser) => {
        if (err) {
            console.log(err);
        }
        else {
            if (foundUser) {
                bcrypt.compare(password, foundUser.password, function (err, result) {
                    if (result) {
                        res.render("secrets");
                    }
                });


            }
        }
    });
});


app.listen(3000, () => {
    console.log("Server started at port 3000");
})