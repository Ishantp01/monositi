// src/controllers/property.controller.js
const Property = require("./property.model");
const asyncHandler = require("express-async-handler");
const cloudinary = require("../../config/cloudinary");
const fs = require("fs");

/**
 * @desc    Create property listing (any authenticated user)
 * @route   POST /properties
 * @access  Authenticated (tenant, landlord, service provider)
 */
exports.createPropertyListing = asyncHandler(async (req, res) => {
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
    contactNumber,
  } = req.body;

  let photoUrls = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "properties",
      });
      photoUrls.push(result.secure_url);
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
    tags: Array.isArray(tags)
      ? tags
      : typeof tags === "string"
      ? tags.split(",").map((t) => t.trim())
      : [],
    genderPreference,
    contactNumber,
  });

  res.status(201).json({
    success: true,
    message: "Property listing created successfully",
    property,
  });
});

/**
 * @desc    Get all verified properties (public)
 * @route   GET /properties
 * @access  Public
 */
exports.getAllProperties = asyncHandler(async (req, res) => {
  const filters = { status: "Verified" };
  const {
    type,
    city,
    minPrice,
    maxPrice,
    tags,
    genderPreference,
    isFeatured,
    monositiVerified,
    popular,
  } = req.query;

  if (type) filters.type = type;
  if (city) filters.city = city;
  if (genderPreference) filters.genderPreference = genderPreference;
  if (isFeatured) filters.isFeatured = isFeatured === "true";
  if (monositiVerified) filters.monositiVerified = monositiVerified === "true";
  if (popular) filters.popular = popular === "true";

  if (tags) {
    const tagList = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
      ? tags.split(",").map((tag) => tag.trim())
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
 * @desc    Get property details by ID (only if Verified)
 * @route   GET /properties/:id
 * @access  Public
 */
exports.getPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findOne({
    _id: req.params.id,
    status: "Verified",
  }).populate("landlord", "name email");

  if (!property) {
    return res.status(404).json({
      success: false,
      message: "Property not found or not verified",
    });
  }

  res.json({ success: true, property });
});

/**
 * @desc    Update property (only owner)
 * @route   PUT /properties/:id
 * @access  Authenticated (owner only)
 */
exports.updatePropertyListing = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    return res.status(404).json({ success: false, message: "Property not found" });
  }

  if (property.landlord.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  // Only allow updating specific fields that users should be able to modify
  const allowedFields = [
    'type', 'name', 'description', 'address', 'city', 'state',
    'price', 'tags', 'genderPreference', 'contactNumber'
  ];

  const updates = {};
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  // Handle photo updates separately
  if (req.files && req.files.length > 0) {
    let photoUrls = [];
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "properties",
      });
      photoUrls.push(result.secure_url);
      fs.unlinkSync(file.path);
    }
    updates.photos = photoUrls;
  }

  Object.assign(property, updates);
  property.status = "Pending"; // reset to pending after any update

  await property.save();
  res.json({ success: true, property });
});

/**
 * @desc    Admin verifies or rejects property, sets monositiVerified
 * @route   PATCH /admin/properties/:id/verify
 * @access  Admin
 */
exports.adminVerifyProperty = asyncHandler(async (req, res) => {
  const { status, monositiVerified } = req.body;
  if (!["Verified", "Rejected"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  const property = await Property.findByIdAndUpdate(
    req.params.id,
    { status, monositiVerified: monositiVerified ?? false },
    { new: true }
  );

  if (!property) {
    return res.status(404).json({ success: false, message: "Property not found" });
  }

  res.json({ success: true, property });
});

/**
 * @desc    Admin suspends property
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

/**
 * @desc    Get properties by type (Buy, Rent, Commercial)
 * @route   GET /properties/search/type
 * @access  Public
 */
exports.getPropertiesByType = asyncHandler(async (req, res) => {
  const { type } = req.query;
  const allowedTypes = ["Buy", "Rent", "Commercial"];

  if (!type || !allowedTypes.includes(type)) {
    return res.status(400).json({
      success: false,
      message: `Invalid or missing type. Allowed: ${allowedTypes.join(", ")}`,
    });
  }

  const properties = await Property.find({
    type,
    status: "Verified",
  }).populate("landlord", "name email");

  res.json({ success: true, count: properties.length, properties });
});

/**
 * @desc    Admin: Get properties by type (all statuses)
 * @route   GET /admin/properties/type
 * @access  Admin
 */
exports.adminGetPropertiesByType = asyncHandler(async (req, res) => {
  const { type } = req.query;
  const allowedTypes = ["Buy", "Rent", "Commercial"];

  if (!type || !allowedTypes.includes(type)) {
    return res.status(400).json({
      success: false,
      message: `Invalid or missing type. Allowed: ${allowedTypes.join(", ")}`,
    });
  }

  const properties = await Property.find({
    type,
  }).populate("landlord", "name email");

  res.json({
    success: true,
    count: properties.length,
    properties,
    type,
  });
});

/**
 * @desc    Get all properties of logged-in user
 * @route   GET /user/properties
 * @access  Authenticated
 */
exports.getPropertiesByUser = asyncHandler(async (req, res) => {
  const properties = await Property.find({ landlord: req.user._id }).populate(
    "landlord",
    "name email"
  );
  res.json({ success: true, count: properties.length, properties });
});

/**
 * @desc    Admin fetches all properties without filtering
 * @route   GET /admin/properties/all
 * @access  Admin
 */
exports.getAllPropertiesForAdmin = asyncHandler(async (req, res) => {
  const properties = await Property.find().populate("landlord", "name email");
  res.json({ success: true, count: properties.length, properties });
});
