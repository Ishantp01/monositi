const mongoose =require('mongoose');
// models/verification.model.js
const VerificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  docType: String, // 'aadhaar','pan','ownership'
  fileUrl: String, // S3 signed URL
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  adminNote: String
});
module.exports = mongoose.model('Verification', VerificationSchema);
    