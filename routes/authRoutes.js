const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const validateAuth = require("../middleware/validateAuth");

router.put("/signup", validateAuth, authController.signup);
router.post("/login", authController.login);

module.exports = router;
