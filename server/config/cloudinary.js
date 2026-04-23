const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'reels-app/videos',
    resource_type: 'video',
    allowed_formats: ['mp4', 'mov', 'webm'],
    transformation: [{ quality: 'auto', fetch_format: 'mp4' }],
  },
});

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'reels-app/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
  },
});

const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'reels-app/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face', quality: 'auto' }],
  },
});

const uploadVideo = multer({ storage: videoStorage, limits: { fileSize: 100 * 1024 * 1024 } });
const uploadImage = multer({ storage: imageStorage, limits: { fileSize: 10 * 1024 * 1024 } });
const uploadAvatar = multer({ storage: avatarStorage, limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = { cloudinary, uploadVideo, uploadImage, uploadAvatar };
