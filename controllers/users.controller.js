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

// [GET]/users/accept
module.exports.accept = async (req, res) => {
    // Socket
    usersSocket(res);
    // End Socket
    const userId = res.locals.user.id;

    const myUser = await User.findOne({
        _id: userId
    });

    const acceptFriends = myUser.acceptFriends;

    const users = await User.find({
        _id: { $in: acceptFriends },
        deleted: false,
        status: "active"
    }).select("id avatar fullName");

    res.render('pages/users/accept', {
        pageTitle: "Lời mời đã nhận",
        users: users
    });
}

// [GET]/users/friends
module.exports.friends = async (req, res) => {
    // Socket
    usersSocket(res);
    // End Socket
    const userId = res.locals.user.id;

    const myUser = await User.findOne({
        _id: userId
    });

    const friendList = myUser.friendList;
    const friendListId = friendList.map(friend => friend.user_id);

    const users = await User.find({
        _id: { $in: friendListId },
        deleted: false,
        status: "active"
    }).select("id avatar fullName statusOnline");

    res.render('pages/users/friends', {
        pageTitle: "Danh sách bạn bè",
        users: users
    });
}