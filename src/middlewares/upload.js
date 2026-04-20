const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Dans src/middlewares/upload.js
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 60000 // On passe à 60 secondes
});

// Configuration du stockage : les images iront dans un dossier "Signature_Pets"
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Signature_Pets',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    
  },
});

const upload = multer({ storage: storage });

module.exports = upload;