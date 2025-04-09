const path = require("path");
const { validationResult } = require("express-validator");
const Task = require("../models/Task");
const fs = require("fs");
const User = require("../models/User");
const socket = require("../socket");
const { uploadToS3, deleteFromS3 } = require("../utils/s3Upload");

exports.getTasks = async (req, res, next) => {
    try {
        const currentPage = req.query.page || 1;
        const perPage = 5; //same as fronted usually 386. Adding Pagination
        let totalItems = await Task.find().countDocuments();
        const tasks = await Task.find()
            .sort({ createdAt: -1 })
            .skip((currentPage - 1) * perPage)
            .limit(perPage);
        socket.getIO().emit("tasks", { action: "get", tasks: tasks });
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
        let imageUrl = null;

        // 🔴 Upload image to S3 if file exists
        if (req.file) {
            const result = await uploadToS3(req.file);
            imageUrl = result.Location; // 🔴 Get public S3 URL
        }
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

        socket.getIO().emit("task", { action: "create", task: task });
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
            const result = await uploadToS3(req.file);
            imageUrl = result.Location;
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

        if (task.creator.toString() !== req.userId) {
            const error = new Error("Not authorized");
            error.statusCode = 403;
            throw error;
        }

        if (imageUrl && imageUrl != task.imageUrl) {
            await deleteFromS3(task.imageUrl);
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
        if (task.creator.toString() !== req.userId) {
            const error = new Error("Not authorized");
            error.statusCode = 403;
            throw error;
        }

        if (task.imageUrl) {
            await deleteFromS3(task.imageUrl);
        }
        await Task.findByIdAndDelete(taskId);
        const user = await User.findById(req.userId);
        await user.tasks.pull(taskId);
        await user.save();
        return res.status(200).json({ message: "Deleted task" });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};
