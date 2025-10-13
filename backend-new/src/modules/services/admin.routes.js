import express from 'express';
import { 
  getAllProviderRequests, 
  approveProviderRequest, 
  rejectProviderRequest, 
  verifyOrRejectService,
  getAllServicesAdmin,
  getAllBookingsAdmin,
  getAdminDashboard
} from './admin.controller.js';
import { protect, adminOnly } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// ✅ Admin Dashboard
router.get('/dashboard', 
  protect, 
  adminOnly,
  getAdminDashboard
);

// ✅ Provider Request Management
router.get('/providers/requests', 
  protect, 
  adminOnly,
  getAllProviderRequests
);

router.patch('/providers/requests/:id/approve', 
  protect, 
  adminOnly,
  approveProviderRequest
);

router.patch('/providers/requests/:id/reject', 
  protect, 
  adminOnly,
  rejectProviderRequest
);

// ✅ Service Management
router.get('/services', 
  protect, 
  adminOnly,
  getAllServicesAdmin
);

router.patch('/services/:id/verify', 
  protect, 
  adminOnly,
  verifyOrRejectService
);

// ✅ Booking Management
router.get('/bookings', 
  protect, 
  adminOnly,
  getAllBookingsAdmin
);

export default router;
