# Monositi Module API Documentation

## Overview
The Monositi module manages admin-controlled listings for commercial spaces, hostels/PGs, and land plots. It includes complete CRUD operations for listings and room management with public-facing APIs.

**Base Route:** `/api/monositi`

---

## 📋 Table of Contents
1. [Authentication](#authentication)
2. [Listings Management (Admin Only)](#listings-management-admin-only)
3. [Room Management (Admin Only)](#room-management-admin-only)
4. [Public APIs](#public-apis-user-facing)
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

## 🏠 Listings Management (Admin Only)

### 1. Create New Listing
**POST** `/api/monositi/listings`

Create a new Monositi listing (commercial, hostel_pg, or land_plot).

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```

**Body (form-data):**
```javascript
{
  "title": "Green Valley Hostel",              // Required
  "description": "Modern hostel near campus",
  "category": "hostel_pg",                     // Required: commercial | hostel_pg | land_plot
  "address": "123 Main Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "coordinates": "{\"lng\": 72.8777, \"lat\": 19.0760}",  // Optional JSON string
  "area": "2000 sq ft",                        // For commercial/land
  "price": 15000,                              // Rent or sale price
  "images": [File, File, ...]                  // Max 10 images
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Listing created successfully",
  "data": {
    "_id": "64abc123...",
    "title": "Green Valley Hostel",
    "category": "hostel_pg",
    "location": {
      "address": "123 Main Street",
      "city": "Mumbai",
      "coordinates": {
        "type": "Point",
        "coordinates": [72.8777, 19.0760]
      }
    },
    "images": ["https://cloudinary.com/..."],
    "status": "available",
    "monositi_verified": false,
    "createdBy": "64def456...",
    "createdAt": "2025-01-01T10:00:00.000Z"
  }
}
```

---

### 2. Get All Listings (with Filters)
**GET** `/api/monositi/listings`

Fetch all listings with optional filters.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**
- `category` - Filter by category (commercial | hostel_pg | land_plot)
- `city` - Filter by city (case-insensitive)
- `status` - Filter by status (available | booked | fullhouse)
- `verified` - Filter by verification (true | false)

**Example:**
```
GET /api/monositi/listings?category=hostel_pg&city=Mumbai&verified=true
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "64abc123...",
      "title": "Green Valley Hostel",
      "category": "hostel_pg",
      "status": "available",
      "monositi_verified": true,
      "createdBy": {
        "_id": "64def456...",
        "name": "Admin User",
        "email": "admin@monositi.com"
      },
      "rooms": [...]
    }
  ]
}
```

---

### 3. Get Single Listing
**GET** `/api/monositi/listings/:id`

Get detailed information about a specific listing.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc123...",
    "title": "Green Valley Hostel",
    "description": "Modern hostel near campus",
    "category": "hostel_pg",
    "location": {...},
    "images": ["https://..."],
    "rooms": [
      {
        "_id": "64room1...",
        "floor": 1,
        "room_number": "101",
        "total_beds": 4,
        "available_beds": 2,
        "status": "available"
      }
    ],
    "status": "available",
    "monositi_verified": true
  }
}
```

---

### 4. Update Listing
**PUT** `/api/monositi/listings/:id`

Update listing details.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```

**Body (form-data):**
```javascript
{
  "title": "Updated Title",                    // Optional
  "description": "Updated description",        // Optional
  "price": 18000,                             // Optional
  "status": "available",                      // Optional
  "images": [File, File]                      // Optional - adds new images
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Listing updated successfully",
  "data": {...}
}
```

---

### 5. Verify/Unverify Listing
**PATCH** `/api/monositi/listings/:id/verify`

Mark a listing as verified or unverified.

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
  "message": "Listing verified successfully",
  "data": {
    "_id": "64abc123...",
    "monositi_verified": true,
    ...
  }
}
```

---

### 6. Delete Listing
**DELETE** `/api/monositi/listings/:id`

Delete a listing (also deletes all associated rooms).

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Listing deleted successfully"
}
```

---

## 🛏️ Room Management (Admin Only)

### 1. Add Room to Listing
**POST** `/api/monositi/listings/:listingId/rooms`

Add a room to a hostel/PG listing.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```

**Body (form-data):**
```javascript
{
  "floor": 1,                                  // Required
  "room_number": "101",                        // Required
  "total_beds": 4,                            // Required
  "available_beds": 4,                        // Optional (defaults to total_beds)
  "rent_per_bed": 5000,                       // Optional
  "amenities": ["AC", "WiFi", "Attached Bath"], // Optional (JSON array or actual array)
  "images": [File, File]                      // Optional - max 5 images
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Room added successfully",
  "data": {
    "_id": "64room1...",
    "listing": "64abc123...",
    "floor": 1,
    "room_number": "101",
    "total_beds": 4,
    "available_beds": 4,
    "rent_per_bed": 5000,
    "amenities": ["AC", "WiFi", "Attached Bath"],
    "images": ["https://..."],
    "status": "available",
    "createdAt": "2025-01-01T10:00:00.000Z"
  }
}
```

---

### 2. Get All Rooms for a Listing
**GET** `/api/monositi/listings/:listingId/rooms`

Get all rooms for a specific hostel/PG listing.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "64room1...",
      "floor": 1,
      "room_number": "101",
      "total_beds": 4,
      "available_beds": 2,
      "rent_per_bed": 5000,
      "status": "available"
    },
    ...
  ]
}
```

---

### 3. Get Single Room Details
**GET** `/api/monositi/rooms/:roomId`

Get detailed information about a specific room.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64room1...",
    "listing": {
      "_id": "64abc123...",
      "title": "Green Valley Hostel"
    },
    "floor": 1,
    "room_number": "101",
    "total_beds": 4,
    "available_beds": 2,
    "rent_per_bed": 5000,
    "amenities": ["AC", "WiFi"],
    "images": ["https://..."],
    "status": "available"
  }
}
```

---

### 4. Update Room Details
**PUT** `/api/monositi/rooms/:roomId`

Update room information.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```

**Body (form-data):**
```javascript
{
  "floor": 2,                                 // Optional
  "room_number": "201",                       // Optional
  "total_beds": 6,                           // Optional
  "available_beds": 3,                       // Optional
  "rent_per_bed": 6000,                      // Optional
  "amenities": ["AC", "WiFi", "Balcony"],    // Optional
  "images": [File]                           // Optional - adds new images
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Room updated successfully",
  "data": {...}
}
```

**Note:** Updates room status automatically based on available_beds. Also updates parent listing status if all rooms become full.

---

### 5. Update Room Bed Availability
**PATCH** `/api/monositi/rooms/:roomId/status`

Update the number of available beds in a room.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body:**
```json
{
  "available_beds": 2
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Room status updated successfully",
  "data": {
    "_id": "64room1...",
    "available_beds": 2,
    "total_beds": 4,
    "status": "available"
  }
}
```

**Automatic Updates:**
- Sets room status to "full" if `available_beds = 0`
- Sets listing status to "fullhouse" if all rooms are full
- Sets listing status to "available" if any room has available beds

---

### 6. Delete Room
**DELETE** `/api/monositi/rooms/:roomId`

Delete a room from a listing.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Room deleted successfully"
}
```

---

## 🌍 Public APIs (User-Facing)

### 1. Get Public Listings
**GET** `/api/monositi/public/listings`

Get verified and available listings (no authentication required).

**Query Parameters:**
- `category` - Filter by category (commercial | hostel_pg | land_plot)
- `city` - Filter by city

**Example:**
```
GET /api/monositi/public/listings?category=hostel_pg&city=Mumbai
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "64abc123...",
      "title": "Green Valley Hostel",
      "category": "hostel_pg",
      "location": {
        "city": "Mumbai",
        "address": "123 Main Street"
      },
      "images": ["https://..."],
      "status": "available",
      "rooms": [...]
    }
  ]
}
```

**Note:** Only returns listings where:
- `monositi_verified = true`
- `status != "fullhouse"`
- Does not include `createdBy` field

---

### 2. Get Public Listing Details
**GET** `/api/monositi/public/listings/:id`

Get detailed information about a specific verified listing.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc123...",
    "title": "Green Valley Hostel",
    "description": "Modern hostel near campus",
    "category": "hostel_pg",
    "location": {...},
    "images": ["https://..."],
    "rooms": [
      {
        "floor": 1,
        "room_number": "101",
        "total_beds": 4,
        "available_beds": 2,
        "rent_per_bed": 5000,
        "amenities": ["AC", "WiFi"],
        "status": "available"
      }
    ],
    "status": "available"
  }
}
```

**Error Response (403):** If listing is not verified
```json
{
  "success": false,
  "message": "This listing is not verified"
}
```

---

## 📊 Data Models

### MonositiListing Schema
```javascript
{
  title: String (required),
  description: String,
  category: String (enum: commercial | hostel_pg | land_plot),
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      type: "Point",
      coordinates: [Number, Number]  // [longitude, latitude]
    }
  },
  images: [String],  // Cloudinary URLs
  rooms: [ObjectId],  // References to MonositiRoom (only for hostel_pg)
  area: String,  // For commercial/land
  price: Number,  // Rent or sale price
  status: String (enum: available | booked | fullhouse),
  monositi_verified: Boolean,
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### MonositiRoom Schema
```javascript
{
  listing: ObjectId (ref: MonositiListing, required),
  floor: Number (required),
  room_number: String (required),
  total_beds: Number (required),
  available_beds: Number (required),
  rent_per_bed: Number,
  amenities: [String],
  images: [String],  // Cloudinary URLs
  status: String (enum: available | full),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔄 Workflow Examples

### Example 1: Creating a Hostel/PG Listing

**Step 1:** Admin creates the listing
```bash
POST /api/monositi/listings
Body: {
  "title": "Sunshine PG",
  "category": "hostel_pg",
  "city": "Pune",
  "price": 6000
}
```

**Step 2:** Admin adds rooms
```bash
POST /api/monositi/listings/64abc123.../rooms
Body: {
  "floor": 1,
  "room_number": "101",
  "total_beds": 4,
  "rent_per_bed": 6000
}
```

**Step 3:** Admin verifies the listing
```bash
PATCH /api/monositi/listings/64abc123.../verify
Body: { "verified": true }
```

**Step 4:** Listing appears on public API
```bash
GET /api/monositi/public/listings?category=hostel_pg
```

---

### Example 2: Managing Bed Availability

**Scenario:** 2 beds are filled in Room 101

```bash
PATCH /api/monositi/rooms/64room1.../status
Body: { "available_beds": 2 }
```

**Result:**
- Room status remains "available" (2 beds left)
- Room shows green indicator on frontend

**Scenario:** All beds filled (0 available)

```bash
PATCH /api/monositi/rooms/64room1.../status
Body: { "available_beds": 0 }
```

**Result:**
- Room status changes to "full"
- Room shows red indicator on frontend
- If all rooms are full, listing status changes to "fullhouse"

---

### Example 3: Creating a Commercial Space

```bash
POST /api/monositi/listings
Body: {
  "title": "Office Space in Bandra",
  "category": "commercial",
  "description": "Modern office with sea view",
  "city": "Mumbai",
  "area": "1500 sq ft",
  "price": 75000,
  "coordinates": "{\"lng\": 72.8400, \"lat\": 19.0596}"
}
```

**Note:** Commercial and land listings don't have rooms.

---

## ⚠️ Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "message": "category is required and must be one of: commercial, hostel_pg, land_plot"
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
  "message": "Listing not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Failed to create listing",
  "error": "Error details..."
}
```

---

## 🧪 Testing Tips

### Using Postman/Thunder Client

1. **Get Admin Token:**
   ```bash
   POST /api/auth/login
   Body: { "phone": "admin_phone", "password": "..." }
   ```

2. **Set Authorization Header:**
   ```
   Authorization: Bearer <token_from_step_1>
   ```

3. **Test Listing Creation:**
   - Use form-data for file uploads
   - Test all three categories
   - Verify image uploads work

4. **Test Room Management:**
   - Create listing first
   - Add multiple rooms
   - Test bed availability updates
   - Verify status auto-updates

5. **Test Public APIs:**
   - Remove authorization header
   - Verify only verified listings appear
   - Test filtering

---

## 📝 Notes

1. **Image Uploads:**
   - Supports up to 10 images per listing
   - Supports up to 5 images per room
   - Images are uploaded to Cloudinary
   - Local files are deleted after upload

2. **Geolocation:**
   - Uses GeoJSON format: `{ type: "Point", coordinates: [lng, lat] }`
   - Supports 2dsphere index for location-based queries
   - Can add distance-based search in future

3. **Status Management:**
   - Room status updates automatically based on available_beds
   - Listing status updates automatically when all rooms are full/available
   - Status changes are triggered on room updates and deletions

4. **Verification:**
   - Only verified listings appear in public APIs
   - Admin can verify/unverify at any time
   - Unverified listings are visible to admin only

---

## 🚀 Future Enhancements

- [ ] Add booking/reservation system
- [ ] Add search by distance (nearby listings)
- [ ] Add tenant management for rooms
- [ ] Add payment integration
- [ ] Add analytics dashboard
- [ ] Add booking history
- [ ] Add automated status updates based on booking dates
- [ ] Add WhatsApp notifications for bed availability

---

**Created:** October 30, 2025  
**Version:** 1.0  
**Module:** Monositi Backend APIs

