// src/utils/uploadToCloudinary.js
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

export const uploadFileToCloudinary = async (filePath, folder) => {
  try {
    // Check if Cloudinary is properly configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('❌ Cloudinary not configured. Skipping upload.');
      return {
        success: false,
        error: 'Cloudinary credentials not configured',
        secure_url: null
      };
    }

    console.log(`📤 Uploading to Cloudinary: ${filePath} -> ${folder}`);
    
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder || 'monositi',
      resource_type: 'auto', // auto handles both images and pdfs
    });

    console.log(`✅ Upload successful: ${result.secure_url}`);

    // Delete local temp file after upload
    try {
      fs.unlinkSync(filePath);
    } catch (deleteError) {
      console.error('Warning: Could not delete temp file:', deleteError.message);
    }

    return {
      success: true,
      secure_url: result.secure_url,
      public_id: result.public_id,
      error: null
    };
  } catch (err) {
    console.error('❌ Cloudinary Upload Error:', err.message);
    
    // Try to clean up temp file even on error
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (cleanupError) {
      console.error('Warning: Could not clean up temp file:', cleanupError.message);
    }
    
    return {
      success: false,
      error: err.message,
      secure_url: null
    };
  }
};
