const express = require("express");
const router = express.Router();
const propertyController = require("./property.controller");
const { protect, adminOnly } = require("../../middlewares/authMiddleware");
const upload = require("../../config/multer");

// Landlord creates property with multiple images
router.post(
  "/properties",
  protect,
  upload.array("photos", 5), // accept up to 5 images
  propertyController.createPropertyListing
);

// Public routes
router.get("/properties", propertyController.getAllProperties);
router.get("/properties/:id", propertyController.getPropertyById);

// landlord can get his/her property
router.get("/landlord/me", protect, propertyController.getPropertiesByLandlord);


// Landlord updates property (can also update images if needed)
router.put(
  "/properties/:id",
  protect,
  upload.array("photos", 5),
  propertyController.updatePropertyListing
);

// Admin routes
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

router.get("/properties/search/type", propertyController.getPropertiesByTags);


module.exports = router;
