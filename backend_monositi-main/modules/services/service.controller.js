const ServiceProvider = require("./service.model");
const ServiceRequest = require("./serviceRequest.model");
const asyncHandler = require("express-async-handler");
const cloudinary = require("../../config/cloudinary");
const fs = require("fs");
const mongoose = require("mongoose");


// exports.createServiceProvider = async (req, res) => {
//   try {
//     const { category, description, tags, address, city, state, pincode } = req.body;

//     let profilePhotoUrl;
//     if (req.file) {
//       const uploadResult = await cloudinary.uploader.upload(req.file.path, {
//         folder: "service-providers/profile",
//       });
//       profilePhotoUrl = uploadResult.secure_url;
//       fs.unlinkSync(req.file.path);
//     }

//     const serviceProvider = await ServiceProvider.create({
//       user: req.user._id,
//       category,
//       description,
//       tags: tags ? tags.split(",").map((t) => t.trim()) : [],
//       profilePhoto: profilePhotoUrl,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Service provider profile created",
//       data: serviceProvider,
//     });
//   } catch (err) {
//     console.error("Error creating service provider:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };





exports.createServiceProvider = async (req, res) => {
  try {
    // Check if user has the right role
    if (!req.user || req.user.role !== "serviceProvider") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only service providers can create profiles.",
      });
    }

    const { category, description, tags, address, city, state, pincode } = req.body;

    let profilePhotoUrl;
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "service-providers/profile",
      });
      profilePhotoUrl = uploadResult.secure_url;
      fs.unlinkSync(req.file.path); // remove temp file
    }

    // Create new service provider profile
    const serviceProvider = await ServiceProvider.create({
      user: req.user._id,
      category,
      description,
      address,
      city,
      state,
      pincode,
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      profilePhoto: profilePhotoUrl,
    });

    res.status(201).json({
      success: true,
      message: "Service provider profile created successfully",
      data: serviceProvider,
    });
  } catch (err) {
    console.error("Error creating service provider:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};
// Upload gallery photos for service provider
exports.uploadServicePhotos = async (req, res) => {
  try {
    const provider = await ServiceProvider.findOne({ user: req.user._id });
    if (!provider) return res.status(404).json({ success: false, message: "Profile not found" });

    const urls = [];
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "service-providers/gallery",
      });
      urls.push(result.secure_url);
      fs.unlinkSync(file.path);
    }

    provider.gallery.push(...urls);
    await provider.save();

    res.json({
      success: true,
      message: "Photos uploaded",
      data: provider.gallery,
    });
  } catch (err) {
    console.error("Error uploading photos:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all providers (for browsing/search)
exports.getAllServiceProviders = async (req, res) => {
  try {
    const providers = await ServiceProvider.find().populate("user", "name email");
    res.json({ success: true, data: providers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get one provider by ID
exports.getServiceProviderById = async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id).populate("user", "name email");
    if (!provider) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: provider });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


/**
 * @desc Tenant creates a service request
 * @route POST /services/requests
 * @access Tenant only
 */
exports.createServiceRequest = asyncHandler(async (req, res) => {
  const { serviceCategory, description, photosBefore } = req.body;

  const newRequest = await ServiceRequest.create({
    tenant: req.user._id,
    serviceCategory,
    description,
    photosBefore,
  });

  res.status(201).json({ success: true, data: newRequest });
});

/**
 * @desc Admin view all service requests
 * @route GET /services/requests/admin
 * @access Admin only
 */
exports.listServiceRequestsForAdmin = asyncHandler(async (req, res) => {
  const requests = await ServiceRequest.find()
    .populate("tenant", "name email")
    .populate("serviceProvider", "category");

  res.json({ success: true, count: requests.length, data: requests });
});

/**
 * @desc Admin assigns provider to a service request
 * @route PATCH /services/requests/:id/assign
 * @access Admin only
 */

exports.assignProviderToRequest = asyncHandler(async (req, res) => {
  const { providerId } = req.body;
  const { id } = req.params;

  // ✅ Validate ObjectIds before using them
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid request ID" });
  }
  if (!mongoose.Types.ObjectId.isValid(providerId)) {
    return res.status(400).json({ success: false, message: "Invalid provider ID" });
  }

  const request = await ServiceRequest.findById(id);
  if (!request) return res.status(404).json({ message: "Request not found" });

  request.serviceProvider = providerId;
  request.status = "Assigned";
  await request.save();

  res.json({ success: true, data: request });
});

/**
 * @desc Provider updates status of a request
 * @route PATCH /services/requests/:id/status
 * @access ServiceProvider only
 */
exports.updateRequestStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const request = await ServiceRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });

  request.status = status;
  await request.save();

  res.json({ success: true, data: request });
});

/**
 * @desc Provider uploads photos after job completion
 * @route POST /services/requests/:id/photos
 * @access ServiceProvider only
 */
exports.uploadCompletedWorkPhotos = asyncHandler(async (req, res) => {
  const { photosAfter } = req.body; // or handle via multer/cloudinary if needed
  const request = await ServiceRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });

  request.photosAfter = photosAfter;
  await request.save();

  res.json({ success: true, data: request });
});

/**
 * @desc Tenant rates & reviews after completion
 * @route POST /services/requests/:id/review
 * @access Tenant only
 */
exports.tenantRateService = asyncHandler(async (req, res) => {
  const { tenantRating, tenantReview } = req.body;
  const request = await ServiceRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });

  request.tenantRating = tenantRating;
  request.tenantReview = tenantReview;
  await request.save();

  // ✅ Update provider stats
  if (request.serviceProvider) {
    const provider = await ServiceProvider.findById(request.serviceProvider);
    provider.ratings.push(tenantRating);
    provider.completedJobsCount += 1;
    await provider.save();
  }

  res.json({ success: true, data: request });
});

/**
 * @desc Provider views assigned and completed services
 * @route GET /services/requests/provider
 * @access ServiceProvider only
 */
exports.getServiceRequestsForProvider = asyncHandler(async (req, res) => {
  const provider = await ServiceProvider.findOne({ user: req.user._id });
  const requests = await ServiceRequest.find({
    serviceProvider: provider._id,
  });

  res.json({ success: true, count: requests.length, data: requests });
});

/**
 * @desc Provider fetches completed services for profile
 * @route GET /services/requests/provider/completed
 * @access ServiceProvider only
 */
exports.getCompletedServicesForProvider = asyncHandler(async (req, res) => {
  const provider = await ServiceProvider.findOne({ user: req.user._id });
  const completedRequests = await ServiceRequest.find({
    serviceProvider: provider._id,
    status: "Completed",
  });

  res.json({ success: true, count: completedRequests.length, data: completedRequests });
});

exports.getServiceRequestById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // ✅ Validate MongoDB ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid service request ID" });
  }

  // Fetch request with populated tenant and provider details
  const serviceRequest = await ServiceRequest.findById(id)
    .populate("tenant", "name email role")
    .populate({
      path: "serviceProvider",
      populate: { path: "user", select: "name email role" },
    });

  if (!serviceRequest) {
    return res.status(404).json({ success: false, message: "Service request not found" });
  }

  // ✅ Authorization check based on role
  if (req.user.role === "tenant") {
    // Tenant can only view their own requests
    if (serviceRequest.tenant._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
  }

  if (req.user.role === "serviceProvider") {
    // Provider can only view requests assigned to them
    const provider = await ServiceProvider.findOne({ user: req.user._id });
    if (
      !serviceRequest.serviceProvider ||
      serviceRequest.serviceProvider._id.toString() !== provider._id.toString()
    ) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
  }

  // Admin can view any request (no extra check needed)

  res.json({ success: true, data: serviceRequest });
});

exports.getServicesByTenant = async (req, res) => {
  try {
    // Tenant ID comes from protect middleware (decoded JWT)
    const tenantId = req.user._id;

    const services = await ServiceRequest.find({ tenant: tenantId })

    res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (err) {
    console.error("Error fetching services by tenant:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};