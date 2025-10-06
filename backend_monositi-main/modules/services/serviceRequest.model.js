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
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
