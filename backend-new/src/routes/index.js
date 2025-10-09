import express from 'express';
const router = express.Router();

// Import route modules
import authRoutes from '../modules/auth/auth.routes.js';
import userRoutes from '../modules/users/user.routes.js';
import propertyRoutes from '../modules/properties/property.routes.js';
import serviceRoutes from '../modules/services/service.routes.js';
import bookingRoutes from '../modules/bookings/booking.routes.js';
import reviewRoutes from '../modules/reviews/review.routes.js';
import subscriptionRoutes from '../modules/subscriptions/subscription.routes.js';

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/properties', propertyRoutes);
router.use('/services', serviceRoutes);
router.use('/bookings', bookingRoutes);
router.use('/reviews', reviewRoutes);
router.use('/subscriptions', subscriptionRoutes);

// Welcome message for API root
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Monositi API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      properties: '/api/properties',
      services: '/api/services',
      bookings: '/api/bookings',
      reviews: '/api/reviews',
      subscriptions: '/api/subscriptions',
      health: '/health'
    },
    documentation: '/api-docs'
  });
});

export default router;
