import express from 'express';
const router = express.Router();


import { updateUserProfile } from './user.controller.js';
import { protect } from '../../middlewares/authMiddleware.js';

// Placeholder user routes - implement as needed
router.put('/update-profile', protect, updateUserProfile);

export default router;
