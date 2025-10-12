import express from 'express';
const router = express.Router();


import { updateUserProfile, sendOtp, verifyOtp } from './user.controller.js';
import { protect } from '../../middlewares/authMiddleware.js';

// Placeholder user routes - implement as needed
router.put('/update-profile', protect, updateUserProfile);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

export default router;
