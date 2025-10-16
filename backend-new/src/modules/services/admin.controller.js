import ProviderRequest from '../../models/providerRequest.js';
import Service from '../../models/service.model.js';
import User from '../../models/user.model.js';
import ServiceBooking from '../../models/booking.model.js';
import Property from '../../models/property.model.js';
import mongoose from 'mongoose';

// 📌 API: GET /api/providers/requests → Get all pending
export const getAllProviderRequests = async (req, res) => {
  try {
    const {
      status = 'pending',  // pending | approved | rejected
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Validate status
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Use pending, approved, or rejected'
      });
    }

    const filter = { status };
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const requests = await ProviderRequest.find(filter)
      .populate('user', 'name email phone role')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalCount = await ProviderRequest.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.status(200).json({
      success: true,
      count: requests.length,
      totalCount,
      currentPage: parseInt(page),
      totalPages,
      requests: requests.map(request => ({
        _id: request._id,
        service_category: request.service_category,
        description: request.description,
        documents: request.documents,
        status: request.status,
        admin_comment: request.admin_comment,
        user: request.user,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt
      }))
    });
  } catch (error) {
    console.error('Error fetching provider requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch provider requests',
      error: error.message
    });
  }
};

// 📌 API: PATCH /api/providers/requests/:id/approve → Approve a request
export const approveProviderRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID'
      });
    }

    const request = await ProviderRequest.findById(id).populate('user', 'name email phone role');
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Provider request not found'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request has already been processed'
      });
    }

    // Update user role from tenant → service_provider
    await User.findByIdAndUpdate(request.user._id, {
      role: 'service_provider'
    });

    // Update request status to approved
    request.status = 'approved';
    request.admin_comment = admin_comment || '';
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Provider request approved successfully',
      request: {
        _id: request._id,
        service_category: request.service_category,
        status: request.status,
        admin_comment: request.admin_comment,
        user: {
          _id: request.user._id,
          name: request.user.name,
          email: request.user.email,
          phone: request.user.phone,
          role: 'service_provider'
        },
        updatedAt: request.updatedAt
      }
    });
  } catch (error) {
    console.error('Error approving provider request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve provider request',
      error: error.message
    });
  }
};

// 📌 API: PATCH /api/providers/requests/:id/reject → Reject a request
export const rejectProviderRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID'
      });
    }

    const request = await ProviderRequest.findById(id).populate('user', 'name email phone role');
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Provider request not found'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request has already been processed'
      });
    }

    // Update request status to rejected
    request.status = 'rejected';
    request.admin_comment = admin_comment || '';
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Provider request rejected successfully',
      request: {
        _id: request._id,
        service_category: request.service_category,
        status: request.status,
        admin_comment: request.admin_comment,
        user: request.user,
        updatedAt: request.updatedAt
      }
    });
  } catch (error) {
    console.error('Error rejecting provider request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject provider request',
      error: error.message
    });
  }
};

// 📌 API: PATCH /api/services/:id/verify → Verify or reject service
export const verifyOrRejectService = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, admin_comment } = req.body; // 'verify' or 'reject'

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service ID'
      });
    }

    if (!["verify", "reject"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Action must be either 'verify' or 'reject'"
      });
    }

    const service = await Service.findById(id).populate("provider_id", "name phone email");
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    // Update verification status
    if (action === "verify") {
      service.monositi_verified = true;
      service.active_status = true; // Activate service when verified
    } else if (action === "reject") {
      service.monositi_verified = false;
      // Don't deactivate service on rejection, let provider fix issues
    }

    // Add admin comment if provided
    if (admin_comment) {
      service.admin_comment = admin_comment;
    }

    // Add verification timestamp
    service.verification_date = new Date();

    await service.save();

    res.status(200).json({
      success: true,
      message: `Service ${action}ed successfully`,
      service: {
        _id: service._id,
        service_name: service.service_name,
        category: service.category,
        monositi_verified: service.monositi_verified,
        active_status: service.active_status,
        admin_comment: service.admin_comment,
        verification_date: service.verification_date,
        provider: {
          _id: service.provider_id._id,
          name: service.provider_id.name,
          phone: service.provider_id.phone,
          email: service.provider_id.email
        },
        updatedAt: service.updatedAt
      }
    });
  } catch (error) {
    console.error("Error verifying/rejecting service:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update service verification status",
      error: error.message
    });
  }
};

// Get all services (admin view)
export const getAllServicesAdmin = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      monositi_verified,
      active_status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter = {};

    if (category) {
      filter.category = new RegExp(category, 'i');
    }

    if (monositi_verified !== undefined) {
      filter.monositi_verified = monositi_verified === 'true';
    }

    if (active_status !== undefined) {
      filter.active_status = active_status === 'true';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const services = await Service.find(filter)
      .populate('provider_id', 'name phone email role')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const totalCount = await Service.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.status(200).json({
      success: true,
      count: services.length,
      totalCount,
      currentPage: parseInt(page),
      totalPages,
      services: services.map(service => ({
        _id: service._id,
        service_name: service.service_name,
        category: service.category,
        description: service.description,
        base_price: service.base_price,
        variable_price: service.variable_price,
        availability_calendar: service.availability_calendar,
        location: service.location,
        addons: service.addons,
        tags: service.tags,
        images: service.images,
        service_docs: service.service_docs,
        active_status: service.active_status,
        monositi_verified: service.monositi_verified,
        ratings: service.ratings,
        provider: {
          _id: service.provider_id._id,
          name: service.provider_id.name,
          phone: service.provider_id.phone,
          email: service.provider_id.email,
          role: service.provider_id.role
        },
        createdAt: service.createdAt,
        updatedAt: service.updatedAt
      }))
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get all bookings (admin view)
export const getAllBookingsAdmin = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter = {};

    if (status) {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const bookings = await ServiceBooking.find(filter)
      .populate([
        { path: 'service', select: 'service_name category base_price images provider_id' },
        { path: 'customer', select: 'name phone email' },
        { path: 'provider', select: 'name phone email' }
      ])
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Filter by category if provided
    let filteredBookings = bookings;
    if (category) {
      filteredBookings = bookings.filter(booking =>
        booking.service.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    const totalCount = await ServiceBooking.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.status(200).json({
      success: true,
      count: filteredBookings.length,
      totalCount,
      currentPage: parseInt(page),
      totalPages,
      bookings: filteredBookings.map(booking => ({
        _id: booking._id,
        service: {
          _id: booking.service._id,
          service_name: booking.service.service_name,
          category: booking.service.category,
          base_price: booking.service.base_price,
          images: booking.service.images,
          provider_id: booking.service.provider_id
        },
        customer: {
          _id: booking.customer._id,
          name: booking.customer.name,
          phone: booking.customer.phone,
          email: booking.customer.email
        },
        provider: {
          _id: booking.provider._id,
          name: booking.provider.name,
          phone: booking.provider.phone,
          email: booking.provider.email
        },
        scheduled_for: booking.scheduled_for,
        status: booking.status,
        total_amount: booking.total_amount,
        notes: booking.notes,
        images_before: booking.images_before,
        images_after: booking.images_after,
        service_address: booking.service_address,
        completion_notes: booking.completion_notes,
        customer_rating: booking.customer_rating,
        customer_review: booking.customer_review,
        provider_rating: booking.provider_rating,
        provider_review: booking.provider_review,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt
      }))
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Admin dashboard stats
export const getAdminDashboard = async (req, res) => {
  try {
    // Get counts for different entities
    const [
      totalUsers,
      totalProviders,
      totalServices,
      totalBookings,
      pendingRequests,
      activeServices,
      verifiedServices,
      completedBookings,
      pendingBookings
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'service_provider' }),
      Service.countDocuments(),
      ServiceBooking.countDocuments(),
      ProviderRequest.countDocuments({ status: 'pending' }),
      Service.countDocuments({ active_status: true }),
      Service.countDocuments({ monositi_verified: true }),
      ServiceBooking.countDocuments({ status: 'completed' }),
      ServiceBooking.countDocuments({ status: 'pending' })
    ]);

    // Get recent activities
    const recentRequests = await ProviderRequest.find({ status: 'pending' })
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentBookings = await ServiceBooking.find()
      .populate([
        { path: 'service', select: 'service_name category' },
        { path: 'customer', select: 'name email' },
        { path: 'provider', select: 'name email' }
      ])
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      dashboard: {
        stats: {
          totalUsers,
          totalProviders,
          totalServices,
          totalBookings,
          pendingRequests,
          activeServices,
          verifiedServices,
          completedBookings,
          pendingBookings
        },
        recentActivities: {
          requests: recentRequests.map(request => ({
            _id: request._id,
            service_category: request.service_category,
            description: request.description,
            status: request.status,
            user: request.user,
            createdAt: request.createdAt
          })),
          bookings: recentBookings.map(booking => ({
            _id: booking._id,
            service: {
              _id: booking.service._id,
              service_name: booking.service.service_name,
              category: booking.service.category
            },
            customer: {
              _id: booking.customer._id,
              name: booking.customer.name,
              email: booking.customer.email
            },
            provider: {
              _id: booking.provider._id,
              name: booking.provider.name,
              email: booking.provider.email
            },
            status: booking.status,
            total_amount: booking.total_amount,
            createdAt: booking.createdAt
          }))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

//================================================================
// ADMIN PROPERTY MANAGEMENT
//================================================================

// Get all properties (admin view)
export const getAllPropertiesAdmin = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      verification_status,
      city,
      state,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter = {};

    if (type) {
      filter.type = type;
    }

    if (verification_status) {
      filter.verification_status = verification_status;
    }

    if (city) {
      filter.city = new RegExp(city, 'i');
    }

    if (state) {
      filter.state = new RegExp(state, 'i');
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const properties = await Property.find(filter)
      .populate('owner_id', 'name phone email role')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const totalCount = await Property.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.status(200).json({
      success: true,
      count: properties.length,
      totalCount,
      currentPage: parseInt(page),
      totalPages,
      properties: properties.map(property => ({
        _id: property._id,
        name: property.name,
        type: property.type,
        address: property.address,
        city: property.city,
        state: property.state,
        pincode: property.pincode,
        price: property.price,
        status: property.status,
        verification_status: property.verification_status,
        monositi_verified: property.monositi_verified,
        listing_visibility: property.listing_visibility,
        property_features: property.property_features,
        tags: property.tags,
        documents: property.documents,
        performance_metrics: property.performance_metrics,
        owner: {
          _id: property.owner_id._id,
          name: property.owner_id.name,
          phone: property.owner_id.phone,
          email: property.owner_id.email,
          role: property.owner_id.role
        },
        createdAt: property.createdAt,
        updatedAt: property.updatedAt
      }))
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get pending properties
export const getPendingProperties = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = { verification_status: 'pending' };
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const properties = await Property.find(filter)
      .populate('owner_id', 'name phone email role')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const totalCount = await Property.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.status(200).json({
      success: true,
      count: properties.length,
      totalCount,
      currentPage: parseInt(page),
      totalPages,
      properties: properties.map(property => ({
        _id: property._id,
        name: property.name,
        type: property.type,
        address: property.address,
        city: property.city,
        state: property.state,
        price: property.price,
        verification_status: property.verification_status,
        property_features: property.property_features,
        documents: property.documents,
        owner: {
          _id: property.owner_id._id,
          name: property.owner_id.name,
          phone: property.owner_id.phone,
          email: property.owner_id.email
        },
        createdAt: property.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching pending properties:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Verify or reject property
export const verifyProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_comment } = req.body; // status: 'verified' or 'rejected'

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID'
      });
    }

    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'verified' or 'rejected'"
      });
    }

    const property = await Property.findById(id).populate('owner_id', 'name email phone');
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Update property verification status
    property.verification_status = status;
    property.monositi_verified = status === 'verified';

    if (status === 'verified') {
      property.status = 'active'; // Make property active when verified
    }

    if (admin_comment) {
      property.admin_comment = admin_comment;
    }

    await property.save();

    res.status(200).json({
      success: true,
      message: `Property ${status} successfully`,
      property: {
        _id: property._id,
        name: property.name,
        verification_status: property.verification_status,
        monositi_verified: property.monositi_verified,
        status: property.status,
        admin_comment: property.admin_comment,
        owner: property.owner_id,
        updatedAt: property.updatedAt
      }
    });
  } catch (error) {
    console.error('Error verifying property:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Toggle property visibility
export const togglePropertyVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    const { listing_visibility } = req.body; // 'public' or 'private'

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID'
      });
    }

    if (!['public', 'private'].includes(listing_visibility)) {
      return res.status(400).json({
        success: false,
        message: "Visibility must be either 'public' or 'private'"
      });
    }

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    property.listing_visibility = listing_visibility;
    await property.save();

    res.status(200).json({
      success: true,
      message: `Property visibility changed to ${listing_visibility}`,
      property: {
        _id: property._id,
        name: property.name,
        listing_visibility: property.listing_visibility,
        updatedAt: property.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating property visibility:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete property (admin)
export const deletePropertyAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID'
      });
    }

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Soft delete - change status to 'deleted'
    property.status = 'deleted';
    await property.save();

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully',
      property: {
        _id: property._id,
        name: property.name,
        status: property.status,
        updatedAt: property.updatedAt
      }
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

//================================================================
// ADMIN USER MANAGEMENT
//================================================================

// Get all users (admin view)
export const getAllUsersAdmin = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      verification_status,
      is_active,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter = {};

    if (role) {
      filter.role = role;
    }

    if (verification_status) {
      filter.verification_status = verification_status;
    }

    if (is_active !== undefined) {
      filter.is_active = is_active === 'true';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const users = await User.find(filter)
      .select('-password_hash') // Exclude password hash
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const totalCount = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.status(200).json({
      success: true,
      count: users.length,
      totalCount,
      currentPage: parseInt(page),
      totalPages,
      users: users.map(user => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        verification_status: user.verification_status,
        monositi_verified: user.monositi_verified,
        is_active: user.is_active,
        profile_img: user.profile_img,
        rating: user.rating,
        KYC_docs: user.KYC_docs,
        contact_preferences: user.contact_preferences,
        subscription: user.subscription,
        registered_on: user.registered_on,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }))
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update user role (admin)
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    const allowedRoles = ['tenant', 'owner', 'agent', 'service_provider', 'admin'];
    if (!role || !allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Allowed roles: ${allowedRoles.join(', ')}`
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Ban/Unban user
export const banUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active, ban_reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    if (typeof is_active !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'is_active must be a boolean value'
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent banning admin users
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot ban admin users'
      });
    }

    user.is_active = is_active;

    if (ban_reason) {
      user.ban_reason = ban_reason;
    }

    await user.save();

    const action = is_active ? 'unbanned' : 'banned';
    res.status(200).json({
      success: true,
      message: `User ${action} successfully`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        is_active: user.is_active,
        ban_reason: user.ban_reason,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Error banning/unbanning user:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Verify user (admin)
export const verifyUserAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { verification_status, admin_comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    if (!['verified', 'rejected', 'pending'].includes(verification_status)) {
      return res.status(400).json({
        success: false,
        message: "Verification status must be 'verified', 'rejected', or 'pending'"
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.verification_status = verification_status;
    user.monositi_verified = verification_status === 'verified';

    if (admin_comment) {
      user.admin_comment = admin_comment;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: `User verification status updated to ${verification_status}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        verification_status: user.verification_status,
        monositi_verified: user.monositi_verified,
        admin_comment: user.admin_comment,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Error verifying user:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};