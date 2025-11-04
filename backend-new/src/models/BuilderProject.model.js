import mongoose from "mongoose";

const builderProjectSchema = new mongoose.Schema({
  builder: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Builder", 
    required: true 
  },
  
  project_name: { 
    type: String, 
    required: true,
    trim: true 
  },
  
  description: { type: String },
  
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
  
  images: [{ type: String }], // Cloudinary URLs
  
  project_type: {
    type: String,
    enum: ["residential", "commercial", "mixed"],
    required: true
  },
  
  status: {
    type: String,
    enum: ["upcoming", "ongoing", "completed", "ready_to_move"],
    default: "ongoing"
  },
  
  possession_date: { type: Date },
  
  rera_number: { type: String },
  
  total_units: { 
    type: Number, 
    default: 0 
  },
  
  available_units: { 
    type: Number, 
    default: 0 
  },
  
  price_range: {
    min: { type: Number },
    max: { type: Number }
  },
  
  // Unit configurations (1BHK, 2BHK, etc.)
  unit_configurations: [{
    type: { 
      type: String, 
      required: true // e.g., "1BHK", "2BHK", "3BHK", "Penthouse"
    },
    carpet_area: { type: String }, // e.g., "650 sq ft"
    price: { type: Number },
    total_units: { type: Number, default: 0 },
    available_units: { type: Number, default: 0 },
    floor_plan: { type: String }, // Cloudinary URL for floor plan image
  }],
  
  amenities: [{ type: String }],
  
  documents: [{ type: String }], // Cloudinary URLs for brochures, etc.
  
  monositi_verified: { 
    type: Boolean, 
    default: false 
  },
  
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
}, { timestamps: true });

// Add geospatial index for location-based queries
builderProjectSchema.index({ 'location.coordinates': '2dsphere' });

export default mongoose.model("BuilderProject", builderProjectSchema);

