import User from '../../models/user.model.js';
import jwt from "jsonwebtoken";
import twilio from "twilio";
import { twilioClient, whatsappFrom } from "../../config/whatsapp.js";


export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;

    // Basic validations
    if (!phone) {
      return res.status(400).json({ success: false, message: "Phone number is required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Create new user
    const newUser = await User.create({
      name,
      email,
      phone,
      role: role || "tenant", // default role if not provided
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (err) {
    console.error("Register user error:", err);
    res.status(500).json({ success: false, message: "Failed to register user" });
  }
};

export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email, profile_img } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { name, email, profile_img },
            { new: true }
        );

        res.json({message: 'User profile updated successfully', user});
    }
    catch(err) {
        console.error('Error updating user profile:', err);
        res.status(500).json({message: 'Failed to update user profile'});
    }
}






// Temporary OTP store (for dev; use Redis or DB for production)
const otpStore = new Map();


export const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: "Phone number required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(phone, otp);

    await twilioClient.messages.create({
      from: whatsappFrom,
      to: `whatsapp:${phone}`,
      body: `Your OTP for login is ${otp}. It will expire in 2 minutes.`,
    })
    .then(msg => console.log("Message SID:", msg.sid))
    .catch(err => console.error("Twilio error:", err));

    setTimeout(() => otpStore.delete(phone), 120000);

    res.json({ success: true, message: "OTP sent via WhatsApp" });
  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

 
export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: "Phone and OTP are required" });
    }

    const storedOtp = otpStore.get(phone);

    if (!storedOtp || storedOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    let user = await User.findOne({ phone });

    // If user not found, create a new one
    if (!user) {
      user = await User.create({ phone });
    }

    // OTP verified — remove from temporary store
    otpStore.delete(phone);

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "OTP verified successfully",
      token,
      user,
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ success: false, message: "Failed to verify OTP" });
  }
};

