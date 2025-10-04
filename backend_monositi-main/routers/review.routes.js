// src/routes/review.routes.js
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
} = require("../controllers/review.controller");

// Property reviews
router.post("/property/:propertyId", auth, createReview);
router.get("/property/:propertyId", getReviews);

// Service reviews
router.post("/service/:serviceId", auth, createReview);
router.get("/service/:serviceId", getReviews);

// Common
router.patch("/:id", auth, updateReview);
router.delete("/:id", auth, deleteReview);

module.exports = router;
