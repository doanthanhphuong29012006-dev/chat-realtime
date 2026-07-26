const Chat = require('../models/chat.model');
const User = require('../models/user.model');

// [GET]/chat
module.exports.index = async (req, res) => {
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;

    _io.once('connection', (socket) => {
        socket.on("CLIENT_SEND_MESSAGE", async (content) => {
            const chat = new Chat({
                user_id: userId,
                content: content
            });

            await chat.save();

            _io.emit("SERVER_RETURN_MESSAGE", {
                userId: userId,
                fullName: fullName,
                content: content
            });
        });

        // Typing
        socket.on("CLIENT_SEND_TYPING", async (type) => {
            socket.broadcast.emit("SERVER_RETURN_TYPING", {
                userId: userId,
                fullName: fullName,
                type: type
            });
        });
        // End Typing
    });

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