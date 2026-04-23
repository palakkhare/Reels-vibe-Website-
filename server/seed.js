require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Reel = require('./models/Reel');
const Comment = require('./models/Comment');

const sampleVideos = [
  'https://res.cloudinary.com/demo/video/upload/dog.mp4',
  'https://res.cloudinary.com/demo/video/upload/elephants.mp4',
  'https://res.cloudinary.com/demo/video/upload/sea_turtle.mp4',
  'https://res.cloudinary.com/demo/video/upload/w_300/flower.mp4',
];

const sampleThumbnails = [
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&q=80',
  'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=500&q=80',
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&q=80',
  'https://images.unsplash.com/photo-1494253109108-2e30c049369b?w=500&q=80',
];

const seedData = async (shouldExit = true) => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Reel.deleteMany({});
    await Comment.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create demo users
    const users = await User.create([
      {
        username: 'demo',
        email: 'demo@reelvibe.com',
        password: 'password123',
        fullName: 'Demo User',
        bio: '🎬 Content Creator | 📱 Tech Enthusiast | ✨ Living my best life',
        isVerified: true,
      },
      {
        username: 'sarah_creates',
        email: 'sarah@reelvibe.com',
        password: 'password123',
        fullName: 'Sarah Johnson',
        bio: '📸 Photographer | 🌍 Travel | 🎨 Art',
        isVerified: true,
      },
      {
        username: 'alex_vibes',
        email: 'alex@reelvibe.com',
        password: 'password123',
        fullName: 'Alex Chen',
        bio: '🎵 Music Producer | 🎧 DJ | 🔥 Beats',
      },
      {
        username: 'mia_fitness',
        email: 'mia@reelvibe.com',
        password: 'password123',
        fullName: 'Mia Rodriguez',
        bio: '💪 Fitness Coach | 🥗 Nutrition | 🏋️ Training',
        isVerified: true,
      },
      {
        username: 'foodie_jay',
        email: 'jay@reelvibe.com',
        password: 'password123',
        fullName: 'Jay Patel',
        bio: '🍕 Food Blogger | 👨‍🍳 Chef | 🌮 Recipes',
      },
    ]);

    console.log(`👤 Created ${users.length} users`);

    // Make some users follow each other
    await User.findByIdAndUpdate(users[0]._id, {
      following: [users[1]._id, users[2]._id, users[3]._id],
    });
    await User.findByIdAndUpdate(users[1]._id, {
      followers: [users[0]._id],
      following: [users[0]._id, users[2]._id],
    });
    await User.findByIdAndUpdate(users[2]._id, {
      followers: [users[0]._id, users[1]._id],
      following: [users[3]._id],
    });
    await User.findByIdAndUpdate(users[3]._id, {
      followers: [users[0]._id, users[2]._id],
      following: [users[0]._id],
    });

    // Create reels
    const reelData = [
      {
        user: users[0]._id,
        caption: 'Check out this amazing sunset! 🌅 #nature #sunset #beautiful',
        hashtags: ['nature', 'sunset', 'beautiful', 'viral'],
        music: { title: 'Golden Hour', artist: 'JVKE' },
      },
      {
        user: users[1]._id,
        caption: 'Street photography vibes 📸 #photography #street #art',
        hashtags: ['photography', 'street', 'art', 'creative'],
        music: { title: 'Blinding Lights', artist: 'The Weeknd' },
      },
      {
        user: users[2]._id,
        caption: 'New beat drop! 🎵🔥 What do you think? #music #beats #producer',
        hashtags: ['music', 'beats', 'producer', 'trending'],
        music: { title: 'Original Beat', artist: 'Alex Chen' },
      },
      {
        user: users[3]._id,
        caption: 'Morning workout routine 💪 No excuses! #fitness #workout #health',
        hashtags: ['fitness', 'workout', 'health', 'motivation'],
        music: { title: 'Unstoppable', artist: 'Sia' },
      },
      {
        user: users[4]._id,
        caption: 'Making the perfect pasta 🍝 Recipe in bio! #food #cooking #recipe',
        hashtags: ['food', 'cooking', 'recipe', 'pasta'],
        music: { title: "That's Amore", artist: 'Dean Martin' },
      },
      {
        user: users[0]._id,
        caption: 'Travel vlog: exploring hidden gems ✈️ #travel #explore #adventure',
        hashtags: ['travel', 'explore', 'adventure', 'vlog'],
        music: { title: 'On My Way', artist: 'Alan Walker' },
      },
      {
        user: users[1]._id,
        caption: 'Editing tutorial - how I create cinematic shots 🎥 #tutorial #editing',
        hashtags: ['tutorial', 'editing', 'cinematic', 'photography'],
        music: { title: 'Time', artist: 'Hans Zimmer' },
      },
      {
        user: users[3]._id,
        caption: 'Healthy meal prep for the week 🥗 Save this! #mealprep #healthy',
        hashtags: ['mealprep', 'healthy', 'nutrition', 'fitness'],
        music: { title: 'Good Day', artist: 'Nappy Roots' },
      },
    ];

    const reels = [];
    for (let i = 0; i < reelData.length; i++) {
      const reel = await Reel.create({
        ...reelData[i],
        videoUrl: sampleVideos[i % sampleVideos.length],
        thumbnailUrl: sampleThumbnails[i % sampleThumbnails.length],
        views: Math.floor(Math.random() * 10000) + 100,
        shares: Math.floor(Math.random() * 100),
        likes: users.slice(0, Math.floor(Math.random() * 4) + 1).map(u => u._id),
      });
      reels.push(reel);
    }

    console.log(`🎬 Created ${reels.length} reels`);

    // Add comments
    const comments = await Comment.create([
      { reel: reels[0]._id, user: users[1]._id, text: 'This is absolutely stunning! 😍' },
      { reel: reels[0]._id, user: users[2]._id, text: 'Where is this? I need to visit!' },
      { reel: reels[1]._id, user: users[0]._id, text: 'Your photography skills are insane 🔥' },
      { reel: reels[2]._id, user: users[3]._id, text: 'This beat goes hard! 🎵' },
      { reel: reels[3]._id, user: users[4]._id, text: 'Starting this routine tomorrow! 💪' },
      { reel: reels[4]._id, user: users[0]._id, text: 'Looks delicious! Trying this weekend' },
    ]);

    // Add comment refs to reels
    await Reel.findByIdAndUpdate(reels[0]._id, { comments: [comments[0]._id, comments[1]._id] });
    await Reel.findByIdAndUpdate(reels[1]._id, { comments: [comments[2]._id] });
    await Reel.findByIdAndUpdate(reels[2]._id, { comments: [comments[3]._id] });
    await Reel.findByIdAndUpdate(reels[3]._id, { comments: [comments[4]._id] });
    await Reel.findByIdAndUpdate(reels[4]._id, { comments: [comments[5]._id] });

    console.log(`💬 Created ${comments.length} comments`);
    console.log('\n✅ Seed complete!');
    
    if (shouldExit) process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    if (shouldExit) process.exit(1);
    throw err;
  }
};

if (require.main === module) {
  connectDB().then(() => seedData());
}

module.exports = seedData;
