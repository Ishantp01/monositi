const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
  },
  { timestamps: true }
);

const serviceProviderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    // Basic info (can be different from user info if needed)
    name: { type: String, required: [true, 'Name is required'] },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Plumbing', 'Electrical', 'Cleaning', 'Carpentry', 'Painting', 'Gardening', 'Appliance Repair', 'Other']
    },
    contactNumber: { type: String, required: [true, 'Contact number is required'] },
    address: { type: String, required: [true, 'Address is required'] },
    city: { type: String, required: [true, 'City is required'] },
    state: { type: String, required: [true, 'State is required'] },
    photo: { type: String }, // URL of provider's image
    description: { type: String, trim: true },
    experience: { type: Number, min: 0, default: 0 }, // Years of experience
    availability: {
      type: String,
      enum: ['Available', 'Busy', 'Unavailable'],
      default: 'Available'
    },
    reviews: [reviewSchema],
    averageRating: { type: Number, default: 0 },
    // Admin management fields
    isActive: { type: Boolean, default: true },
    approvedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    approvedAt: { type: Date },
  },
  { timestamps: true }
);

// Automatically calculate average rating when reviews change
serviceProviderSchema.pre('save', function (next) {
  if (this.reviews && this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    this.averageRating = totalRating / this.reviews.length;
  } else {
    this.averageRating = 0;
  }
  next();
});

// Method to calculate average rating
serviceProviderSchema.methods.calculateAverageRating = function() {
  if (this.reviews && this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return totalRating / this.reviews.length;
  }
  return 0;
};

module.exports = mongoose.model('ServiceProvider', serviceProviderSchema);
