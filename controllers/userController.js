const pool = require("../db/pool");
const { generatePassword } = require("../auth/passwordUtils");
const { body, validationResult, matchedData } = require("express-validator");
const { checkIfEmailIsInUse } = require("../db/queries");

const authLengthErr = 'Must be between 1 and 50 characters.';
const passwordMatchErr = 'Passwords must match';
const passwordLength = 'Password must be between 8 and 50 characters'

const validateSignUp = [
    body('firstName').trim()
        .isLength({ min: 1, max: 50 }).withMessage(`First name: ${authLengthErr}`),
    body('lastName').trim()
        .isLength({ min: 1, max: 50 }).withMessage(`Last name: ${authLengthErr}`),
    body('username').trim().isEmail().withMessage('Please enter a valid email address.')
        .custom(async (emailAddress) => {
            const user = await checkIfEmailIsInUse(emailAddress);
            if (user) {
                throw new Error('Email already in use');
            }
            return true;
        }),
    body('password').trim()
        .isLength({ min: 8, max: 50 }).withMessage(`Last name: ${passwordLength}`),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords must match!');
        }
        return value === req.body.password;
    }),
]
async function showSignUpForm(req, res) {
    res.render("sign-up-form");
}

async function handleSignUp(req, res, next) {
    // Collect errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).render("sign-up-form", {
            errors: errors.array(),
        });
    }

    try {
        // confirm passwords match
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
    validateSignUp
};
