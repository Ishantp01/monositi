import express from 'express';
import { 
  requestProviderAccess, 
  updateBookingStatus, 
  getProviderBookings, 
  completeBooking, 
  rateCustomer 
} from './provider.controller.js';
import { protect } from '../../middlewares/authMiddleware.js';
import { upload } from '../../config/multer.js';

const router = express.Router();

// ✅ Request provider access
router.post('/request-access', 
  protect, 
  upload.array('documents', 5), 
  requestProviderAccess
);

// ✅ Provider booking management
router.get('/bookings', 
  protect, 
  getProviderBookings
);

router.patch('/bookings/:id/status', 
  protect, 
  updateBookingStatus
);

router.patch('/bookings/:id/complete', 
  protect, 
  upload.array('images_after', 5), 
  completeBooking
);

router.post('/bookings/:id/rate-customer', 
  protect, 
  rateCustomer
);

export default router;
