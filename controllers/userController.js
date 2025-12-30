const bcrypt = require("bcryptjs");
const pool = require("../db/pool");

async function showSignUpForm(req, res) {
    res.render("sign-up-form");
}

async function handleSignUp(req, res, next) {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await pool.query(
            "INSERT INTO users (username, password) VALUES ($1, $2)",
            [req.body.username, hashedPassword]
        );
        res.redirect("/");
    } catch (error) {
        console.error(error);
        next(error);
    }
}

function handleLogOut(req, res, next) {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect("/");
    });
}

module.exports = {
    showSignUpForm,
    handleSignUp,
    handleLogOut,
};
