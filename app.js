const path = require("node:path");
const express = require("express");
const session = require("express-session");
const userRouter = require("./routes/userRouter");
const messageRouter = require("./routes/messageRouter");
const passport = require("passport");
require("./auth/passportConfig");
require("dotenv").config();
const pool = require('./db/pool');

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");


app.use(session({
    store: new (require('connect-pg-simple')(session))({
        pool: pool,
        tableName: "session"
    }),
    saveUninitialized: false,
    secret: process.env.FOO_COOKIE_SECRET,
    resave: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(userRouter);
app.use(messageRouter);

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});


app.get("/", (req, res) => {
    res.render("index", { user: req.user });
});

app.listen(3000, (error) => {
    if (error) {
        throw error;
    }
    console.log("app listening on port 3000!");
});
