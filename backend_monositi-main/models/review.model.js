// src/models/review.model.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
  },
  { timestamps: true }
);

// Prevent duplicate reviews for same property/service by same user
reviewSchema.index({ user: 1, property: 1 }, { unique: true, sparse: true });
reviewSchema.index({ user: 1, service: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Review", reviewSchema);
