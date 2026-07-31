const express = require('express');
const multer = require('multer');
const router = express.Router();

const upload = multer();

const controller = require('../controllers/rooms-chat.controller');

router.get('/', controller.index);

router.get('/create', controller.create);

router.post('/create',
    upload.single('avatar'),
    controller.createPost
);

module.exports = router;