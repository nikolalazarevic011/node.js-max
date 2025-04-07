const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const socket = require("./socket");

const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(bodyParser.json());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );
    next();
});

app.use("/task", taskRoutes);
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

mongoose
    .connect(
        "mongodb+srv://nikolawork95:7yVgpXPbZRoqNg1x@cluster0.lxqyqn1.mongodb.net/tasks?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then((result) => {
        const server = app.listen(8087);
        const io = socket.init(server);

        io.on("connection", (socket) => {
            console.log("Client connected");
        });
    })
    .catch((err) => console.log(err));
