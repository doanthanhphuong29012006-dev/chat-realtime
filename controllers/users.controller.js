const User = require('../models/user.model');

const usersSocket = require('../sockets/users.socket');

// [GET]/users/suggestions
module.exports.suggestions = async (req, res) => {
    // Socket
    usersSocket(res);
    // End Socket
    const userId = res.locals.user.id;

    const myUser = await User.findOne({
        _id: userId
    });

    const requestFriends = myUser.requestFriends;
    const acceptFriends = myUser.acceptFriends;

    const users = await User.find({
        $and: [
            { _id: { $ne: userId } },
            { _id: { $nin: requestFriends } },
            { _id: { $nin: acceptFriends } }
        ],
        deleted: false,
        status: "active"
    }).select("id avatar fullName");

    res.render('pages/users/suggestions', {
        pageTitle: "Gợi ý kết bạn",
        users: users
    });
}

// [GET]/users/requests
module.exports.requests = async (req, res) => {
    // Socket
    usersSocket(res);
    // End Socket
    const userId = res.locals.user.id;

    const myUser = await User.findOne({
        _id: userId
    });

    const requestFriends = myUser.requestFriends;
    const acceptFriends = myUser.acceptFriends;

    const users = await User.find({
        _id: { $in: requestFriends },
        deleted: false,
        status: "active"
    }).select("id avatar fullName");

    res.render('pages/users/requests', {
        pageTitle: "Lời mời đã gửi",
        users: users
    });
}