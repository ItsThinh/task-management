const md5 = require("md5");
const User = require("../models/user.model");
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