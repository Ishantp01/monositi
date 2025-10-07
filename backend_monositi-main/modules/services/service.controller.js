const ServiceProvider = require('./serviceProvider.model');
const ServiceRequest = require('./serviceRequest.model');
const User = require('../users/user.model');
const asyncHandler = require('express-async-handler');

/**
 * Admin: Create a new service provider
 */
exports.createServiceProvider = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    contactNumber,
    address,
    city,
    state,
    photo,
    description,
    experience
  } = req.body;

  const provider = await ServiceProvider.create({
    user: req.user._id,
    name,
    category,
    contactNumber,
    address,
    city,
    state,
    photo,
    description,
    experience,
  });

  res.status(201).json({
    success: true,
    message: 'Service provider created successfully',
    provider,
  });
});

/**
 * Public: List providers by category (optional query param)
 */
exports.listServiceProvidersByCategory = asyncHandler(async (req, res) => {
  const { category, city, availability } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (city) filter.city = city;
  if (availability) filter.availability = availability;

  const providers = await ServiceProvider.find(filter)
    .sort({ averageRating: -1 })
    .select('name category contactNumber city state averageRating availability photo');

  res.json({
    success: true,
    count: providers.length,
    providers,
  });
});

/**
 * Public: Get provider by ID with reviews
 */
exports.getServiceProviderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const provider = await ServiceProvider.findById(id).populate('reviews.user', 'name email');

  if (!provider) {
    return res.status(404).json({
      success: false,
      message: 'Service provider not found',
    });
  }

  res.json({
    success: true,
    provider,
  });
});

/**
 * Authenticated user: Create a service booking request
 * Guest users must register/login before creating
 */
exports.createServiceRequest = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Please login to book a service',
    });
  }

  const { serviceProvider, description, photos } = req.body;

  // Validate required fields
  if (!serviceProvider || !description) {
    return res.status(400).json({
      success: false,
      message: 'Service provider and description are required',
    });
  }

  // Verify service provider exists
  const provider = await ServiceProvider.findById(serviceProvider);
  if (!provider) {
    return res.status(404).json({
      success: false,
      message: 'Service provider not found',
    });
  }

  const request = await ServiceRequest.create({
    user: req.user._id,
    serviceProvider,
    description,
    photos,
  });

  res.status(201).json({
    success: true,
    message: 'Service request created successfully',
    request,
  });
});

/**
 * Provider or Admin: Update booking status
 */
exports.updateServiceRequestStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['Requested', 'In Progress', 'Completed', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Valid statuses: ' + validStatuses.join(', '),
    });
  }

  const request = await ServiceRequest.findById(id);
  if (!request) {
    return res.status(404).json({
      success: false,
      message: 'Service request not found',
    });
  }

  // Only admin or the service provider for this request can update
  if (req.user.role !== 'admin' && req.user.role !== 'serviceProvider') {
    return res.status(403).json({
      success: false,
      message: 'Only admins and service providers can update request status',
    });
  }

  // If not admin, check if user is the service provider for this request
  if (req.user.role !== 'admin') {
    const providerId = request.serviceProvider.toString();
    if (req.user._id.toString() !== providerId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update status for your own service requests',
      });
    }
  }

  request.status = status;
  await request.save();

  res.json({
    success: true,
    message: 'Service request status updated successfully',
    request,
  });
});

/**
 * Delete service request (Customer or Service Provider - with restrictions)
 */
exports.deleteServiceRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const request = await ServiceRequest.findById(id);
  if (!request) {
    return res.status(404).json({
      success: false,
      message: 'Service request not found',
    });
  }

  // Check authorization
  const isCustomer = request.user.toString() === req.user._id.toString();
  const isServiceProvider = request.serviceProvider.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isCustomer && !isServiceProvider && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to delete this service request',
    });
  }

  // Service providers can only delete completed requests
  if (isServiceProvider && request.status !== 'Completed') {
    return res.status(403).json({
      success: false,
      message: 'Service providers can only delete completed service requests',
    });
  }

  // Soft delete the service request
  await request.softDelete();

  res.json({
    success: true,
    message: 'Service request deleted successfully',
  });
});

/**
 * Admin: Get all deleted service requests
 */
exports.getDeletedServiceRequests = asyncHandler(async (req, res) => {
  // Only admins can view deleted service requests
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Only admins can view deleted service requests',
    });
  }

  const requests = await ServiceRequest.find({ deletedAt: { $ne: null } })
    .populate('user', 'name email')
    .populate('serviceProvider', 'name category')
    .sort({ deletedAt: -1 });

  res.json({
    success: true,
    count: requests.length,
    requests,
  });
});

/**
 * Provider or Admin: View a specific service request by ID
 */
exports.getServiceRequestById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Only service providers and admins can view service requests
  if (req.user.role !== 'admin' && req.user.role !== 'serviceProvider') {
    return res.status(403).json({
      success: false,
      message: 'Only admins and service providers can view service requests',
    });
  }

  const request = await ServiceRequest.findById(id)
    .populate('user', 'name email')
    .populate('serviceProvider', 'name category contactNumber city state');

  if (!request) {
    return res.status(404).json({
      success: false,
      message: 'Service request not found',
    });
  }

  // If not admin, check if user is the service provider for this request
  if (req.user.role !== 'admin') {
    const providerId = request.serviceProvider._id.toString();
    if (req.user._id.toString() !== providerId) {
      return res.status(403).json({
        success: false,
        message: 'You can only view your own service requests',
      });
    }
  }

  res.json({
    success: true,
    request,
  });
});

/**
 * Provider: View all their requests
 */
exports.getServiceRequestsForProvider = asyncHandler(async (req, res) => {
  // Only service providers and admins can view provider requests
  if (req.user.role !== 'admin' && req.user.role !== 'serviceProvider') {
    return res.status(403).json({
      success: false,
      message: 'Only admins and service providers can view service requests',
    });
  }

  const providerId = req.user._id;

  const requests = await ServiceRequest.find({ serviceProvider: providerId })
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: requests.length,
    requests,
  });
});

/**
 * Service Provider: Update their availability status
 */
exports.updateAvailability = asyncHandler(async (req, res) => {
  // Only service providers can update their availability
  if (req.user.role !== 'serviceProvider') {
    return res.status(403).json({
      success: false,
      message: 'Only service providers can update availability status',
    });
  }

  const { availability } = req.body;
  const validStatuses = ['Available', 'Busy', 'Unavailable'];

  if (!availability || !validStatuses.includes(availability)) {
    return res.status(400).json({
      success: false,
      message: `Invalid availability status. Valid options: ${validStatuses.join(', ')}`,
    });
  }

  // Find the service provider profile for the authenticated user
  const provider = await ServiceProvider.findOne({ user: req.user._id });

  if (!provider) {
    return res.status(404).json({
      success: false,
      message: 'Service provider profile not found. Please create a service provider profile first.',
    });
  }

  // Update the availability status
  provider.availability = availability;
  await provider.save();

  res.json({
    success: true,
    message: 'Availability status updated successfully',
    availability: provider.availability,
  });
});

/**
 * Service Provider: Get their own profile
 */
exports.getMyProfile = asyncHandler(async (req, res) => {
  // Only service providers can view their own profile
  if (req.user.role !== 'serviceProvider') {
    return res.status(403).json({
      success: false,
      message: 'Only service providers can view their profile',
    });
  }

  const provider = await ServiceProvider.findOne({ user: req.user._id })
    .populate('user', 'name email')
    .populate('reviews.user', 'name');

  if (!provider) {
    return res.status(404).json({
      success: false,
      message: 'Service provider profile not found',
    });
  }

  res.json({
    success: true,
    provider,
  });
});
