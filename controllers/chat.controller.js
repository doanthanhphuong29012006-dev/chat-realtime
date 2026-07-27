const Chat = require('../models/chat.model');
const User = require('../models/user.model');

const chatSocket = require('../sockets/chat.socket');

// [GET]/chat
module.exports.index = async (req, res) => {
    chatSocket(res);

    const chats = await Chat.find({
        deleted: false
    });

    for (const chat of chats) {
        const userInfo = await User.findOne({
            _id: chat.user_id
        }).select("fullName");

        chat.userInfo = userInfo;
    }

    res.render('pages/chat/index', {
        pageTitle: "Chat",
        chats: chats
    });
}