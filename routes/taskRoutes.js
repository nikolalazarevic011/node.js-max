const express = require("express");
const taskController = require("../controllers/taskController");
const validateTask = require("../middleware/validateTask");
const router = express.Router();
const upload = require("../middleware/fileUpload");

router.get("/tasks", taskController.getTasks);
router.post(
    "/tasks",
    upload.single("image"), // handles `image` field from form-data
    validateTask,
    taskController.createTask
);
router.get("/task/:taskId", taskController.getTask);
router.put(
    "/task/:taskId",
    upload.single("image"),
    validateTask,
    taskController.updateTask
);

module.exports = router;
