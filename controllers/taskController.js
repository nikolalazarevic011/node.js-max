const { validationResult } = require("express-validator");

exports.getTasks = (req, res, next) => {
    res.status(200).json({
        tasks: [
            {
                id: "1",
                title: "First Task",
                content: "Complete the setup of the task manager app",
                creator: "Nikola",
                createdAt: "2024-03-28T08:00:00.000Z",
                status: "completed",
                priority: "low",
            },
            {
                id: "2",
                title: "Second Task",
                content: "Design the frontend UI for task creation",
                creator: "Max",
                createdAt: "2024-03-28T09:30:00.000Z",
                status: "pending",
                priority: "high",
            },
            {
                id: "3",
                title: "Third Task",
                content: "Connect React app with Node.js API",
                creator: "Nikola",
                createdAt: "2024-03-28T11:00:00.000Z",
                status: "pending",
                priority: "medium",
            },
        ],
    });
};

exports.createTask = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { title, content, creator, priority, status } = req.body;

    res.status(201).json({
        message: "Task created successfully",
        task: {
            id: new Date().toISOString(),
            title,
            content,
            creator,
            priority,
            status,
            createdAt: new Date().toISOString(),
        },
    });
};
