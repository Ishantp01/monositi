# 🏠 Monositi Properties API Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Property APIs](#property-apis)
4. [Testing Guide](#testing-guide)
5. [Data Models](#data-models)
6. [Error Handling](#error-handling)

---

## 🔍 Overview

The Monositi Properties module provides comprehensive APIs for:
- **Property Listing Management** - Create, update, delete properties
- **Property Discovery** - Search, filter, and browse properties
- **Location-based Search** - Find properties near specific coordinates
- **Property Verification** - Admin verification workflow
- **Document Management** - Handle property documents and images

### Base URL
```
http://localhost:5000/api/properties
```

### Authentication
Most APIs require JWT authentication except public browsing endpoints.


---

## 🔐 Authentication

### Headers Required
```json
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}
```

### File Upload Headers
```json
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "multipart/form-data"
}
```

---

## 🏠 Property APIs

### 1. Create Property Listing
**Endpoint:** `POST /api/properties`

**Description:** Create a new property listing with images and documents.

**Headers:**
```json
{
  "Authorization": "Bearer <jwt_token>"
}
```

**Body (multipart/form-data):**
```json
{
  "type": "residential",
  "name": "Beautiful 2BHK Apartment",
  "description": "Spacious apartment with modern amenities",
  "address": "123 Main Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "price": "5000000",
  "tags": "2BHK,Furnished,Near Metro",
  "amenities": "Parking,Swimming Pool,Gym,Security",
  "size": "1200",
  "units": "2",
  "nearby_places": "Metro Station,Shopping Mall,School",
  "listing_visibility": "public",
  "contactNumber": "+919876543210",
  "geo": "{\"lat\":19.0760,\"lng\":72.8777}",
  "photos": [image1.jpg, image2.jpg, image3.jpg], // Max 8 files
  "propertyDocs": [deed.pdf, certificate.pdf] // Max 6 files
}
```

**Response:**
```json
{
  "success": true,
  "message": "Property created successfully (pending verification)",
  "property": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "name": "Beautiful 2BHK Apartment",
    "type": "residential",
    "address": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "price": 5000000,
    "status": "pending",
    "verification_status": "pending",
    "images": [
      "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/monositi/properties/photos/image1.jpg"
    ],
    "owner": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2023-09-05T10:30:00.000Z"
  }
}
```

### 2. Get All Properties
**Endpoint:** `GET /api/properties`

**Description:** Browse all verified and active properties with filtering and pagination.

**Query Parameters:**
```
?type=residential&city=Mumbai&state=Maharashtra&minPrice=1000000&maxPrice=10000000&bedrooms=2&amenities=Parking,Gym&page=1&limit=20&sort=-createdAt
```

**Response:**
```json
{
  "success": true,
  "properties": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "owner_id": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+919876543210"
      },
      "type": "residential",
      "status": "active",
      "name": "Beautiful 2BHK Apartment",
      "description": "Spacious apartment with modern amenities",
      "address": "123 Main Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "geo_location": {
        "type": "Point",
        "coordinates": [72.8777, 19.0760]
      },
      "property_features": {
        "size": 1200,
        "units": 2,
        "amenities": ["Parking", "Swimming Pool", "Gym", "Security"],
        "nearby_places": ["Metro Station", "Shopping Mall", "School"],
        "images": [
          "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/monositi/properties/photos/image1.jpg"
        ]
      },
      "price": 5000000,
      "occupancy_rate": 0,
      "performance_metrics": {
        "views": 25,
        "leads": 3
      },
      "tags": ["2bhk", "furnished", "near metro"],
      "listing_visibility": "public",
      "verification_status": "verified",
      "monositi_verified": true,
      "contactNumber": "+919876543210",
      "createdAt": "2023-09-05T10:30:00.000Z",
      "updatedAt": "2023-09-05T10:30:00.000Z"
    }
  ],
  "pagination": {
    "current": 1,
    "total": 5,
    "count": 20,
    "totalCount": 95
  }
}
```

### 3. Get Property by ID
**Endpoint:** `GET /api/properties/:id`

**Description:** Get detailed information about a specific property.

**Response:**
```json
{
  "success": true,
  "property": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "owner_id": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+919876543210"
    },
    "type": "residential",
    "status": "active",
    "name": "Beautiful 2BHK Apartment",
    "description": "Spacious apartment with modern amenities",
    "address": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "geo_location": {
      "type": "Point",
      "coordinates": [72.8777, 19.0760]
    },
    "property_features": {
      "size": 1200,
      "units": 2,
      "amenities": ["Parking", "Swimming Pool", "Gym", "Security"],
      "nearby_places": ["Metro Station", "Shopping Mall", "School"],
      "images": [
        "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/monositi/properties/photos/image1.jpg"
      ]
    },
    "price": 5000000,
    "occupancy_rate": 0,
    "performance_metrics": {
      "views": 26,
      "leads": 3
    },
    "tags": ["2bhk", "furnished", "near metro"],
    "listing_visibility": "public",
    "documents": [
      "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/monositi/properties/docs/deed.pdf"
    ],
    "verification_status": "verified",
    "monositi_verified": true,
    "contactNumber": "+919876543210",
    "createdAt": "2023-09-05T10:30:00.000Z",
    "updatedAt": "2023-09-05T10:30:00.000Z"
  }
}
```

### 4. Update Property
**Endpoint:** `PUT /api/properties/:id`

**Description:** Update property details (owner only).

**Headers:**
```json
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "name": "Updated Property Name",
  "description": "Updated description",
  "price": "5500000",
  "amenities": "Parking,Swimming Pool,Gym,Security,Club House",
  "tags": "2BHK,Furnished,Near Metro,Premium",
  "listing_visibility": "premium",
  "contactNumber": "+919876543211"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Property updated successfully",
  "property": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "name": "Updated Property Name",
    "description": "Updated description",
    "price": 5500000,
    "property_features": {
      "amenities": ["Parking", "Swimming Pool", "Gym", "Security", "Club House"]
    },
    "tags": ["2bhk", "furnished", "near metro", "premium"],
    "listing_visibility": "premium",
    "contactNumber": "+919876543211",
    "updatedAt": "2023-09-05T11:00:00.000Z"
  }
}
```

### 5. Delete Property
**Endpoint:** `DELETE /api/properties/:id`

**Description:** Soft delete a property (owner only).

**Headers:**
```json
{
  "Authorization": "Bearer <jwt_token>"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Property deleted successfully"
}
```

### 6. Get Owner Properties
**Endpoint:** `GET /api/properties/my-properties`

**Description:** Get all properties owned by the logged-in user.

**Headers:**
```json
{
  "Authorization": "Bearer <jwt_token>"
}
```

**Query Parameters:**
```
?status=active&type=residential&page=1&limit=20&sort=-createdAt
```

**Response:**
```json
{
  "success": true,
  "properties": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "type": "residential",
      "status": "active",
      "name": "Beautiful 2BHK Apartment",
      "address": "123 Main Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "price": 5000000,
      "verification_status": "verified",
      "createdAt": "2023-09-05T10:30:00.000Z"
    }
  ],
  "pagination": {
    "current": 1,
    "total": 2,
    "count": 1,
    "totalCount": 3
  }
}
```

### 7. Get Nearby Properties
**Endpoint:** `GET /api/properties/nearby`

**Description:** Find properties within a specified radius of given coordinates.

**Query Parameters:**
```
?latitude=19.0760&longitude=72.8777&radius=5
```

**Response:**
```json
{
  "success": true,
  "message": "Found 3 properties within 5km",
  "properties": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "owner_id": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+919876543210"
      },
      "name": "Beautiful 2BHK Apartment",
      "address": "123 Main Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "price": 5000000,
      "geo_location": {
        "type": "Point",
        "coordinates": [72.8777, 19.0760]
      },
      "property_features": {
        "images": ["https://res.cloudinary.com/..."]
      }
    }
  ],
  "searchParams": {
    "latitude": 19.0760,
    "longitude": 72.8777,
    "radius": 5,
    "radiusUnit": "km"
  }
}
```

### 8. Search Properties
**Endpoint:** `GET /api/properties/search`

**Description:** Advanced search with multiple filters and text search.

**Query Parameters:**
```
?q=2BHK apartment&city=Mumbai&type=residential&minPrice=1000000&maxPrice=10000000&limit=20&page=1&sort=-price
```

**Response:**
```json
{
  "success": true,
  "message": "Found 5 properties matching your search",
  "properties": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "owner_id": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+919876543210"
      },
      "name": "Beautiful 2BHK Apartment",
      "description": "Spacious apartment with modern amenities",
      "address": "123 Main Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "price": 5000000,
      "property_features": {
        "images": ["https://res.cloudinary.com/..."]
      },
      "tags": ["2bhk", "furnished", "near metro"]
    }
  ],
  "pagination": {
    "current": 1,
    "total": 1,
    "count": 5,
    "totalCount": 5
  },
  "searchParams": {
    "query": "2BHK apartment",
    "city": "Mumbai",
    "type": "residential",
    "minPrice": "1000000",
    "maxPrice": "10000000",
    "sort": "-price"
  }
}
```

### 9. Get Property Documents
**Endpoint:** `GET /api/properties/:id/documents`

**Description:** Get all documents associated with a property.

**Response:**
```json
{
  "success": true,
  "message": "Found 2 document(s) for this property",
  "property": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "name": "Beautiful 2BHK Apartment",
    "address": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "verification_status": "verified",
    "owner": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+919876543210"
    }
  },
  "documents": [
    {
      "id": 1,
      "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/monositi/properties/docs/deed.pdf",
      "type": "PDF",
      "filename": "deed"
    },
    {
      "id": 2,
      "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/monositi/properties/docs/certificate",
      "type": "Image",
      "filename": "certificate"
    }
  ],
  "totalDocuments": 2
}
```

### 10. Verify Property (Admin Only)
**Endpoint:** `PATCH /api/properties/:id/verify`

**Description:** Admin endpoint to verify or reject a property.

**Headers:**
```json
{
  "Authorization": "Bearer <admin_jwt_token>",
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "status": "verified"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Property verified successfully",
  "property": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "verification_status": "verified",
    "verified_by": "64f8a1b2c3d4e5f6a7b8c9d3",
    "verified_at": "2023-09-05T12:00:00.000Z"
  }
}
```

---

## 🧪 Testing Guide

### Prerequisites
1. **Postman** installed
2. **Backend server** running on `http://localhost:5000`
3. **Valid JWT tokens** for different user roles:
   - Property Owner token
   - Admin token

### Test Data Setup

#### 1. Create Test Users
```bash
# Register a property owner
POST http://localhost:5000/api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+919876543210",
  "role": "tenant"
}

# Register an admin
POST http://localhost:5000/api/auth/register
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123",
  "phone": "+919876543999",
  "role": "admin"
}
```

#### 2. Login to Get Tokens
```bash
# Login as property owner
POST http://localhost:5000/api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

# Login as admin
POST http://localhost:5000/api/auth/login
{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Testing Workflow

#### Phase 1: Property Creation
1. **Create Property Listing** (as property owner)
   - Use owner token
   - Upload property photos and documents
   - Verify property creation with pending status

2. **Verify Property** (as admin)
   - Use admin token
   - Verify the created property
   - Check status change to verified

#### Phase 2: Property Discovery
3. **Browse All Properties** (public)
   - No authentication required
   - Test filtering and pagination
   - Verify only verified properties are shown

4. **Search Properties** (public)
   - Test text search functionality
   - Test multiple filters
   - Verify search results

5. **Get Property Details** (public)
   - Test property detail view
   - Verify view count increment
   - Check all property information

6. **Find Nearby Properties** (public)
   - Test geolocation search
   - Verify radius-based results
   - Test coordinate validation

#### Phase 3: Property Management
7. **Get Owner Properties** (as owner)
   - View all owned properties
   - Test filtering by status/type
   - Verify pagination

8. **Update Property** (as owner)
   - Modify property details
   - Test field updates
   - Verify changes

9. **Get Property Documents** (public)
   - View property documents
   - Test document access
   - Verify document information

10. **Delete Property** (as owner)
    - Soft delete property
    - Verify status change
    - Test ownership validation

### Postman Collection Setup

#### Environment Variables
Create a Postman environment with:
```json
{
  "base_url": "http://localhost:5000/api/properties",
  "owner_token": "{{owner_jwt_token}}",
  "admin_token": "{{admin_jwt_token}}"
}
```

#### Collection Structure
```
Monositi Properties API
├── Authentication
│   ├── Register User
│   └── Login User
├── Property Management
│   ├── Create Property Listing
│   ├── Get Owner Properties
│   ├── Update Property
│   └── Delete Property
├── Property Discovery
│   ├── Browse All Properties
│   ├── Search Properties
│   ├── Get Property by ID
│   ├── Get Nearby Properties
│   └── Get Property Documents
└── Admin Functions
    └── Verify Property
```

### File Upload Testing

#### Test Images
Create test images with these specifications:
- **Format:** JPG, PNG
- **Size:** 1-5 MB each
- **Dimensions:** 1200x800 or similar
- **Content:** Sample property photos
- **Max Count:** 8 images per property

#### Test Documents
Create test documents:
- **Format:** PDF, JPG, PNG
- **Size:** 1-10 MB
- **Content:** Sample property documents (deeds, certificates)
- **Max Count:** 6 documents per property

#### Cloudinary Testing
Verify Cloudinary uploads by:
1. Checking response URLs
2. Accessing uploaded files
3. Verifying folder structure:
   - `monositi/properties/photos/`
   - `monositi/properties/docs/`

### Advanced Testing Scenarios

#### Geolocation Testing
```bash
# Test with Mumbai coordinates
GET /api/properties/nearby?latitude=19.0760&longitude=72.8777&radius=10

# Test with Delhi coordinates
GET /api/properties/nearby?latitude=28.7041&longitude=77.1025&radius=5

# Test invalid coordinates
GET /api/properties/nearby?latitude=200&longitude=300&radius=5
```

#### Search Testing
```bash
# Text search
GET /api/properties/search?q=apartment&city=Mumbai

# Price range search
GET /api/properties/search?minPrice=1000000&maxPrice=10000000

# Type and location search
GET /api/properties/search?type=residential&city=Mumbai&state=Maharashtra

# Combined search
GET /api/properties/search?q=2BHK&city=Mumbai&type=residential&minPrice=2000000&maxPrice=8000000
```

#### Filter Testing
```bash
# Filter by type
GET /api/properties?type=residential

# Filter by city
GET /api/properties?city=Mumbai

# Filter by price range
GET /api/properties?minPrice=1000000&maxPrice=10000000

# Combined filters
GET /api/properties?type=residential&city=Mumbai&minPrice=2000000&maxPrice=8000000&sort=-price
```

### Error Testing

#### Test Error Scenarios
1. **Invalid Authentication**
   - Missing token
   - Expired token
   - Wrong role permissions

2. **Invalid Data**
   - Missing required fields
   - Invalid property ID format
   - Invalid coordinates

3. **Business Logic Errors**
   - Unauthorized property access
   - Invalid file types
   - Property not found

#### Expected Error Responses
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

---

## 📊 Data Models

### Property Schema
```javascript
{
  owner_id: ObjectId, // Reference to User
  agent_id: ObjectId, // Reference to User (optional)
  type: String, // "residential" | "commercial"
  status: String, // "active" | "pending" | "sold" | "rented"
  address: String, // Required
  city: String, // Required
  state: String, // Required
  pincode: String,
  geo_location: {
    type: "Point",
    coordinates: [longitude, latitude]
  },
  property_features: {
    size: Number, // Square feet
    units: Number, // Number of rooms/units
    amenities: [String], // Array of amenities
    nearby_places: [String], // Array of nearby places
    images: [String] // Array of image URLs
  },
  price: Number, // Required
  occupancy_rate: Number, // Default 0
  performance_metrics: {
    views: Number, // Default 0
    leads: Number // Default 0
  },
  tags: [String], // For filtering
  listing_visibility: String, // "public" | "premium"
  documents: [String], // Array of document URLs
  verification_status: String, // "pending" | "verified" | "rejected"
  monositi_verified: Boolean, // Default false
  name: String,
  description: String,
  contactNumber: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Query Parameters Reference

#### Get Properties Filters
- `type`: Property type (residential/commercial)
- `city`: City name (case-insensitive)
- `state`: State name (case-insensitive)
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `bedrooms`: Number of bedrooms
- `amenities`: Comma-separated amenities
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `sort`: Sort field (default: -createdAt)

#### Search Properties Filters
- `q`: Search query text
- `city`: City filter
- `type`: Property type filter
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `limit`: Items per page (default: 20)
- `page`: Page number (default: 1)
- `sort`: Sort field (default: -createdAt)

#### Nearby Properties Filters
- `latitude`: Latitude coordinate (required)
- `longitude`: Longitude coordinate (required)
- `radius`: Search radius in km (default: 5)

---

## ⚠️ Error Handling

### Common Error Codes
- **400** - Bad Request (validation errors)
- **401** - Unauthorized (missing/invalid token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found (property doesn't exist)
- **500** - Internal Server Error (server issues)

### Error Response Format
```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": "Technical error details (development only)"
}
```

### Validation Errors
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "type",
      "message": "type is required and must be one of residential, commercial"
    },
    {
      "field": "price",
      "message": "price is required and must be a positive number"
    }
  ]
}
```

---

## 🔧 Configuration

### Environment Variables Required
```bash
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

# Database
MONGODB_URI=mongodb://localhost:27017/monositi

# Server
PORT=5000
NODE_ENV=development
```

### File Upload Limits
- **Property Photos:** Max 8 files, 5MB each
- **Property Documents:** Max 6 files, 10MB each
- **Total request size:** 50MB

### Geolocation Features
- **Coordinate System:** WGS84 (longitude, latitude)
- **Search Radius:** 1-100 km
- **Index:** 2dsphere for efficient geospatial queries

---

## 📝 Notes

### Security Considerations
1. **JWT tokens** expire after 7 days
2. **File uploads** are validated for type and size
3. **Property access** is restricted to owners
4. **Admin verification** is required for public visibility

### Performance Considerations
1. **Pagination** is implemented for all list endpoints
2. **Geospatial index** optimizes location-based queries
3. **File uploads** use Cloudinary for CDN delivery
4. **View tracking** increments on property detail views

### Business Logic
1. **Property Status Flow:** pending → active (after verification)
2. **Verification Process:** Admin approval required
3. **Soft Delete:** Properties marked as 'sold' instead of deletion
4. **Public Visibility:** Only verified and active properties shown

### Future Enhancements
1. **Property Analytics** dashboard for owners
2. **Advanced Search** with more filters
3. **Property Comparison** feature
4. **Favorites/Wishlist** functionality
5. **Property Recommendations** based on user preferences

---

**Last Updated:** September 2023  
**Version:** 1.0.0  
**Maintainer:** Monositi Development Team
