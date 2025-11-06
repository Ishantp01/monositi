# Monositi Enquiry API Documentation

## Overview
The enquiry system allows users to send inquiries about Monositi listings (commercial, hostel_pg, land_plot) to admins. This document covers the enquiry endpoints and their usage.

---

## Public Endpoints (No Authentication Required)

### 1. Send Enquiry
**POST** `/api/monositi/public/listings/:id/enquiry`

Allows users to send an enquiry about a specific listing to the admin.

#### Request Parameters
- **URL Parameter:**
  - `id` (required) - The listing ID

#### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+919876543210",
  "message": "I am interested in this property. Please provide more details.",
  "enquiry_type": "general"  // optional: general, booking, pricing, visit, other
}
```

#### Required Fields
- `name` - User's full name
- `email` - User's email address
- `phone` - User's phone number
- `message` - Enquiry message

#### Optional Fields
- `enquiry_type` - Type of enquiry (default: "general")
  - Options: `general`, `booking`, `pricing`, `visit`, `other`

#### Success Response
```json
{
  "success": true,
  "message": "Enquiry sent successfully. We will contact you soon.",
  "data": {
    "_id": "64abc123def456...",
    "listing": "64xyz789abc123...",
    "user": null,  // or user ID if logged in
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "message": "I am interested in this property...",
    "enquiry_type": "general",
    "status": "pending",
    "createdAt": "2025-11-06T10:30:00.000Z",
    "updatedAt": "2025-11-06T10:30:00.000Z"
  }
}
```

#### Error Responses

**400 Bad Request** - Missing required fields
```json
{
  "success": false,
  "message": "name, email, phone, and message are required"
}
```

**404 Not Found** - Listing doesn't exist
```json
{
  "success": false,
  "message": "Listing not found"
}
```

---

## Admin Endpoints (Authentication + Admin Role Required)

### 2. Get All Enquiries
**GET** `/api/monositi/enquiries?listing=&status=`

Fetch all enquiries with optional filters.

#### Query Parameters
- `listing` (optional) - Filter by listing ID
- `status` (optional) - Filter by status: `pending`, `contacted`, `resolved`, `closed`

#### Example Request
```
GET /api/monositi/enquiries?status=pending
GET /api/monositi/enquiries?listing=64xyz789abc123
```

#### Success Response
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "64abc123def456...",
      "listing": {
        "_id": "64xyz789abc123...",
        "title": "Modern Commercial Space",
        "category": "commercial",
        "location": {
          "city": "Mumbai",
          "state": "Maharashtra"
        },
        "images": ["https://..."]
      },
      "user": {
        "_id": "64user123...",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+919876543210"
      },
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+919876543210",
      "message": "I am interested in this property...",
      "enquiry_type": "pricing",
      "status": "pending",
      "admin_notes": null,
      "contacted_at": null,
      "resolved_at": null,
      "createdAt": "2025-11-06T10:30:00.000Z",
      "updatedAt": "2025-11-06T10:30:00.000Z"
    }
  ]
}
```

---

### 3. Update Enquiry Status
**PATCH** `/api/monositi/enquiries/:enquiryId/status`

Update the status of an enquiry and add admin notes.

#### Request Parameters
- **URL Parameter:**
  - `enquiryId` (required) - The enquiry ID

#### Request Body
```json
{
  "status": "contacted",  // pending, contacted, resolved, closed
  "admin_notes": "Called the customer. They will visit on Monday."
}
```

#### Fields
- `status` (optional) - Update enquiry status
  - Options: `pending`, `contacted`, `resolved`, `closed`
  - Auto-updates `contacted_at` when set to "contacted"
  - Auto-updates `resolved_at` when set to "resolved"
- `admin_notes` (optional) - Add admin notes

#### Success Response
```json
{
  "success": true,
  "message": "Enquiry updated successfully",
  "data": {
    "_id": "64abc123def456...",
    "listing": "64xyz789abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "message": "I am interested in this property...",
    "enquiry_type": "general",
    "status": "contacted",
    "admin_notes": "Called the customer. They will visit on Monday.",
    "contacted_at": "2025-11-06T11:00:00.000Z",
    "resolved_at": null,
    "createdAt": "2025-11-06T10:30:00.000Z",
    "updatedAt": "2025-11-06T11:00:00.000Z"
  }
}
```

---

## Enquiry Status Flow

```
pending → contacted → resolved → closed
```

- **pending**: Initial status when enquiry is created
- **contacted**: Admin has contacted the user
- **resolved**: Enquiry has been successfully resolved
- **closed**: Enquiry is closed (no further action needed)

---

## Frontend Integration Examples

### Send Enquiry (User Side)
```javascript
const sendEnquiry = async (listingId, enquiryData) => {
  try {
    const response = await fetch(
      `${API_URL}/api/monositi/public/listings/${listingId}/enquiry`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enquiryData),
      }
    );
    
    const data = await response.json();
    
    if (data.success) {
      alert('Enquiry sent successfully! We will contact you soon.');
    }
  } catch (error) {
    console.error('Error sending enquiry:', error);
  }
};

// Usage
sendEnquiry('64xyz789abc123', {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+919876543210',
  message: 'I want to know more about this property',
  enquiry_type: 'general'
});
```

### Get All Enquiries (Admin Side)
```javascript
const getEnquiries = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(
      `${API_URL}/api/monositi/enquiries?${queryParams}`,
      {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      }
    );
    
    const data = await response.json();
    return data.data; // Array of enquiries
  } catch (error) {
    console.error('Error fetching enquiries:', error);
  }
};

// Usage
const pendingEnquiries = await getEnquiries({ status: 'pending' });
const listingEnquiries = await getEnquiries({ listing: '64xyz789abc123' });
```

### Update Enquiry Status (Admin Side)
```javascript
const updateEnquiryStatus = async (enquiryId, updates) => {
  try {
    const response = await fetch(
      `${API_URL}/api/monositi/enquiries/${enquiryId}/status`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify(updates),
      }
    );
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Enquiry updated:', data.data);
    }
  } catch (error) {
    console.error('Error updating enquiry:', error);
  }
};

// Usage
updateEnquiryStatus('64abc123def456', {
  status: 'contacted',
  admin_notes: 'Called the customer. Visit scheduled for Monday.'
});
```

---

## Database Schema

### MonositiEnquiry Model
```javascript
{
  listing: ObjectId (ref: MonositiListing) - Required
  user: ObjectId (ref: User) - Optional (if user is logged in)
  name: String - Required
  email: String - Required
  phone: String - Required
  message: String - Required
  enquiry_type: String - Enum: [general, booking, pricing, visit, other]
  status: String - Enum: [pending, contacted, resolved, closed]
  admin_notes: String - Optional
  contacted_at: Date - Auto-set when status becomes "contacted"
  resolved_at: Date - Auto-set when status becomes "resolved"
  createdAt: Date - Auto-generated
  updatedAt: Date - Auto-generated
}
```

### Indexes
- `listing + status` - For efficient filtering
- `createdAt (desc)` - For sorting by newest first

---

## Notes

1. **Public Access**: Users don't need to be logged in to send enquiries
2. **User Tracking**: If a user is logged in, their user ID is automatically associated with the enquiry
3. **Email Validation**: Basic email format is validated by the model
4. **Listing Verification**: Enquiries can be sent for any listing (verified or not), but typically you'd want to validate on the frontend
5. **Admin Dashboard**: Admins can view all enquiries, filter by listing or status, and update status with notes

---

## Testing

### Test Send Enquiry (Public)
```bash
curl -X POST http://localhost:5000/api/monositi/public/listings/YOUR_LISTING_ID/enquiry \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+919876543210",
    "message": "Test enquiry message",
    "enquiry_type": "general"
  }'
```

### Test Get Enquiries (Admin)
```bash
curl http://localhost:5000/api/monositi/enquiries?status=pending \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Test Update Enquiry Status (Admin)
```bash
curl -X PATCH http://localhost:5000/api/monositi/enquiries/ENQUIRY_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "status": "contacted",
    "admin_notes": "Test admin note"
  }'
```

