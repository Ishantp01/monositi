// src/controllers/review.controller.js
const Review = require("../models/review.model");
const Property = require("../models/property.model");
const Service = require("../models/service.model");

// 🟢 Create Review
exports.createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { propertyId, serviceId } = req.params;

    const reviewData = {
      user: req.user._id,
      rating,
      comment,
    };

    if (propertyId) reviewData.property = propertyId;
    if (serviceId) reviewData.service = serviceId;

    const review = await Review.create(reviewData);

    // Optional: Recalculate average rating for property/service
    if (propertyId) await recalculatePropertyRating(propertyId);
    if (serviceId) await recalculateServiceRating(serviceId);

    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// 🟡 Get Reviews for a Property or Service
exports.getReviews = async (req, res) => {
  try {
    const { propertyId, serviceId } = req.params;

    const filter = propertyId ? { property: propertyId } : { service: serviceId };

    const reviews = await Review.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// 🟠 Update Review
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });

    // Allow only the review owner or admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    await review.save();

    if (review.property) await recalculatePropertyRating(review.property);
    if (review.service) await recalculateServiceRating(review.service);

    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// 🔴 Delete Review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await review.deleteOne();

    if (review.property) await recalculatePropertyRating(review.property);
    if (review.service) await recalculateServiceRating(review.service);

    res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Helper functions for avg rating
async function recalculatePropertyRating(propertyId) {
  const stats = await Review.aggregate([
    { $match: { property: propertyId } },
    { $group: { _id: null, avgRating: { $avg: "$rating" } } }
  ]);
  await Property.findByIdAndUpdate(propertyId, { rating: stats[0]?.avgRating || 0 });
}

async function recalculateServiceRating(serviceId) {
  const stats = await Review.aggregate([
    { $match: { service: serviceId } },
    { $group: { _id: null, avgRating: { $avg: "$rating" } } }
  ]);
  await Service.findByIdAndUpdate(serviceId, { rating: stats[0]?.avgRating || 0 });
}
