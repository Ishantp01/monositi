# Service Provider Integration Summary

## Overview
The service provider system has been successfully integrated with the user authentication system. Now service providers can login using their user credentials and access their specific routes and APIs.

## Key Changes Made

### 1. Service Provider Model (`serviceProvider.model.js`)
- Added admin management fields: `isActive`, `approvedBy`, `approvedAt`
- Enhanced the model to support approval workflow
- Maintained the existing `user` reference field

### 2. Service Provider Controller (`service.controller.js`)
- **Admin Functions:**
  - `createServiceProvider`: Admin creates service provider profile for existing user
  - `getAllServiceProviders`: Get all service providers (including inactive)
  - `approveServiceProvider`: Approve pending service providers
  - `deactivateServiceProvider`: Deactivate service providers

- **Self-Registration:**
  - `createMyServiceProviderProfile`: Users can register themselves as service providers (pending approval)

- **Updated Functions:**
  - `listServiceProvidersByCategory`: Only shows active providers
  - `getServiceRequestsForProvider`: Now works with user-service provider relationship
  - `updateServiceRequestStatus`: Properly handles user-service provider relationship

### 3. Service Provider Routes (`service.routes.js`)
- **Admin Routes:**
  - `POST /admin/service-providers` - Create service provider profile
  - `GET /admin/service-providers` - Get all service providers
  - `PATCH /admin/service-providers/:id/approve` - Approve service provider
  - `PATCH /admin/service-providers/:id/deactivate` - Deactivate service provider

- **Self-Registration:**
  - `POST /service-providers/register` - Users register as service providers

### 4. User Controller (`users.controller.js`)
- Added `createServiceProviderUser`: Admin creates service provider user account

### 5. User Routes (`user.routes.js`)
- Added `POST /admin/service-provider-user` - Admin creates service provider user

## Workflow

### Admin Creates Service Provider (Two-Step Process)
1. **Step 1:** Admin creates user account with service provider role
   ```
   POST /api/users/admin/service-provider-user
   Body: { name, email, password, photo }
   ```

2. **Step 2:** Admin creates service provider profile
   ```
   POST /api/services/admin/service-providers
   Body: { userId, name, category, contactNumber, address, city, state, photo, description, experience }
   ```

### User Self-Registration
1. **Step 1:** User registers normally
   ```
   POST /api/users/register
   Body: { name, email, password, photo }
   ```

2. **Step 2:** User creates service provider profile (pending approval)
   ```
   POST /api/services/service-providers/register
   Body: { name, category, contactNumber, address, city, state, photo, description, experience }
   ```

3. **Step 3:** Admin approves the service provider
   ```
   PATCH /api/services/admin/service-providers/:id/approve
   ```

## Authentication Flow
1. Service providers login using their user credentials
2. Their role is automatically set to "serviceProvider" upon approval
3. They can access all service provider routes using their user authentication
4. The service provider profile is linked to their user account via the `user` field

## Access Control
- Only active service providers (`isActive: true`) are shown in public listings
- Service providers can only manage their own service requests
- Admins can manage all service providers and service requests
- Users with role "user" can register as service providers (pending approval)

## Database Relationship
```
User (Main Account)
├── _id (Primary Key)
├── email, password, role, etc.
└── ServiceProvider (Extension Profile)
    ├── user: ObjectId (References User._id)
    ├── name, category, contactNumber, etc.
    └── isActive, approvedBy, approvedAt
```

This integration ensures that service providers have a unified authentication system while maintaining their specialized profile information.

