// models/booking.model.js
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  type: { type: String, enum: ['property_viewing','service_booking'], required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' }, // for property viewing
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' }, // for service booking
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // landlord or service provider
  slotStart: { type: Date, required: true },
  slotEnd: Date,
  status: { type: String, enum: ['pending','confirmed','rescheduled','cancelled','completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  notes: String,
  paymentInfo: { provider: String, txnId: String, amount: Number }
});
BookingSchema.index({ tenant: 1, provider: 1, slotStart: 1 });
module.exports = mongoose.model('Booking', BookingSchema);
