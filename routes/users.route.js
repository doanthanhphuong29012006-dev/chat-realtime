const express = require('express');
const router = express.Router();

const controller = require('../controllers/users.controller');

router.get('/suggestions', controller.suggestions);

module.exports = router;