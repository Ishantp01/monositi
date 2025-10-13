# 🚀 Monositi Service Management API Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Provider APIs](#provider-apis)
4. [Service APIs](#service-apis)
5. [Admin APIs](#admin-apis)
6. [Testing Guide](#testing-guide)
7. [Error Handling](#error-handling)

---

## 🔍 Overview

The Monositi Service Management System provides comprehensive APIs for:
- **Service Provider Onboarding** - Request access and create services
- **Service Management** - Create, update, and manage services
- **Booking Management** - Handle service bookings and completion
- **Admin Oversight** - Manage providers, services, and bookings

### Base URL
```
http://localhost:5000/api
```

### Authentication
All APIs require JWT authentication except public service discovery endpoints.

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

## 👨‍💼 Provider APIs

### 1. Request Provider Access
**Endpoint:** `POST /api/providers/request-access`

**Description:** Allows tenants to request becoming a service provider.

**Headers:**
```json
{
  "Authorization": "Bearer <jwt_token>"
}
```

**Body (multipart/form-data):**
```json
{
  "service_category": "plumbing",
  "description": "Professional plumbing services",
  "documents": [file1.pdf, file2.pdf] // Max 5 files
}
```

**Response:**
```json
{
  "success": true,
  "message": "Provider access request submitted successfully",
  "request": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "service_category": "plumbing",
    "description": "Professional plumbing services",
    "documents": [
      "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/monositi/provider_docs/file1.pdf"
    ],
    "status": "pending",
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890"
    },
    "createdAt": "2023-09-05T10:30:00.000Z"
  }
}
```

### 2. Create First Service (Become Provider)
**Endpoint:** `POST /api/providers/create-service`

**Description:** Creates the first service and automatically makes user a service provider.

**Headers:**
```json
{
  "Authorization": "Bearer <jwt_token>"
}
```

**Body (multipart/form-data):**
```json
{
  "service_name": "Emergency Plumbing Repair",
  "category": "plumbing",
  "description": "24/7 emergency plumbing services",
  "base_price": "150",
  "variable_price": "true",
  "location": "{\"address\":\"123 Main St\",\"city\":\"New York\",\"state\":\"NY\",\"coordinates\":{\"lat\":40.7128,\"lng\":-74.0060}}",
  "addons": "[{\"name\":\"Weekend Service\",\"price\":50},{\"name\":\"Emergency Call\",\"price\":75}]",
  "tags": "[\"emergency\",\"24-7\",\"licensed\"]",
  "availability_calendar": "[\"2023-09-06\",\"2023-09-07\",\"2023-09-08\"]",
  "images": [image1.jpg, image2.jpg], // Max 10 files
  "service_docs": [license.pdf, insurance.pdf] // Max 5 files
}
```

**Response:**
```json
{
  "success": true,
  "message": "Service created successfully and you are now a service provider",
  "service": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "service_name": "Emergency Plumbing Repair",
    "category": "plumbing",
    "description": "24/7 emergency plumbing services",
    "base_price": 150,
    "variable_price": true,
    "active_status": true,
    "monositi_verified": false,
    "images": [
      "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/monositi/services/image1.jpg"
    ],
    "createdAt": "2023-09-05T10:30:00.000Z"
  }
}
```

### 3. Get Provider's Service
**Endpoint:** `GET /api/providers/my-service`

**Description:** Retrieves the logged-in provider's service details.

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
  "service": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "service_name": "Emergency Plumbing Repair",
    "category": "plumbing",
    "description": "24/7 emergency plumbing services",
    "base_price": 150,
    "variable_price": true,
    "availability_calendar": ["2023-09-06", "2023-09-07"],
    "location": {
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "coordinates": {
        "lat": 40.7128,
        "lng": -74.0060
      }
    },
    "addons": [
      {"name": "Weekend Service", "price": 50},
      {"name": "Emergency Call", "price": 75}
    ],
    "tags": ["emergency", "24-7", "licensed"],
    "images": ["https://res.cloudinary.com/..."],
    "service_docs": ["https://res.cloudinary.com/..."],
    "active_status": true,
    "monositi_verified": false,
    "ratings": [],
    "createdAt": "2023-09-05T10:30:00.000Z",
    "updatedAt": "2023-09-05T10:30:00.000Z"
  }
}
```

### 4. Update Provider Service
**Endpoint:** `PUT /api/providers/update-service`

**Description:** Updates the provider's service details.

**Headers:**
```json
{
  "Authorization": "Bearer <jwt_token>"
}
```

**Body (multipart/form-data):**
```json
{
  "service_name": "Updated Plumbing Service",
  "description": "Updated description",
  "base_price": "200",
  "images": [new_image.jpg], // Optional: new images
  "service_docs": [new_doc.pdf] // Optional: new documents
}
```

**Response:**
```json
{
  "success": true,
  "message": "Service updated successfully",
  "service": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "service_name": "Updated Plumbing Service",
    "category": "plumbing",
    "description": "Updated description",
    "base_price": 200,
    "variable_price": true,
    "active_status": true,
    "monositi_verified": false,
    "ratings": [],
    "updatedAt": "2023-09-05T11:00:00.000Z"
  }
}
```

### 5. Update Service Availability
**Endpoint:** `PATCH /api/providers/update-availability`

**Description:** Manages the service availability calendar.

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
  "action": "add", // "add", "remove", or "replace"
  "dates": ["2023-09-10", "2023-09-11", "2023-09-12"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Availability added successfully",
  "total_dates": 5,
  "availability_calendar": ["2023-09-06", "2023-09-07", "2023-09-10", "2023-09-11", "2023-09-12"]
}
```

### 6. Manage Service Addons
**Endpoint:** `PATCH /api/providers/manage-addons`

**Description:** Adds, updates, or removes service addons.

**Headers:**
```json
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}
```

**Body (Add Addon):**
```json
{
  "action": "add",
  "addon": {
    "name": "Premium Service",
    "price": 100
  }
}
```

**Body (Update Addon):**
```json
{
  "action": "update",
  "addon": {
    "index": 0,
    "name": "Updated Premium Service",
    "price": 120
  }
}
```

**Body (Remove Addon):**
```json
{
  "action": "remove",
  "addon": {
    "index": 0
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Addon added successfully",
  "total_addons": 3,
  "addons": [
    {"name": "Weekend Service", "price": 50},
    {"name": "Emergency Call", "price": 75},
    {"name": "Premium Service", "price": 100}
  ]
}
```

### 7. Manage Service Images
**Endpoint:** `PATCH /api/providers/manage-images`

**Description:** Adds or removes service images.

**Headers:**
```json
{
  "Authorization": "Bearer <jwt_token>"
}
```

**Body (Add Images - multipart/form-data):**
```json
{
  "action": "add",
  "images": [image1.jpg, image2.jpg] // Max 10 total images
}
```

**Body (Remove Image - application/json):**
```json
{
  "action": "remove",
  "imageIndex": 0
}
```

**Response:**
```json
{
  "success": true,
  "message": "Images added successfully",
  "total_images": 3,
  "images": [
    "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/monositi/services/image1.jpg",
    "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/monositi/services/image2.jpg",
    "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/monositi/services/image3.jpg"
  ]
}
```

### 8. Get Provider Bookings
**Endpoint:** `GET /api/providers/bookings`

**Description:** Retrieves all bookings for the logged-in provider.

**Headers:**
```json
{
  "Authorization": "Bearer <jwt_token>"
}
```

**Query Parameters:**
```
?page=1&limit=10&status=pending
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "totalCount": 5,
  "currentPage": 1,
  "totalPages": 1,
  "bookings": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
      "service": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
        "service_name": "Emergency Plumbing Repair",
        "category": "plumbing",
        "base_price": 150,
        "images": ["https://res.cloudinary.com/..."]
      },
      "customer": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d4",
        "name": "Jane Smith",
        "phone": "+1234567891",
        "email": "jane@example.com"
      },
      "scheduled_for": "2023-09-06T14:00:00.000Z",
      "status": "pending",
      "total_amount": 200,
      "notes": "Customer needs urgent repair",
      "images_before": ["https://res.cloudinary.com/..."],
      "service_address": {
        "address": "456 Oak St",
        "city": "New York",
        "coordinates": [40.7589, -73.9851]
      },
      "createdAt": "2023-09-05T12:00:00.000Z"
    }
  ]
}
```

### 9. Update Booking Status
**Endpoint:** `PATCH /api/providers/bookings/:id/status`

**Description:** Accept or reject a booking.

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
  "status": "accepted", // "accepted" or "rejected"
  "notes": "I'll be there at the scheduled time"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking accepted successfully",
  "booking": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
    "service": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "service_name": "Emergency Plumbing Repair",
      "category": "plumbing"
    },
    "customer": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d4",
      "name": "Jane Smith",
      "phone": "+1234567891",
      "email": "jane@example.com"
    },
    "scheduled_for": "2023-09-06T14:00:00.000Z",
    "status": "accepted",
    "total_amount": 200,
    "notes": "Customer needs urgent repair\nProvider: I'll be there at the scheduled time",
    "images_before": ["https://res.cloudinary.com/..."],
    "service_address": {
      "address": "456 Oak St",
      "city": "New York",
      "coordinates": [40.7589, -73.9851]
    },
    "updatedAt": "2023-09-05T13:00:00.000Z"
  }
}
```

### 10. Complete Booking
**Endpoint:** `PATCH /api/providers/bookings/:id/complete`

**Description:** Mark a booking as completed with after-service images.

**Headers:**
```json
{
  "Authorization": "Bearer <jwt_token>"
}
```

**Body (multipart/form-data):**
```json
{
  "completion_notes": "Service completed successfully. Replaced the faulty pipe.",
  "images_after": [after1.jpg, after2.jpg] // Max 5 files
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking marked as completed successfully",
  "booking": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
    "service": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "service_name": "Emergency Plumbing Repair",
      "category": "plumbing"
    },
    "customer": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d4",
      "name": "Jane Smith",
      "phone": "+1234567891",
      "email": "jane@example.com"
    },
    "scheduled_for": "2023-09-06T14:00:00.000Z",
    "status": "completed",
    "total_amount": 200,
    "notes": "Customer needs urgent repair\nProvider: I'll be there at the scheduled time",
    "images_before": ["https://res.cloudinary.com/..."],
    "images_after": ["https://res.cloudinary.com/your-cloud/image/upload/v1234567890/monositi/bookings/after/after1.jpg"],
    "service_address": {
      "address": "456 Oak St",
      "city": "New York",
      "coordinates": [40.7589, -73.9851]
    },
    "completion_notes": "Service completed successfully. Replaced the faulty pipe.",
    "updatedAt": "2023-09-06T16:00:00.000Z"
  }
}
```

### 11. Rate Customer
**Endpoint:** `POST /api/providers/bookings/:id/rate-customer`

**Description:** Rate and review a customer after service completion.

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
  "rating": 5,
  "review": "Great customer, very cooperative and understanding."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Customer rated successfully",
  "booking": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
    "service": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "service_name": "Emergency Plumbing Repair",
      "category": "plumbing"
    },
    "customer": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d4",
      "name": "Jane Smith",
      "phone": "+1234567891",
      "email": "jane@example.com"
    },
    "provider_rating": 5,
    "provider_review": "Great customer, very cooperative and understanding.",
    "updatedAt": "2023-09-06T17:00:00.000Z"
  }
}
```

---

## 🏠 Service APIs (Tenant/Customer)

### 1. Browse All Services
**Endpoint:** `GET /api/services`

**Description:** Browse all active services with filtering and pagination.

**Query Parameters:**
```
?page=1&limit=10&category=plumbing&min_price=100&max_price=500&verified=true&sort=price_asc
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "totalCount": 15,
  "currentPage": 1,
  "totalPages": 2,
  "services": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "service_name": "Emergency Plumbing Repair",
      "category": "plumbing",
      "description": "24/7 emergency plumbing services",
      "base_price": 150,
      "variable_price": true,
      "images": ["https://res.cloudinary.com/..."],
      "location": {
        "address": "123 Main St",
        "city": "New York",
        "state": "NY"
      },
      "addons": [
        {"name": "Weekend Service", "price": 50},
        {"name": "Emergency Call", "price": 75}
      ],
      "tags": ["emergency", "24-7", "licensed"],
      "active_status": true,
      "monositi_verified": true,
      "ratings": {
        "average": 4.5,
        "count": 12
      },
      "provider": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "name": "John Doe",
        "phone": "+1234567890"
      },
      "createdAt": "2023-09-05T10:30:00.000Z"
    }
  ]
}
```

### 2. Advanced Service Search
**Endpoint:** `GET /api/services/search`

**Description:** Advanced search with multiple filters.

**Query Parameters:**
```
?q=plumbing&category=plumbing&location=New York&min_price=100&max_price=500&tags=emergency&verified=true&sort=rating_desc&page=1&limit=10
```

**Response:** Same as browse all services

### 3. Get Service Categories
**Endpoint:** `GET /api/services/categories`

**Description:** Get all available service categories.

**Response:**
```json
{
  "success": true,
  "categories": [
    "plumbing",
    "electrical",
    "hvac",
    "cleaning",
    "maintenance",
    "renovation"
  ]
}
```

### 4. Get Service by ID
**Endpoint:** `GET /api/services/:id`

**Description:** Get detailed information about a specific service.

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
  "service": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "service_name": "Emergency Plumbing Repair",
    "category": "plumbing",
    "description": "24/7 emergency plumbing services",
    "base_price": 150,
    "variable_price": true,
    "availability_calendar": ["2023-09-06", "2023-09-07"],
    "location": {
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "coordinates": {
        "lat": 40.7128,
        "lng": -74.0060
      }
    },
    "addons": [
      {"name": "Weekend Service", "price": 50},
      {"name": "Emergency Call", "price": 75}
    ],
    "tags": ["emergency", "24-7", "licensed"],
    "images": ["https://res.cloudinary.com/..."],
    "service_docs": ["https://res.cloudinary.com/..."],
    "active_status": true,
    "monositi_verified": true,
    "ratings": {
      "average": 4.5,
      "count": 12,
      "reviews": [
        {
          "rating": 5,
          "review": "Excellent service!",
          "customer": "Jane Smith",
          "createdAt": "2023-09-01T10:00:00.000Z"
        }
      ]
    },
    "provider": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "John Doe",
      "phone": "+1234567890",
      "email": "john@example.com"
    },
    "createdAt": "2023-09-05T10:30:00.000Z",
    "updatedAt": "2023-09-05T10:30:00.000Z"
  }
}
```

### 5. Create Booking
**Endpoint:** `POST /api/services/bookings`

**Description:** Book a service as a tenant/customer.

**Headers:**
```json
{
  "Authorization": "Bearer <jwt_token>"
}
```

**Body (multipart/form-data):**
```json
{
  "service_id": "64f8a1b2c3d4e5f6a7b8c9d2",
  "scheduled_for": "2023-09-06T14:00:00.000Z",
  "notes": "Urgent repair needed",
  "selected_addons": "[{\"name\":\"Emergency Call\",\"price\":75}]",
  "service_address": "{\"address\":\"456 Oak St\",\"city\":\"New York\",\"coordinates\":[40.7589,-73.9851]}",
  "images_before": [before1.jpg, before2.jpg] // Max 5 files
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "booking": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
    "service": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "service_name": "Emergency Plumbing Repair",
      "category": "plumbing",
      "provider": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "name": "John Doe",
        "phone": "+1234567890"
      }
    },
    "customer": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d4",
      "name": "Jane Smith",
      "phone": "+1234567891",
      "email": "jane@example.com"
    },
    "scheduled_for": "2023-09-06T14:00:00.000Z",
    "status": "pending",
    "total_amount": 225,
    "notes": "Urgent repair needed",
    "images_before": ["https://res.cloudinary.com/your-cloud/image/upload/v1234567890/monositi/bookings/before/before1.jpg"],
    "service_address": {
      "address": "456 Oak St",
      "city": "New York",
      "coordinates": [40.7589, -73.9851]
    },
    "createdAt": "2023-09-05T12:00:00.000Z"
  }
}
```

### 6. Get Customer Bookings
**Endpoint:** `GET /api/services/bookings/my-bookings`

**Description:** Get all bookings for the logged-in customer.

**Headers:**
```json
{
  "Authorization": "Bearer <jwt_token>"
}
```

**Query Parameters:**
```
?page=1&limit=10&status=pending
```

**Response:**
```json
{
  "success": true,
  "count": 1,
  "totalCount": 3,
  "currentPage": 1,
  "totalPages": 1,
  "bookings": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
      "service": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
        "service_name": "Emergency Plumbing Repair",
        "category": "plumbing",
        "base_price": 150,
        "images": ["https://res.cloudinary.com/..."]
      },
      "provider": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "name": "John Doe",
        "phone": "+1234567890",
        "email": "john@example.com"
      },
      "scheduled_for": "2023-09-06T14:00:00.000Z",
      "status": "pending",
      "total_amount": 225,
      "notes": "Urgent repair needed",
      "images_before": ["https://res.cloudinary.com/..."],
      "service_address": {
        "address": "456 Oak St",
        "city": "New York",
        "coordinates": [40.7589, -73.9851]
      },
      "createdAt": "2023-09-05T12:00:00.000Z"
    }
  ]
}
```

### 7. Cancel Booking
**Endpoint:** `PATCH /api/services/bookings/:id/cancel`

**Description:** Cancel a booking (only if status is pending).

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
  "cancellation_reason": "Schedule conflict"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "booking": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
    "status": "cancelled",
    "cancellation_reason": "Schedule conflict",
    "updatedAt": "2023-09-05T13:00:00.000Z"
  }
}
```

### 8. Rate Service
**Endpoint:** `POST /api/services/bookings/:id/rate`

**Description:** Rate and review a completed service.

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
  "rating": 5,
  "review": "Excellent service! Very professional and completed on time."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Service rated successfully",
  "booking": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
    "customer_rating": 5,
    "customer_review": "Excellent service! Very professional and completed on time.",
    "updatedAt": "2023-09-06T18:00:00.000Z"
  },
  "service": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "ratings": {
      "average": 4.6,
      "count": 13
    }
  }
}
```

---

## 👨‍💼 Admin APIs

### 1. Admin Dashboard
**Endpoint:** `GET /api/admin/dashboard`

**Description:** Get admin dashboard statistics and recent activities.

**Headers:**
```json
{
  "Authorization": "Bearer <admin_jwt_token>"
}
```

**Response:**
```json
{
  "success": true,
  "dashboard": {
    "stats": {
      "totalUsers": 150,
      "totalProviders": 25,
      "totalServices": 30,
      "totalBookings": 200,
      "pendingRequests": 5,
      "activeServices": 28,
      "verifiedServices": 20,
      "completedBookings": 180,
      "pendingBookings": 15
    },
    "recentActivities": {
      "requests": [
        {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d5",
          "service_category": "plumbing",
          "description": "Professional plumbing services",
          "status": "pending",
          "user": {
            "_id": "64f8a1b2c3d4e5f6a7b8c9d6",
            "name": "Mike Johnson",
            "email": "mike@example.com",
            "phone": "+1234567892"
          },
          "createdAt": "2023-09-05T09:00:00.000Z"
        }
      ],
      "bookings": [
        {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
          "service": {
            "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
            "service_name": "Emergency Plumbing Repair",
            "category": "plumbing"
          },
          "customer": {
            "_id": "64f8a1b2c3d4e5f6a7b8c9d4",
            "name": "Jane Smith",
            "email": "jane@example.com"
          },
          "provider": {
            "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
            "name": "John Doe",
            "email": "john@example.com"
          },
          "status": "completed",
          "total_amount": 225,
          "createdAt": "2023-09-05T12:00:00.000Z"
        }
      ]
    }
  }
}
```

### 2. Get All Provider Requests
**Endpoint:** `GET /api/admin/providers/requests`

**Description:** Get all provider access requests with filtering.

**Headers:**
```json
{
  "Authorization": "Bearer <admin_jwt_token>"
}
```

**Query Parameters:**
```
?page=1&limit=10&status=pending&category=plumbing
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "totalCount": 5,
  "currentPage": 1,
  "totalPages": 1,
  "requests": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d5",
      "service_category": "plumbing",
      "description": "Professional plumbing services",
      "documents": ["https://res.cloudinary.com/..."],
      "status": "pending",
      "user": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d6",
        "name": "Mike Johnson",
        "email": "mike@example.com",
        "phone": "+1234567892"
      },
      "createdAt": "2023-09-05T09:00:00.000Z"
    }
  ]
}
```

### 3. Approve Provider Request
**Endpoint:** `PATCH /api/admin/providers/requests/:id/approve`

**Description:** Approve a provider access request.

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
  "admin_comment": "Documents verified. Approved for plumbing services."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Provider request approved successfully",
  "request": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d5",
    "status": "approved",
    "admin_comment": "Documents verified. Approved for plumbing services.",
    "updatedAt": "2023-09-05T11:00:00.000Z"
  },
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d6",
    "role": "serviceProvider",
    "verification_status": "verified"
  }
}
```

### 4. Reject Provider Request
**Endpoint:** `PATCH /api/admin/providers/requests/:id/reject`

**Description:** Reject a provider access request.

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
  "admin_comment": "Incomplete documentation. Please resubmit with proper licenses."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Provider request rejected successfully",
  "request": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d5",
    "status": "rejected",
    "admin_comment": "Incomplete documentation. Please resubmit with proper licenses.",
    "updatedAt": "2023-09-05T11:00:00.000Z"
  }
}
```

### 5. Get All Services (Admin)
**Endpoint:** `GET /api/admin/services`

**Description:** Get all services with admin-level details and filtering.

**Headers:**
```json
{
  "Authorization": "Bearer <admin_jwt_token>"
}
```

**Query Parameters:**
```
?page=1&limit=10&verified=false&active=true&category=plumbing&sort=createdAt_desc
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "totalCount": 30,
  "currentPage": 1,
  "totalPages": 3,
  "services": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "service_name": "Emergency Plumbing Repair",
      "category": "plumbing",
      "description": "24/7 emergency plumbing services",
      "base_price": 150,
      "variable_price": true,
      "active_status": true,
      "monositi_verified": false,
      "ratings": {
        "average": 4.5,
        "count": 12
      },
      "provider": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890"
      },
      "createdAt": "2023-09-05T10:30:00.000Z",
      "updatedAt": "2023-09-05T10:30:00.000Z"
    }
  ]
}
```

### 6. Verify/Reject Service
**Endpoint:** `PATCH /api/admin/services/:id/verify`

**Description:** Verify or reject a service.

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
  "action": "verify", // "verify" or "reject"
  "admin_comment": "Service meets all requirements. Verified."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Service verified successfully",
  "service": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "monositi_verified": true,
    "updatedAt": "2023-09-05T12:00:00.000Z"
  }
}
```

### 7. Get All Bookings (Admin)
**Endpoint:** `GET /api/admin/bookings`

**Description:** Get all bookings with admin-level details and filtering.

**Headers:**
```json
{
  "Authorization": "Bearer <admin_jwt_token>"
}
```

**Query Parameters:**
```
?page=1&limit=10&status=completed&category=plumbing&sort=createdAt_desc
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "totalCount": 200,
  "currentPage": 1,
  "totalPages": 20,
  "bookings": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
      "service": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
        "service_name": "Emergency Plumbing Repair",
        "category": "plumbing"
      },
      "customer": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d4",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "phone": "+1234567891"
      },
      "provider": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890"
      },
      "scheduled_for": "2023-09-06T14:00:00.000Z",
      "status": "completed",
      "total_amount": 225,
      "notes": "Urgent repair needed",
      "images_before": ["https://res.cloudinary.com/..."],
      "images_after": ["https://res.cloudinary.com/..."],
      "service_address": {
        "address": "456 Oak St",
        "city": "New York",
        "coordinates": [40.7589, -73.9851]
      },
      "completion_notes": "Service completed successfully. Replaced the faulty pipe.",
      "customer_rating": 5,
      "customer_review": "Excellent service!",
      "provider_rating": 5,
      "provider_review": "Great customer!",
      "createdAt": "2023-09-05T12:00:00.000Z",
      "updatedAt": "2023-09-06T17:00:00.000Z"
    }
  ]
}
```

---

## 🧪 Testing Guide

### Prerequisites
1. **Postman** installed
2. **Backend server** running on `http://localhost:5000`
3. **Valid JWT tokens** for different user roles:
   - Tenant/Customer token
   - Service Provider token
   - Admin token

### Test Data Setup

#### 1. Create Test Users
```bash
# Register a tenant
POST http://localhost:5000/api/auth/register
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "password123",
  "phone": "+1234567891",
  "role": "tenant"
}

# Register a service provider
POST http://localhost:5000/api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "role": "serviceProvider"
}

# Register an admin
POST http://localhost:5000/api/auth/register
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123",
  "phone": "+1234567899",
  "role": "admin"
}
```

#### 2. Login to Get Tokens
```bash
# Login as tenant
POST http://localhost:5000/api/auth/login
{
  "email": "jane@example.com",
  "password": "password123"
}

# Login as service provider
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

#### Phase 1: Provider Onboarding
1. **Request Provider Access** (as tenant)
   - Use tenant token
   - Upload documents
   - Verify pending status

2. **Approve Provider Request** (as admin)
   - Use admin token
   - Approve the request
   - Verify user role change

#### Phase 2: Service Management
3. **Create First Service** (as approved provider)
   - Use provider token
   - Upload service images and documents
   - Verify service creation

4. **Update Service** (as provider)
   - Modify service details
   - Upload additional images
   - Verify updates

5. **Manage Availability** (as provider)
   - Add/remove availability dates
   - Verify calendar updates

6. **Manage Addons** (as provider)
   - Add new addons
   - Update existing addons
   - Remove addons

#### Phase 3: Service Discovery & Booking
7. **Browse Services** (as tenant)
   - Search and filter services
   - View service details

8. **Create Booking** (as tenant)
   - Book a service
   - Upload before images
   - Verify booking creation

#### Phase 4: Booking Management
9. **Accept/Reject Booking** (as provider)
   - Review booking details
   - Accept or reject booking

10. **Complete Booking** (as provider)
    - Mark booking as completed
    - Upload after images
    - Add completion notes

11. **Rate Service** (as customer)
    - Rate completed service
    - Add review

12. **Rate Customer** (as provider)
    - Rate customer
    - Add provider review

#### Phase 5: Admin Oversight
13. **Admin Dashboard** (as admin)
    - View statistics
    - Review recent activities

14. **Manage Services** (as admin)
    - Verify/reject services
    - View all services

15. **Manage Bookings** (as admin)
    - View all bookings
    - Monitor system activity

### Postman Collection Setup

#### Environment Variables
Create a Postman environment with:
```json
{
  "base_url": "http://localhost:5000/api",
  "tenant_token": "{{tenant_jwt_token}}",
  "provider_token": "{{provider_jwt_token}}",
  "admin_token": "{{admin_jwt_token}}"
}
```

#### Collection Structure
```
Monositi Service Management
├── Authentication
│   ├── Register User
│   └── Login User
├── Provider APIs
│   ├── Request Provider Access
│   ├── Create First Service
│   ├── Get Provider Service
│   ├── Update Provider Service
│   ├── Update Availability
│   ├── Manage Addons
│   ├── Manage Images
│   ├── Get Provider Bookings
│   ├── Update Booking Status
│   ├── Complete Booking
│   └── Rate Customer
├── Service APIs
│   ├── Browse All Services
│   ├── Search Services
│   ├── Get Service Categories
│   ├── Get Service by ID
│   ├── Create Booking
│   ├── Get Customer Bookings
│   ├── Cancel Booking
│   └── Rate Service
└── Admin APIs
    ├── Admin Dashboard
    ├── Get Provider Requests
    ├── Approve Provider Request
    ├── Reject Provider Request
    ├── Get All Services
    ├── Verify Service
    └── Get All Bookings
```

### File Upload Testing

#### Test Images
Create test images with these specifications:
- **Format:** JPG, PNG
- **Size:** 1-5 MB each
- **Dimensions:** 800x600 or similar
- **Content:** Sample service images

#### Test Documents
Create test documents:
- **Format:** PDF
- **Size:** 1-10 MB
- **Content:** Sample licenses, certificates

#### Cloudinary Testing
Verify Cloudinary uploads by:
1. Checking response URLs
2. Accessing uploaded files
3. Verifying folder structure:
   - `monositi/provider_docs/`
   - `monositi/services/`
   - `monositi/service_docs/`
   - `monositi/bookings/before/`
   - `monositi/bookings/after/`

### Error Testing

#### Test Error Scenarios
1. **Invalid Authentication**
   - Missing token
   - Expired token
   - Wrong role permissions

2. **Invalid Data**
   - Missing required fields
   - Invalid JSON format
   - Invalid file types

3. **Business Logic Errors**
   - Duplicate requests
   - Invalid booking status changes
   - Unauthorized access attempts

#### Expected Error Responses
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

---

## ⚠️ Error Handling

### Common Error Codes
- **400** - Bad Request (validation errors)
- **401** - Unauthorized (missing/invalid token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found (resource doesn't exist)
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
      "field": "service_name",
      "message": "Service name is required"
    },
    {
      "field": "base_price",
      "message": "Base price must be a positive number"
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
- **Images:** Max 10 files, 5MB each
- **Documents:** Max 5 files, 10MB each
- **Total request size:** 50MB

### Rate Limiting
- **Authentication endpoints:** 5 requests per minute
- **File upload endpoints:** 10 requests per minute
- **General API endpoints:** 100 requests per minute

---

## 📝 Notes

### Security Considerations
1. **JWT tokens** expire after 7 days
2. **File uploads** are validated for type and size
3. **Sensitive fields** are protected from updates
4. **Role-based access** is enforced on all endpoints

### Performance Considerations
1. **Pagination** is implemented for all list endpoints
2. **Database indexes** are optimized for common queries
3. **File uploads** use Cloudinary for CDN delivery
4. **Caching** can be implemented for frequently accessed data

### Future Enhancements
1. **Real-time notifications** for booking updates
2. **Payment integration** for service payments
3. **Advanced search** with geolocation
4. **Analytics dashboard** for providers
5. **Mobile app** API optimization

---

**Last Updated:** September 2023  
**Version:** 1.0.0  
**Maintainer:** Monositi Development Team
