const { body } = require("express-validator");
const User = require("../models/User");

const validateAuth = [
    body("email")
        .isEmail()
        .withMessage("Please enter a valid email.")
        .custom((value, { req }) => {
            return User.findOne({ email: value }).then((userDoc) => {
                if (userDoc) {
                    return Promise.reject("E-Mail address already exists!");
                }
            });
        })
        .normalizeEmail(), // Normalize email to avoid case sensitivity and other variations

    body("password").trim().isLength({ min: 5 }), // Password should have at least 5 characters

];

module.exports = validateAuth;
