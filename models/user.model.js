const mongoose = require('mongoose');
const generate = require('../helpers/generate');

const userSchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        password: String,
        phone: String,
        avatar: {
            type: String,
            default: "https://res.cloudinary.com/unvqsun9/image/upload/v1785406583/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector_vou0th.webp"
        },
        status: {
            type: String,
            default: "active"
        },
        requestFriends: Array,
        acceptFriends: Array,
        friendList: [
            {
                user_id: String,
                room_chat_id: String
            }
        ],
        statusOnline: String,
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date
    }, {
        timestamps: true
    }
);

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;