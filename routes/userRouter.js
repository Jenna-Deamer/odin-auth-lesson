const { Router } = require("express");
const passport = require("passport");
const usersController = require("../controllers/userController");
const usersRouter = Router();

usersRouter.get("/sign-up", usersController.showSignUpForm);

usersRouter.post("/sign-up", usersController.validateSignUp, usersController.handleSignUp);

usersRouter.post("/log-in", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
})
);

usersRouter.get("/log-out", usersController.handleLogOut);

module.exports = usersRouter;
