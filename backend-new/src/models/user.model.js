import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String }, // Optional at signup — can be filled later
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, required: true },
    password_hash: String, // not used yet but kept for future web login

    role: {
      type: String,
      enum: ['tenant', 'owner', 'agent', 'service_provider', 'admin'],
      default: 'tenant',
    },

    KYC_docs: [String],

    verification_status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },

    monositi_verified: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    profile_img: String,

    registered_on: { type: Date, default: Date.now },

    contact_preferences: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      whatsapp: { type: Boolean, default: true },
    },

    subscription: {
      status: { type: Boolean, default: false },
      plan: {
        type: String,
        enum: ['basic', 'premium', 'enterprise', null],
        default: null,
      },
      valid_till: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);


