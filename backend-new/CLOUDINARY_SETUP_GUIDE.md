# Cloudinary Setup Guide

## The Error You're Seeing

The error "Failed to upload image: undefined" occurs because Cloudinary credentials are not configured. Here's how to fix it:

## Step 1: Create .env File

Create a file named `.env` in the `backend-new` directory with the following content:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/monositi

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
JWT_EXPIRE=7d

# Cloudinary Configuration (REQUIRED for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Twilio Configuration (for WhatsApp OTP)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# Server Configuration
PORT=5000
NODE_ENV=development
```

## Step 2: Get Cloudinary Credentials

1. Go to [https://cloudinary.com/console](https://cloudinary.com/console)
2. Sign up or log in to your account
3. On the dashboard, you'll see your credentials:
   - Cloud Name
   - API Key
   - API Secret
4. Copy these values and replace the placeholders in your `.env` file

## Step 3: Restart Your Server

After creating the `.env` file with correct credentials:

```bash
cd backend-new
npm run dev
```

## Step 4: Test the Upload

Now when you test the property creation endpoint, you should see:
- ✅ Cloudinary credentials loaded successfully
- 📤 Uploading to Cloudinary: [file path] -> [folder]
- ✅ Upload successful: [cloudinary URL]

## What I Fixed

1. **Added credential validation** in `cloudinary.js` - now shows clear error messages if credentials are missing
2. **Fixed the upload function** in `uploadToCloudinary.js` - now returns proper success/error objects
3. **Added better error handling** - handles missing credentials gracefully
4. **Added logging** - shows upload progress and success/failure messages

## Testing Without Cloudinary (Development)

If you want to test without setting up Cloudinary immediately, the uploads will be skipped gracefully and the property will still be created (just without images). You'll see:

```
❌ Cloudinary not configured. Skipping upload.
```

The property creation will still work, but without file uploads.

## Next Steps

1. Create the `.env` file with your Cloudinary credentials
2. Restart the server
3. Test the property creation endpoint again
4. You should now see successful uploads to Cloudinary

Let me know if you need help getting your Cloudinary credentials or if you encounter any other issues!
