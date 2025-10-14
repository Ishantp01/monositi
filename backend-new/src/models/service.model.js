// models/Service.js
import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
provider_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
service_name: String,
category: String, // e.g. "Plumbing", "Cleaning"
description: String,
base_price: Number,
variable_price: Boolean,
availability_calendar: [Date],
service_docs: [String],
location: {
type: { type: String, enum: ['Point'], default: 'Point' },
coordinates: [Number],
},
addons: [{ name: String, price: Number }],
ratings: { type: Number, default: 0 },
images: [String],
active_status: { type: Boolean, default: true },
tags: [String], // For filtering (e.g. "24x7", "eco-friendly", "certified")
monositi_verified: { type: Boolean, default: false }
}, { timestamps: true });

serviceSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Service', serviceSchema);