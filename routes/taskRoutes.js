const express = require("express");
const taskController = require("../controllers/taskController");
const validateTask = require("../middleware/validateTask"); 
const router = express.Router();

router.get("/tasks", taskController.getTasks);
router.post("/tasks", validateTask,taskController.createTask);


module.exports = router;
