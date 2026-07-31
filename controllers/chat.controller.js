const Chat = require('../models/chat.model');
const User = require('../models/user.model');
const RoomChat = require('../models/rooms-chat.model');

const chatSocket = require('../sockets/chat.socket');

// [GET]/chat/roomChatId
module.exports.index = async (req, res) => {
    const roomChatId = req.params.roomChatId;

    const roomChat = await RoomChat.findOne({
        _id: roomChatId,
        deleted: false
    });

    const partnerId = roomChat.users.find(userId => userId.user_id.toString() !== res.locals.user.id);
    const partner = await User.findOne({
        _id: partnerId.user_id,
        deleted: false,
        status: "active"
    }).select("fullName avatar statusOnline");

    const chats = await Chat.find({
        room_chat_id: roomChatId,
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
        chats: chats,
        partner: partner,
        roomChat: roomChat
    });
}