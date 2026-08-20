const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');
const multer = require('multer');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'reviews',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

const uploadReviewImages = multer({ storage });
module.exports = uploadReviewImages;