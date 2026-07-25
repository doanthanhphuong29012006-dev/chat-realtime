const mongoose = require('mongoose');

module.exports.connect = async () => {
    try {
    await mongoose.connect('mongodb://127.0.0.1:27017/chat-realtime');
    console.log("Successfully connected to the database!")
    } catch (error) {
    console.log("Database connection failed");
    }
}