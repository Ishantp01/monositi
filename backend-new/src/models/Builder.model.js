import mongoose from "mongoose";

const builderSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  logo: { type: String }, // Cloudinary URL
  description: { type: String },
  founded_year: { type: Number },
  
  contact_info: {
    phone: { type: String },
    email: { type: String },
    address: { type: String },
  },
  
  website: { type: String },
  
  certifications: [{ type: String }], // RERA, ISO, etc.
  
  total_projects_completed: { 
    type: Number, 
    default: 0 
  },
  
  rating: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 5 
  },
  
  monositi_verified: { 
    type: Boolean, 
    default: false 
  },
  
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },
  
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
}, { timestamps: true });

export default mongoose.model("Builder", builderSchema);

