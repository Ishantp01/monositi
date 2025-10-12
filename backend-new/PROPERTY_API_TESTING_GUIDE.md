# Property API Testing Guide

This guide will help you test all the property-related endpoints using Postman.

## Prerequisites

1. **Backend Server Running**: Make sure your backend server is running on `http://localhost:5000` (or your configured port)
2. **Authentication Token**: You'll need a valid JWT token for protected routes
3. **Cloudinary Setup**: Ensure Cloudinary credentials are properly configured in your `.env` file

## Environment Variables Setup

Create a Postman environment with these variables:
- `base_url`: `http://localhost:5000`
- `auth_token`: `Bearer YOUR_JWT_TOKEN_HERE`
- `property_id`: `PROPERTY_ID_FROM_CREATE_RESPONSE`

## 1. Authentication Setup

### Step 1: Get Authentication Token
First, you need to authenticate and get a JWT token.

**POST** `{{base_url}}/api/auth/login`
```json
{
  "email": "your-email@example.com",
  "password": "your-password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "role": "user"
    }
  }
}
```

**Step 2: Set Authorization Header**
Copy the `accessToken` from the response and set it in your Postman environment:
- Variable: `auth_token`
- Value: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 2. Property Routes Testing

### 2.1 Create Property Listing

**POST** `{{base_url}}/api/properties`

**Headers:**
- `Authorization`: `{{auth_token}}`
- `Content-Type`: `multipart/form-data` (Postman will set this automatically)

**Body (form-data):**
```
type: residential
name: Beautiful 2BHK Apartment
description: Spacious apartment with modern amenities
address: 123 Main Street, Sector 5
city: Mumbai
state: Maharashtra
pincode: 400001
price: 15000
tags: 2BHK,Furnished,Near Metro
amenities: Swimming Pool,Gym,Parking,Security
size: 1200
units: 1
nearby_places: Metro Station,Shopping Mall,Hospital
listing_visibility: public
contactNumber: +91-9876543210
lng: 72.8777
lat:    
photos: [Upload 2-3 image files]
propertyDocs: [Upload 1-2 PDF files]
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Property created successfully (pending verification)",
  "property": {
    "_id": "property_id_here",
    "name": "Beautiful 2BHK Apartment",
    "type": "residential",
    "address": "123 Main Street, Sector 5",
    "city": "Mumbai",
    "state": "Maharashtra",
    "price": 15000,
    "status": "pending",
    "verification_status": "pending",
    "images": ["https://res.cloudinary.com/..."],
    "owner": {
      "_id": "user_id",
      "name": "User Name",
      "email": "user@example.com"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Save the `_id` from the response to use in other tests.**

### 2.2 Get All Properties (Public)

**GET** `{{base_url}}/api/properties`

**Query Parameters (optional):**
```
type: residential
city: Mumbai
state: Maharashtra
minPrice: 10000
maxPrice: 20000
page: 1
limit: 10
sort: -createdAt
includePending: true
```

**Note:** 
- `includePending: true` - Shows both verified and pending properties
- `includePending: false` (default) - Shows only verified properties

**Expected Response:**
```json
{
  "success": true,
  "properties": [
    {
      "_id": "property_id",
      "owner_id": {
        "_id": "user_id",
        "name": "Owner Name",
        "email": "owner@example.com",
        "phone": "+91-9876543210"
      },
      "type": "residential",
      "status": "active",
      "address": "123 Main Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "price": 15000,
      "property_features": {
        "size": 1200,
        "amenities": ["Swimming Pool", "Gym"],
        "images": ["https://res.cloudinary.com/..."]
      },
      "tags": ["2bhk", "furnished"],
      "verification_status": "verified"
    }
  ],
  "pagination": {
    "current": 1,
    "total": 5,
    "count": 10,
    "totalCount": 50
  }
}
```

### 2.3 Get Property by ID (Public)

**GET** `{{base_url}}/api/properties/{{property_id}}`

**Expected Response:**
```json
{
  "success": true,
  "property": {
    "_id": "property_id",
    "owner_id": {
      "_id": "user_id",
      "name": "Owner Name",
      "email": "owner@example.com",
      "phone": "+91-9876543210"
    },
    "type": "residential",
    "status": "active",
    "address": "123 Main Street, Sector 5",
    "city": "Mumbai",
    "state": "Maharashtra",
    "price": 15000,
    "property_features": {
      "size": 1200,
      "units": 1,
      "amenities": ["Swimming Pool", "Gym", "Parking"],
      "nearby_places": ["Metro Station", "Shopping Mall"],
      "images": ["https://res.cloudinary.com/..."]
    },
    "performance_metrics": {
      "views": 1,
      "leads": 0
    },
    "tags": ["2bhk", "furnished", "near metro"],
    "verification_status": "verified"
  }
}
```

### 2.4 Update Property (Owner Only)

**PUT** `{{base_url}}/api/properties/{{property_id}}`

**Headers:**
- `Authorization`: `{{auth_token}}`
- `Content-Type`: `application/json`

**Body (JSON):**
```json
{
  "name": "Updated Property Name",
  "description": "Updated description",
  "price": 18000,
  "amenities": "Swimming Pool,Gym,Parking,Security,Club House",
  "tags": "2BHK,Furnished,Near Metro,Pet Friendly",
  "listing_visibility": "premium",
  "contactNumber": "+91-9876543211"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Property updated successfully",
  "property": {
    "_id": "property_id",
    "name": "Updated Property Name",
    "price": 18000,
    "property_features": {
      "amenities": ["Swimming Pool", "Gym", "Parking", "Security", "Club House"]
    },
    "tags": ["2bhk", "furnished", "near metro", "pet friendly"],
    "listing_visibility": "premium"
  }
}
```

### 2.5 Delete Property (Owner Only)

**DELETE** `{{base_url}}/api/properties/{{property_id}}`

**Headers:**
- `Authorization`: `{{auth_token}}`

**Expected Response:**
```json
{
  "success": true,
  "message": "Property deleted successfully"
}
```

### 2.6 Admin: Verify Property

**PATCH** `{{base_url}}/api/properties/{{property_id}}/verify`

**Headers:**
- `Authorization`: `{{auth_token}}` (Admin token required)
- `Content-Type`: `application/json`

**Body (JSON):**
```json
{
  "status": "verified"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Property verified successfully",
  "property": {
    "_id": "property_id",
    "verification_status": "verified",
    "verified_by": "admin_user_id",
    "verified_at": "2024-01-01T00:00:00.000Z"
  }
}
```

## 3. Testing Scenarios

### Scenario 1: Complete Property Lifecycle
1. Create a property → Get property ID
2. Get all properties → Verify it appears in the list
3. Get property by ID → Verify details
4. Update property → Verify changes
5. Delete property → Verify deletion

### Scenario 2: Error Testing
1. **Unauthorized Access**: Test protected routes without token
2. **Invalid Data**: Test with missing required fields
3. **Invalid File Types**: Upload unsupported file formats
4. **Non-existent Property**: Test with invalid property ID
5. **Wrong Owner**: Try to update/delete property you don't own

### Scenario 3: File Upload Testing
1. **Valid Files**: Upload images (JPG, PNG) and PDFs
2. **Invalid Files**: Try uploading .exe, .txt files
3. **Large Files**: Test with files exceeding size limits
4. **Multiple Files**: Upload multiple photos and documents

## 4. Common Issues and Solutions

### Issue 1: "Must supply api_key" Error
**Solution**: Check your `.env` file has correct Cloudinary credentials:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Issue 2: Authentication Errors
**Solution**: 
- Ensure token is properly formatted: `Bearer <token>`
- Check if token has expired
- Verify user exists in database

### Issue 3: File Upload Errors
**Solution**:
- Check multer configuration
- Ensure uploads directory exists
- Verify file size limits

### Issue 4: Property Not Found
**Solution**:
- Check if property ID is correct
- Verify property status is 'active'
- Ensure verification_status is 'verified' for public access

## 5. Postman Collection Setup

### Collection Structure:
```
Property API Tests
├── Authentication
│   ├── Login
│   └── Register
├── Properties
│   ├── Create Property
│   ├── Get All Properties
│   ├── Get Property by ID
│   ├── Update Property
│   ├── Delete Property
│   └── Admin Verify Property
└── Error Tests
    ├── Unauthorized Access
    ├── Invalid Data
    └── File Upload Errors
```

### Pre-request Scripts:
Add this to your collection's pre-request script to automatically set the auth token:
```javascript
if (pm.environment.get("auth_token")) {
    pm.request.headers.add({
        key: "Authorization",
        value: pm.environment.get("auth_token")
    });
}
```

## 6. Testing Checklist

- [ ] Authentication works correctly
- [ ] Property creation with files uploads successfully
- [ ] All required fields are validated
- [ ] File uploads work with valid file types
- [ ] Public routes return correct data
- [ ] Protected routes require authentication
- [ ] Owner can update/delete their properties
- [ ] Admin can verify properties
- [ ] Error handling works for invalid requests
- [ ] Pagination works correctly
- [ ] Filtering and sorting work as expected

## 7. Sample Test Data

### Residential Property:
```json
{
  "type": "residential",
  "name": "Modern 2BHK Apartment",
  "description": "Beautiful apartment with city view",
  "address": "456 Park Avenue, Bandra West",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400050",
  "price": 25000,
  "tags": "2BHK,Furnished,Sea View",
  "amenities": "Swimming Pool,Gym,Parking,Security,Club House",
  "size": 1200,
  "units": 1,
  "nearby_places": "Bandra Station,Shopping Mall,Hospital",
  "listing_visibility": "premium",
  "contactNumber": "+91-9876543210"
}
```

### Commercial Property:
```json
{
  "type": "commercial",
  "name": "Prime Office Space",
  "description": "Modern office space in business district",
  "address": "789 Business Park, Sector 1",
  "city": "Gurgaon",
  "state": "Haryana",
  "pincode": "122001",
  "price": 50000,
  "tags": "Office Space,IT Park,Metro Connected",
  "amenities": "Parking,Security,Cafeteria,Conference Room",
  "size": 2000,
  "units": 5,
  "nearby_places": "Metro Station,Airport,Mall",
  "listing_visibility": "public",
  "contactNumber": "+91-9876543211"
}
```

This guide should help you thoroughly test all the property API endpoints. Make sure to test both success and error scenarios to ensure your API is robust and handles edge cases properly.
