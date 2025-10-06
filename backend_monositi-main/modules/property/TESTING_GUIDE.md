# Property Routes Testing Guide

This guide provides instructions on how to test all property-related API endpoints.

## Prerequisites

1. **Server Running**: Ensure the backend server is running on `http://localhost:5000`
2. **Environment Variables**: Make sure `.env` file is configured with valid credentials
3. **MongoDB**: Database should be running and accessible
4. **Testing Tool**: Use Postman, Thunder Client (VS Code), or curl

## Authentication Setup

Most routes require authentication. First, you need to obtain a JWT token:

### 1. Register a User (if not already registered)
```http
POST http://localhost:5000/api/users/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "testuser@example.com",
  "password": "password123",
  "role": "landlord"
}
```

### 2. Login to Get Token
```http
POST http://localhost:5000/api/users/login
Content-Type: application/json

{
  "email": "testuser@example.com",
  "password": "password123"
}
```

**Save the token** from the response. You'll use it in the `Authorization` header for protected routes:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## Property Routes Testing

### 1. Create Property Listing

**Endpoint**: `POST /api/properties/properties`  
**Access**: Authenticated users  
**Content-Type**: `multipart/form-data`

**Headers**:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body** (Form Data):
```
type: Rent
name: Beautiful 2BHK Apartment
description: Spacious apartment with modern amenities
address: 123 Main Street
city: Mumbai
state: Maharashtra
price: 25000
tags: Furnished, Parking, Wifi
genderPreference: Any
contactNumber: 9876543210
photos: [Upload 1-5 image files]
```

**Example using curl**:
```bash
curl -X POST http://localhost:5000/api/properties/properties \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "type=Rent" \
  -F "name=Beautiful 2BHK Apartment" \
  -F "description=Spacious apartment with modern amenities" \
  -F "address=123 Main Street" \
  -F "city=Mumbai" \
  -F "state=Maharashtra" \
  -F "price=25000" \
  -F "tags=Furnished,Parking,Wifi" \
  -F "genderPreference=Any" \
  -F "contactNumber=9876543210" \
  -F "photos=@/path/to/image1.jpg" \
  -F "photos=@/path/to/image2.jpg"
```

**Expected Response** (201):
```json
{
  "success": true,
  "message": "Property listing created successfully",
  "property": {
    "_id": "property_id",
    "landlord": "user_id",
    "type": "Rent",
    "name": "Beautiful 2BHK Apartment",
    "status": "Pending",
    ...
  }
}
```

---

### 2. Get All Verified Properties

**Endpoint**: `GET /api/properties/properties`  
**Access**: Public  
**Query Parameters** (all optional):
- `type`: Buy, Rent, or Commercial
- `city`: Filter by city name
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `tags`: Comma-separated tags (e.g., "Furnished,Parking")
- `genderPreference`: Boys, Girls, Co-ed, or Any
- `isFeatured`: true or false
- `monositiVerified`: true or false
- `popular`: true or false

**Examples**:

Get all verified properties:
```http
GET http://localhost:5000/api/properties/properties
```

Filter by type and city:
```http
GET http://localhost:5000/api/properties/properties?type=Rent&city=Mumbai
```

Filter by price range:
```http
GET http://localhost:5000/api/properties/properties?minPrice=20000&maxPrice=50000
```

Filter by tags:
```http
GET http://localhost:5000/api/properties/properties?tags=Furnished,Wifi
```

Get featured properties:
```http
GET http://localhost:5000/api/properties/properties?isFeatured=true
```

**Expected Response** (200):
```json
{
  "success": true,
  "count": 5,
  "properties": [
    {
      "_id": "property_id",
      "landlord": {
        "_id": "user_id",
        "name": "Test User",
        "email": "testuser@example.com"
      },
      "type": "Rent",
      "name": "Beautiful 2BHK Apartment",
      "status": "Verified",
      ...
    }
  ]
}
```

---

### 3. Get Property by ID

**Endpoint**: `GET /api/properties/properties/:id`  
**Access**: Public (only verified properties)

**Example**:
```http
GET http://localhost:5000/api/properties/properties/67890abcdef12345
```

**Expected Response** (200):
```json
{
  "success": true,
  "property": {
    "_id": "67890abcdef12345",
    "landlord": {
      "_id": "user_id",
      "name": "Test User",
      "email": "testuser@example.com"
    },
    "type": "Rent",
    "name": "Beautiful 2BHK Apartment",
    ...
  }
}
```

**Error Response** (404):
```json
{
  "success": false,
  "message": "Property not found or not verified"
}
```

---

### 4. Get Properties by Type

**Endpoint**: `GET /api/properties/properties/search/type`  
**Access**: Public  
**Query Parameters**:
- `type`: Required (Buy, Rent, or Commercial)

**Example**:
```http
GET http://localhost:5000/api/properties/properties/search/type?type=Buy
```

**Expected Response** (200):
```json
{
  "success": true,
  "count": 3,
  "properties": [...]
}
```

**Error Response** (400):
```json
{
  "success": false,
  "message": "Invalid or missing type. Allowed: Buy, Rent, Commercial"
}
```

---

### 5. Get User's Properties

**Endpoint**: `GET /api/properties/user/properties`  
**Access**: Authenticated users

**Headers**:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Example**:
```http
GET http://localhost:5000/api/properties/user/properties
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response** (200):
```json
{
  "success": true,
  "count": 2,
  "properties": [
    {
      "_id": "property_id",
      "landlord": {
        "_id": "your_user_id",
        "name": "Your Name",
        "email": "your@email.com"
      },
      "status": "Pending",
      ...
    }
  ]
}
```

---

### 6. Update Property

**Endpoint**: `PUT /api/properties/properties/:id`  
**Access**: Authenticated (Owner only)  
**Content-Type**: `multipart/form-data`

**Headers**:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body** (Form Data) - All fields are optional:
```
name: Updated Apartment Name
description: Updated description
price: 30000
tags: Furnished, Parking
photos: [Upload new images if needed]
```

**Example**:
```http
PUT http://localhost:5000/api/properties/properties/67890abcdef12345
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: multipart/form-data

name=Updated Apartment Name
price=30000
```

**Expected Response** (200):
```json
{
  "success": true,
  "property": {
    "_id": "67890abcdef12345",
    "name": "Updated Apartment Name",
    "status": "Pending",
    ...
  }
}
```

**Error Response** (403 - Not the owner):
```json
{
  "success": false,
  "message": "Not authorized"
}
```

---

## Admin Routes

These routes require admin role. First, login as an admin user.

### 7. Get All Properties (Admin)

**Endpoint**: `GET /api/properties/admin/properties/all`  
**Access**: Admin only

**Headers**:
```
Authorization: Bearer ADMIN_TOKEN_HERE
```

**Example**:
```http
GET http://localhost:5000/api/properties/admin/properties/all
Authorization: Bearer ADMIN_TOKEN_HERE
```

**Expected Response** (200):
```json
{
  "success": true,
  "count": 10,
  "properties": [
    // All properties including Pending, Rejected, Suspended
  ]
}
```

---

### 8. Verify/Reject Property (Admin)

**Endpoint**: `PATCH /api/properties/admin/properties/:id/verify`  
**Access**: Admin only  
**Content-Type**: `application/json`

**Headers**:
```
Authorization: Bearer ADMIN_TOKEN_HERE
Content-Type: application/json
```

**Body**:
```json
{
  "status": "Verified",
  "monositiVerified": true
}
```

or to reject:
```json
{
  "status": "Rejected",
  "monositiVerified": false
}
```

**Example**:
```http
PATCH http://localhost:5000/api/properties/admin/properties/67890abcdef12345/verify
Authorization: Bearer ADMIN_TOKEN_HERE
Content-Type: application/json

{
  "status": "Verified",
  "monositiVerified": true
}
```

**Expected Response** (200):
```json
{
  "success": true,
  "property": {
    "_id": "67890abcdef12345",
    "status": "Verified",
    "monositiVerified": true,
    ...
  }
}
```

---

### 9. Suspend Property (Admin)

**Endpoint**: `PATCH /api/properties/admin/properties/:id/suspend`  
**Access**: Admin only

**Headers**:
```
Authorization: Bearer ADMIN_TOKEN_HERE
```

**Example**:
```http
PATCH http://localhost:5000/api/properties/admin/properties/67890abcdef12345/suspend
Authorization: Bearer ADMIN_TOKEN_HERE
```

**Expected Response** (200):
```json
{
  "success": true,
  "property": {
    "_id": "67890abcdef12345",
    "status": "Suspended",
    ...
  }
}
```

---

## Testing Workflow

### Complete Testing Sequence:

1. **Register/Login** → Get JWT token
2. **Create Property** → Creates property with "Pending" status
3. **Get User's Properties** → Should show your property with "Pending" status
4. **Get All Properties** → Should NOT show your property (not verified yet)
5. **Login as Admin** → Get admin token
6. **Get All Properties (Admin)** → Should show all properties including pending
7. **Verify Property** → Change status to "Verified"
8. **Get All Properties** → Now your property should appear
9. **Get Property by ID** → Test individual property retrieval
10. **Update Property** → Test property updates (status resets to "Pending")
11. **Suspend Property (Admin)** → Test suspension functionality

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
  "success": false,
  "message": "Not authorized"
}
```
**Solution**: You don't have permission (e.g., trying to update someone else's property)

### 404 Not Found
```json
{
  "success": false,
  "message": "Property not found"
}
```
**Solution**: Check if property ID is correct

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid status"
}
```
**Solution**: Check request body/query parameters

---

## Testing Tips

1. **Use Postman Collections**: Create a Postman collection with all these requests for easy reuse
2. **Environment Variables**: Store tokens and IDs as environment variables in Postman
3. **Test Data**: Keep a set of test images ready for upload testing
4. **Different Roles**: Test with different user roles (tenant, landlord, admin)
5. **Edge Cases**: Try invalid IDs, missing required fields, unauthorized access
6. **Filters**: Test all query parameter combinations
7. **Status Transitions**: Test property status flow (Pending → Verified → Suspended)

---

## Quick Test Script (Using curl)

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"password123"}' \
  | jq -r '.token')

# 2. Create Property
curl -X POST http://localhost:5000/api/properties/properties \
  -H "Authorization: Bearer $TOKEN" \
  -F "type=Rent" \
  -F "name=Test Property" \
  -F "address=123 Test St" \
  -F "city=Mumbai" \
  -F "state=Maharashtra" \
  -F "price=25000" \
  -F "contactNumber=9876543210"

# 3. Get All Properties
curl http://localhost:5000/api/properties/properties

# 4. Get User's Properties
curl http://localhost:5000/api/properties/user/properties \
  -H "Authorization: Bearer $TOKEN"
```

---

## Notes

- Properties with "Pending" status are only visible to the owner and admins
- Only "Verified" properties appear in public listings
- Property status resets to "Pending" after any update
- Maximum 5 photos can be uploaded per property
- Supported image formats: JPEG, JPG, PNG
- Maximum file size: 5MB per image

