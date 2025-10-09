 Service Provider Registration Workflow

 Overview
This document outlines the complete workflow for how a user can become a service provider, including all API endpoints and testing scenarios.

 Workflow Options

 Option 1: User Self-Registration (Recommended)
This is the most common workflow where users register themselves as service providers.

 Option 2: Admin Creates Service Provider
This is for when admins want to onboard service providers directly.

---

 Option 1: User Self-Registration Workflow

 Step 1: User Registration
Endpoint: `POST /api/users/register`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "photo": "https://example.com/photo.jpg"
}
```

Response:
```json
{
  "success": true,
  "message": "User registered. Please verify your email with the OTP sent."
}
```

 Step 2: Email Verification
Endpoint: `POST /api/users/verify-email`
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

Response:
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

 Step 3: User Login
Endpoint: `POST /api/users/login`
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "user": {
    "_id": "user_id_here",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "photo": "https://example.com/photo.jpg"
  },
  "token": "jwt_token_here"
}
```

 Step 4: Apply as Service Provider
Endpoint: `POST /api/services/service-providers/register`
Headers: `Authorization: Bearer jwt_token_here`
Content-Type: `multipart/form-data` (for photo upload)

```json
{
  "name": "John's Plumbing Services",
  "category": "Plumbing",
  "contactNumber": "+1234567890",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "description": "Professional plumbing services",
  "experience": 5,
  "photo": "file_upload_here"
}
```

Response:
```json
{
  "success": true,
  "message": "Service provider profile created successfully. Pending admin approval.",
  "provider": {
    "_id": "provider_id_here",
    "user": "user_id_here",
    "name": "John's Plumbing Services",
    "category": "Plumbing",
    "isActive": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

 Step 5: Admin Approval (Admin Action)
Endpoint: `PATCH /api/services/admin/service-providers/:provider_id/approve`
Headers: `Authorization: Bearer admin_jwt_token`

Response:
```json
{
  "success": true,
  "message": "Service provider approved successfully",
  "provider": {
    "_id": "provider_id_here",
    "user": "user_id_here",
    "isActive": true,
    "approvedBy": "admin_user_id",
    "approvedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

 Step 6: Service Provider Login (After Approval)
Endpoint: `POST /api/users/login`
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "user": {
    "_id": "user_id_here",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "serviceProvider",  // Role updated!
    "photo": "https://example.com/photo.jpg"
  },
  "token": "jwt_token_here"
}
```

 Step 7: Access Service Provider Features
Now the user can access all service provider routes:

Get Profile:
`GET /api/services/provider/profile`

Update Availability:
`PATCH /api/services/provider/availability`
```json
{
  "availability": "Available"
}
```

View Service Requests:
`GET /api/services/service-requests/provider`

---

 Option 2: Admin Creates Service Provider

 Step 1: Admin Creates User Account
Endpoint: `POST /api/users/admin/service-provider-user`
Headers: `Authorization: Bearer admin_jwt_token`

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "password123",
  "photo": "https://example.com/photo.jpg"
}
```

Response:
```json
{
  "success": true,
  "message": "Service Provider user created successfully. Now create their service provider profile.",
  "user": {
    "_id": "user_id_here",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "serviceProvider"
  }
}
```

 Step 2: Admin Creates Service Provider Profile
Endpoint: `POST /api/services/admin/service-providers`
Headers: `Authorization: Bearer admin_jwt_token`
Content-Type: `multipart/form-data`

```json
{
  "userId": "user_id_here",
  "name": "Jane's Electrical Services",
  "category": "Electrical",
  "contactNumber": "+1234567890",
  "address": "456 Oak St",
  "city": "Los Angeles",
  "state": "CA",
  "description": "Professional electrical services",
  "experience": 8,
  "photo": "file_upload_here"
}
```

Response:
```json
{
  "success": true,
  "message": "Service provider profile created successfully",
  "provider": {
    "_id": "provider_id_here",
    "user": "user_id_here",
    "name": "Jane's Electrical Services",
    "category": "Electrical",
    "isActive": true,
    "approvedBy": "admin_user_id",
    "approvedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

 Step 3: Service Provider Login
Endpoint: `POST /api/users/login`
```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "user": {
    "_id": "user_id_here",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "serviceProvider",
    "photo": "https://example.com/photo.jpg"
  },
  "token": "jwt_token_here"
}
```

---

 Testing Scenarios

 Test Case 1: Complete Self-Registration Flow
1. Register user
2. Verify email
3. Login as user
4. Apply as service provider
5. Login as admin
6. Approve service provider
7. Login as service provider
8. Access service provider features

 Test Case 2: Admin Creates Service Provider
1. Login as admin
2. Create service provider user
3. Create service provider profile
4. Login as service provider
5. Access service provider features

 Test Case 3: Error Handling
1. Try to register as service provider without being logged in
2. Try to register as service provider when already having a profile
3. Try to approve non-existent service provider
4. Try to access service provider routes without proper role

---

 API Testing with Postman/Thunder Client

 Environment Variables
```
base_url = http://localhost:5000/api
admin_token = your_admin_jwt_token
user_token = your_user_jwt_token
service_provider_token = your_service_provider_jwt_token
```

 Collection Structure
```
📁 Service Provider Workflow
├── 📁 User Registration
│   ├── POST Register User
│   ├── POST Verify Email
│   └── POST Login User
├── 📁 Service Provider Registration
│   ├── POST Apply as Service Provider
│   ├── GET My Profile (as user)
│   └── GET Service Provider Profile (after approval)
├── 📁 Admin Management
│   ├── GET All Service Providers
│   ├── PATCH Approve Service Provider
│   ├── PATCH Deactivate Service Provider
│   └── POST Create Service Provider (Admin)
└── 📁 Service Provider Features
    ├── GET My Profile
    ├── PATCH Update Availability
    ├── GET My Service Requests
    └── PATCH Update Request Status
```

---

 Database States During Workflow

 After User Registration
```json
User: {
  "_id": "user_id",
  "role": "user",
  "verified": true
}
ServiceProvider: null
```

 After Service Provider Application
```json
User: {
  "_id": "user_id",
  "role": "user",
  "verified": true
}
ServiceProvider: {
  "_id": "provider_id",
  "user": "user_id",
  "isActive": false,
  "approvedBy": null,
  "approvedAt": null
}
```

 After Admin Approval
```json
User: {
  "_id": "user_id",
  "role": "serviceProvider",
  "verified": true
}
ServiceProvider: {
  "_id": "provider_id",
  "user": "user_id",
  "isActive": true,
  "approvedBy": "admin_id",
  "approvedAt": "2024-01-01T00:00:00.000Z"
}
```

---

 Frontend Integration Points

 Registration Form
- User registration form
- Email verification form
- Service provider application form

 Admin Dashboard
- Service provider management
- Approval/rejection interface
- Service provider creation form

 Service Provider Dashboard
- Profile management
- Service request management
- Availability updates

This workflow ensures a smooth transition from regular user to service provider with proper validation and admin oversight.
