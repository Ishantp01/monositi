# Monositi API Testing Guide

## Quick Start Testing

### Prerequisites
1. Server running on `http://localhost:5000` (or your configured port)
2. Admin user created with role = "admin"
3. API client (Postman, Thunder Client, or curl)

---

## 🔑 Step 1: Get Admin Token

```bash
POST /api/auth/send-otp
Content-Type: application/json

{
  "phone": "9876543210"
}
```

```bash
POST /api/auth/verify-otp
Content-Type: application/json

{
  "phone": "9876543210",
  "otp": "123456"
}
```

**Save the token from response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 🏠 Step 2: Create a Hostel/PG Listing

```bash
POST /api/monositi/listings
Authorization: Bearer <YOUR_TOKEN>
Content-Type: multipart/form-data

Form Data:
- title: "Green Valley Hostel"
- description: "Modern hostel near campus with all amenities"
- category: "hostel_pg"
- address: "123 Main Street, Near XYZ College"
- city: "Mumbai"
- state: "Maharashtra"
- pincode: "400001"
- coordinates: {"lng": 72.8777, "lat": 19.0760}
- price: 6000
- images: [select image files]
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Listing created successfully",
  "data": {
    "_id": "67a1b2c3d4e5f6789abc",
    "title": "Green Valley Hostel",
    "category": "hostel_pg",
    "status": "available",
    "monositi_verified": false
  }
}
```

**Save the listing ID!**

---

## 🛏️ Step 3: Add Rooms to the Hostel

### Add Room 101 (4 beds)

```bash
POST /api/monositi/listings/67a1b2c3d4e5f6789abc/rooms
Authorization: Bearer <YOUR_TOKEN>
Content-Type: multipart/form-data

Form Data:
- floor: 1
- room_number: "101"
- total_beds: 4
- available_beds: 4
- rent_per_bed: 6000
- amenities: ["AC", "WiFi", "Attached Bath"]
- images: [select image files]
```

### Add Room 102 (2 beds)

```bash
POST /api/monositi/listings/67a1b2c3d4e5f6789abc/rooms
Authorization: Bearer <YOUR_TOKEN>
Content-Type: multipart/form-data

Form Data:
- floor: 1
- room_number: "102"
- total_beds: 2
- available_beds: 2
- rent_per_bed: 7000
- amenities: ["AC", "WiFi", "Attached Bath", "Balcony"]
```

**Save room IDs from responses!**

---

## ✅ Step 4: Verify the Listing

```bash
PATCH /api/monositi/listings/67a1b2c3d4e5f6789abc/verify
Authorization: Bearer <YOUR_TOKEN>
Content-Type: application/json

{
  "verified": true
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Listing verified successfully",
  "data": {
    "monositi_verified": true
  }
}
```

---

## 🔍 Step 5: Test Public APIs (No Auth Required)

### Get All Public Listings

```bash
GET /api/monositi/public/listings?category=hostel_pg&city=Mumbai
```

**Expected:** Should return your verified listing with rooms

### Get Specific Listing Details

```bash
GET /api/monositi/public/listings/67a1b2c3d4e5f6789abc
```

**Expected:** Full listing details with all rooms

---

## 📊 Step 6: Test Room Status Updates

### Fill 2 Beds in Room 101

```bash
PATCH /api/monositi/rooms/<ROOM_101_ID>/status
Authorization: Bearer <YOUR_TOKEN>
Content-Type: application/json

{
  "available_beds": 2
}
```

**Expected:**
- Room status: "available" (2 beds left)
- Listing status: "available"

### Fill All Beds in Room 101

```bash
PATCH /api/monositi/rooms/<ROOM_101_ID>/status
Authorization: Bearer <YOUR_TOKEN>
Content-Type: application/json

{
  "available_beds": 0
}
```

**Expected:**
- Room status: "full"
- Listing status: Still "available" (Room 102 has beds)

### Fill All Beds in Room 102

```bash
PATCH /api/monositi/rooms/<ROOM_102_ID>/status
Authorization: Bearer <YOUR_TOKEN>
Content-Type: application/json

{
  "available_beds": 0
}
```

**Expected:**
- Room status: "full"
- **Listing status: "fullhouse"** (all rooms full)
- Listing should NOT appear in public API anymore

---

## 🏢 Step 7: Test Commercial Listing

```bash
POST /api/monositi/listings
Authorization: Bearer <YOUR_TOKEN>
Content-Type: multipart/form-data

Form Data:
- title: "Premium Office Space"
- description: "Modern office with sea view"
- category: "commercial"
- address: "456 Business Park"
- city: "Mumbai"
- state: "Maharashtra"
- pincode: "400050"
- area: "1500 sq ft"
- price: 75000
- coordinates: {"lng": 72.8400, "lat": 19.0596}
- images: [select image files]
```

**Note:** Commercial listings don't need rooms!

---

## 🌍 Step 8: Test All Filters

### Filter by Category

```bash
GET /api/monositi/public/listings?category=commercial
GET /api/monositi/public/listings?category=hostel_pg
GET /api/monositi/public/listings?category=land_plot
```

### Filter by City

```bash
GET /api/monositi/public/listings?city=Mumbai
GET /api/monositi/public/listings?city=Pune
```

### Admin Filters

```bash
GET /api/monositi/listings?verified=true
GET /api/monositi/listings?status=fullhouse
GET /api/monositi/listings?category=hostel_pg&city=Mumbai&verified=true
```

---

## 🧹 Step 9: Test Updates

### Update Listing

```bash
PUT /api/monositi/listings/67a1b2c3d4e5f6789abc
Authorization: Bearer <YOUR_TOKEN>
Content-Type: application/json

{
  "title": "Green Valley Premium Hostel",
  "price": 6500,
  "description": "Updated description"
}
```

### Update Room

```bash
PUT /api/monositi/rooms/<ROOM_ID>
Authorization: Bearer <YOUR_TOKEN>
Content-Type: application/json

{
  "rent_per_bed": 6500,
  "amenities": ["AC", "WiFi", "Attached Bath", "Mini Fridge"]
}
```

---

## 🗑️ Step 10: Test Deletions

### Delete a Room

```bash
DELETE /api/monositi/rooms/<ROOM_ID>
Authorization: Bearer <YOUR_TOKEN>
```

**Expected:**
- Room deleted
- Room removed from listing.rooms array
- Listing status updated if needed

### Delete a Listing

```bash
DELETE /api/monositi/listings/67a1b2c3d4e5f6789abc
Authorization: Bearer <YOUR_TOKEN>
```

**Expected:**
- Listing deleted
- All associated rooms deleted
- No longer appears in any API

---

## 🧪 Test Scenarios

### Scenario 1: Complete Hostel Workflow
1. ✅ Create hostel listing
2. ✅ Add 5 rooms with different bed configurations
3. ✅ Verify listing
4. ✅ Check public API - should appear
5. ✅ Fill beds gradually in rooms
6. ✅ When all rooms full, listing becomes "fullhouse"
7. ✅ Listing disappears from public API

### Scenario 2: Commercial Space
1. ✅ Create commercial listing
2. ✅ Upload images
3. ✅ Verify listing
4. ✅ Check public API
5. ✅ Update price and details
6. ✅ Mark as "booked"

### Scenario 3: Land Plot
1. ✅ Create land_plot listing
2. ✅ Add location coordinates
3. ✅ Verify listing
4. ✅ Test filtering by city

---

## 📝 Postman Collection

Save this as a Postman collection for easy testing:

```json
{
  "info": {
    "name": "Monositi API Tests",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "1. Create Listing",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "body": {
          "mode": "formdata",
          "formdata": [
            { "key": "title", "value": "Test Hostel" },
            { "key": "category", "value": "hostel_pg" },
            { "key": "city", "value": "Mumbai" }
          ]
        },
        "url": "{{baseUrl}}/api/monositi/listings"
      }
    },
    {
      "name": "2. Get All Listings",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": "{{baseUrl}}/api/monositi/listings"
      }
    },
    {
      "name": "3. Add Room",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "body": {
          "mode": "formdata",
          "formdata": [
            { "key": "floor", "value": "1" },
            { "key": "room_number", "value": "101" },
            { "key": "total_beds", "value": "4" }
          ]
        },
        "url": "{{baseUrl}}/api/monositi/listings/{{listingId}}/rooms"
      }
    },
    {
      "name": "4. Update Room Status",
      "request": {
        "method": "PATCH",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"available_beds\": 2\n}"
        },
        "url": "{{baseUrl}}/api/monositi/rooms/{{roomId}}/status"
      }
    },
    {
      "name": "5. Verify Listing",
      "request": {
        "method": "PATCH",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"verified\": true\n}"
        },
        "url": "{{baseUrl}}/api/monositi/listings/{{listingId}}/verify"
      }
    },
    {
      "name": "6. Get Public Listings",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/monositi/public/listings"
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000"
    },
    {
      "key": "token",
      "value": "YOUR_TOKEN_HERE"
    },
    {
      "key": "listingId",
      "value": "LISTING_ID_HERE"
    },
    {
      "key": "roomId",
      "value": "ROOM_ID_HERE"
    }
  ]
}
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Not authenticated"
**Solution:** Make sure Authorization header is set with valid admin token

### Issue 2: "Admin only"
**Solution:** User role must be "admin". Update user in database:
```javascript
db.users.updateOne(
  { phone: "9876543210" },
  { $set: { role: "admin" } }
)
```

### Issue 3: "Rooms can only be added to hostel_pg listings"
**Solution:** Make sure listing category is "hostel_pg" before adding rooms

### Issue 4: Images not uploading
**Solution:** 
- Check Cloudinary configuration in `backend-new/src/config/cloudinary.js`
- Verify environment variables: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

### Issue 5: Coordinates not saving
**Solution:** Pass coordinates as JSON string:
```json
{
  "coordinates": "{\"lng\": 72.8777, \"lat\": 19.0760}"
}
```

---

## ✅ Testing Checklist

- [ ] Admin can create listings (all 3 categories)
- [ ] Admin can upload images
- [ ] Admin can add rooms to hostels
- [ ] Admin can update listing details
- [ ] Admin can verify/unverify listings
- [ ] Admin can update room bed availability
- [ ] Room status changes to "full" when beds = 0
- [ ] Listing status changes to "fullhouse" when all rooms full
- [ ] Public API shows only verified listings
- [ ] Public API filters work (category, city)
- [ ] Admin can delete rooms
- [ ] Admin can delete listings
- [ ] Deleting listing also deletes rooms
- [ ] Images upload to Cloudinary successfully
- [ ] Coordinates save in GeoJSON format

---

**Happy Testing! 🚀**

