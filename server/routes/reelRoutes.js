const express = require('express');
const router = express.Router();
const {
  uploadReel, getFeed, getReelById, likeReel, addComment,
  getComments, saveReel, shareReel, deleteReel, getUserReels,
  getTrending, searchReels, getTrendingHashtags,
} = require('../controllers/reelController');
const { protect, optionalAuth } = require('../middleware/auth');
const { uploadVideo } = require('../config/cloudinary');

router.get('/feed', optionalAuth, getFeed);
router.get('/trending', getTrending);
router.get('/hashtags/trending', getTrendingHashtags);
router.get('/search', searchReels);
router.get('/user/:userId', getUserReels);
router.get('/:id', optionalAuth, getReelById);
router.post('/upload', protect, uploadVideo.single('video'), uploadReel);
router.post('/:id/like', protect, likeReel);
router.post('/:id/comment', protect, addComment);
router.get('/:id/comments', getComments);
router.post('/:id/save', protect, saveReel);
router.post('/:id/share', shareReel);
router.delete('/:id', protect, deleteReel);

module.exports = router;
