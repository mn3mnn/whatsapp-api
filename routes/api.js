const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { validateRequest, checkAPIKey } = require('../middleware');

router.post('/send-message', validateRequest, checkAPIKey, messageController.sendMessage);

module.exports = router;
