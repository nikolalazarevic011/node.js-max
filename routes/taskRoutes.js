const express = require("express");
const taskController = require("../controllers/taskController");
const validateTask = require("../middleware/validateTask");
const router = express.Router();
const upload = require("../middleware/fileUpload");
const isAuth = require("../middleware/isAuth");

router.get("/tasks", isAuth, taskController.getTasks);
router.post(
    "/tasks",
    isAuth,
    upload.single("image"), // handles `image` field from form-data
    validateTask,
    taskController.createTask
);
router.get("/task/:taskId", isAuth, taskController.getTask);
router.delete("/task/:taskId", isAuth, taskController.deleteTask);
router.put(
    "/task/:taskId",
    isAuth,
    upload.single("image"),
    validateTask,
    taskController.updateTask
);

module.exports = router;
