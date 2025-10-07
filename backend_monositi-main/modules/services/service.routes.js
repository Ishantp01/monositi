const express = require('express');
const router = express.Router();
const {
  createServiceProvider,
  listServiceProvidersByCategory,
  getServiceProviderById,
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

// Admin routes
router.post('/admin/service-providers', protect, adminOnly, createServiceProvider);
router.get('/admin/service-requests/deleted', protect, adminOnly, getDeletedServiceRequests);

// Public routes
router.get('/service-providers', listServiceProvidersByCategory);
router.get('/service-providers/:id', getServiceProviderById);

// User routes
router.post('/service-requests', protect, createServiceRequest);

// Provider/Admin routes
router.get('/service-requests/:id', protect, getServiceRequestById);
router.patch('/service-requests/:id/status', protect, updateServiceRequestStatus);
router.delete('/service-requests/:id', protect, deleteServiceRequest);
router.get('/service-requests/provider', protect, getServiceRequestsForProvider);

// Service Provider routes
router.get('/provider/profile', protect, getMyProfile);
router.patch('/provider/availability', protect, updateAvailability);

module.exports = router;
