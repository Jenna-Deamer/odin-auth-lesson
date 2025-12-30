const passport = require("passport");
const { findUserByName, findUserById } = require("../db/queries");
const { validatePassword } = require("./passwordUtils");
const LocalStrategy = require('passport-local').Strategy;


async function verifyCallback(username, password, done) {
    try {
        const rows = await (findUserByName(username));
        const user = rows[0];

        if (!user) {
            return done(null, false)
        }
        const match = await validatePassword(password, user.password);

        if (match) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        return done(err);
    }
}

const strategy = new LocalStrategy(verifyCallback);
passport.use(strategy);


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const rows = await (findUserById(id));
        const user = rows[0];

        done(null, user);
    } catch (err) {
        done(err);
    }
});
