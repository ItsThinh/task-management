const mongoose = require('mongoose');

const forgotPasswordSchema = new mongoose.Schema(
    {
        email: String,
        otp: String,
        expireAt: {
            type: Date,
            default: () => Date.now() + 3 * 60 * 1000,
            expires: 0
        }
    },
    {
        timestamps: true
    }
);

const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema, 'forgot-passwords');

module.exports = ForgotPassword;