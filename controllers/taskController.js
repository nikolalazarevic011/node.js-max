const path = require("path");
const { validationResult } = require("express-validator");
const Task = require("../models/Task");
const fs = require("fs");
const User = require("../models/User");

exports.getTasks = async (req, res, next) => {
    try {
        const currentPage = req.query.page || 1;
        const perPage = 5; //same as fronted usually 386. Adding Pagination
        let totalItems = await Task.find().countDocuments();
        const tasks = await Task.find()
            .skip((currentPage - 1) * perPage)
            .limit(perPage);
        res.status(200).json({
            message: "Posts fetched",
            tasks: tasks,
            totalItems: totalItems,
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

exports.createTask = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error(
                "Validation failed, enterer data is incorrect"
            );
            error.statusCode = 422;
            throw error;
        }
        const { title, content, priority, status } = req.body;
        const imageUrl = req.file ? req.file.path.replace(/\\/g, "/") : null; // for linux servers - makes url web friendly

        const task = new Task({
            title,
            content,
            creator: req.userId,
            priority,
            status,
            imageUrl,
        });

        const user = await User.findById(req.userId);
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        user.tasks.push(task._id);
        await task.save();
        await user.save();

        res.status(201).json({
            message: "Task created successfully",
            task,
            creator: { _id: user._id, email: user.email },
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

exports.getTask = async (req, res, next) => {
    try {
        const taskId = req.params.taskId;

        const task = await Task.findById(taskId);
        if (!task) {
            const error = new Error("Could not find Task ");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: "Task fetched", task: task });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

exports.updateTask = async (req, res, next) => {
    try {
        const taskId = req.params.taskId;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error(
                "Validation failed, enterer data is incorrect"
            );
            error.statusCode = 422;
            throw error;
        }
        const { title, content, creator, priority, status } = req.body;
        let imageUrl = req.body.image;
        if (req.file) {
            imageUrl = req.file.path;
        }
        // if (!imageUrl) {
        //     const error = new Error("No File picked");
        //     error.statusCode = 422;
        //     throw error;
        // }

        const task = await Task.findById(taskId);
        if (!task) {
            const error = new Error("Could not find post ");
            error.statusCode = 404;
            throw error;
        }

        if (imageUrl && imageUrl != task.imageUrl) {
            clearImage(task.imageUrl);
        }

        task.title = title;
        task.content = content;
        task.creator = creator;
        task.priority = priority;
        task.status = status;
        task.imageUrl = imageUrl ? imageUrl : task.imageUrl;
        await task.save();

        return res.status(200).json({ message: "Post Updated", task: task });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

exports.deleteTask = async (req, res, next) => {
    try {
        const taskId = req.params.taskId;
        const task = await Task.findById(taskId);
        if (!task) {
            const error = new Error("Could not find Task ");
            error.statusCode = 404;
            throw error;
        }
        //checked logged in user

        if (task.imageUrl) {
            clearImage(task.imageUrl);
        }
        await Task.findByIdAndDelete(taskId);
        return res.status(200).json({ message: "Deleted task" });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

const clearImage = (filePath) => {
    filePath = path.join(__dirname, "..", filePath);
    fs.unlink(filePath, (err) => console.log(err));
};
