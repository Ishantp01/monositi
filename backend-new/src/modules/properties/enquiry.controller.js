import Enquiry from "../../models/enquiry.model.js";
import Property from "../../models/property.model.js";
import Service from "../../models/service.model.js";
import mongoose from "mongoose";

/**
 * Create an enquiry for a property or service
 * @route POST /api/enquiries
 * @access Private (authenticated users)
 */
export const createEnquiry = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      property_id,
      service_id,
      name,
      email,
      phone,
      message,
      enquiry_type,
    } = req.body;

    // Validation
    if (!name || !email || !phone || !message || !enquiry_type) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone, message, and enquiry_type are required",
      });
    }

    if (enquiry_type === "property" && !property_id) {
      return res.status(400).json({
        success: false,
        message: "Property ID is required for property enquiries",
      });
    }

    if (enquiry_type === "service" && !service_id) {
      return res.status(400).json({
        success: false,
        message: "Service ID is required for service enquiries",
      });
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid 10-digit phone number",
      });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Check if property/service exists
    if (enquiry_type === "property") {
      if (!mongoose.Types.ObjectId.isValid(property_id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid property ID",
        });
      }

      const property = await Property.findById(property_id);
      if (!property) {
        return res.status(404).json({
          success: false,
          message: "Property not found",
        });
      }

      // Increment leads count
      property.performance_metrics.leads += 1;
      await property.save();
    }

    if (enquiry_type === "service") {
      if (!mongoose.Types.ObjectId.isValid(service_id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid service ID",
        });
      }

      const service = await Service.findById(service_id);
      if (!service) {
        return res.status(404).json({
          success: false,
          message: "Service not found",
        });
      }
    }

    // Create enquiry
    const enquiry = await Enquiry.create({
      property_id: enquiry_type === "property" ? property_id : undefined,
      service_id: enquiry_type === "service" ? service_id : undefined,
      user_id: userId,
      name,
      email,
      phone,
      message,
      enquiry_type,
      status: "pending",
    });

    // Populate the enquiry with property/service details
    await enquiry.populate([
      { path: "property_id", select: "name address city state price owner_id" },
      {
        path: "service_id",
        select: "service_name category base_price provider_id",
      },
      { path: "user_id", select: "name email phone" },
    ]);

    return res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully. We will contact you soon.",
      enquiry: {
        _id: enquiry._id,
        name: enquiry.name,
        email: enquiry.email,
        phone: enquiry.phone,
        message: enquiry.message,
        status: enquiry.status,
        enquiry_type: enquiry.enquiry_type,
        property: enquiry.property_id,
        service: enquiry.service_id,
        createdAt: enquiry.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating enquiry:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Get all enquiries for a property owner
 * @route GET /api/enquiries/my-property-enquiries
 * @access Private (property owners)
 */
export const getMyPropertyEnquiries = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status, page = 1, limit = 20 } = req.query;

    // Find all properties owned by the user
    const properties = await Property.find({ owner_id: userId }).select("_id");
    const propertyIds = properties.map((p) => p._id);

    // Build filter
    const filter = {
      property_id: { $in: propertyIds },
      enquiry_type: "property",
    };

    if (status) {
      filter.status = status;
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const enquiries = await Enquiry.find(filter)
      .populate("property_id", "name address city state price")
      .populate("user_id", "name email phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Enquiry.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: enquiries.length,
      totalCount: total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      enquiries,
    });
  } catch (error) {
    console.error("Error fetching property enquiries:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Get all enquiries for a service provider
 * @route GET /api/enquiries/my-service-enquiries
 * @access Private (service providers)
 */
export const getMyServiceEnquiries = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status, page = 1, limit = 20 } = req.query;

    // Find all services owned by the user
    const services = await Service.find({ provider_id: userId }).select("_id");
    const serviceIds = services.map((s) => s._id);

    // Build filter
    const filter = {
      service_id: { $in: serviceIds },
      enquiry_type: "service",
    };

    if (status) {
      filter.status = status;
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const enquiries = await Enquiry.find(filter)
      .populate("service_id", "service_name category base_price")
      .populate("user_id", "name email phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Enquiry.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: enquiries.length,
      totalCount: total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      enquiries,
    });
  } catch (error) {
    console.error("Error fetching service enquiries:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Update enquiry status
 * @route PATCH /api/enquiries/:id/status
 * @access Private (property owner or service provider)
 */
export const updateEnquiryStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "contacted", "closed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be pending, contacted, or closed",
      });
    }

    const enquiry = await Enquiry.findById(id)
      .populate("property_id", "owner_id")
      .populate("service_id", "provider_id");

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    // Check if user is the owner/provider
    const isPropertyOwner =
      enquiry.property_id &&
      enquiry.property_id.owner_id.toString() === userId.toString();
    const isServiceProvider =
      enquiry.service_id &&
      enquiry.service_id.provider_id.toString() === userId.toString();

    if (!isPropertyOwner && !isServiceProvider) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this enquiry",
      });
    }

    enquiry.status = status;
    await enquiry.save();

    return res.status(200).json({
      success: true,
      message: "Enquiry status updated successfully",
      enquiry,
    });
  } catch (error) {
    console.error("Error updating enquiry status:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Get user's own enquiries
 * @route GET /api/enquiries/my-enquiries
 * @access Private
 */
export const getMyEnquiries = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status, enquiry_type, page = 1, limit = 20 } = req.query;

    // Build filter
    const filter = { user_id: userId };

    if (status) {
      filter.status = status;
    }

    if (enquiry_type) {
      filter.enquiry_type = enquiry_type;
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const enquiries = await Enquiry.find(filter)
      .populate("property_id", "name address city state price")
      .populate("service_id", "service_name category base_price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Enquiry.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: enquiries.length,
      totalCount: total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      enquiries,
    });
  } catch (error) {
    console.error("Error fetching user enquiries:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
