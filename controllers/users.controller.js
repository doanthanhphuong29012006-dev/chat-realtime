const User = require('../models/user.model')

// [GET]/users/suggestions
module.exports.suggestions = async (req, res) => {
    const userId = res.locals.user.id;

    const users = await User.find({
        _id: { $ne: userId },
        deleted: false,
        status: "active"
    }).select("id avatar fullName");

    res.render('pages/users/suggestions', {
        pageTitle: "Gợi ý kết bạn",
        users: users
    });
}