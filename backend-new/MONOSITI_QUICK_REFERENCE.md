# 🚀 Monositi Module - Quick Reference Card

## ✅ Implementation Complete!

All APIs have been implemented and integrated. Here's your quick reference guide.

---

## 📍 Base URL
```
http://localhost:5000/api/monositi  (Development)
https://your-backend.com/api/monositi  (Production)
```

---

## 🔑 Admin Authentication
All admin routes require:
```javascript
Headers: {
  "Authorization": "Bearer <YOUR_JWT_TOKEN>"
}
```

---

## 📋 Quick API Reference

### 🏠 CREATE LISTING (Admin)
```bash
POST /api/monositi/listings
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body:
- title: "Green Valley Hostel"
- category: "hostel_pg"  # commercial | hostel_pg | land_plot
- city: "Mumbai"
- images: [files]
```

### 🛏️ ADD ROOM (Admin)
```bash
POST /api/monositi/listings/:listingId/rooms
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body:
- floor: 1
- room_number: "101"
- total_beds: 4
- rent_per_bed: 6000
- amenities: ["AC", "WiFi"]
```

### ✅ VERIFY LISTING (Admin)
```bash
PATCH /api/monositi/listings/:id/verify
Content-Type: application/json
Authorization: Bearer <token>

Body:
{ "verified": true }
```

### 🔄 UPDATE BED STATUS (Admin)
```bash
PATCH /api/monositi/rooms/:roomId/status
Content-Type: application/json
Authorization: Bearer <token>

Body:
{ "available_beds": 2 }
```

### 🌍 BROWSE PUBLIC LISTINGS (Public)
```bash
GET /api/monositi/public/listings?category=hostel_pg&city=Mumbai
# No authentication needed!
```

### 👁️ VIEW LISTING DETAILS (Public)
```bash
GET /api/monositi/public/listings/:id
# No authentication needed!
```

---

## 📊 All Endpoints at a Glance

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| **PUBLIC ROUTES** ||||
| GET | `/public/listings` | Public | Browse verified listings |
| GET | `/public/listings/:id` | Public | View listing details |
| **ADMIN ROUTES** ||||
| POST | `/listings` | Admin | Create listing |
| GET | `/listings` | Admin | Get all listings |
| GET | `/listings/:id` | Admin | Get single listing |
| PUT | `/listings/:id` | Admin | Update listing |
| PATCH | `/listings/:id/verify` | Admin | Verify listing |
| DELETE | `/listings/:id` | Admin | Delete listing |
| POST | `/listings/:listingId/rooms` | Admin | Add room |
| GET | `/listings/:listingId/rooms` | Admin | Get rooms |
| GET | `/rooms/:roomId` | Admin | Get room details |
| PUT | `/rooms/:roomId` | Admin | Update room |
| PATCH | `/rooms/:roomId/status` | Admin | Update bed status |
| DELETE | `/rooms/:roomId` | Admin | Delete room |

---

## 🎯 Common Use Cases

### 1️⃣ Create Complete Hostel
```javascript
// Step 1: Create listing
POST /api/monositi/listings
{ title: "XYZ Hostel", category: "hostel_pg", city: "Mumbai" }

// Step 2: Add rooms
POST /api/monositi/listings/64abc.../rooms
{ floor: 1, room_number: "101", total_beds: 4 }

// Step 3: Verify
PATCH /api/monositi/listings/64abc.../verify
{ verified: true }
```

### 2️⃣ Manage Bed Availability
```javascript
// Mark 2 beds as filled
PATCH /api/monositi/rooms/64room.../status
{ available_beds: 2 }

// Mark room as full
PATCH /api/monositi/rooms/64room.../status
{ available_beds: 0 }
```

### 3️⃣ Browse Hostels (Frontend)
```javascript
// Get all hostels in a city
fetch('/api/monositi/public/listings?category=hostel_pg&city=Mumbai')
  .then(res => res.json())
  .then(data => console.log(data))
```

---

## 🔄 Auto-Status Updates

### Room Status
- `available_beds > 0` → `status: "available"` 🟢
- `available_beds = 0` → `status: "full"` 🔴

### Listing Status
- Any room available → `status: "available"` ✅
- All rooms full → `status: "fullhouse"` 🏠
- Fullhouse listings hidden from public API

---

## 📂 Files Created/Modified

### ✅ Created
- `src/models/MonositiListing.model.js`
- `src/models/MonositiRoom.model.js`
- `src/modules/Monositi/monositi.controller.js`
- `src/modules/Monositi/monositi.routes.js`
- `src/modules/Monositi/MONOSITI_API_DOCUMENTATION.md`
- `src/modules/Monositi/TESTING_GUIDE.md`
- `src/modules/Monositi/README.md`
- `MONOSITI_MODULE_IMPLEMENTATION.md`
- `MONOSITI_QUICK_REFERENCE.md`

### ✅ Modified
- `src/routes/index.js` (added Monositi routes)
- `src/app.js` (fixed CORS)

---

## 🧪 Quick Test

```bash
# 1. Get admin token
POST /api/auth/verify-otp
{ "phone": "your_admin_phone", "otp": "123456" }
# Save the token!

# 2. Create listing
POST /api/monositi/listings
Authorization: Bearer <token>
{ "title": "Test Hostel", "category": "hostel_pg", "city": "Mumbai" }
# Save the listing ID!

# 3. Add room
POST /api/monositi/listings/<LISTING_ID>/rooms
Authorization: Bearer <token>
{ "floor": 1, "room_number": "101", "total_beds": 4 }

# 4. Verify listing
PATCH /api/monositi/listings/<LISTING_ID>/verify
Authorization: Bearer <token>
{ "verified": true }

# 5. Check public API (no auth needed!)
GET /api/monositi/public/listings
# Should see your listing!
```

---

## 🐛 Troubleshooting

### Issue: "Not authenticated"
→ Add Authorization header with Bearer token

### Issue: "Admin only"
→ User role must be "admin" in database

### Issue: "Listing not found"
→ Check listing ID is correct

### Issue: Images not uploading
→ Check Cloudinary config in `.env`:
```
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

### Issue: CORS error in frontend
→ Already fixed! Frontend URL added to CORS config

---

## 📚 Full Documentation

- **Complete API Docs:** `src/modules/Monositi/MONOSITI_API_DOCUMENTATION.md`
- **Testing Guide:** `src/modules/Monositi/TESTING_GUIDE.md`
- **Implementation Summary:** `MONOSITI_MODULE_IMPLEMENTATION.md`

---

## ✨ What's Working

✅ Create, Read, Update, Delete listings  
✅ Add, manage, delete rooms  
✅ Automatic bed availability tracking  
✅ Status auto-updates (room & listing)  
✅ Image uploads (Cloudinary)  
✅ Verification system  
✅ Public browsing API  
✅ Filtering (category, city, status)  
✅ GeoJSON location support  
✅ Complete error handling  
✅ CORS fixed for deployment  

---

## 🎉 Ready to Use!

All APIs are live at `/api/monositi` once you start the server.

**Start the server:**
```bash
cd backend-new
npm start
```

**Test immediately with the endpoints above!**

---

**Need Help?** Check the full documentation files listed above.

**Happy Coding! 🚀**

