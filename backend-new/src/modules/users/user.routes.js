
import express from 'express';
const router = express.Router();


import { updateUserProfile, sendOtp, verifyOtp ,registerUser,getMyProfile,
    updateMyProfile,
    updateKyc,
    updateContactPreferences,
    requestRoleChange,
    getAllUsers,
    makeAdmin,
    getUserById,
    updateUserByAdmin,
    deleteUser,
    getMySubscription,
    updateMySubscription,
    getMyProperties,
    getUserProperties} from './user.controller.js';
import  upload  from '../../config/multer.js';

import { protect,adminOnly } from '../../middlewares/authMiddleware.js';

// Placeholder user routes - implement as needed
router.post("/register", registerUser); 
router.put('/update-profile', protect, updateUserProfile);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

//================================================================
// 2. User Profile Routes (Requires Authentication)
//================================================================
router.route('/me')
    .get(protect, getMyProfile)
    .put(protect, updateMyProfile);

// Specific PATCH routes for granular updates
router.patch('/me/kyc', protect, upload.array('kycDocs', 5), updateKyc); // Allows uploading up to 5 files with field name 'kycDocs'
router.patch('/me/contact-preferences', protect, updateContactPreferences);

//================================================================
// 3. Role & Permissions Routes (Requires Authentication)
//================================================================
router.patch('/me/role', protect, requestRoleChange);

//================================================================
// 4. Admin User Management Routes (Requires Admin privileges)
//================================================================
router.route('/')
    .get(protect, adminOnly, getAllUsers);

router.route('/:id')
    .get(protect, adminOnly, getUserById)
    .patch(protect, adminOnly, updateUserByAdmin)
    .delete(protect, adminOnly, deleteUser);

// Promote a user to admin
router.put('/:id/make-admin',  makeAdmin);

//================================================================
// 5. Subscription & Features Routes (Requires Authentication)
//================================================================
router.route('/users/me/subscription')
    .get(protect, getMySubscription)
    .post(protect, updateMySubscription);

//================================================================
// 6. Property-Linked Routes
//================================================================
// Get properties for the logged-in user
router.get('/users/me/properties', protect, getMyProperties);

// Get properties for a specific user (Admin only)
router.get('/users/:id/properties', protect, adminOnly, getUserProperties);


export default router;