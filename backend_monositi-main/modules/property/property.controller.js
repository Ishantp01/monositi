// src/controllers/property.controller.js
const Property = require("./property.model");
const asyncHandler = require("express-async-handler");
const cloudinary = require("../../config/cloudinary");
const fs = require("fs");

/**
 * @desc    Landlord creates a new property listing (status defaults to Pending)
 * @route   POST /properties
 * @access  Landlord
 */
exports.createPropertyListing = async (req, res) => {
  try {
    const landlordId = req.user._id;
    const {
      type,
      name,
      description,
      address,
      city,
      state,
      price,
      tags,
      genderPreference,
      contactNumber
    } = req.body;

    let photoUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "properties"
        });
        photoUrls.push(result.secure_url);
        // remove temp file after uploading
        fs.unlinkSync(file.path);
      }
    }

    const property = await Property.create({
      landlord: landlordId,
      type,
      name,
      description,
      address,
      city,
      state,
      price,
      photos: photoUrls,
      tags:  Array.isArray(req.body.tags) ? req.body.tags: typeof req.body.tags === 'string' ? req.body.tags.split(',').map(tag => tag.trim()) : [],
      genderPreference,
      contactNumber
    });

    res.status(201).json({
      success: true,
      message: "Property listing created successfully",
      property
    });
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

/**
 * @desc    Get all VERIFIED properties (public)
 * @route   GET /properties
 * @access  Public
 */
exports.getAllProperties = asyncHandler(async (req, res) => {
  const filters = { status: "Verified" };
  const { type, city, minPrice, maxPrice, tags, genderPreference, isFeatured } = req.query;

  if (type) filters.type = type;
  if (city) filters.city = city;
  if (genderPreference) filters.genderPreference = genderPreference;
  if (isFeatured) filters.isFeatured = isFeatured === "true";

  if (tags) {
  const tagList = Array.isArray(tags)
    ? tags
    : typeof tags === 'string'
      ? tags.split(',').map(tag => tag.trim())
      : [];

  if (tagList.length > 0) {
    filters.tags = { $in: tagList };
  }
}


  if (minPrice || maxPrice) {
    filters.price = {};
    if (minPrice) filters.price.$gte = Number(minPrice);
    if (maxPrice) filters.price.$lte = Number(maxPrice);
  }

  const properties = await Property.find(filters).populate("landlord", "name email");

  res.json({ success: true, count: properties.length, properties });
});

/**
 * @desc    Get detailed info for a specific verified property
 * @route   GET /properties/:id
 * @access  Public
 */
exports.getPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findOne({
    _id: req.params.id,
  }).populate("landlord", "name email");

  if (!property) {
    return res.status(404).json({ success: false, message: "Property not found or not verified" });
  }

  res.json({ success: true, property });
});

/**
 * @desc    Landlord updates their own property — status resets to Pending
 * @route   PUT /properties/:id
 * @access  Landlord
 */
exports.updatePropertyListing = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    return res.status(404).json({ success: false, message: "Property not found" });
  }

  if (property.landlord.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Not authorized to update this listing" });
  }

  Object.assign(property, req.body);
  property.status = "Pending"; // Reset to pending after update

  await property.save();
  res.json({ success: true, property });
});

/**
 * @desc    Admin approves or rejects a property
 * @route   PATCH /admin/properties/:id/verify
 * @access  Admin
 */
exports.adminVerifyProperty = asyncHandler(async (req, res) => {
  const { status } = req.body; // status can be 'Verified' or 'Rejected'

  if (!["Verified", "Rejected"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  const property = await Property.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!property) {
    return res.status(404).json({ success: false, message: "Property not found" });
  }

  res.json({ success: true, property });
});

/**
 * @desc    Admin suspends a property listing
 * @route   PATCH /admin/properties/:id/suspend
 * @access  Admin
 */
exports.adminSuspendProperty = asyncHandler(async (req, res) => {
  const property = await Property.findByIdAndUpdate(
    req.params.id,
    { status: "Suspended" },
    { new: true }
  );

  if (!property) {
    return res.status(404).json({ success: false, message: "Property not found" });
  }

  res.json({ success: true, property });
});

exports.getPropertiesByType = async (req, res) => {
  try {
    const { type } = req.query;

    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Type is required",
      });
    }

    // Validate against allowed enum values to avoid invalid queries
    const allowedTypes = ["PG/Hostel", "Rent", "Buy", "Commercial"];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid type. Allowed types: ${allowedTypes.join(", ")}`,
      });
    }

    // Fetch verified properties of the given type
    const properties = await Property.find({
      type,
      status: "verified",
    }).populate("landlord", "name email");

    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    console.error("Error fetching properties by type:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getPropertiesByLandlord = asyncHandler(async (req, res) => {
  const landlordId = req.user._id;

  const properties = await Property.find({ landlord: landlordId }).populate(
    "landlord",
    "name email"
  );

  res.status(200).json({
    success: true,
    count: properties.length,
    properties,
  });
});


exports.getAllPropertiesForAdmin = async (req, res) => {
  try {
    // Optional: You can add role check if needed
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    // Fetch all properties without filtering by status
    const properties = await Property.find().populate("landlord");

    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    console.error("Error fetching all properties for admin:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
