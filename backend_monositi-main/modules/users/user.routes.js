const express = require("express");
const router = express.Router();
const {
  registerUser,
  verifyEmail,
  loginUser,
  getUserProfile,
  getAllUsers,
  getUserById,
  createMonositiTenant,
} = require("./users.controller");

const { protect, adminOnly } = require("../../middlewares/authMiddleware");

// Public
router.post("/register", registerUser);
router.post("/verify-email", verifyEmail);
router.post("/login", loginUser);

// Authenticated user
router.get("/me", protect, getUserProfile);

// Admin
router.post("/admin/monositi-tenant", protect, adminOnly, createMonositiTenant);
router.get("/", protect, adminOnly, getAllUsers);
router.get("/:id", protect, adminOnly, getUserById);

module.exports = router;
