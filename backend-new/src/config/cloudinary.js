// src/config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';

// Check if Cloudinary credentials are available
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error('❌ Cloudinary credentials missing! Please check your .env file:');
  console.error('   CLOUDINARY_CLOUD_NAME:', cloudName ? '✅ Set' : '❌ Missing');
  console.error('   CLOUDINARY_API_KEY:', apiKey ? '✅ Set' : '❌ Missing');
  console.error('   CLOUDINARY_API_SECRET:', apiSecret ? '✅ Set' : '❌ Missing');
  console.error('');
  console.error('📝 Create a .env file in backend-new/ directory with:');
  console.error('   CLOUDINARY_CLOUD_NAME=your_cloud_name');
  console.error('   CLOUDINARY_API_KEY=your_api_key');
  console.error('   CLOUDINARY_API_SECRET=your_api_secret');
  console.error('');
} else {
  console.log('✅ Cloudinary credentials loaded successfully');
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export default cloudinary;
