const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

module.exports.requireAuth = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        req.flash('error', "Vui lòng đăng nhập để tiếp tục!");
        res.redirect('/auth/login');
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({
            _id: decoded.userId,
            deleted: false,
            status: "active"
        }).select("-password");

        if (!user) {
            res.clearCookie("token");
            res.redirect('/auth/login');
            return;
        }

        res.locals.user = user;

        next();
    } catch (error) {
        res.clearCookie("token");
        req.flash('error', "Phiên đăng nhập hết hạn hoặc không hợp lệ!");
        res.redirect('/auth/login');
        return;
    }
}