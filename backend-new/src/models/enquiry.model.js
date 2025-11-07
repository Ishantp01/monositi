import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    property_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "contacted", "closed"],
      default: "pending",
    },
    enquiry_type: {
      type: String,
      enum: ["property", "service"],
      required: true,
    },
  },
  { timestamps: true }
);

// Index for faster queries
enquirySchema.index({ property_id: 1, status: 1 });
enquirySchema.index({ service_id: 1, status: 1 });
enquirySchema.index({ user_id: 1 });

export default mongoose.model("Enquiry", enquirySchema);
