// models/service.model.js
const mongoose = require('mongoose');
const ServiceSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  description: String,
  category: String, // cleaning, plumbing
  tags: [String],
  photos: [String],
  pricePerHour: Number,
  approved: { type: Boolean, default: false },
  listingTier: { type: String, enum: ['normal','featured','verified'], default: 'normal' },
  reviewsCount: { type: Number, default: 0 },
  avgRating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Service', ServiceSchema);

