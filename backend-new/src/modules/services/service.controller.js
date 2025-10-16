import Service from '../../models/service.model.js';
import User from '../../models/user.model.js';
import ServiceBooking from '../../models/booking.model.js';
import mongoose from 'mongoose';
import { uploadFileToCloudinary } from '../../utils/uploadToCloudinary.js';

// Create a new service (for verified service providers)
export const createService = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check if user is a service provider
    const user = await User.findById(userId);
    // Ensure this role name 'serviceProvider' matches exactly what's in your User model
    if (!user || user.role !== 'service_provider') {
      return res.status(403).json({
        success: false,
        message: 'Only service providers can create services'
      });
    }

    const {
      service_name,
      category,
      description,
      base_price,
      variable_price,
      availability_calendar,
      location,
      addons,
      tags,
    } = req.body;

    // Basic validation
    if (!service_name || !category || !description || !base_price) {
      return res.status(400).json({
        success: false,
        message: 'service_name, category, description, and base_price are required'
      });
    }

    // Handle file uploads with Cloudinary
    const images = [];
    const serviceDocs = [];

    if (req.files) {
      // Upload service images
      if (req.files.images) {
        for (const file of req.files.images) {
          const uploadResult = await uploadFileToCloudinary(file.path, 'monositi/services');
          if (uploadResult.success) {
            images.push(uploadResult.secure_url);
          } else {
            console.error('Failed to upload service image:', uploadResult.error);
          }
        }
      }

      // Upload service documents
      if (req.files.service_docs) {
        for (const file of req.files.service_docs) {
          const uploadResult = await uploadFileToCloudinary(file.path, 'monositi/service_docs');
          if (uploadResult.success) {
            serviceDocs.push(uploadResult.secure_url);
          } else {
            console.error('Failed to upload service document:', uploadResult.error);
          }
        }
      }
    }

    // Parse JSON fields if they are strings
    let parsedLocation = {};
    let parsedAddons = [];
    let parsedTags = [];
    // CORRECTED: Initialize as an empty array
    let parsedCalendar = [];

    try {
      if (location) {
        parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;
      }
      if (addons) {
        parsedAddons = typeof addons === 'string' ? JSON.parse(addons) : addons;
      }
      if (tags) {
        parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      }
      if (availability_calendar) {
        parsedCalendar = typeof availability_calendar === 'string' ? JSON.parse(availability_calendar) : availability_calendar;
      }
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid JSON format in request body'
      });
    }

    // Create new service
    const service = await Service.create({
      provider_id: userId,
      service_name,
      category,
      description,
      base_price: Number(base_price),
      variable_price: variable_price === 'true' || variable_price === true,
      availability_calendar: parsedCalendar,
      location: parsedLocation,
      addons: parsedAddons,
      tags: parsedTags,
      images,
      service_docs: serviceDocs,
      active_status: true,
      monositi_verified: false
    });

    return res.status(201).json({
      success: true,
      message: 'Service created successfully',
      service: {
        _id: service._id,
        service_name: service.service_name,
        category: service.category,
        description: service.description,
        base_price: service.base_price,
        variable_price: service.variable_price,
        active_status: service.active_status,
        monositi_verified: service.monositi_verified,
        createdAt: service.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating service:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
// Get all services for a specific provider
export const getProviderServices = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, status = 'active' } = req.query;

    // Check if user is a service provider
    const user = await User.findById(userId);
    if (!user || user.role !== 'service_provider') {
      return res.status(403).json({
        success: false,
        message: 'Only service providers can view their services'
      });
    }

    const filter = { provider_id: userId };

    if (status === 'active') {
      filter.active_status = true;
    } else if (status === 'inactive') {
      filter.active_status = false;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const services = await Service.find(filter)
      .sort({ createdAt: -1 })
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
        active_status: service.active_status,
        monositi_verified: service.monositi_verified,
        ratings: service.ratings,
        images: service.images,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt
      }))
    });
  } catch (error) {
    console.error('Error fetching provider services:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get a specific service by ID
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service ID'
      });
    }

    const service = await Service.findById(id).populate('provider_id', 'name phone email');
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check if user is the owner or if service is active
    const isOwner = service.provider_id._id.toString() === userId.toString();
    const isActive = service.active_status;

    if (!isOwner && !isActive) {
      return res.status(403).json({
        success: false,
        message: 'Service is not available'
      });
    }

    res.status(200).json({
      success: true,
      service: {
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
        provider: service.provider_id,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt
      }
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update a service
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service ID'
      });
    }

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check if user is the owner
    if (service.provider_id.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own services'
      });
    }

    // Exclude sensitive fields from updates
    const {
      provider_id,
      _id,
      id: serviceId,
      ratings,
      monositi_verified,
      createdAt,
      ...updateData
    } = req.body;

    // Handle file uploads with Cloudinary
    if (req.files) {
      if (req.files.service_docs) {
        const uploadedDocs = [];
        for (const file of req.files.service_docs) {
          const uploadResult = await uploadFileToCloudinary(file.path, 'monositi/service_docs');
          if (uploadResult.success) {
            uploadedDocs.push(uploadResult.secure_url);
          } else {
            console.error('Failed to upload service document:', uploadResult.error);
          }
        }
        updateData.service_docs = uploadedDocs;
      }

      if (req.files.images) {
        const uploadedImages = [];
        for (const file of req.files.images) {
          const uploadResult = await uploadFileToCloudinary(file.path, 'monositi/services');
          if (uploadResult.success) {
            uploadedImages.push(uploadResult.secure_url);
          } else {
            console.error('Failed to upload service image:', uploadResult.error);
          }
        }
        updateData.images = uploadedImages;
      }
    }

    // Parse JSON fields if they are strings
    if (updateData.location && typeof updateData.location === 'string') {
      try {
        updateData.location = JSON.parse(updateData.location);
      } catch (parseError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid JSON format for location'
        });
      }
    }

    if (updateData.addons && typeof updateData.addons === 'string') {
      try {
        updateData.addons = JSON.parse(updateData.addons);
      } catch (parseError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid JSON format for addons'
        });
      }
    }

    if (updateData.tags && typeof updateData.tags === 'string') {
      try {
        updateData.tags = JSON.parse(updateData.tags);
      } catch (parseError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid JSON format for tags'
        });
      }
    }

    if (updateData.availability_calendar && typeof updateData.availability_calendar === 'string') {
      try {
        updateData.availability_calendar = JSON.parse(updateData.availability_calendar);
      } catch (parseError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid JSON format for availability_calendar'
        });
      }
    }

    // Convert data types
    if (updateData.base_price) {
      updateData.base_price = Number(updateData.base_price);
    }
    if (updateData.variable_price !== undefined) {
      updateData.variable_price = updateData.variable_price === 'true' || updateData.variable_price === true;
    }

    const updatedService = await Service.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      service: {
        _id: updatedService._id,
        service_name: updatedService.service_name,
        category: updatedService.category,
        description: updatedService.description,
        base_price: updatedService.base_price,
        variable_price: updatedService.variable_price,
        active_status: updatedService.active_status,
        monositi_verified: updatedService.monositi_verified,
        ratings: updatedService.ratings,
        updatedAt: updatedService.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete a service
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service ID'
      });
    }

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check if user is the owner
    if (service.provider_id.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own services'
      });
    }

    await Service.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Toggle service active status
export const toggleServiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service ID'
      });
    }

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check if user is the owner
    if (service.provider_id.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own services'
      });
    }

    service.active_status = !service.active_status;
    await service.save();

    res.status(200).json({
      success: true,
      message: `Service ${service.active_status ? 'activated' : 'deactivated'} successfully`,
      service: {
        _id: service._id,
        service_name: service.service_name,
        active_status: service.active_status,
        updatedAt: service.updatedAt
      }
    });
  } catch (error) {
    console.error('Error toggling service status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get all active services (for tenants to browse)
export const getAllServices = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      min_price,
      max_price,
      monositi_verified,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter = { active_status: true };

    if (category) {
      filter.category = new RegExp(category, 'i');
    }

    if (min_price || max_price) {
      filter.base_price = {};
      if (min_price) filter.base_price.$gte = Number(min_price);
      if (max_price) filter.base_price.$lte = Number(max_price);
    }

    if (monositi_verified !== undefined) {
      filter.monositi_verified = monositi_verified === 'true';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const services = await Service.find(filter)
      .populate('provider_id', 'name phone email')
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
        active_status: service.active_status,
        monositi_verified: service.monositi_verified,
        ratings: service.ratings,
        provider: {
          _id: service.provider_id._id,
          name: service.provider_id.name,
          phone: service.provider_id.phone,
          email: service.provider_id.email
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

// Advanced search for services
export const searchServices = async (req, res) => {
  try {
    const {
      query,
      category,
      location,
      min_price,
      max_price,
      tags,
      monositi_verified,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build search filter
    const filter = { active_status: true };

    // Text search
    if (query) {
      filter.$or = [
        { service_name: new RegExp(query, 'i') },
        { description: new RegExp(query, 'i') },
        { category: new RegExp(query, 'i') }
      ];
    }

    // Category filter
    if (category) {
      filter.category = new RegExp(category, 'i');
    }

    // Price range filter
    if (min_price || max_price) {
      filter.base_price = {};
      if (min_price) filter.base_price.$gte = Number(min_price);
      if (max_price) filter.base_price.$lte = Number(max_price);
    }

    // Tags filter
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      filter.tags = { $in: tagArray.map(tag => new RegExp(tag, 'i')) };
    }

    // Monositi verified filter
    if (monositi_verified !== undefined) {
      filter.monositi_verified = monositi_verified === 'true';
    }

    // Location-based search (if coordinates provided)
    if (location) {
      try {
        const locationData = JSON.parse(location);
        if (locationData.coordinates && locationData.coordinates.length === 2) {
          const [longitude, latitude] = locationData.coordinates;
          const maxDistance = locationData.maxDistance || 10000; // 10km default

          filter.location = {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [longitude, latitude]
              },
              $maxDistance: maxDistance
            }
          };
        }
      } catch (parseError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid location format'
        });
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const services = await Service.find(filter)
      .populate('provider_id', 'name phone email')
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
      searchQuery: {
        query,
        category,
        location,
        min_price,
        max_price,
        tags,
        monositi_verified
      },
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
        active_status: service.active_status,
        monositi_verified: service.monositi_verified,
        ratings: service.ratings,
        provider: {
          _id: service.provider_id._id,
          name: service.provider_id.name,
          phone: service.provider_id.phone,
          email: service.provider_id.email
        },
        createdAt: service.createdAt,
        updatedAt: service.updatedAt
      }))
    });
  } catch (error) {
    console.error('Error searching services:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get all service categories
export const getServiceCategories = async (req, res) => {
  try {
    const categories = await Service.distinct('category', { active_status: true });

    res.status(200).json({
      success: true,
      count: categories.length,
      categories: categories.sort()
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create a new booking (for tenants/customers)
export const createBooking = async (req, res) => {
  try {
    const customerId = req.user._id;
    const {
      service_id,
      scheduled_for,
      notes,
      service_address,
      total_amount
    } = req.body;

    // Basic validation
    if (!service_id) {
      return res.status(400).json({
        success: false,
        message: 'Service ID is required'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(service_id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service ID'
      });
    }

    // Check if service exists and is active
    const service = await Service.findById(service_id).populate('provider_id', 'name phone email');
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    if (!service.active_status) {
      return res.status(400).json({
        success: false,
        message: 'Service is not available for booking'
      });
    }

    // Check if user is trying to book their own service
    if (service.provider_id._id.toString() === customerId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot book your own service'
      });
    }

    // Handle file uploads for before images with Cloudinary
    const images_before = [];
    if (req.files && req.files.images_before) {
      for (const file of req.files.images_before) {
        const uploadResult = await uploadFileToCloudinary(file.path, 'monositi/bookings/before');
        if (uploadResult.success) {
          images_before.push(uploadResult.secure_url);
        } else {
          console.error('Failed to upload booking before image:', uploadResult.error);
        }
      }
    }

    // Parse service_address if it's a string
    let parsedAddress = {};
    if (service_address) {
      try {
        parsedAddress = typeof service_address === 'string' ? JSON.parse(service_address) : service_address;
      } catch (parseError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid JSON format for service_address'
        });
      }
    }

    // Parse scheduled_for date
    let scheduledDate = null;
    if (scheduled_for) {
      scheduledDate = new Date(scheduled_for);
      if (isNaN(scheduledDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date format for scheduled_for'
        });
      }
    }

    // Create new booking
    const booking = await ServiceBooking.create({
      service: service_id,
      customer: customerId,
      provider: service.provider_id._id,
      scheduled_for: scheduledDate,
      notes: notes || '',
      total_amount: total_amount || service.base_price,
      images_before,
      service_address: parsedAddress,
      status: 'pending'
    });

    // Populate the booking with service and user details
    await booking.populate([
      { path: 'service', select: 'service_name category base_price images' },
      { path: 'customer', select: 'name phone email' },
      { path: 'provider', select: 'name phone email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: {
        _id: booking._id,
        service: {
          _id: booking.service._id,
          service_name: booking.service.service_name,
          category: booking.service.category,
          base_price: booking.service.base_price,
          images: booking.service.images
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
        service_address: booking.service_address,
        createdAt: booking.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get customer's bookings
export const getCustomerBookings = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { page = 1, limit = 10, status } = req.query;

    const filter = { customer: customerId };
    if (status) {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await ServiceBooking.find(filter)
      .populate([
        { path: 'service', select: 'service_name category base_price images' },
        { path: 'provider', select: 'name phone email' }
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalCount = await ServiceBooking.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.status(200).json({
      success: true,
      count: bookings.length,
      totalCount,
      currentPage: parseInt(page),
      totalPages,
      bookings: bookings.map(booking => ({
        _id: booking._id,
        service: {
          _id: booking.service._id,
          service_name: booking.service.service_name,
          category: booking.service.category,
          base_price: booking.service.base_price,
          images: booking.service.images
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
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt
      }))
    });
  } catch (error) {
    console.error('Error fetching customer bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Cancel a booking (customer only)
export const cancelBooking = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { id } = req.params;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID'
      });
    }

    const booking = await ServiceBooking.findById(id).populate([
      { path: 'service', select: 'service_name category' },
      { path: 'provider', select: 'name phone email' }
    ]);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is the customer
    if (booking.customer.toString() !== customerId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own bookings'
      });
    }

    // Check if booking can be cancelled
    if (['cancelled', 'completed'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be cancelled'
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    if (reason) {
      booking.notes = booking.notes ? `${booking.notes}\nCancellation: ${reason}` : `Cancellation: ${reason}`;
    }
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking: {
        _id: booking._id,
        service: {
          _id: booking.service._id,
          service_name: booking.service.service_name,
          category: booking.service.category
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
        updatedAt: booking.updatedAt
      }
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Rate and review a service (customer only)
export const rateService = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { id } = req.params;
    const { rating, review } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID'
      });
    }

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const booking = await ServiceBooking.findById(id).populate([
      { path: 'service', select: 'service_name category provider_id' },
      { path: 'provider', select: 'name phone email' }
    ]);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is the customer
    if (booking.customer.toString() !== customerId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only rate your own bookings'
      });
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'You can only rate completed services'
      });
    }

    // Check if already rated
    if (booking.customer_rating) {
      return res.status(400).json({
        success: false,
        message: 'You have already rated this service'
      });
    }

    // Update booking with rating and review
    booking.customer_rating = Number(rating);
    booking.customer_review = review || '';
    await booking.save();

    // Update service average rating
    const service = await Service.findById(booking.service._id);
    const allBookings = await ServiceBooking.find({
      service: booking.service._id,
      customer_rating: { $exists: true }
    });

    const totalRating = allBookings.reduce((sum, b) => sum + b.customer_rating, 0);
    const averageRating = totalRating / allBookings.length;

    service.ratings = Math.round(averageRating * 10) / 10; // Round to 1 decimal
    await service.save();

    res.status(200).json({
      success: true,
      message: 'Service rated successfully',
      booking: {
        _id: booking._id,
        service: {
          _id: booking.service._id,
          service_name: booking.service.service_name,
          category: booking.service.category,
          ratings: service.ratings
        },
        provider: {
          _id: booking.provider._id,
          name: booking.provider.name,
          phone: booking.provider.phone,
          email: booking.provider.email
        },
        customer_rating: booking.customer_rating,
        customer_review: booking.customer_review,
        updatedAt: booking.updatedAt
      }
    });
  } catch (error) {
    console.error('Error rating service:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
