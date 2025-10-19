import express from 'express';
import {
  getAllProviderRequests,
  approveProviderRequest,
  rejectProviderRequest,
  verifyOrRejectService,
  getAllServicesAdmin,
  getAllBookingsAdmin,
  getAdminDashboard,
  getAllPropertiesAdmin,
  getPendingProperties,
  verifyProperty,
  togglePropertyVisibility,
  deletePropertyAdmin,
  getAllUsersAdmin,
  updateUserRole,
  banUser,
  verifyUserAdmin
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

// ✅ Property Management (Admin)
router.get('/properties',
  protect,
  adminOnly,
  getAllPropertiesAdmin
);

router.get('/properties/pending',
  protect,
  adminOnly,
  getPendingProperties
);

router.patch('/properties/:id/verify',
  protect,
  adminOnly,
  verifyProperty
);

router.patch('/properties/:id/visibility',
  protect,
  adminOnly,
  togglePropertyVisibility
);

router.delete('/properties/:id',
  protect,
  adminOnly,
  deletePropertyAdmin
);

// ✅ User Management (Admin)
router.get('/users',
  protect,
  adminOnly,
  getAllUsersAdmin
);

router.patch('/users/:id/role',
  protect,
  adminOnly,
  updateUserRole
);

router.patch('/users/:id/ban',
  protect,
  adminOnly,
  banUser
);

router.patch('/users/:id/verify',
  protect,
  adminOnly,
  verifyUserAdmin
);

export default router;
