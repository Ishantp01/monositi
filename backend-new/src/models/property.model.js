import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  agent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['residential', 'commercial'], required: true },
  sub_category: { type: String, enum: ['Buy', 'Rent', 'Monositi'], required: true },
  status: { type: String, enum: ['active', 'pending', 'sold', 'rented'], default: 'pending' },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: String,
  geo_location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number],
  },
  property_features: {
    size: Number,
    units: Number,
    amenities: [String],
    nearby_places: [String],
    images: [String]
  },
  price: { type: Number, required: true },
  occupancy_rate: { type: Number, default: 0 },
  performance_metrics: {
    views: { type: Number, default: 0 },
    leads: { type: Number, default: 0 }
  },
  tags: [String], // for filtering (e.g. "2BHK", "Furnished", "Near Metro")
  listing_visibility: {
    type: String,
    enum: ['public', 'premium'],
    default: 'public'
  },
  documents: [String],
  verification_status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  monositi_verified: { type: Boolean, default: false },
  // Additional fields for better property management
  name: { type: String, trim: true },
  description: { type: String, trim: true },
  contactNumber: { type: String, trim: true },
}, { timestamps: true });

propertySchema.index({ geo_location: '2dsphere' });

export default mongoose.model('Property', propertySchema);