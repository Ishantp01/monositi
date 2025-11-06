import express from "express";
import {
  createEnquiry,
  getMyPropertyEnquiries,
  getMyServiceEnquiries,
  updateEnquiryStatus,
  getMyEnquiries,
} from "./enquiry.controller.js";
import { protect } from "../../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Create enquiry
router.post("/", createEnquiry);

// Get user's own enquiries
router.get("/my-enquiries", getMyEnquiries);

// Get property enquiries (for property owners)
router.get("/my-property-enquiries", getMyPropertyEnquiries);

// Get service enquiries (for service providers)
router.get("/my-service-enquiries", getMyServiceEnquiries);

// Update enquiry status
router.patch("/:id/status", updateEnquiryStatus);

export default router;
