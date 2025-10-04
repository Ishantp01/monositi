const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
} = require("./users.controller");

const { protect, adminOnly } = require("../../middlewares/authMiddleware");

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);

// Authenticated user
router.get("/me", protect, getUserProfile);
router.put("/me", protect, updateUserProfile);

// Admin only
router.get("/", protect, adminOnly, getAllUsers);
router.get("/:id", protect, adminOnly, getUserById);

module.exports = router;
