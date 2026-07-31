const User = require('../models/user.model');
const RoomChat = require('../models/rooms-chat.model');
const Chat = require('../models/chat.model');

module.exports.getSidebar = async (req, res, next) => {
    try {
        const userId = res.locals.user.id;
        const myRooms = await RoomChat.find({
            "users.user_id": userId,
            deleted: false
        });

        const sidebarData = [];

        for (const room of myRooms) {
            let roomName = "";
            let roomAvatar = "";

            if (room.typeRoom === "friend") {
                const partner = room.users.find(user => user.user_id.toString() !== userId);
                if (partner) {
                    const partnerInfo = await User.findOne({
                        _id: partner.user_id,
                        deleted: false, 
                        status: "active"
                    }).select("fullName avatar");

                    roomName = partnerInfo.fullName;
                    roomAvatar = partnerInfo.avatar;
                }
            } else {
                roomName = room.title,
                roomAvatar = room.avatar
            }

            if (roomName) {
                const lastMessage = await Chat.findOne({
                    room_chat_id: room.id,
                    deleted: false
                }).sort({ createdAt: -1 });

                let messageContent = "Chưa có tin nhắn";
                let messageTime = "";

                if (lastMessage) {
                    if (lastMessage.content) {
                        messageContent = lastMessage.content;
                    } else if (lastMessage.images && lastMessage.images.length > 0) {
                        messageContent = "[Hình ảnh]";
                    }

                    const date = new Date(lastMessage.createdAt);
                    const hours = date.getHours().toString().padStart(2, '0');
                    const minutes = date.getMinutes().toString().padStart(2, '0');
                    messageTime = `${hours}:${minutes}`;
                }

                sidebarData.push({
                    roomChatId: room.id,
                    roomName: roomName,
                    roomAvatar: roomAvatar,
                    lastMessage: messageContent,
                    messageTime: messageTime
                });
            }
        }

        res.locals.sidebarData = sidebarData;

        next();
    } catch (error) {
        console.error("Lỗi lấy dữ liệu Sidebar:", error);
        next();
    }
}