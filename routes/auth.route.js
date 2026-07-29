const express = require('express');
const router = express.Router();

const controller = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/login', controller.login);

router.post('/login', controller.loginPost);

router.get('/register', controller.register);

router.post('/register', controller.registerPost);

router.get('/logout', authMiddleware.requireAuth, controller.logout);

module.exports = router;