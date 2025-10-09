const express = require('express');
const router = express.Router();
const upload = require('../../config/multer');
const {
  createServiceProvider,
  createMyServiceProviderProfile,
  listServiceProvidersByCategory,
  getAllServiceProviders,
  getServiceProviderById,
  approveServiceProvider,
  deactivateServiceProvider,
  createServiceRequest,
  updateServiceRequestStatus,
  getServiceRequestById,
  getServiceRequestsForProvider,
  updateAvailability,
  getMyProfile,
  deleteServiceRequest,
  getDeletedServiceRequests,
} = require('./service.controller');

const { protect, adminOnly } = require('../../middlewares/authMiddleware');

// Admin routes for service provider management
router.post('/admin/service-providers', protect, adminOnly, upload.single('photo'), createServiceProvider);
router.get('/admin/service-providers', protect, adminOnly, getAllServiceProviders);
router.patch('/admin/service-providers/:id/approve', protect, adminOnly, approveServiceProvider);
router.patch('/admin/service-providers/:id/deactivate', protect, adminOnly, deactivateServiceProvider);
router.get('/admin/service-requests/deleted', protect, adminOnly, getDeletedServiceRequests);

// Self-registration route for users to become service providers
router.post('/service-providers/register', protect, upload.single('photo'), createMyServiceProviderProfile);

// Public routes
router.get('/service-providers', listServiceProvidersByCategory);
router.get('/service-providers/:id', getServiceProviderById);

// User routes
router.post('/service-requests', protect, upload.array('photos', 5), createServiceRequest);

// Provider/Admin routes
router.get('/service-requests/:id', protect, getServiceRequestById);
router.patch('/service-requests/:id/status', protect, updateServiceRequestStatus);
router.delete('/service-requests/:id', protect, deleteServiceRequest);
router.get('/service-requests/provider', protect, getServiceRequestsForProvider);

// Service Provider routes
router.get('/provider/profile', protect, getMyProfile);
router.patch('/provider/availability', protect, updateAvailability);

module.exports = router;
