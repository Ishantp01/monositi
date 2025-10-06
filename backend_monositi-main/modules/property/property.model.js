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
      enum: ["Buy", "Rent", "Commercial"], // PG/Hostel removed
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
        type: String, // Cloudinary URLs or any URL
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
    monositiVerified: {
      type: Boolean,
      default: false,
    },
    popular: {
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