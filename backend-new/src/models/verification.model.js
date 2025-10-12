import mongoose from 'mongoose';

const verificationSchema = new mongoose.Schema(
  {
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'targetModel' },
    targetModel: { type: String, required: true, enum: ['User', 'Property'] },
    type: { type: String, required: true, enum: ['KYC', 'PropertyDocs'] },
    docs: [{ type: String }],
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Verification', verificationSchema);