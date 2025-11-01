import mongoose from "mongoose";

const monositiRoomSchema = new mongoose.Schema({
  listing: { type: mongoose.Schema.Types.ObjectId, ref: "MonositiListing", required: true },
  floor: { type: Number, required: true },
  room_number: { type: String, required: true },
  total_beds: { type: Number, required: true },
  available_beds: { type: Number, required: true },
  rent_per_bed: { type: Number },
  amenities: [{ type: String }],
  images: [{ type: String }],
  status: {
    type: String,
    enum: ["available", "full"],
    default: "available",
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

export default mongoose.model('MonositiRoom', monositiRoomSchema);
