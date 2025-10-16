# 🚀 Monositi Complete API Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [User APIs](#user-apis)
4. [Property APIs](#property-apis)
5. [Service APIs](#service-apis)
6. [Service Provider APIs](#service-provider-apis)
7. [Admin APIs](#admin-apis)
8. [Quick Reference](#quick-reference)

---

## 🔍 Overview

### Base URL
```
http://localhost:5000/api
```

### User Roles
- **👤 Tenant** - Regular user (browse properties, book services)
- **🏠 Landlord/Property Owner** - Can list properties
- **🔧 Service Provider** - Can offer services (requires approval)
- **👨‍💼 Admin** - Full system access and verification rights

### Authentication
Most endpoints require JWT authentication via Bearer token in the Authorization header.

---

## 🔐 Authentication

All authenticated requests require:
```json
Headers: {
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}
```

For file uploads:
```json
Headers: {
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "multipart/form-data"
}
```

---

## 👤 User APIs

### Base Path: `/api/users`

### 1️⃣ Register User
**Endpoint:** `POST /api/users/register`  
**Access:** Public  
**Role:** None

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+919876543210",
  "role": "tenant"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "role": "tenant",
    "createdAt": "2023-09-05T10:30:00.000Z"
  }
}
```

---

### 2️⃣ Send OTP
**Endpoint:** `POST /api/users/send-otp`  
**Access:** Public  
**Role:** None

**Request Body:**
```json
{
  "phone": "+919876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent via WhatsApp"
}
```

---

### 3️⃣ Verify OTP
**Endpoint:** `POST /api/users/verify-otp`  
**Access:** Public  
**Role:** None

**Request Body:**
```json
{
  "phone": "+919876543210",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "role": "tenant"
  }
}
```

---

### 4️⃣ Get My Profile
**Endpoint:** `GET /api/users/users/me`  
**Access:** Protected  
**Role:** User (Tenant, Landlord, Service Provider)

**Request:** No body required

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "role": "tenant",
    "profile_img": "https://cloudinary.com/...",
    "kyc_status": "pending",
    "contact_preferences": {
      "email_notifications": true,
      "sms_notifications": true
    },
    "subscription": {
      "plan": "free",
      "expiry_date": null
    },
    "createdAt": "2023-09-05T10:30:00.000Z"
  }
}
```

---

### 5️⃣ Update My Profile
**Endpoint:** `PUT /api/users/users/me`  
**Access:** Protected  
**Role:** User (Tenant, Landlord, Service Provider)

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "johnupdated@example.com",
  "profile_img": "https://cloudinary.com/new-image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "name": "John Updated",
    "email": "johnupdated@example.com",
    "profile_img": "https://cloudinary.com/new-image.jpg"
  }
}
```

---

### 6️⃣ Update KYC
**Endpoint:** `PATCH /api/users/users/me/kyc`  
**Access:** Protected  
**Role:** User (Tenant, Landlord, Service Provider)  
**Content-Type:** multipart/form-data

**Request Body:**
```json
{
  "kycDocs": [file1.pdf, file2.jpg, file3.jpg] // Max 5 files
}
```

**Response:**
```json
{
  "success": true,
  "message": "KYC documents uploaded successfully",
  "user": {
    "kyc_status": "pending",
    "kyc_docs": [
      "https://cloudinary.com/monositi/kyc/doc1.pdf",
      "https://cloudinary.com/monositi/kyc/doc2.jpg"
    ]
  }
}
```

---

### 7️⃣ Update Contact Preferences
**Endpoint:** `PATCH /api/users/users/me/contact-preferences`  
**Access:** Protected  
**Role:** User (Tenant, Landlord, Service Provider)

**Request Body:**
```json
{
  "email_notifications": true,
  "sms_notifications": false,
  "whatsapp_notifications": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contact preferences updated",
  "contact_preferences": {
    "email_notifications": true,
    "sms_notifications": false,
    "whatsapp_notifications": true
  }
}
```

---

### 8️⃣ Request Role Change
**Endpoint:** `PATCH /api/users/users/me/role`  
**Access:** Protected  
**Role:** User (Tenant, Landlord, Service Provider)

**Request Body:**
```json
{
  "requested_role": "serviceProvider",
  "reason": "I want to offer plumbing services"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Role change request submitted",
  "status": "pending"
}
```

---

### 9️⃣ Get My Subscription
**Endpoint:** `GET /api/users/users/me/subscription`  
**Access:** Protected  
**Role:** User (Tenant, Landlord, Service Provider)

**Request:** No body required

**Response:**
```json
{
  "success": true,
  "subscription": {
    "plan": "premium",
    "features": ["unlimited_listings", "priority_support", "analytics"],
    "expiry_date": "2024-12-31T23:59:59.000Z",
    "auto_renew": true
  }
}
```

---

### 🔟 Update My Subscription
**Endpoint:** `POST /api/users/users/me/subscription`  
**Access:** Protected  
**Role:** User (Tenant, Landlord, Service Provider)

**Request Body:**
```json
{
  "plan": "premium",
  "duration_months": 12,
  "payment_method": "card"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription updated successfully",
  "subscription": {
    "plan": "premium",
    "expiry_date": "2024-12-31T23:59:59.000Z",
    "payment_status": "completed"
  }
}
```

---

### 1️⃣1️⃣ Get My Properties
**Endpoint:** `GET /api/users/users/me/properties`  
**Access:** Protected  
**Role:** Landlord/Property Owner

**Request:** No body required

**Response:**
```json
{
  "success": true,
  "properties": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "Beautiful 2BHK Apartment",
      "type": "residential",
      "city": "Mumbai",
      "price": 5000000,
      "status": "active",
      "verification_status": "verified"
    }
  ]
}
```

---

### 1️⃣2️⃣ Get All Users (Admin)
**Endpoint:** `GET /api/users/users`  
**Access:** Protected + Admin  
**Role:** Admin

**Query Parameters:**
```
?page=1&limit=20&role=tenant&search=john
```

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+919876543210",
      "role": "tenant",
      "kyc_status": "verified",
      "createdAt": "2023-09-05T10:30:00.000Z"
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

---

### 1️⃣3️⃣ Get User by ID (Admin)
**Endpoint:** `GET /api/users/users/:id`  
**Access:** Protected + Admin  
**Role:** Admin

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "role": "tenant",
    "kyc_status": "verified",
    "kyc_docs": ["https://cloudinary.com/..."],
    "properties": [],
    "bookings": [],
    "createdAt": "2023-09-05T10:30:00.000Z"
  }
}
```

---

### 1️⃣4️⃣ Update User by Admin
**Endpoint:** `PATCH /api/users/users/:id`  
**Access:** Protected + Admin  
**Role:** Admin

**Request Body:**
```json
{
  "role": "serviceProvider",
  "kyc_status": "verified",
  "subscription": {
    "plan": "premium",
    "expiry_date": "2024-12-31"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "role": "serviceProvider",
    "kyc_status": "verified"
  }
}
```

---

### 1️⃣5️⃣ Delete User (Admin)
**Endpoint:** `DELETE /api/users/users/:id`  
**Access:** Protected + Admin  
**Role:** Admin

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

### 1️⃣6️⃣ Get User Properties (Admin)
**Endpoint:** `GET /api/users/users/:id/properties`  
**Access:** Protected + Admin  
**Role:** Admin

**Response:**
```json
{
  "success": true,
  "properties": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "Beautiful 2BHK Apartment",
      "type": "residential",
      "city": "Mumbai",
      "price": 5000000,
      "status": "active"
    }
  ]
}
```

---

## 🏠 Property APIs

### Base Path: `/api/properties`

### 1️⃣ Create Property Listing
**Endpoint:** `POST /api/properties`  
**Access:** Protected  
**Role:** Landlord/Property Owner  
**Content-Type:** multipart/form-data

**Request Body:**
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
  "photos": [image1.jpg, image2.jpg], // Max 8 files
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
    "images": ["https://res.cloudinary.com/..."],
    "owner": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2023-09-05T10:30:00.000Z"
  }
}
```

---

### 2️⃣ Get All Properties
**Endpoint:** `GET /api/properties`  
**Access:** Public  
**Role:** None

**Query Parameters:**
```
?type=residential&city=Mumbai&state=Maharashtra&minPrice=1000000&maxPrice=10000000&page=1&limit=20&sort=-createdAt
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
      "address": "123 Main Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "price": 5000000,
      "property_features": {
        "size": 1200,
        "amenities": ["Parking", "Swimming Pool", "Gym"],
        "images": ["https://res.cloudinary.com/..."]
      },
      "tags": ["2bhk", "furnished", "near metro"],
      "verification_status": "verified"
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

---

### 3️⃣ Search Properties
**Endpoint:** `GET /api/properties/search`  
**Access:** Public  
**Role:** None

**Query Parameters:**
```
?q=2BHK apartment&city=Mumbai&type=residential&minPrice=1000000&maxPrice=10000000&limit=20&page=1&sort=-price
```

**Response:**
```json
{
  "success": true,
  "message": "Found 5 properties matching your search",
  "properties": [...],
  "pagination": {...},
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

---

### 4️⃣ Get Nearby Properties
**Endpoint:** `GET /api/properties/nearby`  
**Access:** Public  
**Role:** None

**Query Parameters:**
```
?latitude=19.0760&longitude=72.8777&radius=5
```

**Response:**
```json
{
  "success": true,
  "message": "Found 3 properties within 5km",
  "properties": [...],
  "searchParams": {
    "latitude": 19.0760,
    "longitude": 72.8777,
    "radius": 5,
    "radiusUnit": "km"
  }
}
```

---

### 5️⃣ Get Property by ID
**Endpoint:** `GET /api/properties/:id`  
**Access:** Public  
**Role:** None

**Response:**
```json
{
  "success": true,
  "property": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "owner_id": {...},
    "name": "Beautiful 2BHK Apartment",
    "description": "Spacious apartment...",
    "address": "123 Main Street",
    "city": "Mumbai",
    "price": 5000000,
    "property_features": {
      "size": 1200,
      "amenities": ["Parking", "Swimming Pool"],
      "images": ["https://res.cloudinary.com/..."]
    },
    "performance_metrics": {
      "views": 26,
      "leads": 3
    }
  }
}
```

---

### 6️⃣ Get My Properties
**Endpoint:** `GET /api/properties/my-properties`  
**Access:** Protected  
**Role:** Landlord/Property Owner

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
      "city": "Mumbai",
      "price": 5000000,
      "verification_status": "verified",
      "createdAt": "2023-09-05T10:30:00.000Z"
    }
  ],
  "pagination": {...}
}
```

---

### 7️⃣ Get Property Documents
**Endpoint:** `GET /api/properties/:id/documents`  
**Access:** Public  
**Role:** None

**Response:**
```json
{
  "success": true,
  "message": "Found 2 document(s) for this property",
  "property": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "name": "Beautiful 2BHK Apartment",
    "address": "123 Main Street",
    "city": "Mumbai"
  },
  "documents": [
    {
      "id": 1,
      "url": "https://res.cloudinary.com/.../deed.pdf",
      "type": "PDF",
      "filename": "deed"
    }
  ],
  "totalDocuments": 2
}
```

---

### 8️⃣ Update Property
**Endpoint:** `PUT /api/properties/:id`  
**Access:** Protected  
**Role:** Landlord/Property Owner (owner only)

**Request Body:**
```json
{
  "name": "Updated Property Name",
  "description": "Updated description",
  "price": "5500000",
  "amenities": "Parking,Swimming Pool,Gym,Security,Club House",
  "tags": "2BHK,Furnished,Near Metro,Premium"
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
    "price": 5500000,
    "updatedAt": "2023-09-05T11:00:00.000Z"
  }
}
```

---

### 9️⃣ Delete Property
**Endpoint:** `DELETE /api/properties/:id`  
**Access:** Protected  
**Role:** Landlord/Property Owner (owner only)

**Response:**
```json
{
  "success": true,
  "message": "Property deleted successfully"
}
```

---

### 🔟 Verify Property (Admin)
**Endpoint:** `PATCH /api/properties/:id/verify`  
**Access:** Protected + Admin  
**Role:** Admin

**Request Body:**
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

## 🔧 Service APIs (Tenant Side)

### Base Path: `/api/services`

### 1️⃣ Browse All Services
**Endpoint:** `GET /api/services`  
**Access:** Public  
**Role:** None

**Query Parameters:**
```
?category=Plumbing&minPrice=500&maxPrice=5000&verified=true&page=1&limit=20&sort=-createdAt
```

**Response:**
```json
{
  "success": true,
  "services": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "provider_id": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
        "name": "ABC Services",
        "phone": "+919876543210"
      },
      "service_name": "Professional Plumbing",
      "category": "Plumbing",
      "description": "Expert plumbing services for residential...",
      "base_price": 1000,
      "location": {
        "city": "Mumbai",
        "state": "Maharashtra"
      },
      "images": ["https://res.cloudinary.com/..."],
      "ratings": {
        "average": 4.5,
        "count": 120
      },
      "monositi_verified": true,
      "active_status": true
    }
  ],
  "pagination": {...}
}
```

---

### 2️⃣ Search Services
**Endpoint:** `GET /api/services/search`  
**Access:** Public  
**Role:** None

**Query Parameters:**
```
?q=plumber&city=Mumbai&category=Plumbing&minPrice=500&maxPrice=5000&verified=true&page=1&limit=20&sort=-ratings.average
```

**Response:**
```json
{
  "success": true,
  "message": "Found 5 services matching your search",
  "services": [...],
  "pagination": {...},
  "searchParams": {
    "query": "plumber",
    "city": "Mumbai",
    "category": "Plumbing",
    "minPrice": "500",
    "maxPrice": "5000"
  }
}
```

---

### 3️⃣ Get Service Categories
**Endpoint:** `GET /api/services/categories`  
**Access:** Public  
**Role:** None

**Response:**
```json
{
  "success": true,
  "categories": [
    "Plumbing",
    "Electrical",
    "Carpentry",
    "Painting",
    "Cleaning",
    "Pest Control",
    "AC Repair",
    "Appliance Repair"
  ]
}
```

---

### 4️⃣ Get Service by ID
**Endpoint:** `GET /api/services/:id`  
**Access:** Protected  
**Role:** User (Tenant)

**Response:**
```json
{
  "success": true,
  "service": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "provider_id": {...},
    "service_name": "Professional Plumbing",
    "category": "Plumbing",
    "description": "Expert plumbing services...",
    "base_price": 1000,
    "location": {
      "city": "Mumbai",
      "state": "Maharashtra",
      "coordinates": [72.8777, 19.0760]
    },
    "availability_dates": [
      "2023-09-10",
      "2023-09-11",
      "2023-09-12"
    ],
    "addons": [
      {
        "name": "Emergency Service",
        "price": 500,
        "description": "24/7 emergency support"
      }
    ],
    "images": ["https://res.cloudinary.com/..."],
    "ratings": {
      "average": 4.5,
      "count": 120
    },
    "reviews": [...]
  }
}
```

---

### 5️⃣ Create Booking
**Endpoint:** `POST /api/services/bookings`  
**Access:** Protected  
**Role:** User (Tenant)  
**Content-Type:** multipart/form-data

**Request Body:**
```json
{
  "service_id": "64f8a1b2c3d4e5f6a7b8c9d1",
  "scheduled_date": "2023-09-15T10:00:00.000Z",
  "service_address": {
    "address": "123 Main Street, Apt 4B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "lat": 19.0760,
    "lng": 72.8777
  },
  "selected_addons": ["addon_id_1", "addon_id_2"],
  "special_requests": "Please call before arriving",
  "images_before": [image1.jpg, image2.jpg] // Max 5 files
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "booking": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d5",
    "service_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "customer_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "provider_id": "64f8a1b2c3d4e5f6a7b8c9d3",
    "scheduled_date": "2023-09-15T10:00:00.000Z",
    "status": "pending",
    "total_amount": 1500,
    "service_address": {...},
    "images_before": ["https://res.cloudinary.com/..."]
  }
}
```

---

### 6️⃣ Get My Bookings
**Endpoint:** `GET /api/services/bookings/my-bookings`  
**Access:** Protected  
**Role:** User (Tenant)

**Query Parameters:**
```
?status=pending&page=1&limit=20&sort=-createdAt
```

**Response:**
```json
{
  "success": true,
  "bookings": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d5",
      "service_id": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "service_name": "Professional Plumbing",
        "category": "Plumbing"
      },
      "provider_id": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
        "name": "ABC Services",
        "phone": "+919876543210"
      },
      "scheduled_date": "2023-09-15T10:00:00.000Z",
      "status": "pending",
      "total_amount": 1500,
      "service_address": {...},
      "createdAt": "2023-09-05T10:30:00.000Z"
    }
  ],
  "pagination": {...}
}
```

---

### 7️⃣ Cancel Booking
**Endpoint:** `PATCH /api/services/bookings/:id/cancel`  
**Access:** Protected  
**Role:** User (Tenant)

**Request Body:**
```json
{
  "cancellation_reason": "Schedule changed"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "booking": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d5",
    "status": "cancelled",
    "cancellation_reason": "Schedule changed",
    "cancelled_at": "2023-09-06T10:30:00.000Z"
  }
}
```

---

### 8️⃣ Rate Service
**Endpoint:** `POST /api/services/bookings/:id/rate`  
**Access:** Protected  
**Role:** User (Tenant)

**Request Body:**
```json
{
  "rating": 5,
  "review": "Excellent service! Very professional and punctual."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Rating submitted successfully",
  "rating": {
    "booking_id": "64f8a1b2c3d4e5f6a7b8c9d5",
    "service_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "rating": 5,
    "review": "Excellent service! Very professional and punctual.",
    "created_at": "2023-09-16T10:30:00.000Z"
  },
  "service": {
    "ratings": {
      "average": 4.6,
      "count": 121
    }
  }
}
```

---

## 🛠️ Service Provider APIs

### Base Path: `/api/services/provider`

### 1️⃣ Request Provider Access
**Endpoint:** `POST /api/services/provider/request-access`  
**Access:** Protected  
**Role:** User (Tenant)  
**Content-Type:** multipart/form-data

**Request Body:**
```json
{
  "service_category": "Plumbing",
  "business_name": "ABC Plumbing Services",
  "description": "Professional plumbing services with 10+ years experience",
  "experience_years": "10",
  "documents": [license.pdf, certificate.pdf] // Max 5 files
}
```

**Response:**
```json
{
  "success": true,
  "message": "Provider access request submitted successfully",
  "request": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d6",
    "user_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "service_category": "Plumbing",
    "business_name": "ABC Plumbing Services",
    "status": "pending",
    "documents": ["https://res.cloudinary.com/..."],
    "createdAt": "2023-09-05T10:30:00.000Z"
  }
}
```

---

### 2️⃣ Create Service (Provider)
**Endpoint:** `POST /api/services/provider/create-service`  
**Access:** Protected  
**Role:** Service Provider  
**Content-Type:** multipart/form-data

**Request Body:**
```json
{
  "service_name": "Professional Plumbing Services",
  "category": "Plumbing",
  "description": "Expert plumbing solutions for all your needs",
  "base_price": "1000",
  "city": "Mumbai",
  "state": "Maharashtra",
  "lat": "19.0760",
  "lng": "72.8777",
  "availability_dates": ["2023-09-10", "2023-09-11", "2023-09-12"],
  "addons": "[{\"name\":\"Emergency Service\",\"price\":500}]",
  "tags": "24x7,Emergency,Certified",
  "images": [service1.jpg, service2.jpg], // Max 10 files
  "service_docs": [certificate.pdf] // Max 5 files
}
```

**Response:**
```json
{
  "success": true,
  "message": "Service created successfully",
  "service": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "provider_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "service_name": "Professional Plumbing Services",
    "category": "Plumbing",
    "base_price": 1000,
    "location": {
      "city": "Mumbai",
      "state": "Maharashtra",
      "coordinates": [72.8777, 19.0760]
    },
    "images": ["https://res.cloudinary.com/..."],
    "active_status": true,
    "monositi_verified": false,
    "createdAt": "2023-09-05T10:30:00.000Z"
  }
}
```

---

### 3️⃣ Get My Service
**Endpoint:** `GET /api/services/provider/my-service`  
**Access:** Protected  
**Role:** Service Provider

**Response:**
```json
{
  "success": true,
  "service": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "provider_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "service_name": "Professional Plumbing Services",
    "category": "Plumbing",
    "description": "Expert plumbing solutions...",
    "base_price": 1000,
    "location": {...},
    "availability_dates": [...],
    "addons": [...],
    "images": ["https://res.cloudinary.com/..."],
    "ratings": {
      "average": 4.5,
      "count": 120
    },
    "active_status": true,
    "monositi_verified": false
  }
}
```

---

### 4️⃣ Update Service
**Endpoint:** `PUT /api/services/provider/update-service`  
**Access:** Protected  
**Role:** Service Provider  
**Content-Type:** multipart/form-data

**Request Body:**
```json
{
  "service_name": "Updated Service Name",
  "description": "Updated description",
  "base_price": "1200",
  "tags": "24x7,Emergency,Certified,Premium",
  "images": [newimage.jpg], // Optional new images
  "service_docs": [newdoc.pdf] // Optional new docs
}
```

**Response:**
```json
{
  "success": true,
  "message": "Service updated successfully",
  "service": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "service_name": "Updated Service Name",
    "base_price": 1200,
    "updatedAt": "2023-09-06T10:30:00.000Z"
  }
}
```

---

### 5️⃣ Update Service Availability
**Endpoint:** `PATCH /api/services/provider/update-availability`  
**Access:** Protected  
**Role:** Service Provider

**Request Body:**
```json
{
  "action": "add",
  "dates": ["2023-09-20", "2023-09-21", "2023-09-22"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Availability updated successfully",
  "availability_dates": [
    "2023-09-10",
    "2023-09-11",
    "2023-09-20",
    "2023-09-21",
    "2023-09-22"
  ]
}
```

---

### 6️⃣ Manage Service Addons
**Endpoint:** `PATCH /api/services/provider/manage-addons`  
**Access:** Protected  
**Role:** Service Provider

**Request Body:**
```json
{
  "action": "add",
  "addon": {
    "name": "Weekend Service",
    "price": 300,
    "description": "Available on weekends"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Addon added successfully",
  "addons": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d7",
      "name": "Emergency Service",
      "price": 500,
      "description": "24/7 emergency support"
    },
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d8",
      "name": "Weekend Service",
      "price": 300,
      "description": "Available on weekends"
    }
  ]
}
```

---

### 7️⃣ Manage Service Images
**Endpoint:** `PATCH /api/services/provider/manage-images`  
**Access:** Protected  
**Role:** Service Provider  
**Content-Type:** multipart/form-data

**Request Body:**
```json
{
  "action": "add",
  "images": [newimage1.jpg, newimage2.jpg] // Max 10 total images
}
```

**Response:**
```json
{
  "success": true,
  "message": "Images added successfully",
  "images": [
    "https://res.cloudinary.com/monositi/service1.jpg",
    "https://res.cloudinary.com/monositi/service2.jpg",
    "https://res.cloudinary.com/monositi/newimage1.jpg",
    "https://res.cloudinary.com/monositi/newimage2.jpg"
  ]
}
```

---

### 8️⃣ Get Provider Bookings
**Endpoint:** `GET /api/services/provider/bookings`  
**Access:** Protected  
**Role:** Service Provider

**Query Parameters:**
```
?status=pending&page=1&limit=20&sort=-createdAt
```

**Response:**
```json
{
  "success": true,
  "bookings": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d5",
      "service_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "customer_id": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
        "name": "John Doe",
        "phone": "+919876543210"
      },
      "scheduled_date": "2023-09-15T10:00:00.000Z",
      "status": "pending",
      "total_amount": 1500,
      "service_address": {
        "address": "123 Main Street, Apt 4B",
        "city": "Mumbai",
        "coordinates": [72.8777, 19.0760]
      },
      "images_before": ["https://res.cloudinary.com/..."],
      "createdAt": "2023-09-05T10:30:00.000Z"
    }
  ],
  "pagination": {...}
}
```

---

### 9️⃣ Update Booking Status
**Endpoint:** `PATCH /api/services/provider/bookings/:id/status`  
**Access:** Protected  
**Role:** Service Provider

**Request Body:**
```json
{
  "status": "accepted"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking status updated to accepted",
  "booking": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d5",
    "status": "accepted",
    "accepted_at": "2023-09-06T10:30:00.000Z"
  }
}
```

---

### 🔟 Complete Booking
**Endpoint:** `PATCH /api/services/provider/bookings/:id/complete`  
**Access:** Protected  
**Role:** Service Provider  
**Content-Type:** multipart/form-data

**Request Body:**
```json
{
  "completion_notes": "Service completed successfully. Fixed main water line.",
  "images_after": [after1.jpg, after2.jpg] // Max 5 files
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking marked as completed",
  "booking": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d5",
    "status": "completed",
    "completion_notes": "Service completed successfully. Fixed main water line.",
    "images_after": ["https://res.cloudinary.com/..."],
    "completed_at": "2023-09-15T14:30:00.000Z"
  }
}
```

---

### 1️⃣1️⃣ Rate Customer
**Endpoint:** `POST /api/services/provider/bookings/:id/rate-customer`  
**Access:** Protected  
**Role:** Service Provider

**Request Body:**
```json
{
  "rating": 5,
  "review": "Very cooperative customer. Smooth experience."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Customer rating submitted successfully",
  "rating": {
    "booking_id": "64f8a1b2c3d4e5f6a7b8c9d5",
    "customer_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "provider_rating": 5,
    "provider_review": "Very cooperative customer. Smooth experience.",
    "created_at": "2023-09-16T10:30:00.000Z"
  }
}
```

---

## 👨‍💼 Admin APIs

### Base Path: `/api/admin`

### 1️⃣ Admin Dashboard
**Endpoint:** `GET /api/admin/dashboard`  
**Access:** Protected + Admin  
**Role:** Admin

**Response:**
```json
{
  "success": true,
  "dashboard": {
    "statistics": {
      "total_users": 1250,
      "total_properties": 450,
      "total_services": 120,
      "total_bookings": 890,
      "pending_verifications": {
        "properties": 15,
        "services": 8,
        "provider_requests": 5
      },
      "revenue": {
        "total": 450000,
        "this_month": 35000
      }
    },
    "recent_activities": [
      {
        "type": "property_created",
        "user": "John Doe",
        "timestamp": "2023-09-05T10:30:00.000Z"
      },
      {
        "type": "booking_completed",
        "service": "Plumbing Service",
        "timestamp": "2023-09-05T09:15:00.000Z"
      }
    ],
    "pending_approvals": [
      {
        "type": "provider_request",
        "_id": "64f8a1b2c3d4e5f6a7b8c9d6",
        "user": "ABC Services",
        "category": "Plumbing"
      }
    ]
  }
}
```

---

### 2️⃣ Get All Provider Requests
**Endpoint:** `GET /api/admin/providers/requests`  
**Access:** Protected + Admin  
**Role:** Admin

**Query Parameters:**
```
?status=pending&category=Plumbing&page=1&limit=20&sort=-createdAt
```

**Response:**
```json
{
  "success": true,
  "requests": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d6",
      "user_id": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
        "name": "ABC Services",
        "email": "abc@example.com",
        "phone": "+919876543210"
      },
      "service_category": "Plumbing",
      "business_name": "ABC Plumbing Services",
      "description": "Professional plumbing services...",
      "experience_years": 10,
      "documents": ["https://res.cloudinary.com/..."],
      "status": "pending",
      "createdAt": "2023-09-05T10:30:00.000Z"
    }
  ],
  "pagination": {...}
}
```

---

### 3️⃣ Approve Provider Request
**Endpoint:** `PATCH /api/admin/providers/requests/:id/approve`  
**Access:** Protected + Admin  
**Role:** Admin

**Response:**
```json
{
  "success": true,
  "message": "Provider request approved successfully",
  "request": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d6",
    "status": "approved",
    "approved_by": "64f8a1b2c3d4e5f6a7b8c9d3",
    "approved_at": "2023-09-06T10:30:00.000Z"
  },
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "role": "serviceProvider",
    "verification_status": "verified"
  }
}
```

---

### 4️⃣ Reject Provider Request
**Endpoint:** `PATCH /api/admin/providers/requests/:id/reject`  
**Access:** Protected + Admin  
**Role:** Admin

**Request Body:**
```json
{
  "rejection_reason": "Incomplete documentation"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Provider request rejected",
  "request": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d6",
    "status": "rejected",
    "rejection_reason": "Incomplete documentation",
    "rejected_by": "64f8a1b2c3d4e5f6a7b8c9d3",
    "rejected_at": "2023-09-06T10:30:00.000Z"
  }
}
```

---

### 5️⃣ Get All Services (Admin)
**Endpoint:** `GET /api/admin/services`  
**Access:** Protected + Admin  
**Role:** Admin

**Query Parameters:**
```
?category=Plumbing&verified=false&active=true&page=1&limit=20&sort=-createdAt
```

**Response:**
```json
{
  "success": true,
  "services": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "provider_id": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
        "name": "ABC Services",
        "phone": "+919876543210"
      },
      "service_name": "Professional Plumbing",
      "category": "Plumbing",
      "base_price": 1000,
      "location": {...},
      "ratings": {
        "average": 4.5,
        "count": 120
      },
      "monositi_verified": false,
      "active_status": true,
      "createdAt": "2023-09-05T10:30:00.000Z"
    }
  ],
  "pagination": {...}
}
```

---

### 6️⃣ Verify/Reject Service
**Endpoint:** `PATCH /api/admin/services/:id/verify`  
**Access:** Protected + Admin  
**Role:** Admin

**Request Body:**
```json
{
  "action": "verify"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Service verified successfully",
  "service": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "monositi_verified": true,
    "verified_by": "64f8a1b2c3d4e5f6a7b8c9d3",
    "verified_at": "2023-09-06T10:30:00.000Z"
  }
}
```

---

### 7️⃣ Get All Bookings (Admin)
**Endpoint:** `GET /api/admin/bookings`  
**Access:** Protected + Admin  
**Role:** Admin

**Query Parameters:**
```
?status=pending&service_id=64f8a1b2c3d4e5f6a7b8c9d1&customer_id=64f8a1b2c3d4e5f6a7b8c9d2&page=1&limit=20&sort=-createdAt
```

**Response:**
```json
{
  "success": true,
  "bookings": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d5",
      "service_id": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "service_name": "Professional Plumbing",
        "category": "Plumbing"
      },
      "customer_id": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
        "name": "John Doe",
        "phone": "+919876543210"
      },
      "provider_id": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
        "name": "ABC Services",
        "phone": "+919876543999"
      },
      "scheduled_date": "2023-09-15T10:00:00.000Z",
      "status": "pending",
      "total_amount": 1500,
      "service_address": {...},
      "createdAt": "2023-09-05T10:30:00.000Z"
    }
  ],
  "pagination": {...}
}
```

---

## 📊 Quick Reference

### API by User Role

#### 🟢 Public APIs (No Authentication)
```
GET    /api/properties
GET    /api/properties/search
GET    /api/properties/nearby
GET    /api/properties/:id
GET    /api/properties/:id/documents
GET    /api/services
GET    /api/services/search
GET    /api/services/categories
POST   /api/users/register
POST   /api/users/send-otp
POST   /api/users/verify-otp
```

#### 🔵 Tenant APIs (User Role)
```
GET    /api/users/users/me
PUT    /api/users/users/me
PATCH  /api/users/users/me/kyc
PATCH  /api/users/users/me/contact-preferences
PATCH  /api/users/users/me/role
GET    /api/users/users/me/subscription
POST   /api/users/users/me/subscription
POST   /api/services/bookings
GET    /api/services/bookings/my-bookings
PATCH  /api/services/bookings/:id/cancel
POST   /api/services/bookings/:id/rate
```

#### 🟠 Landlord/Property Owner APIs
```
POST   /api/properties (create listing)
GET    /api/properties/my-properties
PUT    /api/properties/:id
DELETE /api/properties/:id
GET    /api/users/users/me/properties
```

#### 🟣 Service Provider APIs
```
POST   /api/services/provider/request-access
POST   /api/services/provider/create-service
GET    /api/services/provider/my-service
PUT    /api/services/provider/update-service
PATCH  /api/services/provider/update-availability
PATCH  /api/services/provider/manage-addons
PATCH  /api/services/provider/manage-images
GET    /api/services/provider/bookings
PATCH  /api/services/provider/bookings/:id/status
PATCH  /api/services/provider/bookings/:id/complete
POST   /api/services/provider/bookings/:id/rate-customer
```

#### 🔴 Admin APIs
```
GET    /api/admin/dashboard
GET    /api/admin/providers/requests
PATCH  /api/admin/providers/requests/:id/approve
PATCH  /api/admin/providers/requests/:id/reject
GET    /api/admin/services
PATCH  /api/admin/services/:id/verify
GET    /api/admin/bookings
GET    /api/users/users
GET    /api/users/users/:id
PATCH  /api/users/users/:id
DELETE /api/users/users/:id
GET    /api/users/users/:id/properties
PATCH  /api/properties/:id/verify
```

---

## 📝 Common Request/Response Patterns

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

### Pagination Format
```json
{
  "pagination": {
    "current": 1,
    "total": 5,
    "count": 20,
    "totalCount": 95
  }
}
```

### File Upload Limits
- **Property Photos:** Max 8 files, 5MB each
- **Property Documents:** Max 6 files, 10MB each
- **Service Images:** Max 10 files, 5MB each
- **Service Documents:** Max 5 files, 10MB each
- **KYC Documents:** Max 5 files, 10MB each
- **Booking Images:** Max 5 files (before/after), 5MB each

### Common Query Parameters
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `sort` - Sort field (e.g., -createdAt, price)
- `status` - Filter by status
- `search` or `q` - Search query

---

## 🔒 Security Notes

1. **JWT Tokens** expire after 7 days
2. **File uploads** are validated for type and size
3. **Owner-only operations** check ownership
4. **Admin operations** require admin role
5. **Rate limiting** applied on all endpoints
6. **Input validation** on all request bodies

---

**Last Updated:** October 2023  
**Version:** 2.0.0  
**Base URL:** http://localhost:5000/api  
**Documentation:** Complete API reference for Monositi platform
