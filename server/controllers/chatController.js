const Message = require('../models/Message');
const User = require('../models/User');

exports.getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all unique conversation IDs for this user
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiver', userId] },
                    { $not: { $in: [userId, '$readBy'] } },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { 'lastMessage.createdAt': -1 } },
    ]);

    // Populate other user details for each conversation
    const conversations = await Promise.all(
      messages.map(async (conv) => {
        const otherUserId =
          conv.lastMessage.sender.toString() === userId.toString()
            ? conv.lastMessage.receiver
            : conv.lastMessage.sender;

        const otherUser = await User.findById(otherUserId).select(
          'username fullName avatar isOnline lastSeen'
        );

        return {
          conversationId: conv._id,
          otherUser,
          lastMessage: {
            text: conv.lastMessage.text,
            media: conv.lastMessage.media,
            createdAt: conv.lastMessage.createdAt,
            sender: conv.lastMessage.sender,
          },
          unreadCount: conv.unreadCount,
        };
      })
    );

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const conversationId = Message.getConversationId(req.user._id.toString(), userId);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const messages = await Message.find({ conversationId })
      .populate('sender', 'username avatar fullName')
      .populate('receiver', 'username avatar fullName')
      .populate('reelRef', 'thumbnailUrl caption videoUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Message.countDocuments({ conversationId });

    // Mark messages as read
    await Message.updateMany(
      { conversationId, receiver: req.user._id, readBy: { $ne: req.user._id } },
      { $addToSet: { readBy: req.user._id } }
    );

    res.json({
      messages: messages.reverse(),
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, text, media, reelRef } = req.body;
    const conversationId = Message.getConversationId(req.user._id.toString(), receiverId);

    const message = await Message.create({
      conversationId,
      sender: req.user._id,
      receiver: receiverId,
      text: text || '',
      media: media || {},
      reelRef: reelRef || null,
      readBy: [req.user._id],
    });

    const populated = await Message.findById(message._id)
      .populate('sender', 'username avatar fullName')
      .populate('receiver', 'username avatar fullName')
      .populate('reelRef', 'thumbnailUrl caption videoUrl');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
