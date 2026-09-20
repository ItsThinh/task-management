const taskRoutes = require("./task.route");
const userRoutes = require("./user.route");

module.exports = (app) => {
    app.use("/api/v1/tasks", taskRoutes);
    app.use("/api/v1/users", userRoutes);
}