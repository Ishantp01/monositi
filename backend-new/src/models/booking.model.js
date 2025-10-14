// models/ServiceBooking.js
import mongoose from 'mongoose';

const serviceBookingSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheduled_for: Date,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  total_amount: Number,
  notes: String,
  // Images before service
  images_before: [String], // URLs of images taken before service
  // Images after service
  images_after: [String], // URLs of images taken after service
  // Additional booking details
  service_address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: [Number]
    }
  },
  // Service completion details
  completion_notes: String,
  customer_rating: { type: Number, min: 1, max: 5 },
  customer_review: String,
  provider_rating: { type: Number, min: 1, max: 5 },
  provider_review: String,
}, { timestamps: true });

// Index for geospatial queries
serviceBookingSchema.index({ 'service_address.coordinates': '2dsphere' });

export default mongoose.model('ServiceBooking', serviceBookingSchema);
