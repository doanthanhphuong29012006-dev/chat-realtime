const express = require('express');
const router = express.Router();

const controller = require('../controllers/users.controller');

router.get('/suggestions', controller.suggestions);

router.get('/requests', controller.requests);

router.get('/accept', controller.accept);

module.exports = router;