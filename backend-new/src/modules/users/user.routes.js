
@@ -2,67 +2,13 @@ import express from 'express';
const router = express.Router();


import { updateUserProfile, sendOtp, verifyOtp ,registerUser,getMyProfile,
    updateMyProfile,
    updateKyc,
    updateContactPreferences,
    requestRoleChange,
    getAllUsers,
    getUserById,
    updateUserByAdmin,
    deleteUser,
    getMySubscription,
    updateMySubscription,
    getMyProperties,
    getUserProperties} from './user.controller.js';
import  upload  from '../../config/multer.js';

import { protect,adminOnly } from '../../middlewares/authMiddleware.js';
import { updateUserProfile, sendOtp, verifyOtp ,registerUser} from './user.controller.js';
import { protect } from '../../middlewares/authMiddleware.js';

// Placeholder user routes - implement as needed
router.post("/register", registerUser); 
router.put('/update-profile', protect, updateUserProfile);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.route('/me')
    .get(protect, getMyProfile)
    .put(protect, updateMyProfile);