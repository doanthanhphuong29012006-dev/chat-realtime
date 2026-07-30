const RoomChat = require('../models/rooms-chat.model');

module.exports.isAccept = async (req, res, next) => {
    const roomChatId = req.params.roomChatId;
    const userId = res.locals.user.id;

    const existUserInRoomChat = await RoomChat.findOne({
        _id: roomChatId,
        deleted: false,
        "users.user_id": userId
    });

    if (existUserInRoomChat) {
        next();
    } else {
        res.redirect('/users/friends');
    }
}