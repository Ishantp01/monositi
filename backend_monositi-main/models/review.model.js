const mongoose = require('mongoose');
// models/review.model.js
const ReviewSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetType: { type: String, enum: ['property','service'], required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  rating: { type: Number, min: 1, max: 5 },
  title: String,
  body: String,
  createdAt: { type: Date, default: Date.now },
  approved: { type: Boolean, default: false } // admin moderation
});
module.exports = mongoose.model('Review', ReviewSchema);
