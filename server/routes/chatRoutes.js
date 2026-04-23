const express = require('express');
const router = express.Router();
const { getConversations, getMessages, sendMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.get('/conversations', protect, getConversations);
router.get('/messages/:userId', protect, getMessages);
router.post('/send', protect, sendMessage);

module.exports = router;
