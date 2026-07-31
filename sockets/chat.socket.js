const Chat = require('../models/chat.model');
const RoomChat = require('../models/rooms-chat.model.js');
const User = require('../models/user.model.js');

const uploadToCloudinaryHelper = require('../helpers/uploadToCloudinary.js');

const onlineTimeouts = {};

module.exports = (io) => {

    io.on('connection', (socket) => {
        socket.on("CLIENT_JOIN_ROOM", (roomChatId) => {
            socket.join(roomChatId);
        });

        socket.on("CLIENT_JOIN_GLOBAL", async (userId) => {
            socket.join(userId);
            socket.userId = userId;

            if (onlineTimeouts[userId]) {
                clearTimeout(onlineTimeouts[userId]);
                delete onlineTimeouts[userId];
            }

            await User.updateOne({ 
                _id: userId 
            }, { 
                statusOnline: "online" 
            });

            socket.broadcast.emit("SERVER_RETURN_USER_STATUS_ONLINE", {
                userId: userId,
                status: "online"
            });
        });

        socket.on('disconnect', async () => {
            const userId = socket.userId;

            if (userId) {
                const activeTabs = io.sockets.adapter.rooms.get(userId);
                if (!activeTabs || activeTabs.size === 0) {
                    onlineTimeouts[userId] = setTimeout(async () => {
                        await User.updateOne({ 
                            _id: userId 
                        }, { 
                            statusOnline: "offline" 
                        });

                        socket.broadcast.emit("SERVER_RETURN_USER_STATUS_ONLINE", {
                            userId: userId,
                            status: "offline"
                        });

                        delete onlineTimeouts[userId];
                    }, 3000);
                }
            }
        });

        socket.on("CLIENT_SEND_MESSAGE", async (data) => {
            let images = [];
            for (const imageBuffer of data.images) {
                const link = await uploadToCloudinaryHelper(imageBuffer);
                images.push(link);
            }
            
            const chat = new Chat({
                user_id: data.userId,
                room_chat_id: data.roomChatId,
                content: data.content,
                images: images
            });

            await chat.save();

            io.to(data.roomChatId).emit("SERVER_RETURN_MESSAGE", {
                userId: data.userId,
                fullName: data.fullName,
                content: data.content,
                images: images
            });

            const room = await RoomChat.findOne({
                _id: data.roomChatId,
                deleted: false
            });
            if (room) {
                for (const member of room.users) {
                    io.to(member.user_id).emit("SERVER_RETURN_SIDEBAR", {
                        roomChatId: data.roomChatId,
                        content: data.content,
                        images: images
                    });
                }
            }
        });

        // Typing
        socket.on("CLIENT_SEND_TYPING", async (data) => {
            socket.broadcast.to(data.roomChatId).emit("SERVER_RETURN_TYPING", {
                userId: data.userId,
                fullName: data.fullName,
                type: data.type
            });
        });
        // End Typing
    });
}