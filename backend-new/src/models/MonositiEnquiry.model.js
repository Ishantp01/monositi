import mongoose from "mongoose";

const monositiEnquirySchema = new mongoose.Schema({
  listing: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "MonositiListing", 
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: false // Optional if user is not logged in
  },
  // Contact information
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  
  // Enquiry details
  message: { type: String, required: true },
  enquiry_type: {
    type: String,
    enum: ["general", "booking", "pricing", "visit", "other"],
    default: "general"
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ["pending", "contacted", "resolved", "closed"],
    default: "pending"
  },
  
  // Admin notes
  admin_notes: { type: String },
  contacted_at: { type: Date },
  resolved_at: { type: Date },
}, { timestamps: true });

// Index for quick queries
monositiEnquirySchema.index({ listing: 1, status: 1 });
monositiEnquirySchema.index({ createdAt: -1 });

export default mongoose.model('MonositiEnquiry', monositiEnquirySchema);

