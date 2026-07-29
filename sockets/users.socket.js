const User = require('../models/user.model');

module.exports = (res) => {
    _io.once('connection', (socket) => {
        // Request Submission Feature
        socket.on("CLIENT_ADD_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;
            
            const existIdAinB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            });

            if (!existIdAinB) {
                await User.updateOne({
                    _id: userId
                }, {
                    $push: { acceptFriends: myUserId }
                });
            }

            const existIdBinA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            });

            if (!existIdBinA) {
                await User.updateOne({
                    _id: myUserId
                }, {
                    $push: { requestFriends: userId }
                });
            }

            const infoUserB = await User.findOne({
                _id: userId
            });
            const lengthAcceptFriends = infoUserB.acceptFriends.length;

            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userId,
                lengthAcceptFriend: lengthAcceptFriends
            });

            const infoUserA = await User.findOne({
                _id: myUserId
            }).select("id fullName avatar");

            socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
                userId: userId,
                infoUserA: infoUserA
            });
        });

        // Friend Request Cancellation Feature
        socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;
            
            const existIdAinB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            });

            if (existIdAinB) {
                await User.updateOne({
                    _id: userId
                }, {
                    $pull: { acceptFriends: myUserId }
                });
            }

            const existIdBinA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            });

            if (existIdBinA) {
                await User.updateOne({
                    _id: myUserId
                }, {
                    $pull: { requestFriends: userId }
                });
            }

            const infoUserB = await User.findOne({
                _id: userId
            });
            const lengthAcceptFriends = infoUserB.acceptFriends.length;

            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userId,
                lengthAcceptFriend: lengthAcceptFriends
            });

            socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_FRIEND", {
                userIdB: userId,
                userIdA: myUserId
            });
        });

        // Friend Request Deletion Feature
        socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;
            
            const existIdAinB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            });

            if (existIdAinB) {
                await User.updateOne({
                    _id: myUserId
                }, {
                    $pull: { acceptFriends: userId }
                });
            }

            const existIdBinA = await User.findOne({
                _id: userId,
                requestFriends: myUserId
            });

            if (existIdBinA) {
                await User.updateOne({
                    _id: userId
                }, {
                    $pull: { requestFriends: myUserId }
                });
            }
        });

        // Friend Request Acceptance Feature
        socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;
            
            const existFriendship = await User.findOne({
                _id: myUserId,
                "friendList.user_id": userId
            });

            if (!existFriendship) {
                await User.updateOne({
                    _id: myUserId
                }, {
                    $push: {
                        friendList: {
                            user_id: userId,
                            room_chat_id: ""
                        }
                    },

                    $pull: { acceptFriends: userId }
                });

                await User.updateOne({
                    _id: userId
                }, {
                    $push: {
                        friendList: {
                            user_id: myUserId,
                            room_chat_id: ""
                        }
                    },

                    $pull: { requestFriends: myUserId }
                });
            }
        });
    });
}