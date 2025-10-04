// src/models/property.model.js
const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["PG/Hostel", "Rent", "Buy", "Commercial"],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    photos: [
      {
        type: String, // store Cloudinary URLs or any image URLs
      },
    ],
    tags: [
      {
        type: String,
      },
    ],
    genderPreference: {
      type: String,
      enum: ["Boys", "Girls", "Co-ed", "Any"],
      default: "Any",
    },
    status: {
      type: String,
      enum: ["Pending", "Verified", "Rejected", "Suspended"],
      default: "Pending",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    contactNumber: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);
