const User = require("../v1/models/user.model");

module.exports.requireAuth = async (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        const user = await User.findOne(
            {
                token: token,
                deleted: false
            }
        ).select("-password -token");

        if (!user) {
            return res.json({
                code: 400,
                message: "Token người dùng không hợp lệ"
            });
        }

        req.user = user;
    }
    else {
        return res.json({
            code: 400,
            message: "Không có token"
        });
    }

    next();
}