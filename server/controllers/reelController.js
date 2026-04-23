const Reel = require('../models/Reel');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Notification = require('../models/Notification');

exports.uploadReel = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Video file is required' });
    const { caption, hashtags, music } = req.body;
    const parsedHashtags = hashtags
      ? (typeof hashtags === 'string' ? JSON.parse(hashtags) : hashtags)
      : [];
    const parsedMusic = music
      ? (typeof music === 'string' ? JSON.parse(music) : music)
      : {};

    const reel = await Reel.create({
      user: req.user._id,
      videoUrl: req.file.path,
      thumbnailUrl: req.file.path.replace(/\.[^/.]+$/, '.jpg'),
      caption: caption || '',
      hashtags: parsedHashtags.map(h => h.replace('#', '').toLowerCase()),
      music: parsedMusic,
    });

    const populated = await Reel.findById(reel._id)
      .populate('user', 'username avatar fullName isVerified');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFeed = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = { isPublic: true };

    // If user is logged in, prioritize following users' reels
    const reels = await Reel.find(query)
      .populate('user', 'username avatar fullName isVerified followers')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Reel.countDocuments(query);
    res.json({
      reels,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReelById = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id)
      .populate('user', 'username avatar fullName isVerified followers')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'username avatar fullName' },
        options: { sort: { createdAt: -1 }, limit: 20 },
      });
    if (!reel) return res.status(404).json({ message: 'Reel not found' });

    // Increment views
    reel.views += 1;
    await reel.save();

    res.json(reel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.likeReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: 'Reel not found' });

    const isLiked = reel.likes.includes(req.user._id);
    if (isLiked) {
      reel.likes.pull(req.user._id);
    } else {
      reel.likes.addToSet(req.user._id);
      // Notification
      if (reel.user.toString() !== req.user._id.toString()) {
        await Notification.create({
          recipient: reel.user,
          sender: req.user._id,
          type: 'like',
          reel: reel._id,
        });
      }
    }
    await reel.save();
    res.json({ isLiked: !isLiked, likeCount: reel.likes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: 'Reel not found' });
    if (!reel.allowComments) return res.status(403).json({ message: 'Comments disabled' });

    const { text, parentCommentId } = req.body;
    const comment = await Comment.create({
      reel: reel._id,
      user: req.user._id,
      text,
      parentComment: parentCommentId || null,
    });

    // If it's a reply, add to parent's replies array
    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, {
        $push: { replies: comment._id },
      });
    }

    reel.comments.push(comment._id);
    await reel.save();

    // Notification
    if (reel.user.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: reel.user,
        sender: req.user._id,
        type: 'comment',
        reel: reel._id,
        comment: comment._id,
        message: text.substring(0, 100),
      });
    }

    const populated = await Comment.findById(comment._id)
      .populate('user', 'username avatar fullName');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({ reel: req.params.id, parentComment: null })
      .populate('user', 'username avatar fullName')
      .populate({
        path: 'replies',
        populate: { path: 'user', select: 'username avatar fullName' },
        options: { limit: 3 },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments({ reel: req.params.id, parentComment: null });
    res.json({ comments, page, pages: Math.ceil(total / limit), total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.saveReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: 'Reel not found' });

    const isSaved = reel.saves.includes(req.user._id);
    if (isSaved) {
      reel.saves.pull(req.user._id);
      await User.findByIdAndUpdate(req.user._id, { $pull: { savedReels: reel._id } });
    } else {
      reel.saves.addToSet(req.user._id);
      await User.findByIdAndUpdate(req.user._id, { $addToSet: { savedReels: reel._id } });
    }
    await reel.save();
    res.json({ isSaved: !isSaved, saveCount: reel.saves.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.shareReel = async (req, res) => {
  try {
    const reel = await Reel.findByIdAndUpdate(
      req.params.id,
      { $inc: { shares: 1 } },
      { new: true }
    );
    if (!reel) return res.status(404).json({ message: 'Reel not found' });
    res.json({ shares: reel.shares });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: 'Reel not found' });
    if (reel.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await Comment.deleteMany({ reel: reel._id });
    await Notification.deleteMany({ reel: reel._id });
    await Reel.findByIdAndDelete(reel._id);
    res.json({ message: 'Reel deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserReels = async (req, res) => {
  try {
    const reels = await Reel.find({ user: req.params.userId })
      .populate('user', 'username avatar fullName isVerified')
      .sort({ createdAt: -1 });
    res.json(reels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTrending = async (req, res) => {
  try {
    const reels = await Reel.find({ isPublic: true })
      .populate('user', 'username avatar fullName isVerified')
      .sort({ views: -1, likes: -1 })
      .limit(20);
    res.json(reels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchReels = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const reels = await Reel.find({
      $or: [
        { caption: { $regex: q, $options: 'i' } },
        { hashtags: { $in: [q.toLowerCase().replace('#', '')] } },
      ],
      isPublic: true,
    })
      .populate('user', 'username avatar fullName isVerified')
      .sort({ createdAt: -1 })
      .limit(30);
    res.json(reels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTrendingHashtags = async (req, res) => {
  try {
    const hashtags = await Reel.aggregate([
      { $unwind: '$hashtags' },
      { $group: { _id: '$hashtags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]);
    res.json(hashtags.map(h => ({ tag: h._id, count: h.count })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
