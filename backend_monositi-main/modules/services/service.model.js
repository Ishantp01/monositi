// src/models/service.model.js
const mongoose = require("mongoose");

// 📌 ServiceProvider Model — represents a provider offering services
const serviceProviderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Linked to a registered user
      unique: true, // One user = one provider profile
    },
    category: {
      type: String,
      required: true,
    },
    description: String,
    tags: [String],
    photo: String, // Profile image URL (Cloudinary)
    verified: {
      type: Boolean,
      default: false,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    ratings: [
      {
        type: Number,
        min: 1,
        max: 5,
      },
    ],
    completedJobsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceProvider", serviceProviderSchema);
