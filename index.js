const express = require("express");
const database = require("./config/database");
const dns = require('node:dns/promises');
require("dotenv").config();

const Task = require('./models/task.model');

dns.setServers(['1.1.1.1', '8.8.8.8']);
database.connect();
const app = express();
const PORT = process.env.PORT;

app.get("/task", async (req, res) => {
    const tasks = await Task.find({
        deleted: false
    }).select("title status timeStart timeEnd").lean();

    res.json(tasks);
});

app.get("/task/detail/:id", async (req, res) => {
    const tasks = await Task.findOne({
        _id: req.params.id,
        deleted: false
    }).select("title status timeStart timeEnd").lean();

    res.json(tasks);
});

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});