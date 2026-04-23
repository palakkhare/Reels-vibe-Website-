const express = require('express');
const router = express.Router();
const {
  register, login, getProfile, getMe, updateProfile,
  followUser, searchUsers, getSuggestedUsers,
} = require('../controllers/authController');
const { protect, optionalAuth } = require('../middleware/auth');
const { uploadAvatar } = require('../config/cloudinary');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/search', searchUsers);
router.get('/suggested', optionalAuth, getSuggestedUsers);
router.get('/profile/:userId', getProfile);
router.put('/profile', protect, uploadAvatar.single('avatar'), updateProfile);
router.post('/follow/:userId', protect, followUser);

module.exports = router;
