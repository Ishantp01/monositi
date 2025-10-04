// src/models/serviceRequest.model.js
const mongoose = require("mongoose");

// 📌 ServiceRequest Model — represents a tenant requesting a service
const serviceRequestSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceProvider",
      default: null,
    },
    serviceCategory: {
      type: String,
      required: true,
    },
    description: String,
    photosBefore: [String],
    photosAfter: [String],
    status: {
      type: String,
      enum: ["Requested", "Assigned", "In Progress", "Completed", "Cancelled"],
      default: "Requested",
    },
    tenantRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    tenantReview: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceRequest", serviceRequestSchema);
