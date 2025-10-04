const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["PG", "House", "Co-living", "Standalone", "Commercial"],
      required: true,
    },
    tags: [String],
    photos: [String], // array of image URLs
    listingType: {
      type: String,
      enum: ["Normal", "Featured", "Verified"],
      default: "Normal",
    },
    description: {
      type: String,
    },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);
