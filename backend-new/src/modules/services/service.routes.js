import express from 'express';
import { 
  createService, 
  getProviderServices, 
  getServiceById, 
  updateService, 
  deleteService, 
  toggleServiceStatus,
  createBooking,
  getAllServices,
  searchServices,
  getServiceCategories,
  getCustomerBookings,
  cancelBooking,
  rateService
} from './service.controller.js';
import { protect } from '../../middlewares/authMiddleware.js';
import { upload } from '../../config/multer.js';

const router = express.Router();

// ✅ Service Discovery APIs (for tenants)
router.get('/', getAllServices); // Browse all active services
router.get('/search', searchServices); // Advanced search
router.get('/categories', getServiceCategories); // Get all categories

// ✅ Create a new service (for verified service providers)
router.post('/create', 
  protect, 
  upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'service_docs', maxCount: 5 }
  ]), 
  createService
);

// ✅ Get all services for a specific provider
router.get('/my-services', 
  protect, 
  getProviderServices
);

// ✅ Get a specific service by ID
router.get('/:id', 
  protect, 
  getServiceById
);

// ✅ Update a service
router.put('/:id', 
  protect, 
  upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'service_docs', maxCount: 5 }
  ]), 
  updateService
);

// ✅ Delete a service
router.delete('/:id', 
  protect, 
  deleteService
);

// ✅ Toggle service active status
router.patch('/:id/toggle-status', 
  protect, 
  toggleServiceStatus
);

// ✅ Booking Management APIs
router.post('/bookings', 
  protect, 
  upload.array('images_before', 5), 
  createBooking
);

router.get('/bookings/my-bookings', 
  protect, 
  getCustomerBookings
);

router.patch('/bookings/:id/cancel', 
  protect, 
  cancelBooking
);

router.post('/bookings/:id/rate', 
  protect, 
  rateService
);

export default router;