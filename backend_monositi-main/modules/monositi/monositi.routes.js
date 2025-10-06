const express = require("express");
const router = express.Router();
const {
  createMonositiListing,
  getAllMonositiListings,
  getMonositiListingById,
  updateMonositiListing,
  deleteMonositiListing,
} = require("./monositi.controller");

const { protect, adminOnly } = require("../../middlewares/authMiddleware");
const upload = require("../../config/multer");

// Public routes
router.get("/", getAllMonositiListings);
router.get("/:id", getMonositiListingById);

// Admin routes
router.post(
  "/",
  protect,
  adminOnly,
  upload.array("photos", 5),
  createMonositiListing
);
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.array("photos", 5),
  updateMonositiListing
);
router.delete("/:id", protect, adminOnly, deleteMonositiListing);

module.exports = router;
