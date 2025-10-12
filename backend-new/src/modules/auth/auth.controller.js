import User from '../../models/user.model.js';
import Verification from '../../models/verification.model.js';
import { sendOTP, verifyOTP } from '../../utils/sendOTP.js';
import { generateAuthTokens } from '../../utils/generateJWT.js';
import jwt from 'jsonwebtoken';

/**
 * Send OTP to user's phone number for verification
 * @route POST /api/auth/send-otp
 * @access Public
 */
export const sendUserOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required',
      });
    }

    // Generate and send OTP
    const otp = await sendOTP(phone);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      otp: process.env.NODE_ENV === 'development' ? otp : undefined, // Only show OTP in development
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
    });
  }
};

/**
 * Verify OTP and login/register user
 * @route POST /api/auth/verify-otp
 * @access Public
 */
export const verifyUserOTP = async (req, res) => {
  try {
    const { phone, otp, name, email } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and OTP are required',
      });
    }

    // Verify OTP
    const isValidOTP = await verifyOTP(phone, otp);

    if (!isValidOTP) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP',
      });
    }

    // Find or create user
    let user = await User.findOne({ phone });

    if (!user) {
      // Create new user if doesn't exist
      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Name is required for new user registration',
        });
      }

      user = await User.create({
        name,
        phone,
        email,
        verified: true,
        role: 'tenant', // Default role
      });
    } else {
      // Update user's last active time
      user.last_active = new Date();
      await user.save();
    }

    // Generate authentication tokens
    const tokens = generateAuthTokens(user);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      ...tokens,
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP',
    });
  }
};

/**
 * Refresh access token using refresh token
 * @route POST /api/auth/refresh-token
 * @access Private
 */
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is required',
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }

    // Generate new tokens
    const tokens = generateAuthTokens(user);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      ...tokens,
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token',
    });
  }
};

/**
 * Get current user profile
 * @route GET /api/auth/me
 * @access Private
 */
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password_hash');

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile',
    });
  }
};

/**
 * Logout user (client-side token removal)
 * @route POST /api/auth/logout
 * @access Private
 */
export const logout = async (req, res) => {
  try {
    // For stateless JWT, logout is handled client-side
    // You could implement token blacklisting here if needed

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to logout',
    });
  }
};
