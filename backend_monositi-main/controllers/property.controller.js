// controllers/property.controller.js
const Property = require("../models/property.model");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

exports.createProperty = async (req, res) => {
  try {
    const { title, description, price, location, address, contactNumber, category, propertyType } = req.body;

    let uploadedPhotos = [];

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "monositi/properties",
        });
        uploadedPhotos.push(result.secure_url);
        fs.unlinkSync(file.path);
      }
    }

    const property = new Property({
      title,
      description,
      price,
      location,
      address,
      contactNumber,
      category,
      propertyType,
      photos: uploadedPhotos, // ✅ use correct field
      owner: req.user.id,
    });

    await property.save();
    res.status(201).json({ success: true, property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate("owner", "name email");
    res.json({ success: true, count: properties.length, properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate("owner", "name email");
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }
    res.json({ success: true, property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    // Check permission
    if (property.owner.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const { title, description, price, location, address, contactNumber, category, propertyType } = req.body;

    // Update fields
    if (title) property.title = title;
    if (description) property.description = description;
    if (price) property.price = price;
    if (location) property.location = location;
    if (address) property.address = address;
    if (contactNumber) property.contactNumber = contactNumber;
    if (category) property.category = category;
    if (propertyType) property.propertyType = propertyType;

    // Handle new images
    if (req.files && req.files.length > 0) {
      let uploadedImages = [];
      for (let file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, { folder: "monositi/properties" });
        uploadedImages.push(result.secure_url);
        fs.unlinkSync(file.path);
      }
      property.images = property.images.concat(uploadedImages);
    }

    await property.save();
    res.json({ success: true, property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    if (property.owner.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await property.deleteOne();
    res.json({ success: true, message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user.id });
    res.json({ success: true, count: properties.length, properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};