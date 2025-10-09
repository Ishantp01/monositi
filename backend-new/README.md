# Monositi Backend

A Node.js/Express backend API for the Monositi property rental and service provider platform.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Property Management**: CRUD operations for property listings
- **Service Providers**: Service provider registration and management
- **Booking System**: Property and service booking functionality
- **Reviews & Ratings**: User reviews and ratings system
- **Subscription Management**: Tiered subscription system
- **File Uploads**: Image and document upload support
- **WhatsApp Integration**: OTP verification via WhatsApp
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet, CORS, rate limiting, input validation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT
- **Validation**: Joi, express-validator
- **File Uploads**: Multer, Cloudinary
- **Communication**: WhatsApp API (Twilio)
- **Logging**: Winston
- **Security**: Helmet, CORS, bcryptjs

## Quick Start

### Prerequisites

- Node.js (v16+)
- MongoDB
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/monositi
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=30d
   CORS_ORIGIN=http://localhost:3000,http://localhost:5173
   ```

3. **Start MongoDB:**
   Make sure MongoDB is running on your system.

4. **Run the server:**

   **Development mode:**
   ```bash
   npm run dev
   ```

   **Production mode:**
   ```bash
   npm run production
   ```

5. **Test the API:**
   - Health check: `GET http://localhost:5000/health`
   - API info: `GET http://localhost:5000/api/`

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm run production` - Start in production mode
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run clean` - Clean node_modules and reinstall

## API Endpoints

### Core Routes
- `GET /health` - Health check
- `GET /api/` - API information

### Module Routes
- `/api/auth` - Authentication routes
- `/api/users` - User management
- `/api/properties` - Property listings
- `/api/services` - Service providers
- `/api/bookings` - Booking system
- `/api/reviews` - Reviews and ratings
- `/api/subscriptions` - Subscription management

## Project Structure

```
src/
├── config/          # Configuration files
├── middlewares/     # Express middlewares
├── models/          # Mongoose models
├── modules/         # Feature modules
│   ├── auth/       # Authentication module
│   ├── users/      # User management
│   ├── properties/ # Property management
│   ├── services/   # Service providers
│   ├── bookings/   # Booking system
│   ├── reviews/    # Reviews module
│   └── subscriptions/ # Subscription management
├── routes/          # Route definitions
├── utils/           # Utility functions
└── server.js        # Application entry point
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | - |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRE` | JWT expiration time | `30d` |
| `CORS_ORIGIN` | Allowed CORS origins | - |

## Development

1. **Code Structure**: Follow the existing module structure
2. **Error Handling**: Use the provided error handler middleware
3. **Validation**: Use Joi schemas for input validation
4. **Logging**: Use Winston logger for all log messages
5. **Response Format**: Use the APIResponse utility for consistent responses

## Contributing

1. Follow the existing code structure and patterns
2. Add proper error handling and validation
3. Write tests for new features
4. Update documentation as needed
5. Use meaningful commit messages

## License

MIT