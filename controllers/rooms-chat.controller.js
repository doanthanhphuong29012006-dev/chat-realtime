const User = require('../models/user.model');
const RoomChat = require('../models/rooms-chat.model');

const uploadToCloudinaryHelper = require('../helpers/uploadToCloudinary');

// [GET]/rooms-chat
module.exports.index = async (req, res) => {
    const myRooms = await RoomChat.find({
        deleted: false,
        typeRoom: "group",
        "users.user_id": res.locals.user.id
    });

    console.log(myRooms);

    res.render('pages/rooms-chat/index', {
        pageTitle: "Danh sách phòng",
        myRooms: myRooms
    });
}

// [GET]/rooms-chat/create
module.exports.create = async (req, res) => {
    const friendList = res.locals.user.friendList;

    for (const friend of friendList) {
        const infoFriend = await User.findOne({
            _id: friend.user_id,
            deleted: false,
            status: "active"
        }).select("fullName avatar");

        friend.infoFriend = infoFriend;
    }

    res.render('pages/rooms-chat/create', {
        pageTitle: "Tạo phòng",
        friendList: friendList
    });
}

// [POST]/rooms-chat/create
module.exports.createPost = async (req, res) => {
    const title = req.body.title;
    const usersId = req.body.usersId;

    let link = res.locals.user.avatar;

    if (req.file) {
        link = uploadToCloudinaryHelper(req.file.buffer);
    }

    const dataRoom = {
        title: title,
        typeRoom: "group",
        avatar: link,
        users: []
    }

    for (const userId of usersId) {
        dataRoom.users.push({
            user_id: userId,
            role: "user"
        });
    }

    dataRoom.users.push({
        user_id: res.locals.user.id,
        role: "superAdmin"
    });

    const roomChat = new RoomChat(dataRoom);
    await roomChat.save();

    res.redirect(`/chat/${roomChat.id}`);
}
