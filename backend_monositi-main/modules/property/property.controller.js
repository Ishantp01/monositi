// src/controllers/property.controller.js
const Property = require("./property.model");
const asyncHandler = require("express-async-handler");

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
      tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
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
    filters.tags = { $in: tags.split(",") };
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
    status: "Verified",
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
