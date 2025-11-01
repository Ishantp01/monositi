import mongoose from "mongoose";

const monositiListingSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Name of property / hostel / commercial space
  description: { type: String },
  category: {
    type: String,
    enum: ["commercial", "hostel_pg", "land_plot"],
    required: true
  },
  location: {
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    coordinates: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: [Number], // [longitude, latitude] - GeoJSON format
    }
  },
  images: [{ type: String }], // Cloudinary / local upload

  // only for hostel_pg
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "MonositiRoom" }],

  // for land/commercial
  area: { type: String },
  price: { type: Number }, // could be rent or sale price
  status: {
    type: String,
    enum: ["available", "booked", "fullhouse"],
    default: "available",
  },

  // admin management flags
  monositi_verified: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Admin ID
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

// Add geospatial index for location-based queries
monositiListingSchema.index({ 'location.coordinates': '2dsphere' });

export default mongoose.model('MonositiListing', monositiListingSchema);
