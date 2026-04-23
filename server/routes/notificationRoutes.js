const express = require('express');
const router = express.Router();
const {
  getNotifications, markAsRead, markOneAsRead,
  deleteNotification, getUnreadCount,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getNotifications);
router.get('/unread-count', protect, getUnreadCount);
router.put('/read-all', protect, markAsRead);
router.put('/:id/read', protect, markOneAsRead);
router.delete('/:id', protect, deleteNotification);

module.exports = router;
