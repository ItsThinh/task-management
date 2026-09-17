const taskRoutes = require("./task.route");

module.exports = (app) => {
    app.use("/api/v1/tasks", taskRoutes);
}