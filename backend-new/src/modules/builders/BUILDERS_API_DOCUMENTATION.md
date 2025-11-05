# Builders Module API Documentation

## Overview
The Builders module manages real estate builders/developers and their projects. It's designed for the "Buy" section, allowing admins to showcase builder projects with complete unit configurations, pricing, and availability tracking.

**Base Route:** `/api/builders`

---

## 📋 Table of Contents
1. [Authentication](#authentication)
2. [Builder Management (Admin Only)](#builder-management-admin-only)
3. [Project Management (Admin Only)](#project-management-admin-only)
4. [Public APIs (User-Facing)](#public-apis-user-facing)
5. [Data Models](#data-models)
6. [Workflow Examples](#workflow-examples)

---

## 🔐 Authentication

### Admin Routes
All admin routes require:
- **Authorization Header:** `Bearer <JWT_TOKEN>`
- **User Role:** `admin`

### Public Routes
No authentication required for `/public/*` endpoints.

---

## 🏢 Builder Management (Admin Only)

### 1. Create New Builder
**POST** `/api/builders`

Create a new builder/developer company.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```

**Body (form-data):**
```javascript
{
  "name": "Lodha Group",                       // Required
  "description": "Leading real estate developer",
  "founded_year": 1980,
  "phone": "+91-9876543210",
  "email": "info@lodha.com",
  "address": "Mumbai, Maharashtra",
  "website": "https://lodhagroup.com",
  "certifications": ["RERA", "ISO 9001"],     // JSON array or actual array
  "total_projects_completed": 50,
  "logo": File                                 // Single image file
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Builder created successfully",
  "data": {
    "_id": "64builder123...",
    "name": "Lodha Group",
    "logo": "https://cloudinary.com/...",
    "description": "Leading real estate developer",
    "founded_year": 1980,
    "contact_info": {
      "phone": "+91-9876543210",
      "email": "info@lodha.com",
      "address": "Mumbai, Maharashtra"
    },
    "website": "https://lodhagroup.com",
    "certifications": ["RERA", "ISO 9001"],
    "total_projects_completed": 50,
    "rating": 0,
    "monositi_verified": false,
    "status": "active",
    "createdBy": "64admin...",
    "createdAt": "2025-01-01T10:00:00.000Z"
  }
}
```

---

### 2. Get All Builders
**GET** `/api/builders?status=&verified=`

Fetch all builders with optional filters.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**
- `status` - Filter by status (active | inactive)
- `verified` - Filter by verification (true | false)

**Example:**
```
GET /api/builders?status=active&verified=true
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "64builder123...",
      "name": "Lodha Group",
      "logo": "https://cloudinary.com/...",
      "rating": 4.5,
      "monositi_verified": true,
      "total_projects_completed": 50,
      "createdBy": {
        "_id": "64admin...",
        "name": "Admin User",
        "email": "admin@monositi.com"
      }
    }
  ]
}
```

---

### 3. Get Single Builder
**GET** `/api/builders/:id`

Get detailed information about a specific builder.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64builder123...",
    "name": "Lodha Group",
    "logo": "https://cloudinary.com/...",
    "description": "Leading real estate developer",
    "contact_info": {...},
    "projectsCount": 25,
    "rating": 4.5,
    "monositi_verified": true
  }
}
```

---

### 4. Update Builder
**PUT** `/api/builders/:id`

Update builder details.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```

**Body (form-data):**
```javascript
{
  "name": "Updated Name",                      // Optional
  "description": "Updated description",        // Optional
  "rating": 4.5,                              // Optional
  "status": "active",                         // Optional
  "logo": File                                // Optional - new logo
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Builder updated successfully",
  "data": {...}
}
```

---

### 5. Verify/Unverify Builder
**PATCH** `/api/builders/:id/verify`

Mark a builder as verified or unverified.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body:**
```json
{
  "verified": true  // or false
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Builder verified successfully",
  "data": {
    "_id": "64builder123...",
    "monositi_verified": true,
    ...
  }
}
```

---

### 6. Delete Builder
**DELETE** `/api/builders/:id`

Delete a builder (also deletes all associated projects).

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Builder and associated projects deleted successfully"
}
```

---

## 🏗️ Project Management (Admin Only)

### 1. Create New Project
**POST** `/api/builders/:builderId/projects`

Create a new project for a builder.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```

**Body (form-data):**
```javascript
{
  "project_name": "Lodha The Park",           // Required
  "description": "Premium residential project",
  "address": "Worli, Mumbai",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400018",
  "coordinates": "{\"lng\": 72.8181, \"lat\": 18.9894}",  // Optional JSON string
  "project_type": "residential",              // residential | commercial | mixed
  "status": "ongoing",                        // upcoming | ongoing | completed | ready_to_move
  "possession_date": "2026-12-31",
  "rera_number": "P51900000123",
  "total_units": 200,
  "available_units": 150,
  "price_min": 15000000,                      // ₹1.5 Crore
  "price_max": 50000000,                      // ₹5 Crore
  "unit_configurations": "[{\"type\":\"2BHK\",\"carpet_area\":\"850 sq ft\",\"price\":20000000,\"total_units\":80,\"available_units\":60},{\"type\":\"3BHK\",\"carpet_area\":\"1200 sq ft\",\"price\":35000000,\"total_units\":120,\"available_units\":90}]",
  "amenities": ["Swimming Pool", "Gym", "Club House", "Garden"],
  "images": [File, File, ...],                // Max 15 images
  "documents": [File, File]                   // Max 10 docs (brochures, etc.)
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Builder project created successfully",
  "data": {
    "_id": "64project123...",
    "builder": "64builder123...",
    "project_name": "Lodha The Park",
    "description": "Premium residential project",
    "location": {
      "address": "Worli, Mumbai",
      "city": "Mumbai",
      "state": "Maharashtra",
      "coordinates": {
        "type": "Point",
        "coordinates": [72.8181, 18.9894]
      }
    },
    "images": ["https://cloudinary.com/..."],
    "project_type": "residential",
    "status": "ongoing",
    "possession_date": "2026-12-31T00:00:00.000Z",
    "rera_number": "P51900000123",
    "total_units": 200,
    "available_units": 150,
    "price_range": {
      "min": 15000000,
      "max": 50000000
    },
    "unit_configurations": [
      {
        "type": "2BHK",
        "carpet_area": "850 sq ft",
        "price": 20000000,
        "total_units": 80,
        "available_units": 60
      },
      {
        "type": "3BHK",
        "carpet_area": "1200 sq ft",
        "price": 35000000,
        "total_units": 120,
        "available_units": 90
      }
    ],
    "amenities": ["Swimming Pool", "Gym", "Club House", "Garden"],
    "documents": ["https://cloudinary.com/..."],
    "monositi_verified": false,
    "createdAt": "2025-01-01T10:00:00.000Z"
  }
}
```

---

### 2. Get All Projects for a Builder
**GET** `/api/builders/:builderId/projects?status=&verified=`

Get all projects for a specific builder.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**
- `status` - Filter by status
- `verified` - Filter by verification

**Success Response (200):**
```json
{
  "success": true,
  "count": 10,
  "data": [...]
}
```

---

### 3. Get All Projects (Global)
**GET** `/api/builders/projects/all?city=&project_type=&status=`

Get all projects across all builders with filters.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**
- `city` - Filter by city (case-insensitive)
- `project_type` - Filter by type (residential | commercial | mixed)
- `status` - Filter by status
- `verified` - Filter by verification (true | false)

**Example:**
```
GET /api/builders/projects/all?city=Mumbai&project_type=residential&verified=true
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 25,
  "data": [
    {
      "_id": "64project123...",
      "project_name": "Lodha The Park",
      "builder": {
        "_id": "64builder123...",
        "name": "Lodha Group",
        "logo": "https://...",
        "rating": 4.5
      },
      "location": {...},
      "price_range": {...},
      "unit_configurations": [...]
    }
  ]
}
```

---

### 4. Get Single Project
**GET** `/api/builders/projects/:projectId`

Get detailed information about a specific project.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64project123...",
    "project_name": "Lodha The Park",
    "builder": {...},
    "location": {...},
    "unit_configurations": [...],
    "amenities": [...],
    "images": [...],
    "documents": [...]
  }
}
```

---

### 5. Update Project
**PUT** `/api/builders/projects/:projectId`

Update project details.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```

**Body (form-data):**
```javascript
{
  "project_name": "Updated Name",             // Optional
  "status": "completed",                      // Optional
  "total_units": 250,                        // Optional
  "available_units": 100,                    // Optional
  "images": [File],                          // Optional - adds new images
  "documents": [File]                        // Optional - adds new docs
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Project updated successfully",
  "data": {...}
}
```

---

### 6. Verify/Unverify Project
**PATCH** `/api/builders/projects/:projectId/verify`

Mark a project as verified or unverified.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body:**
```json
{
  "verified": true  // or false
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Project verified successfully",
  "data": {...}
}
```

---

### 7. Update Project Units
**PATCH** `/api/builders/projects/:projectId/units`

Update unit availability for a project.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body:**
```json
{
  "total_units": 200,
  "available_units": 120,
  "unit_configurations": [
    {
      "type": "2BHK",
      "carpet_area": "850 sq ft",
      "price": 20000000,
      "total_units": 80,
      "available_units": 50
    }
  ]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Project units updated successfully",
  "data": {...}
}
```

---

### 8. Delete Project
**DELETE** `/api/builders/projects/:projectId`

Delete a project.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

---

## 🌍 Public APIs (User-Facing - For Buy Section)

### 1. Get Verified Builders
**GET** `/api/builders/public`

Get all verified builders (no authentication required).

**Success Response (200):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "64builder123...",
      "name": "Lodha Group",
      "logo": "https://cloudinary.com/...",
      "description": "Leading developer",
      "rating": 4.5,
      "total_projects_completed": 50,
      "monositi_verified": true
    }
  ]
}
```

**Note:** Does not include `createdBy` field for privacy.

---

### 2. Get Builder Details with Projects
**GET** `/api/builders/public/:id`

Get builder details with all their verified projects.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64builder123...",
    "name": "Lodha Group",
    "logo": "https://...",
    "description": "...",
    "contact_info": {...},
    "website": "...",
    "rating": 4.5,
    "projects": [
      {
        "_id": "64project1...",
        "project_name": "Lodha The Park",
        "location": {...},
        "price_range": {...}
      }
    ]
  }
}
```

**Error Response (403):** If builder is not verified
```json
{
  "success": false,
  "message": "This builder is not verified"
}
```

---

### 3. Get Verified Projects (Buy Section)
**GET** `/api/builders/public/projects?city=&project_type=&status=&min_price=&max_price=`

Browse verified projects for the Buy section.

**Query Parameters:**
- `city` - Filter by city
- `project_type` - Filter by type (residential | commercial | mixed)
- `status` - Filter by status (ongoing | completed | ready_to_move)
- `min_price` - Minimum price filter
- `max_price` - Maximum price filter

**Example:**
```
GET /api/builders/public/projects?city=Mumbai&project_type=residential&status=ready_to_move&min_price=10000000&max_price=30000000
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "_id": "64project123...",
      "project_name": "Lodha The Park",
      "builder": {
        "_id": "64builder123...",
        "name": "Lodha Group",
        "logo": "https://...",
        "rating": 4.5
      },
      "location": {
        "city": "Mumbai",
        "address": "Worli, Mumbai"
      },
      "images": ["https://..."],
      "project_type": "residential",
      "status": "ready_to_move",
      "possession_date": "2026-12-31",
      "price_range": {
        "min": 15000000,
        "max": 50000000
      },
      "unit_configurations": [
        {
          "type": "2BHK",
          "carpet_area": "850 sq ft",
          "price": 20000000,
          "available_units": 60
        }
      ],
      "amenities": ["Swimming Pool", "Gym"]
    }
  ]
}
```

**Note:** Only returns verified projects.

---

### 4. Get Project Details
**GET** `/api/builders/public/projects/:projectId`

Get detailed information about a specific project.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64project123...",
    "project_name": "Lodha The Park",
    "description": "Premium residential project",
    "builder": {
      "_id": "64builder123...",
      "name": "Lodha Group",
      "logo": "https://...",
      "contact_info": {...},
      "website": "https://lodhagroup.com",
      "rating": 4.5,
      "founded_year": 1980
    },
    "location": {...},
    "images": ["https://..."],
    "project_type": "residential",
    "status": "ongoing",
    "possession_date": "2026-12-31",
    "rera_number": "P51900000123",
    "total_units": 200,
    "available_units": 150,
    "price_range": {
      "min": 15000000,
      "max": 50000000
    },
    "unit_configurations": [...],
    "amenities": [...],
    "documents": [...]
  }
}
```

**Error Response (403):** If project is not verified
```json
{
  "success": false,
  "message": "This project is not verified"
}
```

---

## 📊 Data Models

### Builder Schema
```javascript
{
  name: String (required),
  logo: String,  // Cloudinary URL
  description: String,
  founded_year: Number,
  contact_info: {
    phone: String,
    email: String,
    address: String
  },
  website: String,
  certifications: [String],  // ["RERA", "ISO 9001"]
  total_projects_completed: Number,
  rating: Number (0-5),
  monositi_verified: Boolean,
  status: String (active | inactive),
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### BuilderProject Schema
```javascript
{
  builder: ObjectId (ref: Builder, required),
  project_name: String (required),
  description: String,
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      type: "Point",
      coordinates: [Number, Number]  // [lng, lat]
    }
  },
  images: [String],  // Cloudinary URLs
  project_type: String (residential | commercial | mixed),
  status: String (upcoming | ongoing | completed | ready_to_move),
  possession_date: Date,
  rera_number: String,
  total_units: Number,
  available_units: Number,
  price_range: {
    min: Number,
    max: Number
  },
  unit_configurations: [{
    type: String,  // "1BHK", "2BHK", "3BHK", "Penthouse"
    carpet_area: String,  // "850 sq ft"
    price: Number,
    total_units: Number,
    available_units: Number,
    floor_plan: String  // Cloudinary URL
  }],
  amenities: [String],
  documents: [String],  // Cloudinary URLs
  monositi_verified: Boolean,
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔄 Workflow Examples

### Example 1: Creating a Builder with Projects

**Step 1:** Admin creates the builder
```bash
POST /api/builders
Body: {
  "name": "DLF Limited",
  "founded_year": 1946,
  "website": "https://dlf.in"
}
```

**Step 2:** Admin creates projects
```bash
POST /api/builders/64builder.../projects
Body: {
  "project_name": "DLF Garden City",
  "city": "Gurgaon",
  "project_type": "residential",
  "price_min": 25000000
}
```

**Step 3:** Admin verifies builder and project
```bash
PATCH /api/builders/64builder.../verify
Body: { "verified": true }

PATCH /api/builders/projects/64project.../verify
Body: { "verified": true }
```

**Step 4:** Projects appear in Buy section
```bash
GET /api/builders/public/projects?city=Gurgaon
```

---

### Example 2: Managing Unit Availability

**Scenario:** 20 units sold out of 2BHK

```bash
PATCH /api/builders/projects/64project.../units
Body: {
  "available_units": 130,
  "unit_configurations": [
    {
      "type": "2BHK",
      "available_units": 40
    },
    {
      "type": "3BHK",
      "available_units": 90
    }
  ]
}
```

---

## ⚠️ Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Builder name is required"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Not authenticated"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Admin only"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Builder not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Failed to create builder",
  "error": "Error details..."
}
```

---

## 📝 Notes

1. **Image Uploads:**
   - Builder logo: 1 image max
   - Project images: 15 images max
   - Documents: 10 files max
   - All uploaded to Cloudinary
   - Local files auto-deleted after upload

2. **Geolocation:**
   - Uses GeoJSON format
   - Supports 2dsphere index
   - Ready for distance-based searches

3. **Price Range:**
   - Stored in numbers (e.g., 15000000 for ₹1.5 Crore)
   - Frontend should format for display

4. **Unit Configurations:**
   - Flexible array structure
   - Supports any unit type (1BHK, 2BHK, Villa, etc.)
   - Track total and available units per type

5. **Verification:**
   - Only verified builders and projects appear publicly
   - Admin can verify/unverify at any time

---

## 🚀 Future Enhancements

- [ ] Add booking/inquiry system
- [ ] Add comparison feature (compare projects)
- [ ] Add virtual tours integration
- [ ] Add loan calculator
- [ ] Add EMI calculator
- [ ] Add site visit scheduling
- [ ] Add review and rating system
- [ ] Add distance-based search
- [ ] Add price alerts/notifications

---

**Created:** January 2025  
**Version:** 1.0  
**Module:** Builders Backend APIs

