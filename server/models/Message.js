const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: String,
    required: true,
    index: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: { type: String, default: '' },
  media: {
    url: { type: String, default: '' },
    type: { type: String, enum: ['image', 'video', 'file', ''], default: '' },
  },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  delivered: { type: Boolean, default: false },
  reelRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Reel', default: null },
}, { timestamps: true });

messageSchema.index({ conversationId: 1, createdAt: 1 });
messageSchema.index({ sender: 1, receiver: 1 });

// Generate a consistent conversationId from two user IDs
messageSchema.statics.getConversationId = function (userId1, userId2) {
  return [userId1, userId2].sort().join('_');
};

module.exports = mongoose.model('Message', messageSchema);
