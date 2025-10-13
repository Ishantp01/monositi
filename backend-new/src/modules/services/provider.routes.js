import express from 'express';
import { 
  requestProviderAccess, 
  updateBookingStatus, 
  getProviderBookings, 
  completeBooking, 
  rateCustomer,
  createServiceForProvider,
  getLoggedInProviderService,
  updateProviderService,
  updateServiceAvailability,
  manageServiceAddons,
  manageServiceImages
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

// ✅ Service Management Routes
router.post('/create-service',
  protect,
  upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'service_docs', maxCount: 5 }
  ]),
  createServiceForProvider
);

router.get('/my-service',
  protect,
  getLoggedInProviderService
);

router.put('/update-service',
  protect,
  upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'service_docs', maxCount: 5 }
  ]),
  updateProviderService
);

router.patch('/update-availability',
  protect,
  updateServiceAvailability
);

router.patch('/manage-addons',
  protect,
  manageServiceAddons
);

router.patch('/manage-images',
  protect,
  upload.array('images', 10),
  manageServiceImages
);

export default router;
