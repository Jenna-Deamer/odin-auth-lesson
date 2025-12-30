const pool = require("../db/pool");
const { generatePassword } = require("../auth/passwordUtils");

async function showSignUpForm(req, res) {
    res.render("sign-up-form");
}

async function handleSignUp(req, res, next) {
    try {
        const hashedPassword = await generatePassword(req.body.password);
        await pool.query(
            "INSERT INTO users (username, password, first_name, last_name) VALUES ($1, $2, $3, $4)",
            [req.body.username, hashedPassword, req.body.firstName, req.body.lastName]
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
