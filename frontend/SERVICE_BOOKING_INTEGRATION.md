# Service Booking Integration

## Overview
Added service booking functionality to the home page services section. Users can now book services directly from the service provider cards.

## Features Added

### 1. Service Booking Form (`ServiceBookingForm.jsx`)
- **Location**: `src/components/Services/ServiceBookingForm.jsx`
- **Features**:
  - Date and time selection for service
  - Service address input (street, city, state, zip)
  - Estimated amount input
  - Service description/notes
  - Optional image upload
  - Form validation
  - Loading states
  - Toast notifications

### 2. Updated Services Section (`Services.jsx`)
- **Location**: `src/components/sections/Services.jsx`
- **Changes**:
  - Added "Book Now" button to each service provider card
  - Integrated booking form modal
  - State management for form visibility

### 3. Enhanced Service API (`serviceApi.js`)
- **Location**: `src/utils/serviceApi.js`
- **New Method**: `createServiceBooking(bookingData)`
- **Endpoint**: `POST /api/services/bookings`
- **Authentication**: Required (Bearer token)

## API Integration

### Booking Endpoint
```
POST http://localhost:5000/api/services/bookings
```

### Request Format (FormData)
- `service_id`: Service provider ID
- `scheduled_for`: Date and time (ISO format)
- `total_amount`: Estimated cost
- `notes`: Service description
- `service_address`: JSON string with address details
- `images_before`: Multiple image files (optional)

### Response Format
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": { ... }
}
```

## User Flow

1. User navigates to Home page
2. Clicks on "Services" tab
3. Selects a service category (Plumbing, Electrical, etc.)
4. Views available service providers
5. Clicks "Book Now" on desired provider
6. Fills out booking form with:
   - Service date/time
   - Service address
   - Estimated amount
   - Service description
   - Optional photos
7. Submits form
8. Receives confirmation toast

## Authentication
- Users must be logged in to book services
- Form checks for authentication token
- Redirects to login if not authenticated

## Error Handling
- Form validation for required fields
- Network error handling
- User-friendly error messages
- Loading states during submission

## UI/UX Features
- Modal-based form design
- Responsive layout
- Clean, modern styling matching existing design
- Proper form controls and validation
- Image upload with file count display
- Cancel and submit actions