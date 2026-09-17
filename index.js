const express = require("express");
const database = require("./config/database");
const dns = require('node:dns/promises');
require("dotenv").config();
const route = require("./api/v1/routes/index.route");

dns.setServers(['1.1.1.1', '8.8.8.8']);
database.connect();
const app = express();
const PORT = process.env.PORT;

route(app);

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});