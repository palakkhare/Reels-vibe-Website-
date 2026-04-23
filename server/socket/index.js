const User = require('../models/User');
const Message = require('../models/Message');
const Notification = require('../models/Notification');

module.exports = function setupSocket(io) {
  // Track online users: { socketId: userId }
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // User goes online
    socket.on('user:online', async (userId) => {
      if (!userId) return;
      onlineUsers.set(socket.id, userId);
      await User.findByIdAndUpdate(userId, { isOnline: true, socketId: socket.id });
      io.emit('user:status', { userId, isOnline: true });
    });

    // Join a conversation room
    socket.on('chat:join', (conversationId) => {
      socket.join(conversationId);
    });

    // Leave a conversation room
    socket.on('chat:leave', (conversationId) => {
      socket.leave(conversationId);
    });

    // Send a message
    socket.on('chat:message', async (data) => {
      try {
        const { senderId, receiverId, text, media, reelRef } = data;
        const conversationId = Message.getConversationId(senderId, receiverId);

        const message = await Message.create({
          conversationId,
          sender: senderId,
          receiver: receiverId,
          text,
          media: media || {},
          reelRef: reelRef || null,
          readBy: [senderId],
          delivered: false,
        });

        const populated = await Message.findById(message._id)
          .populate('sender', 'username avatar fullName')
          .populate('receiver', 'username avatar fullName')
          .populate('reelRef', 'thumbnailUrl caption');

        // Emit to conversation room
        io.to(conversationId).emit('chat:message', populated);

        // If receiver is online, mark as delivered
        const receiverSocket = await User.findById(receiverId).select('socketId isOnline');
        if (receiverSocket?.isOnline && receiverSocket?.socketId) {
          io.to(receiverSocket.socketId).emit('chat:newMessage', populated);
          await Message.findByIdAndUpdate(message._id, { delivered: true });
          io.to(conversationId).emit('chat:delivered', { messageId: message._id });
        }

        // Create notification
        await Notification.create({
          recipient: receiverId,
          sender: senderId,
          type: 'message',
          message: text.substring(0, 100),
        });

        // Emit notification
        if (receiverSocket?.socketId) {
          io.to(receiverSocket.socketId).emit('notification:new', {
            type: 'message',
            senderId,
            message: text.substring(0, 50),
          });
        }
      } catch (error) {
        console.error('Chat message error:', error);
      }
    });

    // Typing indicator
    socket.on('chat:typing', (data) => {
      const { conversationId, userId, isTyping } = data;
      socket.to(conversationId).emit('chat:typing', { userId, isTyping });
    });

    // Message read
    socket.on('chat:read', async (data) => {
      try {
        const { conversationId, userId } = data;
        await Message.updateMany(
          { conversationId, receiver: userId, readBy: { $ne: userId } },
          { $addToSet: { readBy: userId } }
        );
        io.to(conversationId).emit('chat:read', { conversationId, userId });
      } catch (error) {
        console.error('Chat read error:', error);
      }
    });

    // Real-time like notification
    socket.on('reel:like', async (data) => {
      const { reelOwnerId, senderId, reelId } = data;
      const ownerSocket = await User.findById(reelOwnerId).select('socketId isOnline');
      if (ownerSocket?.isOnline && ownerSocket?.socketId && reelOwnerId !== senderId) {
        io.to(ownerSocket.socketId).emit('notification:new', {
          type: 'like',
          senderId,
          reelId,
        });
      }
    });

    // Real-time comment notification
    socket.on('reel:comment', async (data) => {
      const { reelOwnerId, senderId, reelId, comment } = data;
      const ownerSocket = await User.findById(reelOwnerId).select('socketId isOnline');
      if (ownerSocket?.isOnline && ownerSocket?.socketId && reelOwnerId !== senderId) {
        io.to(ownerSocket.socketId).emit('notification:new', {
          type: 'comment',
          senderId,
          reelId,
          comment: comment.substring(0, 50),
        });
      }
    });

    // Real-time follow notification
    socket.on('user:follow', async (data) => {
      const { targetUserId, senderId } = data;
      const targetSocket = await User.findById(targetUserId).select('socketId isOnline');
      if (targetSocket?.isOnline && targetSocket?.socketId) {
        io.to(targetSocket.socketId).emit('notification:new', {
          type: 'follow',
          senderId,
        });
      }
    });

    // Disconnect
    socket.on('disconnect', async () => {
      const userId = onlineUsers.get(socket.id);
      if (userId) {
        onlineUsers.delete(socket.id);
        await User.findByIdAndUpdate(userId, {
          isOnline: false,
          lastSeen: new Date(),
          socketId: '',
        });
        io.emit('user:status', { userId, isOnline: false });
      }
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });
};
