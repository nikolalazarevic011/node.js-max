const express = require("express");
const bodyParser = require('body-parser')

const taskRoutes = require('./routes/taskRoutes')

const app = express();

app.use(bodyParser.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


app.use('/task', taskRoutes)

app.listen(8087);
