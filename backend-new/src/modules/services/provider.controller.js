import ProviderRequest from "../../models/providerRequest.js";
import ServiceBooking from "../../models/booking.model.js";
import Service from "../../models/service.model.js";
import User from "../../models/user.model.js";
import mongoose from 'mongoose';
import { uploadFileToCloudinary } from '../../utils/uploadToCloudinary.js';

export const requestProviderAccess = async (req, res) => {
  try {
    const userId = req.user._id; // ✅ Use _id instead of id
    const { service_category, description } = req.body;

    // Basic validation
    if (!service_category) {
      return res.status(400).json({ 
        success: false,
        message: 'Service category is required' 
      });
    }

    // Check if user already has a pending request
    const existingRequest = await ProviderRequest.findOne({ 
      user: userId, 
      status: 'pending' 
    });
    
    if (existingRequest) {
      return res.status(400).json({ 
        success: false,
        message: 'You already have a pending provider request' 
      });
    }

    // Check if user is already a service provider
    const user = await User.findById(userId);
    if (user && user.role === 'serviceProvider') {
      return res.status(400).json({ 
        success: false,
        message: 'You are already a service provider' 
      });
    }

    // Handle file uploads with Cloudinary
    const documents = [];
    if (req.files && req.files.documents) {
      for (const file of req.files.documents) {
        const uploadResult = await uploadFileToCloudinary(file.path, 'monositi/provider_docs');
        if (uploadResult.success) {
          documents.push(uploadResult.secure_url);
        } else {
          console.error('Failed to upload provider document:', uploadResult.error);
        }
      }
    }

    // Create new provider request
    const newRequest = await ProviderRequest.create({
      user: userId,
      service_category,
      description: description || '',
      documents,
      status: 'pending'
    });

    // Populate user details for response
    await newRequest.populate('user', 'name email phone');

    res.status(201).json({ 
      success: true,
      message: 'Provider access request submitted successfully', 
      request: {
        _id: newRequest._id,
        service_category: newRequest.service_category,
        description: newRequest.description,
        documents: newRequest.documents,
        status: newRequest.status,
        user: newRequest.user,
        createdAt: newRequest.createdAt
      }
    });
  } catch (error) {
    console.error("Error creating provider request:", error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Provider accepts/rejects booking
export const updateBookingStatus = async (req, res) => {
  try {
    const providerId = req.user._id;
    const { id } = req.params;
    const { status, notes } = req.body;

    // Validate booking ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID'
      });
    }

    // Validate status
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "accepted" or "rejected"'
      });
    }

    // Find the booking
    const booking = await ServiceBooking.findById(id).populate([
      { path: 'service', select: 'service_name category provider_id' },
      { path: 'customer', select: 'name phone email' },
      { path: 'provider', select: 'name phone email' }
    ]);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if the provider is the owner of this booking's service
    if (booking.provider._id.toString() !== providerId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only manage bookings for your own services'
      });
    }

    // Check if booking is in pending status
    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Booking has already been processed'
      });
    }

    // Update booking status
    booking.status = status;
    if (notes) {
      booking.notes = booking.notes ? `${booking.notes}\nProvider: ${notes}` : `Provider: ${notes}`;
    }
    await booking.save();

    res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      booking: {
        _id: booking._id,
        service: {
          _id: booking.service._id,
          service_name: booking.service.service_name,
          category: booking.service.category
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
        updatedAt: booking.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get provider's bookings
export const getProviderBookings = async (req, res) => {
  try {
    const providerId = req.user._id;
    const { page = 1, limit = 10, status } = req.query;

    const filter = { provider: providerId };
    if (status) {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await ServiceBooking.find(filter)
      .populate([
        { path: 'service', select: 'service_name category base_price images' },
        { path: 'customer', select: 'name phone email' }
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
        customer: {
          _id: booking.customer._id,
          name: booking.customer.name,
          phone: booking.customer.phone,
          email: booking.customer.email
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
    console.error('Error fetching provider bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Mark booking as completed (provider only)
export const completeBooking = async (req, res) => {
  try {
    const providerId = req.user._id;
    const { id } = req.params;
    const { completion_notes, images_after } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID'
      });
    }

    const booking = await ServiceBooking.findById(id).populate([
      { path: 'service', select: 'service_name category provider_id' },
      { path: 'customer', select: 'name phone email' }
    ]);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if the provider is the owner of this booking's service
    if (booking.provider.toString() !== providerId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only complete bookings for your own services'
      });
    }

    // Check if booking is accepted
    if (booking.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Only accepted bookings can be marked as completed'
      });
    }

    // Handle file uploads for after images with Cloudinary
    let afterImages = [];
    if (req.files && req.files.images_after) {
      for (const file of req.files.images_after) {
        const uploadResult = await uploadFileToCloudinary(file.path, 'monositi/bookings/after');
        if (uploadResult.success) {
          afterImages.push(uploadResult.secure_url);
        } else {
          console.error('Failed to upload booking after image:', uploadResult.error);
        }
      }
    } else if (images_after) {
      // If images_after is provided as JSON string
      try {
        afterImages = typeof images_after === 'string' ? JSON.parse(images_after) : images_after;
      } catch (parseError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid JSON format for images_after'
        });
      }
    }

    // Update booking status
    booking.status = 'completed';
    booking.completion_notes = completion_notes || '';
    booking.images_after = afterImages;
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking marked as completed successfully',
      booking: {
        _id: booking._id,
        service: {
          _id: booking.service._id,
          service_name: booking.service.service_name,
          category: booking.service.category
        },
        customer: {
          _id: booking.customer._id,
          name: booking.customer.name,
          phone: booking.customer.phone,
          email: booking.customer.email
        },
        scheduled_for: booking.scheduled_for,
        status: booking.status,
        total_amount: booking.total_amount,
        notes: booking.notes,
        images_before: booking.images_before,
        images_after: booking.images_after,
        service_address: booking.service_address,
        completion_notes: booking.completion_notes,
        updatedAt: booking.updatedAt
      }
    });
  } catch (error) {
    console.error('Error completing booking:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Rate customer (provider only)
export const rateCustomer = async (req, res) => {
  try {
    const providerId = req.user._id;
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
      { path: 'customer', select: 'name phone email' }
    ]);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if the provider is the owner of this booking's service
    if (booking.provider.toString() !== providerId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only rate customers for your own services'
      });
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'You can only rate customers for completed services'
      });
    }

    // Check if already rated
    if (booking.provider_rating) {
      return res.status(400).json({
        success: false,
        message: 'You have already rated this customer'
      });
    }

    // Update booking with provider rating and review
    booking.provider_rating = Number(rating);
    booking.provider_review = review || '';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Customer rated successfully',
      booking: {
        _id: booking._id,
        service: {
          _id: booking.service._id,
          service_name: booking.service.service_name,
          category: booking.service.category
        },
        customer: {
          _id: booking.customer._id,
          name: booking.customer.name,
          phone: booking.customer.phone,
          email: booking.customer.email
        },
        provider_rating: booking.provider_rating,
        provider_review: booking.provider_review,
        updatedAt: booking.updatedAt
      }
    });
  } catch (error) {
    console.error('Error rating customer:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create first service for provider (becomes service provider)
export const createServiceForProvider = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Check if user is already a service provider
    const user = await User.findById(userId);
    if (user && user.role === 'serviceProvider') {
      return res.status(400).json({
        success: false,
        message: 'You are already a service provider'
      });
    }

    // Check if user already has a service
    const existingService = await Service.findOne({ provider_id: userId });
    if (existingService) {
      return res.status(400).json({
        success: false,
        message: 'You already have a service'
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

    // Update user role to serviceProvider
    await User.findByIdAndUpdate(userId, { role: 'serviceProvider' });

    return res.status(201).json({
      success: true,
      message: 'Service created successfully and you are now a service provider',
      service: {
        _id: service._id,
        service_name: service.service_name,
        category: service.category,
        description: service.description,
        base_price: service.base_price,
        variable_price: service.variable_price,
        active_status: service.active_status,
        monositi_verified: service.monositi_verified,
        images: service.images,
        createdAt: service.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating service for provider:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get logged in provider's service
export const getLoggedInProviderService = async (req, res) => {
  try {
    const providerId = req.user._id;

    const service = await Service.findOne({ provider_id: providerId });
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'No service found for this provider'
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
        createdAt: service.createdAt,
        updatedAt: service.updatedAt
      }
    });
  } catch (error) {
    console.error('Error fetching provider service:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update provider service
export const updateProviderService = async (req, res) => {
  try {
    const providerId = req.user._id;

    const service = await Service.findOne({ provider_id: providerId });
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'No service found for this provider'
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
      service._id,
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
    console.error('Error updating provider service:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update service availability
export const updateServiceAvailability = async (req, res) => {
  try {
    const providerId = req.user._id;
    const { action, dates } = req.body;

    if (!action || !['add', 'remove', 'replace'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Action must be "add", "remove", or "replace"'
      });
    }

    if (!dates || !Array.isArray(dates)) {
      return res.status(400).json({
        success: false,
        message: 'Dates array is required'
      });
    }

    const service = await Service.findOne({ provider_id: providerId });
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'No service found for this provider'
      });
    }

    // Parse and validate dates
    const parsedDates = dates.map(dateStr => {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        throw new Error(`Invalid date: ${dateStr}`);
      }
      return date;
    });

    let updatedCalendar = [...service.availability_calendar];

    if (action === 'add') {
      updatedCalendar = [...new Set([...updatedCalendar, ...parsedDates])];
    } else if (action === 'remove') {
      updatedCalendar = updatedCalendar.filter(date => 
        !parsedDates.some(removeDate => 
          new Date(date).getTime() === removeDate.getTime()
        )
      );
    } else if (action === 'replace') {
      updatedCalendar = parsedDates;
    }

    service.availability_calendar = updatedCalendar;
    await service.save();

    res.status(200).json({
      success: true,
      message: `Availability ${action}ed successfully`,
      total_dates: updatedCalendar.length,
      availability_calendar: updatedCalendar
    });
  } catch (error) {
    console.error('Error updating service availability:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Manage service addons
export const manageServiceAddons = async (req, res) => {
  try {
    const providerId = req.user._id;
    const { action, addon } = req.body;

    if (!action || !['add', 'update', 'remove'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Action must be "add", "update", or "remove"'
      });
    }

    const service = await Service.findOne({ provider_id: providerId });
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'No service found for this provider'
      });
    }

    let updatedAddons = [...service.addons];

    if (action === 'add') {
      if (!addon || !addon.name || !addon.price) {
        return res.status(400).json({
          success: false,
          message: 'Addon must have name and price'
        });
      }
      updatedAddons.push({
        name: addon.name,
        price: Number(addon.price)
      });
    } else if (action === 'update') {
      if (!addon || !addon.index || addon.index < 0 || addon.index >= updatedAddons.length) {
        return res.status(400).json({
          success: false,
          message: 'Valid addon index is required'
        });
      }
      if (addon.name) updatedAddons[addon.index].name = addon.name;
      if (addon.price) updatedAddons[addon.index].price = Number(addon.price);
    } else if (action === 'remove') {
      if (!addon || !addon.index || addon.index < 0 || addon.index >= updatedAddons.length) {
        return res.status(400).json({
          success: false,
          message: 'Valid addon index is required'
        });
      }
      updatedAddons.splice(addon.index, 1);
    }

    service.addons = updatedAddons;
    await service.save();

    res.status(200).json({
      success: true,
      message: `Addon ${action}ed successfully`,
      total_addons: updatedAddons.length,
      addons: updatedAddons
    });
  } catch (error) {
    console.error('Error managing service addons:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Manage service images
export const manageServiceImages = async (req, res) => {
  try {
    const providerId = req.user._id;
    const { action } = req.body;

    if (!action || !['add', 'remove'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Action must be "add" or "remove"'
      });
    }

    const service = await Service.findOne({ provider_id: providerId });
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'No service found for this provider'
      });
    }

    let updatedImages = [...service.images];

    if (action === 'add') {
      if (!req.files || !req.files.images || req.files.images.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Images are required for add action'
        });
      }

      // Check image limit (max 10)
      if (updatedImages.length + req.files.images.length > 10) {
        return res.status(400).json({
          success: false,
          message: 'Maximum 10 images allowed'
        });
      }

      // Upload new images to Cloudinary
      for (const file of req.files.images) {
        const uploadResult = await uploadFileToCloudinary(file.path, 'monositi/services');
        if (uploadResult.success) {
          updatedImages.push(uploadResult.secure_url);
        } else {
          console.error('Failed to upload service image:', uploadResult.error);
        }
      }
    } else if (action === 'remove') {
      const { imageIndex } = req.body;
      if (imageIndex === undefined || imageIndex < 0 || imageIndex >= updatedImages.length) {
        return res.status(400).json({
          success: false,
          message: 'Valid image index is required'
        });
      }
      updatedImages.splice(imageIndex, 1);
    }

    service.images = updatedImages;
    await service.save();

    res.status(200).json({
      success: true,
      message: `Images ${action}ed successfully`,
      total_images: updatedImages.length,
      images: updatedImages
    });
  } catch (error) {
    console.error('Error managing service images:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

