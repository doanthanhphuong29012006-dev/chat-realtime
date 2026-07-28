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
    });
}