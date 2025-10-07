const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required for service request']
    },
    serviceProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceProvider',
      required: [true, 'Service provider is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    photos: [{ type: String }], // uploaded images related to request
    status: {
      type: String,
      enum: ['Requested', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Requested',
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// 🗑️ Soft delete method
serviceRequestSchema.methods.softDelete = function () {
  this.deletedAt = new Date();
  return this.save();
};

// 🔍 Query middleware to exclude soft-deleted service requests by default
serviceRequestSchema.pre(/^find/, function (next) {
  // Only apply to queries that don't explicitly include deleted service requests
  if (!this.getOptions().includeDeleted) {
    this.where({ deletedAt: null });
  }
  next();
});

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
