const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// [GET]/auth/login
module.exports.login = (req, res) => {
    res.render('pages/auth/login', {
        pageTitle: "Đăng nhập"
    });
}

// [POST]/auth/login
module.exports.loginPost = async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email
        });

        if (user) {
            const password = req.body.password;

            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                const payload = {
                    userId: user._id,
                    email: user.email
                };

                const token = jwt.sign(payload, process.env.JWT_SECRET, {
                    expiresIn: '1d'
                });

                res.cookie('token', token, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24
                });

                await User.updateOne({
                    _id: user._id
                }, {
                    statusOnline: "online"
                });

                _io.emit('SERVER_RETURN_USER_STATUS_ONLINE', {
                    userId: user.id,
                    status: "online"
                });

                req.flash('success', "Đăng nhập thành công!");
                res.redirect('/');
            } else {
                req.flash('error', "Mật khẩu không chính xác!");
                const currentUrl = req.get('Referrer');
                res.redirect(currentUrl);
                return;
            }
        } else {
            req.flash('error', "Người dùng không tồn tại!");
            const currentUrl = req.get('Referrer');
            res.redirect(currentUrl);
            return;
        }
    } catch (error) {
        console.error("Lỗi Controller Login:", error);
        req.flash('error', "Hệ thống đang bận, vui lòng thử lại sau!");
        const currentUrl = req.get('Referrer');
        res.redirect(currentUrl);
        return;
    }
}

// [GET]/auth/register
module.exports.register = (req, res) => {
    res.render('pages/auth/register', {
        pageTitle: "Đăng ký"
    });
}

// [POST]/auth/register
module.exports.registerPost = async (req, res) => {
    try {
        const email = req.body.email;
        const fullName = req.body.fullName;
        const password = req.body.password;

        const existEmail = await User.findOne({
            email: email
        });

        if (existEmail) {
            req.flash('error', "Email đã tồn tại!");
            const currentUrl = req.get('Referrer');
            res.redirect(currentUrl);
            return;
        } else {
            if (password === req.body.confirmPassword) {
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(password, salt);

                req.body.password = hash;

                const user = new User(req.body);
                await user.save();

                req.flash('success', "Đăng ký tài khoản thành công!");
                res.redirect('/auth/login');
            } else {
                req.flash('error', "Mật khẩu không trùng khớp!");
                const currentUrl = req.get('Referrer');
                res.redirect(currentUrl);
                return;
            }
        }
    } catch (error) {
        console.error("Lỗi Controller Register:", error);
        req.flash('error', "Hệ thống đang bận, vui lòng thử lại sau!");
        const currentUrl = req.get('Referrer');
        res.redirect(currentUrl);
        return;
    }
}

// [GET] /auth/logout
module.exports.logout = async (req, res) => {
    try {
        const userId = res.locals.user.id;

        await User.updateOne({
            _id: userId
        }, {
            statusOnline: "offline"
        });

        _io.emit('SERVER_RETURN_USER_STATUS_ONLINE', {
            userId: userId,
            status: "offline"
        });

        res.clearCookie("token");
        res.redirect("/auth/login");
    } catch (error) {
        console.error("Lỗi hệ thống trong quá trình đăng xuất:", error);
        res.clearCookie("token");
        res.redirect("/auth/login");
    }
}

