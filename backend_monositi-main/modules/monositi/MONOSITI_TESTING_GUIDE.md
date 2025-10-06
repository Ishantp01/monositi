# Monositi Routes Testing Guide

This guide provides comprehensive testing instructions for the Monositi module API endpoints. Monositi listings are admin-managed accommodations including PGs, Hostels, Flats, and Shared Rooms.

## Prerequisites

1. **Server Running**: Ensure the backend server is running on `http://localhost:5000`
2. **Environment Variables**: Configure `.env` file with all required variables
3. **MongoDB**: Database should be running and accessible
4. **Admin Account**: You'll need admin credentials for creating/updating/deleting listings
5. **Testing Tool**: Use Postman, Thunder Client (VS Code), or curl

## Authentication Setup

Admin routes require authentication. First, you need an admin JWT token:

### 1. Login as Admin
```http
POST http://localhost:5000/api/users/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "adminpassword"
}
```

**Save the token** from the response for admin routes.

---

## Monositi Routes Testing

### 1. Get All Monositi Listings

**Endpoint**: `GET /api/monositi/`  
**Access**: Public
**Query Parameters** (all optional):
- `category`: PG, Hostel, Flat, Shared Room
- `city`: Filter by city name
- `genderPreference`: Boys, Girls, Co-ed, Any
- `minPrice`: Minimum price
- `maxPrice`: Maximum price

**Examples**:

Get all listings:
```http
GET http://localhost:5000/api/monositi/
```

Filter by category:
```http
GET http://localhost:5000/api/monositi/?category=PG
```

Filter by city and price range:
```http
GET http://localhost:5000/api/monositi/?city=Mumbai&minPrice=5000&maxPrice=15000
```

Filter by gender preference:
```http
GET http://localhost:5000/api/monositi/?genderPreference=Boys
```

**Expected Response** (200):
```json
{
  "success": true,
  "count": 3,
  "listings": [
    {
      "_id": "listing_id",
      "title": "Premium PG for Boys",
      "description": "Well-maintained PG with modern amenities",
      "category": "PG",
      "address": "123 Main Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "price": 8000,
      "photos": ["https://cloudinary.com/image1.jpg"],
      "facilities": ["WiFi", "AC", "Food"],
      "genderPreference": "Boys",
      "contactNumber": "9876543210",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 2. Get Single Monositi Listing

**Endpoint**: `GET /api/monositi/:id`  
**Access**: Public

**Example**:
```http
GET http://localhost:5000/api/monositi/67890abcdef12345
```

**Expected Response** (200):
```json
{
  "success": true,
  "listing": {
    "_id": "67890abcdef12345",
    "title": "Premium PG for Boys",
    "description": "Well-maintained PG with modern amenities",
    "category": "PG",
    "address": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "price": 8000,
    "photos": ["https://cloudinary.com/image1.jpg"],
    "facilities": ["WiFi", "AC", "Food"],
    "genderPreference": "Boys",
    "contactNumber": "9876543210"
  }
}
```

**Error Response** (404):
```json
{
  "success": false,
  "message": "Monositi listing not found"
}
```

---

### 3. Create Monositi Listing

**Endpoint**: `POST /api/monositi/`  
**Access**: Admin only
**Content-Type**: `multipart/form-data`

**Headers**:
```
Authorization: Bearer ADMIN_TOKEN_HERE
```

**Body** (Form Data):
```
title: Premium PG for Boys
description: Well-maintained PG with modern amenities
category: PG
address: 123 Main Street
city: Mumbai
state: Maharashtra
price: 8000
facilities: WiFi,AC,Food
genderPreference: Boys
contactNumber: 9876543210
photos: [Upload 1-5 image files]
```

**Example using curl**:
```bash
curl -X POST http://localhost:5000/api/monositi/ \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE" \
  -F "title=Premium PG for Boys" \
  -F "description=Well-maintained PG with modern amenities" \
  -F "category=PG" \
  -F "address=123 Main Street" \
  -F "city=Mumbai" \
  -F "state=Maharashtra" \
  -F "price=8000" \
  -F "facilities=WiFi,AC,Food" \
  -F "genderPreference=Boys" \
  -F "contactNumber=9876543210" \
  -F "photos=@/path/to/image1.jpg" \
  -F "photos=@/path/to/image2.jpg"
```

**Expected Response** (201):
```json
{
  "success": true,
  "message": "Monositi listing created successfully",
  "listing": {
    "_id": "new_listing_id",
    "title": "Premium PG for Boys",
    "description": "Well-maintained PG with modern amenities",
    "category": "PG",
    "address": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "price": 8000,
    "photos": ["https://cloudinary.com/uploaded-image.jpg"],
    "facilities": ["WiFi", "AC", "Food"],
    "genderPreference": "Boys",
    "contactNumber": "9876543210"
  }
}
```

**Error Response** (403):
```json
{
  "message": "Access denied: Admins only"
}
```

---

### 4. Update Monositi Listing

**Endpoint**: `PUT /api/monositi/:id`  
**Access**: Admin only
**Content-Type**: `multipart/form-data`

**Headers**:
```
Authorization: Bearer ADMIN_TOKEN_HERE
```

**Body** (Form Data) - All fields optional:
```
title: Updated Premium PG
price: 9000
facilities: WiFi,AC,Food,Laundry
photos: [Upload new images to replace existing]
```

**Example**:
```http
PUT http://localhost:5000/api/monositi/67890abcdef12345
Authorization: Bearer ADMIN_TOKEN_HERE
Content-Type: multipart/form-data

title=Updated Premium PG
price=9000
facilities=WiFi,AC,Food,Laundry
```

**Expected Response** (200):
```json
{
  "success": true,
  "message": "Monositi listing updated successfully",
  "listing": {
    "_id": "67890abcdef12345",
    "title": "Updated Premium PG",
    "price": 9000,
    "facilities": ["WiFi", "AC", "Food", "Laundry"]
  }
}
```

**Error Response** (404):
```json
{
  "success": false,
  "message": "Monositi listing not found"
}
```

---

### 5. Delete Monositi Listing

**Endpoint**: `DELETE /api/monositi/:id`  
**Access**: Admin only

**Headers**:
```
Authorization: Bearer ADMIN_TOKEN_HERE
```

**Example**:
```http
DELETE http://localhost:5000/api/monositi/67890abcdef12345
Authorization: Bearer ADMIN_TOKEN_HERE
```

**Expected Response** (200):
```json
{
  "success": true,
  "message": "Monositi listing deleted successfully"
}
```

**Error Response** (404):
```json
{
  "success": false,
  "message": "Monositi listing not found"
}
```

---

## Testing Workflow

### Complete Testing Sequence:

1. **Login as Admin** → Get admin JWT token
2. **Get All Listings** → Should return empty array initially
3. **Create Listing** → Add a new PG/Hostel listing with photos
4. **Get All Listings** → Should now show the new listing
5. **Get Single Listing** → Test individual listing retrieval
6. **Update Listing** → Modify listing details and photos
7. **Filter Listings** → Test category, city, price filters
8. **Delete Listing** → Remove the test listing

### Testing Different Categories:

Test with different accommodation types:
- **PG**: Pay Guest accommodations
- **Hostel**: Hostel accommodations
- **Flat**: Apartment/Flat rentals
- **Shared Room**: Shared room accommodations

### Testing Filters:

```http
# Test all filter combinations
GET /api/monositi/?category=PG&city=Mumbai&genderPreference=Boys&minPrice=5000&maxPrice=10000
GET /api/monositi/?category=Hostel&city=Delhi
GET /api/monositi/?minPrice=10000&maxPrice=20000
```

---

## Common Error Responses

### 401 Unauthorized
```json
{
  "message": "Not authorized, no token"
}
```
**Solution**: Include valid JWT token in Authorization header

### 403 Forbidden
```json
{
  "message": "Access denied: Admins only"
}
```
**Solution**: Ensure you're using an admin account

### 404 Not Found
```json
{
  "success": false,
  "message": "Monositi listing not found"
}
```
**Solution**: Check if listing ID is correct

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error"
}
```
**Solution**: Check required fields and data types

---

## Testing Scripts

### Using curl:

```bash
# 1. Login as Admin (replace with your admin credentials)
TOKEN=$(curl -s -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"adminpass"}' \
  | jq -r '.token')

# 2. Create Listing
curl -X POST http://localhost:5000/api/monositi/ \
  -H "Authorization: Bearer $TOKEN" \
  -F "title=Test PG" \
  -F "category=PG" \
  -F "address=123 Test St" \
  -F "city=Mumbai" \
  -F "state=Maharashtra" \
  -F "price=8000" \
  -F "contactNumber=9876543210"

# 3. Get All Listings
curl http://localhost:5000/api/monositi/

# 4. Get Single Listing (replace with actual ID)
curl http://localhost:5000/api/monositi/LISTING_ID

# 5. Update Listing (replace with actual ID)
curl -X PUT http://localhost:5000/api/monositi/LISTING_ID \
  -H "Authorization: Bearer $TOKEN" \
  -F "title=Updated Test PG" \
  -F "price=9000"

# 6. Delete Listing (replace with actual ID)
curl -X DELETE http://localhost:5000/api/monositi/LISTING_ID \
  -H "Authorization: Bearer $TOKEN"
```

### Using Postman:

1. Create a new collection "Monositi Testing"
2. Set up environment variables for tokens and listing IDs
3. Import the requests above as separate requests
4. Use variables like `{{ADMIN_TOKEN}}` and `{{LISTING_ID}}` in requests

---

## Data Models

### Monositi Listing Schema:
```javascript
{
  title: String (required),
  description: String,
  category: String (enum: ["PG", "Hostel", "Flat", "Shared Room"]),
  address: String (required),
  city: String (required),
  state: String (required),
  price: Number (required),
  photos: [String], // Cloudinary URLs
  facilities: [String], // Array of facility names
  genderPreference: String (enum: ["Boys", "Girls", "Co-ed", "Any"]),
  contactNumber: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Photo Upload Testing

- **Maximum 5 photos** per listing
- **Supported formats**: JPEG, JPG, PNG
- **Maximum file size**: 5MB per image
- **Photos are uploaded** to Cloudinary and URLs stored in database
- **Update operation** replaces existing photos with new ones

---

## Security Features Tested

✅ **Authentication Required** for create/update/delete operations
✅ **Admin Role Required** for all modification operations
✅ **Photo Upload Security** with file type and size validation
✅ **Input Validation** for all required fields and data types
✅ **Error Handling** for invalid IDs and missing resources

---

## Notes

- **Admin Only Operations**: Create, Update, Delete require admin privileges
- **Public Access**: Anyone can view listings without authentication
- **Photo Management**: Photos are uploaded to Cloudinary during create/update
- **Filtering**: Multiple query parameters can be combined for advanced filtering
- **Real-time Updates**: Changes are immediately reflected in GET requests
- **Data Persistence**: All listings are stored in MongoDB with proper validation

---

## Troubleshooting

If tests fail, check:

1. **Server logs** for detailed error messages
2. **Database** to verify listing creation and updates
3. **Admin authentication** - ensure you're logged in as admin
4. **File uploads** - check if multer and cloudinary are configured
5. **Network connectivity** to MongoDB and Cloudinary servers

The Monositi module is now fully functional and ready for production use! 🏠
