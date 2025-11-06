import express from "express";
const router = express.Router();

import {
  // Listings Management
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  verifyListing,
  deleteListing,
  // Room Management
  addRoom,
  getListingRooms,
  getRoomById,
  updateRoom,
  updateRoomStatus,
  deleteRoom,
  // Public APIs
  getPublicListings,
  getPublicListingById,
  sendEnquiry,
  // Enquiry Management
  getAllEnquiries,
  updateEnquiryStatus,
} from "./monositi.controller.js";

import { protect, adminOnly } from "../../middlewares/authMiddleware.js";
import upload from "../../config/multer.js";

//================================================================
// PUBLIC ROUTES (No authentication required)
//================================================================

// Get verified & available listings (public)
router.get("/public/listings", getPublicListings);

// Get public listing details with rooms
router.get("/public/listings/:id", getPublicListingById);

// Send enquiry about a listing (public - no auth required)
router.post("/public/listings/:id/enquiry", sendEnquiry);

//================================================================
// ADMIN-ONLY ROUTES (Authentication + Admin role required)
//================================================================

// Apply admin protection to all routes below
router.use(protect, adminOnly);

//----------------------------------------------------------------
// A. LISTINGS MANAGEMENT
//----------------------------------------------------------------

// Create new listing with image uploads
router.post("/listings", upload.fields([{ name: "images", maxCount: 10 }]), createListing);

// Get all listings with filters
router.get("/listings", getAllListings);

// Get single listing details
router.get("/listings/:id", getListingById);

// Update listing details
router.put("/listings/:id", upload.fields([{ name: "images", maxCount: 10 }]), updateListing);

// Verify or unverify a listing
router.patch("/listings/:id/verify", verifyListing);

// Delete a listing
router.delete("/listings/:id", deleteListing);

//----------------------------------------------------------------
// B. ROOM MANAGEMENT (Hostel/PG)
//----------------------------------------------------------------

// Add a room to a hostel/PG listing
router.post("/listings/:listingId/rooms", upload.fields([{ name: "images", maxCount: 5 }]), addRoom);

// Get all rooms for a specific listing
router.get("/listings/:listingId/rooms", getListingRooms);

// Get single room details
router.get("/rooms/:roomId", getRoomById);

// Update room details
router.put("/rooms/:roomId", upload.fields([{ name: "images", maxCount: 5 }]), updateRoom);

// Update room bed availability status
router.patch("/rooms/:roomId/status", updateRoomStatus);

// Delete a room
router.delete("/rooms/:roomId", deleteRoom);

//----------------------------------------------------------------
// C. ENQUIRY MANAGEMENT
//----------------------------------------------------------------

// Get all enquiries with filters
router.get("/enquiries", getAllEnquiries);

// Update enquiry status
router.patch("/enquiries/:enquiryId/status", updateEnquiryStatus);

export default router;

