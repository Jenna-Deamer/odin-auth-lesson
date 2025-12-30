const path = require("node:path");
const bcrypt = require('bcryptjs');
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const userRouter = require("./routes/userRouter");
const LocalStrategy = require('passport-local').Strategy;
require("dotenv").config();
const pool = require('./db/pool');

const app = express();
app.set("views", path.join(__dirname, "views"));
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

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});


app.get("/", (req, res) => {
    res.render("index", { user: req.user });
});


passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
            const user = rows[0];

            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                // passwords do not match!
                return done(null, false, { message: "Incorrect password" })
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        const user = rows[0];

        done(null, user);
    } catch (err) {
        done(err);
    }
});


app.listen(3000, (error) => {
    if (error) {
        throw error;
    }
    console.log("app listening on port 3000!");
});
