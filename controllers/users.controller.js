const User = require('../models/user.model');

const usersSocket = require('../sockets/users.socket');

// [GET]/users/suggestions
module.exports.suggestions = async (req, res) => {
    const userId = res.locals.user.id;

    const myUser = await User.findOne({
        _id: userId
    });

    const requestFriends = myUser.requestFriends;
    const acceptFriends = myUser.acceptFriends;
    const listFriends = myUser.friendList.map(friend => friend.user_id);

    const users = await User.find({
        $and: [
            { _id: { $ne: userId } },
            { _id: { $nin: requestFriends } },
            { _id: { $nin: acceptFriends } },
            { _id: { $nin: listFriends } }
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

    for (const user of users) {
        const infoFriend = friendList.find(friend => friend.user_id === user.id);

        user.infoFriend = infoFriend;
    }

    res.render('pages/users/friends', {
        pageTitle: "Danh sách bạn bè",
        users: users
    });
}