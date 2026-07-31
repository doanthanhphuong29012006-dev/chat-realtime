const express = require('express');
const router = express.Router();

const controller = require('../controllers/chat.controller');
const chatMiddleware = require('../middlewares/chat.middleware');
const sidebarMiddleware = require('../middlewares/sidebarChat.middleware');

router.get(
    '/:roomChatId', 
    chatMiddleware.isAccept, 
    sidebarMiddleware.getSidebar, 
    controller.index
);

module.exports = router;