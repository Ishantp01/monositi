// src/routes/service.routes.js
const express = require("express");
const router = express.Router();
const upload = require("../../config/multer"); // ✅ You missed this import
const serviceController = require("./service.controller");
const { protect, adminOnly, serviceProviderOnly, tenantOnly } = require("../../middlewares/authMiddleware");


router.post(
  "/m",
  protect, // verify JWT and attach req.user
  upload.single("profilePhoto"), // allow image upload
  serviceProviderOnly,
  serviceController.createServiceProvider

);
// Tenant creates a service request
router.post("/services/requests", protect, tenantOnly, serviceController.createServiceRequest);

// Admin views all service requests
router.get("/services/requests/admin", protect, adminOnly, serviceController.listServiceRequestsForAdmin);

// Admin assigns provider to a request
router.patch("/services/requests/:id/assign", protect, adminOnly, serviceController.assignProviderToRequest);

// Tenant gives review and rating
router.post("/services/requests/:id/review", protect, tenantOnly, serviceController.tenantRateService);

// Provider views all assigned & completed requests
router.get("/services/requests/provider", protect, serviceProviderOnly, serviceController.getServiceRequestsForProvider);

// Provider fetches completed services
router.get("/services/requests/provider/completed", protect, serviceProviderOnly, serviceController.getCompletedServicesForProvider);

// Provider updates status
router.patch("/services/requests/:id/status", protect, serviceProviderOnly, serviceController.updateRequestStatus);

// Provider uploads completed work photos
router.post("/services/requests/:id/photos", protect, serviceProviderOnly, serviceController.uploadCompletedWorkPhotos);

// common 
router.get(
  "/services/requests/:id",
  protect,
  serviceController.getServiceRequestById
);

router.get(
  "/services/requests/tenant/:tenantId",
  protect,
  serviceController.getServiceRequestsByTenantId
);

module.exports = router;
