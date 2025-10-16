// models/providerRequest.js
import mongoose from 'mongoose';

const providerRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service_category: { type: String, required: true },
  description: String,
  documents: [String], // URLs of uploaded docs via multer/cloudinary
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  admin_comment: String,
}, { timestamps: true });

export default mongoose.model('ProviderRequest', providerRequestSchema);
