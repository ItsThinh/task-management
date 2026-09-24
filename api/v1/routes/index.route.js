const taskRoutes = require("./task.route");
const userRoutes = require("./user.route");

const authMiddleware = require("../../middlewares/auth.middlware");

module.exports = (app) => {
    app.use("/api/v1/tasks", authMiddleware.requireAuth, taskRoutes);
    app.use("/api/v1/users", userRoutes);
}