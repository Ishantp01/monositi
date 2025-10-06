const mongoose = require("mongoose");

const monositiSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ["PG", "Hostel", "Flat", "Shared Room"],
      required: [true, "Category is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    photos: [
      {
        type: String,
      },
    ],
    facilities: [
      {
        type: String,
      },
    ],
    genderPreference: {
      type: String,
      enum: ["Boys", "Girls", "Co-ed", "Any"],
      default: "Any",
    },
    contactNumber: {
      type: String,
      required: [true, "Contact number is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MonositiListing", monositiSchema);
