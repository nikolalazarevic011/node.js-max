const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error("Validation failed");
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

        const email = req.body.email;
        const password = req.body.password;

        const hashedPass = await bcrypt.hash(password, 12);
        const user = new User({
            email: email,
            password: hashedPass,
            tasks: [],
        });
        await user.save();
        res.status(201).json({
            message: "User Created",
            userId: user._id,
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        //no validation cuz we're checking pass email match under anyway

        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({ email: email });
        if (!user) {
            const error = new Error("No user found for that email");
            error.statusCode = 401;
            throw error;
        }

        const passCompare = bcrypt.compare(password, user.password);

        if (!passCompare) {
            const error = new Error("Wrong Password");
            error.statusCode = 401;
            throw error;
        }

        //supersecretkey
        const token = jwt.sign(
            { email: user.email, userId: user._id },
            "lsldjajwejoiopijwfeoijdwwdweoppoipaaccj3432908902348234892",
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Welcome",
            userId: user._id.toString(),
            token: token,
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};
