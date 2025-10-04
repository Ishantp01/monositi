// routers/property.routes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../config/multer");
const { createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getMyProperties,
 } = require("../controllers/property.controller");

// Upload multiple images (max 5)
router.get("/", getAllProperties);
router.get("/:id", getPropertyById);

// Protected
router.post("/", authMiddleware, upload.array("images", 5), createProperty);
router.put("/:id", authMiddleware, upload.array("images", 5), updateProperty);
router.delete("/:id", authMiddleware, deleteProperty);
router.get("/me/listings", authMiddleware, getMyProperties);

module.exports = router;
