const Chat = require('../models/chat.model');

const uploadToCloudinaryHelper = require('../helpers/uploadToCloudinary.js');

module.exports = (io) => {

    io.on('connection', (socket) => {
        socket.on("CLIENT_JOIN_ROOM", (roomChatId) => {
            socket.join(roomChatId);
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