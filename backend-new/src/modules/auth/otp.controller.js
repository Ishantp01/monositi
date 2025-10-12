// modules/auth/otp.controller.js
import User from '../../models/user.model.js';
import { generateAndSendOTP, verifyOTP } from '../../utils/sendOTP.js';
import { generateTempJWT } from '../../utils/generateJWT.js';

export const sendOTPController = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone is required' });

    // Generate and send (currently logs to console)
    generateAndSendOTP(phone);

    return res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Error sending OTP:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const verifyOTPController = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp)
      return res.status(400).json({ message: 'Phone and OTP are required' });

    const isValid = verifyOTP(phone, otp);
    if (!isValid) return res.status(400).json({ message: 'Invalid or expired OTP' });

    // Check if user exists
    let user = await User.findOne({ phone });

    if (!user) {
      // If not, create minimal user entry
      user = await User.create({
        phone,
        verification_status: 'verified'
      });
    } else {
      // Update verification status if needed
      if (user.verification_status !== 'verified') {
        user.verification_status = 'verified';
        await user.save();
      }
    }

    const token = generateTempJWT(user);
    return res.status(200).json({
      message: 'OTP verified successfully',
      user,
      token
    });
  } catch (err) {
    console.error('Error verifying OTP:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
