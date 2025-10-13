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

