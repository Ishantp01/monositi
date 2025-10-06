// src/routes/property.routes.js
const express = require("express");
const router = express.Router();
const propertyController = require("./property.controller");
const { protect, adminOnly } = require("../../middlewares/authMiddleware");
const upload = require("../../config/multer");

// Create property
router.post(
  "/properties",
  protect,
  upload.array("photos", 5),
  propertyController.createPropertyListing
);

// Public
router.get("/properties", propertyController.getAllProperties);
router.get("/properties/:id", propertyController.getPropertyById);
router.get("/properties/search/type", propertyController.getPropertiesByType);

// User's properties
router.get("/user/properties", protect, propertyController.getPropertiesByUser);

// Update property (owner only)
router.put(
  "/properties/:id",
  protect,
  upload.array("photos", 5),
  propertyController.updatePropertyListing
);

// Admin actions
router.patch(
  "/admin/properties/:id/verify",
  protect,
  adminOnly,
  propertyController.adminVerifyProperty
);

router.patch(
  "/admin/properties/:id/suspend",
  protect,
  adminOnly,
  propertyController.adminSuspendProperty
);

router.get(
  "/admin/properties/all",
  protect,
  adminOnly,
  propertyController.getAllPropertiesForAdmin
);

module.exports = router;
