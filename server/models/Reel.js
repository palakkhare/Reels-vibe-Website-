const mongoose = require('mongoose');

const reelSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  videoUrl: {
    type: String,
    required: [true, 'Video URL is required'],
  },
  thumbnailUrl: { type: String, default: '' },
  caption: { type: String, default: '', maxlength: 2200 },
  hashtags: [{ type: String, trim: true, lowercase: true }],
  music: {
    title: { type: String, default: '' },
    artist: { type: String, default: '' },
    url: { type: String, default: '' },
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  shares: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  saves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isPublic: { type: Boolean, default: true },
  allowComments: { type: Boolean, default: true },
  duration: { type: Number, default: 0 },
  aspectRatio: { type: String, default: '9:16' },
}, { timestamps: true });

reelSchema.index({ user: 1, createdAt: -1 });
reelSchema.index({ hashtags: 1 });
reelSchema.index({ createdAt: -1 });

reelSchema.virtual('likeCount').get(function () {
  return this.likes?.length || 0;
});

reelSchema.virtual('commentCount').get(function () {
  return this.comments?.length || 0;
});

reelSchema.virtual('saveCount').get(function () {
  return this.saves?.length || 0;
});

reelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Reel', reelSchema);
