# Monositi Module

## 📌 Overview

The Monositi module is an admin-managed property system for commercial spaces, hostels/PGs, and land plots. It provides complete CRUD operations with public-facing APIs for end-users.

## 🗂️ Module Structure

```
Monositi/
├── monositi.controller.js       # All business logic and API handlers
├── monositi.routes.js           # Route definitions and middleware
├── MONOSITI_API_DOCUMENTATION.md  # Complete API reference
├── TESTING_GUIDE.md             # Step-by-step testing guide
└── README.md                    # This file
```

## 🚀 Features

### Admin Features (Protected Routes)
- ✅ Create/Update/Delete listings (commercial, hostel_pg, land_plot)
- ✅ Add/Update/Delete rooms for hostels/PGs
- ✅ Manage bed availability in real-time
- ✅ Verify/Unverify listings
- ✅ Upload multiple images per listing/room
- ✅ Filter listings by category, city, status, verification
- ✅ Automatic status management (available → full → fullhouse)

### Public Features (Open Routes)
- ✅ Browse verified listings
- ✅ View listing details with room information
- ✅ Filter by category and city
- ✅ View bed availability with visual indicators

## 📊 Data Models

### MonositiListing
```javascript
{
  title, description, category,
  location: { address, city, state, pincode, coordinates },
  images, rooms, area, price, status,
  monositi_verified, createdBy, timestamps
}
```

### MonositiRoom
```javascript
{
  listing, floor, room_number,
  total_beds, available_beds, rent_per_bed,
  amenities, images, status, timestamps
}
```

## 🔗 Base Routes

- **Admin Routes:** `/api/monositi/*` (Requires admin authentication)
- **Public Routes:** `/api/monositi/public/*` (No authentication)

## 📖 Quick Links

- **[Complete API Documentation](./MONOSITI_API_DOCUMENTATION.md)** - All endpoints with examples
- **[Testing Guide](./TESTING_GUIDE.md)** - Step-by-step testing instructions

## 🔧 Setup

1. **Models are already integrated** - `MonositiListing.model.js` and `MonositiRoom.model.js`
2. **Routes are registered** - Module is connected to `/api/monositi`
3. **Authentication works** - Uses existing `protect` and `adminOnly` middleware
4. **File uploads ready** - Uses existing Multer and Cloudinary configuration

## 🎯 Quick Start

### 1. Create a Hostel Listing (Admin)
```bash
POST /api/monositi/listings
Authorization: Bearer <token>
Body: { title, category: "hostel_pg", city, ... }
```

### 2. Add Rooms
```bash
POST /api/monositi/listings/:id/rooms
Authorization: Bearer <token>
Body: { floor, room_number, total_beds, ... }
```

### 3. Verify Listing
```bash
PATCH /api/monositi/listings/:id/verify
Authorization: Bearer <token>
Body: { verified: true }
```

### 4. Public Access
```bash
GET /api/monositi/public/listings?category=hostel_pg
# No authentication needed!
```

## 🔄 Automatic Features

### Status Management
- Room status auto-updates: `available` ↔ `full`
- Listing status auto-updates: `available` → `fullhouse`
- Triggered on bed availability changes

### Cascading Deletes
- Deleting a listing also deletes all its rooms
- Deleting a room updates listing status

## 🧪 Testing

See **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** for:
- Step-by-step API testing
- Postman collection
- Common issues & solutions
- Complete test scenarios

## 📝 API Endpoints Summary

### Listings Management (Admin)
- `POST /listings` - Create listing
- `GET /listings` - Get all listings (with filters)
- `GET /listings/:id` - Get single listing
- `PUT /listings/:id` - Update listing
- `PATCH /listings/:id/verify` - Verify listing
- `DELETE /listings/:id` - Delete listing

### Room Management (Admin)
- `POST /listings/:listingId/rooms` - Add room
- `GET /listings/:listingId/rooms` - Get all rooms
- `GET /rooms/:roomId` - Get single room
- `PUT /rooms/:roomId` - Update room
- `PATCH /rooms/:roomId/status` - Update bed availability
- `DELETE /rooms/:roomId` - Delete room

### Public APIs
- `GET /public/listings` - Get verified listings
- `GET /public/listings/:id` - Get listing details

## 🔐 Authentication

### Admin Routes
```javascript
Headers: {
  Authorization: "Bearer <JWT_TOKEN>"
}
```
User role must be "admin"

### Public Routes
No authentication required

## 📦 Dependencies

- **Express** - Routing
- **Mongoose** - Database ORM
- **Multer** - File upload handling
- **Cloudinary** - Image storage
- **JWT** - Authentication (existing middleware)

## 🌍 Use Cases

### 1. Hostel/PG Management
- List multiple hostels/PGs
- Add rooms with floor and bed details
- Track bed occupancy in real-time
- Show green/red indicators for availability

### 2. Commercial Spaces
- Office spaces for rent
- Retail shops
- Warehouses
- No room management needed

### 3. Land & Plots
- Residential plots
- Agricultural land
- Commercial land
- Area and price based

## 🎨 Frontend Integration

### Display Hostel with Rooms
```javascript
// Fetch listing
const response = await fetch('/api/monositi/public/listings/:id');
const { data } = await response.json();

// Display rooms with bed indicators
data.rooms.forEach(room => {
  const bedStatus = room.available_beds === 0 ? 'red' : 'green';
  // Show room with color indicator
});
```

### Filter Listings
```javascript
// Filter by category and city
const url = `/api/monositi/public/listings?category=hostel_pg&city=Mumbai`;
const listings = await fetch(url).then(r => r.json());
```

## 🔮 Future Enhancements

- [ ] Booking/Reservation system
- [ ] Distance-based search (nearby listings)
- [ ] Tenant management
- [ ] Payment integration
- [ ] Analytics dashboard
- [ ] WhatsApp notifications
- [ ] Automated booking expiry

## 👥 Contributors

Built for Monositi Platform - October 2025

## 📄 License

Part of Monositi Backend System

---

**For detailed API documentation, see [MONOSITI_API_DOCUMENTATION.md](./MONOSITI_API_DOCUMENTATION.md)**

**For testing instructions, see [TESTING_GUIDE.md](./TESTING_GUIDE.md)**

