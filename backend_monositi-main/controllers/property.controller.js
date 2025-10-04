// controllers/property.controller.js
const Property = require("../models/property.model");
const User = require("../models/user.model");

// CREATE Property (Landlord only)
exports.createProperty = async (req, res) => {
  try {
    const { title, description, category, subCategory, address, contactNumber, photos, tags, price, isFurnished, amenities, listingTier } = req.body;

    // Only landlord can create
    if (req.user.role !== "landlord" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only landlords/admin can create property listings" });
    }

    const property = new Property({
      owner: req.user.id,
      title,
      description,
      category,
      subCategory,
      address,
      contactNumber,
      photos,
      tags,
      price,
      isFurnished,
      amenities,
      listingTier,
      approved: req.user.role === "admin" ? true : false // auto-approved if admin
    });

    await property.save();

    res.status(201).json({
      message: "Property created successfully. Awaiting admin approval.",
      property
    });
  } catch (err) {
    res.status(500).json({ message: "Error creating property", error: err.message });
  }
};

// GET all approved properties (Tenant browsing)
exports.getAllProperties = async (req, res) => {
  try {
    const filters = { approved: true };
    if (req.query.category) filters.category = req.query.category;
    if (req.query.city) filters["address.city"] = req.query.city;

    const properties = await Property.find(filters)
      .populate("owner", "name email phone role isVerified")
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: "Error fetching properties", error: err.message });
  }
};

// GET single property details
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate("owner", "name email phone role isVerified");

    if (!property || !property.approved) {
      return res.status(404).json({ message: "Property not found or not approved" });
    }

    res.json(property);
  } catch (err) {
    res.status(500).json({ message: "Error fetching property", error: err.message });
  }
};

// UPDATE property (Owner or Admin)
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) return res.status(404).json({ message: "Property not found" });

    if (property.owner.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this property" });
    }

    const updates = req.body;
    updates.updatedAt = new Date();

    const updatedProperty = await Property.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ message: "Property updated", property: updatedProperty });
  } catch (err) {
    res.status(500).json({ message: "Error updating property", error: err.message });
  }
};

// DELETE property (Owner or Admin)
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) return res.status(404).json({ message: "Property not found" });

    if (property.owner.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this property" });
    }

    await property.remove();
    res.json({ message: "Property deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting property", error: err.message });
  }
};

// ADMIN: Approve or Reject Property
exports.approveProperty = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can approve properties" });
    }

    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    property.approved = true;
    property.isVerified = req.body.isVerified || false;
    property.listingTier = req.body.listingTier || "normal";
    await property.save();

    res.json({ message: "Property approved successfully", property });
  } catch (err) {
    res.status(500).json({ message: "Error approving property", error: err.message });
  }
};
