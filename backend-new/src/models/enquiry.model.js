import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MonositiListing",
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'closed'],
    default: 'new'
  },
  response: {
    type: String,
    trim: true
  },
  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  respondedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
enquirySchema.index({ listing: 1, createdAt: -1 });
enquirySchema.index({ status: 1 });

export default mongoose.model('Enquiry', enquirySchema);