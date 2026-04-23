const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      const field = existingUser.email === email ? 'Email' : 'Username';
      return res.status(400).json({ message: `${field} already exists` });
    }
    const user = await User.create({ username, email, password, fullName: fullName || username });
    const token = generateToken(user._id);
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      avatar: user.avatar,
      bio: user.bio,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = generateToken(user._id);
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      avatar: user.avatar,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('followers', 'username avatar fullName')
      .populate('following', 'username avatar fullName');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('followers', 'username avatar fullName')
      .populate('following', 'username avatar fullName');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { fullName, bio, website, isPrivate } = req.body;
    const updates = {};
    if (fullName !== undefined) updates.fullName = fullName;
    if (bio !== undefined) updates.bio = bio;
    if (website !== undefined) updates.website = website;
    if (isPrivate !== undefined) updates.isPrivate = isPrivate;
    if (req.file) updates.avatar = req.file.path;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.followUser = async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    if (targetUserId === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    const isFollowing = req.user.following.includes(targetUserId);

    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: targetUserId } });
      await User.findByIdAndUpdate(targetUserId, { $pull: { followers: req.user._id } });
      res.json({ message: 'Unfollowed', isFollowing: false });
    } else {
      // Follow
      await User.findByIdAndUpdate(req.user._id, { $addToSet: { following: targetUserId } });
      await User.findByIdAndUpdate(targetUserId, { $addToSet: { followers: req.user._id } });

      // Create notification
      const Notification = require('../models/Notification');
      await Notification.create({
        recipient: targetUserId,
        sender: req.user._id,
        type: 'follow',
      });

      res.json({ message: 'Followed', isFollowing: true });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { fullName: { $regex: q, $options: 'i' } },
      ],
    })
      .select('username fullName avatar bio isVerified')
      .limit(20);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSuggestedUsers = async (req, res) => {
  try {
    const currentUser = req.user
      ? await User.findById(req.user._id)
      : null;
    const excludeIds = currentUser
      ? [currentUser._id, ...currentUser.following]
      : [];
    const users = await User.find({ _id: { $nin: excludeIds } })
      .select('username fullName avatar bio followers isVerified')
      .sort({ followers: -1 })
      .limit(10);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
