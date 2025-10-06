const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("./user.model");
const sendEmail = require("../utils/sendEmail"); // 👈 You'll implement this utility to send OTP

// Helper: generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Helper: generate OTP (6-digit numeric)
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * 📌 Register regular user (role=user, verified=false)
 */
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, photo } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

    const user = await User.create({
      name,
      email,
      password,
      photo,
      otp,
      otpExpires,
    });

    await sendEmail(email, `Your Monositi verification OTP is: ${otp}`);

    res.status(201).json({
      success: true,
      message: "User registered. Please verify your email with the OTP sent.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * 📌 Verify email using OTP
 */
exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.verified) return res.status(400).json({ success: false, message: "Already verified" });
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    user.verified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * 📌 Login - only if verified
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    if (!user.verified) {
      return res.status(403).json({ success: false, message: "Email not verified" });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        photo: user.photo,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * 📌 Admin creates Monositi Tenant directly (verified = true)
 */
exports.createMonositiTenant = async (req, res) => {
  try {
    const { name, email, password, photo } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const user = await User.create({
      name,
      email,
      password,
      photo,
      role: "monositi-tenant",
      verified: true,
    });

    res.status(201).json({
      success: true,
      message: "Monositi Tenant created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * 📌 Get current user profile
 */
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -otp -otpExpires");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * 📌 Get all users (Admin only)
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -otp -otpExpires");
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * 📌 Get user by ID (Admin only)
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -otp -otpExpires");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
