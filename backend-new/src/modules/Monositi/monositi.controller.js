import MonositiListing from "../../models/MonositiListing.model.js";
import MonositiRoom from "../../models/MonositiRoom.model.js";
import MonositiEnquiry from "../../models/MonositiEnquiry.model.js";
import { uploadFileToCloudinary } from "../../utils/uploadToCloudinary.js";
import fs from "fs";

/**
 * Helper function to safely get files from multer
 * @param {Object} files - Files object from multer
 * @param {string} key - File field name
 * @returns {Array} Array of files or empty array
 */
const safeFiles = (files, key) => (files && files[key] ? files[key] : []);

//================================================================
// A. LISTINGS MANAGEMENT (Admin Only)
//================================================================

/**
 * Create a new Monositi listing
 * @route POST /api/monositi/listings
 * @access Admin only
 */
export const createListing = async (req, res) => {
  try {
    const {
      title,
      description,
      category, // commercial, hostel_pg, land_plot
      address,
      city,
      state,
      pincode,
      coordinates, // { lng, lat } or string
      area,
      price,
    } = req.body;

    // Validation
    const allowedCategories = ["commercial", "hostel_pg", "land_plot"];
    if (!category || !allowedCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `category is required and must be one of: ${allowedCategories.join(", ")}`,
      });
    }

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "title is required",
      });
    }

    // Parse coordinates if provided
    let geoCoordinates = null;
    if (coordinates) {
      try {
        const coords = typeof coordinates === "string" ? JSON.parse(coordinates) : coordinates;
        if (coords.lng && coords.lat) {
          geoCoordinates = {
            type: "Point",
            coordinates: [parseFloat(coords.lng), parseFloat(coords.lat)],
          };
        }
      } catch (err) {
        console.log("Error parsing coordinates:", err.message);
      }
    }

    // Handle image uploads
    let uploadedImages = [];
    if (req.files && req.files.images) {
      const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      
      for (const file of imageFiles) {
        try {
          const result = await uploadFileToCloudinary(file.path);
          uploadedImages.push(result.secure_url);
          // Delete local file
          fs.unlinkSync(file.path);
        } catch (err) {
          console.error("Image upload error:", err.message);
        }
      }
    }

    // Create listing
    const listing = new MonositiListing({
      title,
      description,
      category,
      location: {
        address,
        city,
        state,
        pincode,
        coordinates: geoCoordinates,
      },
      images: uploadedImages,
      area,
      price,
      createdBy: req.user._id,
      monositi_verified: false,
    });

    await listing.save();

    return res.status(201).json({
      success: true,
      message: "Listing created successfully",
      data: listing,
    });
  } catch (error) {
    console.error("Create listing error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create listing",
      error: error.message,
    });
  }
};

/**
 * Get all Monositi listings with filters
 * @route GET /api/monositi/listings?category=&city=&status=&verified=
 * @access Admin only
 */
export const getAllListings = async (req, res) => {
  try {
    const { category, city, status, verified } = req.query;

    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (city) filter["location.city"] = new RegExp(city, "i");
    if (status) filter.status = status;
    if (verified !== undefined) filter.monositi_verified = verified === "true";

    const listings = await MonositiListing.find(filter)
      .populate("createdBy", "name email phone")
      .populate("rooms")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: listings.length,
      data: listings,
    });
  } catch (error) {
    console.error("Get all listings error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch listings",
      error: error.message,
    });
  }
};

/**
 * Get single listing details
 * @route GET /api/monositi/listings/:id
 * @access Admin only
 */
export const getListingById = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await MonositiListing.findById(id)
      .populate("createdBy", "name email phone")
      .populate("rooms");

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    console.error("Get listing by ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch listing",
      error: error.message,
    });
  }
};

/**
 * Update listing details
 * @route PUT /api/monositi/listings/:id
 * @access Admin only
 */
export const updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      category,
      address,
      city,
      state,
      pincode,
      coordinates,
      area,
      price,
      status,
    } = req.body;

    const listing = await MonositiListing.findById(id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // Update fields
    if (title) listing.title = title;
    if (description) listing.description = description;
    if (category) listing.category = category;
    if (area) listing.area = area;
    if (price) listing.price = price;
    if (status) listing.status = status;

    // Update location
    if (address) listing.location.address = address;
    if (city) listing.location.city = city;
    if (state) listing.location.state = state;
    if (pincode) listing.location.pincode = pincode;

    // Update coordinates if provided
    if (coordinates) {
      try {
        const coords = typeof coordinates === "string" ? JSON.parse(coordinates) : coordinates;
        if (coords.lng && coords.lat) {
          listing.location.coordinates = {
            type: "Point",
            coordinates: [parseFloat(coords.lng), parseFloat(coords.lat)],
          };
        }
      } catch (err) {
        console.log("Error parsing coordinates:", err.message);
      }
    }

    // Handle new image uploads
    if (req.files && req.files.images) {
      const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      
      for (const file of imageFiles) {
        try {
          const result = await uploadFileToCloudinary(file.path);
          listing.images.push(result.secure_url);
          fs.unlinkSync(file.path);
        } catch (err) {
          console.error("Image upload error:", err.message);
        }
      }
    }

    await listing.save();

    return res.status(200).json({
      success: true,
      message: "Listing updated successfully",
      data: listing,
    });
  } catch (error) {
    console.error("Update listing error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update listing",
      error: error.message,
    });
  }
};

/**
 * Verify or unverify a listing
 * @route PATCH /api/monositi/listings/:id/verify
 * @access Admin only
 */
export const verifyListing = async (req, res) => {
  try {
    const { id } = req.params;
    const { verified } = req.body; // true or false

    const listing = await MonositiListing.findById(id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    listing.monositi_verified = verified === true || verified === "true";
    await listing.save();

    return res.status(200).json({
      success: true,
      message: `Listing ${listing.monositi_verified ? "verified" : "unverified"} successfully`,
      data: listing,
    });
  } catch (error) {
    console.error("Verify listing error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify listing",
      error: error.message,
    });
  }
};

/**
 * Delete a listing (soft delete)
 * @route DELETE /api/monositi/listings/:id
 * @access Admin only
 */
export const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await MonositiListing.findById(id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // Delete all associated rooms if hostel_pg
    if (listing.category === "hostel_pg") {
      await MonositiRoom.deleteMany({ listing: id });
    }

    // Delete the listing
    await MonositiListing.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (error) {
    console.error("Delete listing error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete listing",
      error: error.message,
    });
  }
};

//================================================================
// B. ROOM MANAGEMENT (Admin Only - for Hostel/PG)
//================================================================

/**
 * Add a room to a hostel/PG listing
 * @route POST /api/monositi/listings/:listingId/rooms
 * @access Admin only
 */
export const addRoom = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { floor, room_number, total_beds, available_beds, rent_per_bed, amenities } = req.body;

    // Validation
    const listing = await MonositiListing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    if (listing.category !== "hostel_pg") {
      return res.status(400).json({
        success: false,
        message: "Rooms can only be added to hostel_pg listings",
      });
    }

    if (!floor || !room_number || !total_beds) {
      return res.status(400).json({
        success: false,
        message: "floor, room_number, and total_beds are required",
      });
    }

    // Handle room image uploads
    let uploadedImages = [];
    if (req.files && req.files.images) {
      const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      
      for (const file of imageFiles) {
        try {
          const result = await uploadFileToCloudinary(file.path);
          uploadedImages.push(result.secure_url);
          fs.unlinkSync(file.path);
        } catch (err) {
          console.error("Image upload error:", err.message);
        }
      }
    }

    // Create room
    const room = new MonositiRoom({
      listing: listingId,
      floor,
      room_number,
      total_beds,
      available_beds: available_beds !== undefined ? available_beds : total_beds,
      rent_per_bed,
      amenities: amenities ? (Array.isArray(amenities) ? amenities : JSON.parse(amenities)) : [],
      images: uploadedImages,
      status: available_beds === 0 ? "full" : "available",
    });

    await room.save();

    // Add room to listing
    listing.rooms.push(room._id);
    await listing.save();

    return res.status(201).json({
      success: true,
      message: "Room added successfully",
      data: room,
    });
  } catch (error) {
    console.error("Add room error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add room",
      error: error.message,
    });
  }
};

/**
 * Get all rooms for a specific listing
 * @route GET /api/monositi/listings/:listingId/rooms
 * @access Admin only
 */
export const getListingRooms = async (req, res) => {
  try {
    const { listingId } = req.params;

    const listing = await MonositiListing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    const rooms = await MonositiRoom.find({ listing: listingId }).sort({ floor: 1, room_number: 1 });

    return res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    console.error("Get listing rooms error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch rooms",
      error: error.message,
    });
  }
};

/**
 * Get single room details
 * @route GET /api/monositi/rooms/:roomId
 * @access Admin only
 */
export const getRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await MonositiRoom.findById(roomId).populate("listing");

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error) {
    console.error("Get room by ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch room",
      error: error.message,
    });
  }
};

/**
 * Update room details
 * @route PUT /api/monositi/rooms/:roomId
 * @access Admin only
 */
export const updateRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { floor, room_number, total_beds, available_beds, rent_per_bed, amenities } = req.body;

    const room = await MonositiRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Update fields
    if (floor !== undefined) room.floor = floor;
    if (room_number) room.room_number = room_number;
    if (total_beds !== undefined) room.total_beds = total_beds;
    if (available_beds !== undefined) room.available_beds = available_beds;
    if (rent_per_bed !== undefined) room.rent_per_bed = rent_per_bed;
    if (amenities) room.amenities = Array.isArray(amenities) ? amenities : JSON.parse(amenities);

    // Update status based on available beds
    room.status = room.available_beds === 0 ? "full" : "available";

    // Handle new image uploads
    if (req.files && req.files.images) {
      const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      
      for (const file of imageFiles) {
        try {
          const result = await uploadFileToCloudinary(file.path);
          room.images.push(result.secure_url);
          fs.unlinkSync(file.path);
        } catch (err) {
          console.error("Image upload error:", err.message);
        }
      }
    }

    await room.save();

    // Update listing status if all rooms are full
    await updateListingStatus(room.listing);

    return res.status(200).json({
      success: true,
      message: "Room updated successfully",
      data: room,
    });
  } catch (error) {
    console.error("Update room error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update room",
      error: error.message,
    });
  }
};

/**
 * Update room bed availability status
 * @route PATCH /api/monositi/rooms/:roomId/status
 * @access Admin only
 */
export const updateRoomStatus = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { available_beds } = req.body;

    if (available_beds === undefined) {
      return res.status(400).json({
        success: false,
        message: "available_beds is required",
      });
    }

    const room = await MonositiRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Validate available_beds
    if (available_beds < 0 || available_beds > room.total_beds) {
      return res.status(400).json({
        success: false,
        message: `available_beds must be between 0 and ${room.total_beds}`,
      });
    }

    room.available_beds = available_beds;
    room.status = available_beds === 0 ? "full" : "available";
    await room.save();

    // Update listing status
    await updateListingStatus(room.listing);

    return res.status(200).json({
      success: true,
      message: "Room status updated successfully",
      data: room,
    });
  } catch (error) {
    console.error("Update room status error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update room status",
      error: error.message,
    });
  }
};

/**
 * Delete a room
 * @route DELETE /api/monositi/rooms/:roomId
 * @access Admin only
 */
export const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await MonositiRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    const listingId = room.listing;

    // Remove room from listing
    await MonositiListing.findByIdAndUpdate(listingId, {
      $pull: { rooms: roomId },
    });

    // Delete the room
    await MonositiRoom.findByIdAndDelete(roomId);

    // Update listing status
    await updateListingStatus(listingId);

    return res.status(200).json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error("Delete room error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete room",
      error: error.message,
    });
  }
};

//================================================================
// C. PUBLIC/FRONTEND APIs (Read-only)
//================================================================

/**
 * Get verified & available listings (public)
 * @route GET /api/monositi/public/listings?category=&city=
 * @access Public
 */
export const getPublicListings = async (req, res) => {
  try {
    const { category, city } = req.query;

    // Build filter - only verified and available
    const filter = {
      monositi_verified: true,
      status: { $ne: "fullhouse" },
    };

    if (category) filter.category = category;
    if (city) filter["location.city"] = new RegExp(city, "i");

    const listings = await MonositiListing.find(filter)
      .populate("rooms")
      .select("-createdBy")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: listings.length,
      data: listings,
    });
  } catch (error) {
    console.error("Get public listings error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch listings",
      error: error.message,
    });
  }
};

/**
 * Get public listing details with rooms
 * @route GET /api/monositi/public/listings/:id
 * @access Public
 */
export const getPublicListingById = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await MonositiListing.findById(id)
      .populate("rooms")
      .select("-createdBy");

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    if (!listing.monositi_verified) {
      return res.status(403).json({
        success: false,
        message: "This listing is not verified",
      });
    }

    return res.status(200).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    console.error("Get public listing by ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch listing",
      error: error.message,
    });
  }
};

/**
 * Send enquiry about a listing
 * @route POST /api/monositi/public/listings/:id/enquiry
 * @access Public
 */
export const sendEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, message, enquiry_type } = req.body;

    // Validation
    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "name, email, phone, and message are required",
      });
    }

    // Check if listing exists
    const listing = await MonositiListing.findById(id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // Create enquiry
    const enquiry = new MonositiEnquiry({
      listing: id,
      user: req.user ? req.user._id : null, // If user is logged in
      name,
      email,
      phone,
      message,
      enquiry_type: enquiry_type || "general",
      status: "pending",
    });

    await enquiry.save();

    return res.status(201).json({
      success: true,
      message: "Enquiry sent successfully. We will contact you soon.",
      data: enquiry,
    });
  } catch (error) {
    console.error("Send enquiry error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send enquiry",
      error: error.message,
    });
  }
};

//================================================================
// D. ENQUIRY MANAGEMENT (Admin Only)
//================================================================

/**
 * Get all enquiries with filters
 * @route GET /api/monositi/enquiries?listing=&status=
 * @access Admin only
 */
export const getAllEnquiries = async (req, res) => {
  try {
    const { listing, status } = req.query;

    // Build filter object
    const filter = {};
    if (listing) filter.listing = listing;
    if (status) filter.status = status;

    const enquiries = await MonositiEnquiry.find(filter)
      .populate("listing", "title category location images")
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    console.error("Get all enquiries error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch enquiries",
      error: error.message,
    });
  }
};

/**
 * Update enquiry status
 * @route PATCH /api/monositi/enquiries/:enquiryId/status
 * @access Admin only
 */
export const updateEnquiryStatus = async (req, res) => {
  try {
    const { enquiryId } = req.params;
    const { status, admin_notes } = req.body;

    const enquiry = await MonositiEnquiry.findById(enquiryId);
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    // Update status
    if (status) {
      enquiry.status = status;
      
      // Update timestamps based on status
      if (status === "contacted" && !enquiry.contacted_at) {
        enquiry.contacted_at = new Date();
      }
      if (status === "resolved" && !enquiry.resolved_at) {
        enquiry.resolved_at = new Date();
      }
    }

    // Update admin notes if provided
    if (admin_notes) {
      enquiry.admin_notes = admin_notes;
    }

    await enquiry.save();

    return res.status(200).json({
      success: true,
      message: "Enquiry updated successfully",
      data: enquiry,
    });
  } catch (error) {
    console.error("Update enquiry status error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update enquiry",
      error: error.message,
    });
  }
};

//================================================================
// HELPER FUNCTIONS
//================================================================

/**
 * Helper: Update listing status based on room availability
 */
async function updateListingStatus(listingId) {
  try {
    const listing = await MonositiListing.findById(listingId);
    if (!listing || listing.category !== "hostel_pg") return;

    const rooms = await MonositiRoom.find({ listing: listingId });
    
    if (rooms.length === 0) {
      listing.status = "available";
    } else {
      const allFull = rooms.every((room) => room.status === "full");
      const anyAvailable = rooms.some((room) => room.status === "available");

      if (allFull) {
        listing.status = "fullhouse";
      } else if (anyAvailable) {
        listing.status = "available";
      }
    }

    await listing.save();
  } catch (error) {
    console.error("Update listing status error:", error);
  }
}

