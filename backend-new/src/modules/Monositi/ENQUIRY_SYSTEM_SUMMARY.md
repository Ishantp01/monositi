# Monositi Enquiry System - Implementation Summary

## ✅ What Was Added

### 1. New Model Created
**File:** `backend-new/src/models/MonositiEnquiry.model.js`
- Stores user enquiries about Monositi listings
- Tracks enquiry status (pending → contacted → resolved → closed)
- Stores contact information (name, email, phone)
- Links to listing and optionally to user (if logged in)
- Includes admin notes and timestamps for status changes

### 2. Controller Functions Added
**File:** `backend-new/src/modules/Monositi/monositi.controller.js`

#### Public Function:
- **`sendEnquiry`** - Allows users to send enquiries about a listing (no auth required)

#### Admin Functions:
- **`getAllEnquiries`** - Fetch all enquiries with filters (listing ID, status)
- **`updateEnquiryStatus`** - Update enquiry status and add admin notes

### 3. Routes Added
**File:** `backend-new/src/modules/Monositi/monositi.routes.js`

#### Public Route:
```
POST /api/monositi/public/listings/:id/enquiry
```
- Allows users to send enquiries about a specific listing
- No authentication required
- Includes listing ID in URL

#### Admin Routes:
```
GET /api/monositi/enquiries?listing=&status=
PATCH /api/monositi/enquiries/:enquiryId/status
```
- Admin can view all enquiries
- Admin can update enquiry status and add notes
- Requires authentication + admin role

---

## 📋 API Endpoints Summary

### Public Endpoint (No Auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/monositi/public/listings/:id/enquiry` | Send enquiry about a listing |

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+919876543210",
  "message": "I'm interested in this property",
  "enquiry_type": "general"  // optional
}
```

### Admin Endpoints (Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/monositi/enquiries` | Get all enquiries with filters |
| PATCH | `/api/monositi/enquiries/:enquiryId/status` | Update enquiry status |

**Query Filters (GET):**
- `?listing=64xyz123...` - Filter by listing ID
- `?status=pending` - Filter by status

**Update Body (PATCH):**
```json
{
  "status": "contacted",
  "admin_notes": "Called customer, visit scheduled"
}
```

---

## 🔄 Enquiry Status Flow

```
┌─────────┐    ┌───────────┐    ┌──────────┐    ┌────────┐
│ pending │ -> │ contacted │ -> │ resolved │ -> │ closed │
└─────────┘    └───────────┘    └──────────┘    └────────┘
```

- **pending**: Initial status when enquiry is created
- **contacted**: Admin has contacted the user
- **resolved**: Enquiry has been successfully resolved
- **closed**: Enquiry is closed

---

## 📊 Database Schema

```javascript
MonositiEnquiry {
  listing: ObjectId (ref: MonositiListing) - Required
  user: ObjectId (ref: User) - Optional
  name: String - Required
  email: String - Required
  phone: String - Required
  message: String - Required
  enquiry_type: Enum [general, booking, pricing, visit, other]
  status: Enum [pending, contacted, resolved, closed]
  admin_notes: String
  contacted_at: Date (auto-set)
  resolved_at: Date (auto-set)
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

**Indexes:**
- `listing + status` - For efficient filtering
- `createdAt (desc)` - For sorting

---

## 🎯 Features

### User Features
✅ Send enquiry without login  
✅ Enquiry automatically linked to user if logged in  
✅ Specify enquiry type (general, booking, pricing, visit, other)  
✅ Get confirmation message after sending  

### Admin Features
✅ View all enquiries in one place  
✅ Filter by listing or status  
✅ Update enquiry status  
✅ Add notes for each enquiry  
✅ Auto-timestamps for contacted/resolved status  
✅ See full listing details with each enquiry  
✅ See user details if they were logged in  

---

## 🔐 Security

- Public route allows anyone to send enquiries
- Admin routes protected by `protect` + `adminOnly` middleware
- Validates listing exists before creating enquiry
- Validates required fields (name, email, phone, message)

---

## 📱 Frontend Integration

### User Side - Send Enquiry
```javascript
// On property detail page
const handleSendEnquiry = async (formData) => {
  const response = await fetch(
    `${API_URL}/api/monositi/public/listings/${listingId}/enquiry`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    }
  );
  const data = await response.json();
  if (data.success) {
    alert('Enquiry sent! We will contact you soon.');
  }
};
```

### Admin Side - View Enquiries
```javascript
// In admin dashboard
const fetchEnquiries = async (filters) => {
  const query = new URLSearchParams(filters);
  const response = await fetch(
    `${API_URL}/api/monositi/enquiries?${query}`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  const data = await response.json();
  return data.data; // Array of enquiries
};

// Usage
const allEnquiries = await fetchEnquiries({});
const pendingOnly = await fetchEnquiries({ status: 'pending' });
const forListing = await fetchEnquiries({ listing: listingId });
```

### Admin Side - Update Status
```javascript
const updateEnquiry = async (enquiryId, updates) => {
  const response = await fetch(
    `${API_URL}/api/monositi/enquiries/${enquiryId}/status`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    }
  );
  const data = await response.json();
  return data.data;
};

// Usage
await updateEnquiry(enquiryId, {
  status: 'contacted',
  admin_notes: 'Called customer. Visit on Monday.'
});
```

---

## 📁 Files Modified/Created

### Created:
1. `backend-new/src/models/MonositiEnquiry.model.js` - Enquiry model
2. `backend-new/src/modules/Monositi/ENQUIRY_API_DOCUMENTATION.md` - Full API docs
3. `backend-new/src/modules/Monositi/ENQUIRY_SYSTEM_SUMMARY.md` - This file

### Modified:
1. `backend-new/src/modules/Monositi/monositi.controller.js` - Added 3 new functions
2. `backend-new/src/modules/Monositi/monositi.routes.js` - Added 3 new routes

---

## ✅ Testing Commands

### 1. Send Enquiry (Public)
```bash
curl -X POST http://localhost:5000/api/monositi/public/listings/YOUR_LISTING_ID/enquiry \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+919876543210",
    "message": "I want more information about this property",
    "enquiry_type": "general"
  }'
```

### 2. Get All Enquiries (Admin)
```bash
curl http://localhost:5000/api/monositi/enquiries \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 3. Get Pending Enquiries (Admin)
```bash
curl http://localhost:5000/api/monositi/enquiries?status=pending \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 4. Update Enquiry Status (Admin)
```bash
curl -X PATCH http://localhost:5000/api/monositi/enquiries/ENQUIRY_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "status": "contacted",
    "admin_notes": "Spoke with customer. They will visit tomorrow."
  }'
```

---

## 🎨 UI Suggestions

### User Side (Property Detail Page)
- Add "Enquire Now" button on listing detail page
- Show a form modal with fields:
  - Name (text input)
  - Email (email input)
  - Phone (tel input)
  - Message (textarea)
  - Enquiry Type (dropdown: general, booking, pricing, visit, other)
- Show success message after submission
- Pre-fill name/email/phone if user is logged in

### Admin Side (Dashboard)
- Create "Enquiries" section in admin panel
- Show table with columns:
  - Listing Title + Image
  - User Name + Contact Info
  - Message
  - Enquiry Type
  - Status (with color coding)
  - Date
  - Actions (View, Update Status)
- Add filters:
  - By Status (dropdown)
  - By Listing (search/select)
  - By Date Range
- Add status update modal:
  - Status dropdown
  - Admin notes textarea
  - Save button
- Show badge/count of pending enquiries

### Color Coding for Status
- 🟡 Pending - Yellow
- 🔵 Contacted - Blue
- 🟢 Resolved - Green
- ⚫ Closed - Gray

---

## 🚀 Next Steps

1. **Frontend Implementation**
   - Create enquiry form component for users
   - Create admin enquiry management page
   - Add enquiry notifications for admins

2. **Enhancements** (Optional)
   - Email notifications to admin when new enquiry arrives
   - Email confirmation to user after enquiry submission
   - WhatsApp integration for instant notifications
   - Auto-close resolved enquiries after X days
   - Add file attachments to enquiries
   - Export enquiries to CSV

3. **Analytics** (Optional)
   - Track response time (time to first contact)
   - Conversion rate (enquiries to bookings)
   - Popular enquiry types
   - Peak enquiry times

---

## 📝 Notes

- Enquiries are stored permanently (not deleted)
- All enquiries are visible to all admins
- Users can send multiple enquiries for the same listing
- Listing ID is required and validated before creating enquiry
- If user is logged in, their ID is automatically linked
- Timestamps are automatically managed by Mongoose

