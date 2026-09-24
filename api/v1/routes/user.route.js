const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/auth.middlware");
const controller = require("../controllers/user.controller");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/detail", authMiddleware.requireAuth, controller.detail);
router.post("/password/forgot", controller.forgotPassword);
router.post("/password/otp", controller.otpPassword);
router.post("/password/reset", controller.resetPassword);

module.exports = router;