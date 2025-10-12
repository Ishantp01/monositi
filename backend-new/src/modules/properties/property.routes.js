import express from "express";
import {
  createPropertyListing,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getOwnerProperties,
  getNearbyProperties,
  searchProperties,
} from "./property.controller.js";
import Property from "../../models/property.model.js";
import upload from "../../config/multer.js";
import { protect, adminOnly } from "../../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * Public routes
 */
router.get("/", getProperties);
router.get("/search", searchProperties);
router.get("/nearby", getNearbyProperties);

/**
 * Protected routes (require authentication)
 */
router.post(
  "/",
  protect,
  upload.fields([
    { name: "photos", maxCount: 8 },
    { name: "propertyDocs", maxCount: 6 }
  ]),
  createPropertyListing
);

router.get("/my-properties", protect, getOwnerProperties);
router.put("/:id", protect, updateProperty);
router.delete("/:id", protect, deleteProperty);
router.get("/:id", getPropertyById);

/**
 * Admin routes
 */
router.patch("/:id/verify", protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }

    property.verification_status = status;
    property.verified_by = req.user._id;
    property.verified_at = new Date();

    await property.save();

    res.status(200).json({
      success: true,
      message: `Property ${status} successfully`,
      property
    });
  } catch (error) {
    console.error("Error verifying property:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify property"
    });
  }
});

export default router;


