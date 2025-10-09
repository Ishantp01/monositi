import mongoose from "mongoose";
import bcrypt from "bcrypt";

const addressSchema = new mongoose.Schema(
  {
    label: { type: String }, // e.g. "Home", "Office"
    line1: { type: String },
    line2: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String, default: "India" },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      sparse: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password_hash: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      enum: ["tenant", "owner", "agent", "service_provider", "admin"],
      default: "tenant",
    },
    profile_img: {
      type: String,
    },
    KYC_docs: [
      {
        url: { type: String },
        docType: { type: String },
        status: {
          type: String,
          enum: ["pending", "verified", "rejected"],
          default: "pending",
        },
      },
    ],
    verification_status: {
      type: String,
      enum: ["unverified", "pending", "verified", "rejected"],
      default: "unverified",
    },
    rating: {
      type: Number,
      default: 0,
    },
    subscription_status: {
      type: String,
      enum: ["none", "active", "expired"],
      default: "none",
    },
    address_book: [addressSchema],
    contact_preferences: {
      whatsapp: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
    },
    last_active: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// 🔐 Hash password if modified (future-proof)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password_hash")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password_hash = await bcrypt.hash(this.password_hash, salt);
  next();
});

// 🔍 Compare passwords (future use)
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password_hash);
};

// 🧼 Remove sensitive fields from JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password_hash;
  return obj;
};

export default mongoose.model("User", userSchema);
