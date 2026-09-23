const md5 = require("md5");
const User = require("../models/user.model");
const ForgotPassword = require("../models/forgot-password.model");
const generateHelper = require("../../../helpers/generate");
const sendMailHelper = require("../../../helpers/sendMail");

//[POST] api/v1/users/register
module.exports.register = async (req, res) => {
    req.body.password = md5(req.body.password);

    const emailExist = await User.findOne({
        email: req.body.email,
        deleted: false
    });

    if (emailExist) {
        return res.json({
            code: 400,
            message: "Email đã tồn tại"
        });
    }

    const user = new User({
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password
    });
    await user.save();

    const token = user.token;
    res.cookie("token", token);

    res.json({
        code: 200,
        message: "Tạo tài khoản thành công",
        token
    });
};


//[POST] api/v1/users/login
module.exports.login = async (req, res) => {

    const user = await User.findOne({
        email: req.body.email,
        password: md5(req.body.password),
        deleted: false
    });

    if (!user) {
        return res.json({
            code: 400,
            message: "Email không tồn tại hoặc sai mật khẩu"
        });
    }

    const token = user.token;
    res.cookie("token", token);

    res.json({
        code: 200,
        message: "Đăng nhập thành công",
        token
    });
};

//[POST] api/v1/users/forgot
module.exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    const otpCode = generateHelper.generateRandomInt(6);

    const emailExist = await User.findOne({
        email: email,
        deleted: false
    });
    if (!emailExist) {
        return res.json({
            code: 400,
            message: "Email không tồn tại"
        });
    }

    const forgotPasswordObject = {
        email: email,
        otp: otpCode
    };
    const forgotPassword = new ForgotPassword(forgotPasswordObject);
    await forgotPassword.save();

    sendMailHelper.sendMail(email, "Quên mật khẩu", `Mã OTP của bạn là: ${otpCode}`);

    res.json({
        code: 200,
        message: "Mã OTP đã được gửi",
    })
}

//[POST] api/v1/users/otp
module.exports.otpPassword = async (req, res) => {

    const { email } = req.body;
    const otp = parseInt(req.body.otp);

    const otpPassword = await ForgotPassword.findOne({
        email: email,
        otp: otp
    });

    if (!otpPassword) {
        return res.json({
            code: 400,
            message: "Mã OTP không chính xác"
        });
    }

    const user = await User.findOne({ email }).select(" token ");

    res.cookie("token", user.token);

    res.json({
        code: 200,
        message: "Mã OTP đã được nhận",
        token: user.token
    })
}

//[POST] api/v1/users/reset
module.exports.resetPassword = async (req, res) => {

    const { token, password } = req.body;
    const encryptedPassword = md5(password);

    const user = await User.findOne({ token: token })

    if (user.password === encryptedPassword) {
        return res.json({
            code: 400,
            message: "Vui lòng nhập mật khẩu mới khác mật khẩu cũ"
        });
    }

    await User.updateOne({ token: token }, { password: encryptedPassword })

    res.json({
        code: 200,
        message: "Đã cập nhật mật khẩu"
    })
}