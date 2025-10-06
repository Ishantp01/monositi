const MonositiListing = require("./monositi.model");
const asyncHandler = require("express-async-handler");
const cloudinary = require("../../config/cloudinary");
const fs = require("fs");

/**
 * @desc    Admin - Create a new Monositi listing
 * @route   POST /monositi
 * @access  Admin
 */
exports.createMonositiListing = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    address,
    city,
    state,
    price,
    facilities,
    genderPreference,
    contactNumber,
  } = req.body;

  let photoUrls = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "monositi",
      });
      photoUrls.push(result.secure_url);
      fs.unlinkSync(file.path);
    }
  }

  const listing = await MonositiListing.create({
    title,
    description,
    category,
    address,
    city,
    state,
    price,
    photos: photoUrls,
    facilities,
    genderPreference,
    contactNumber,
  });

  res.status(201).json({
    success: true,
    message: "Monositi listing created successfully",
    listing,
  });
});

/**
 * @desc    Public - Get all Monositi listings
 * @route   GET /monositi
 * @access  Public
 * @filters category, city, genderPreference
 */
exports.getAllMonositiListings = asyncHandler(async (req, res) => {
  const { category, city, genderPreference, minPrice, maxPrice } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (city) filter.city = city;
  if (genderPreference) filter.genderPreference = genderPreference;

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const listings = await MonositiListing.find(filter);
  res.json({ success: true, count: listings.length, listings });
});

/**
 * @desc    Public - Get a single Monositi listing by ID
 * @route   GET /monositi/:id
 * @access  Public
 */
exports.getMonositiListingById = asyncHandler(async (req, res) => {
  const listing = await MonositiListing.findById(req.params.id);

  if (!listing) {
    return res.status(404).json({
      success: false,
      message: "Monositi listing not found",
    });
  }

  res.json({ success: true, listing });
});

/**
 * @desc    Admin - Update a Monositi listing
 * @route   PUT /monositi/:id
 * @access  Admin
 */
exports.updateMonositiListing = asyncHandler(async (req, res) => {
  const listing = await MonositiListing.findById(req.params.id);

  if (!listing) {
    return res.status(404).json({
      success: false,
      message: "Monositi listing not found",
    });
  }

  // Handle photo uploads if new photos are provided
  if (req.files && req.files.length > 0) {
    let photoUrls = [];
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "monositi",
      });
      photoUrls.push(result.secure_url);
      fs.unlinkSync(file.path);
    }
    req.body.photos = photoUrls;
  }

  // Update the listing
  Object.assign(listing, req.body);
  await listing.save();

  res.json({
    success: true,
    message: "Monositi listing updated successfully",
    listing,
  });
});

/**
 * @desc    Admin - Delete a Monositi listing
 * @route   DELETE /monositi/:id
 * @access  Admin
 */
exports.deleteMonositiListing = asyncHandler(async (req, res) => {
  const listing = await MonositiListing.findByIdAndDelete(req.params.id);

  if (!listing) {
    return res.status(404).json({
      success: false,
      message: "Monositi listing not found",
    });
  }

  res.json({
    success: true,
    message: "Monositi listing deleted successfully",
  });
});
