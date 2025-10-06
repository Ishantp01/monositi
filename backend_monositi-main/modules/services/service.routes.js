const express = require('express');
const router = express.Router();
const {
  createServiceProvider,
  listServiceProvidersByCategory,
  getServiceProviderById,
  createServiceRequest,
  updateServiceRequestStatus,
  getServiceRequestsForProvider,
} = require('./service.controller');

const { protect, adminOnly } = require('../../middlewares/authMiddleware');

// Admin routes
router.post('/admin/service-providers', protect, adminOnly, createServiceProvider);

// Public routes
router.get('/service-providers', listServiceProvidersByCategory);
router.get('/service-providers/:id', getServiceProviderById);

// User routes
router.post('/service-requests', protect, createServiceRequest);

// Provider/Admin routes
router.patch('/service-requests/:id/status', protect, updateServiceRequestStatus);
router.get('/service-requests/provider', protect, getServiceRequestsForProvider);

module.exports = router;
