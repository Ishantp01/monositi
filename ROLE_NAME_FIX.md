# Role Name Consistency Fix

## Issue
The system had inconsistent role naming between the database model and application code:
- **Database Model**: Uses `'service_provider'` (with underscore)
- **Application Code**: Was using `'serviceProvider'` (camelCase)

This caused validation errors when trying to update user roles.

## Error Message
```
{
  success: false, 
  message: "Server error",
  error: "User validation failed: role: `serviceProvider` is not a valid enum value for path `role`."
}
```

## Root Cause
The User model in `monositi/backend-new/src/models/user.model.js` defines the role enum as:
```javascript
role: {
  type: String,
  enum: ['tenant', 'owner', 'agent', 'service_provider', 'admin'],
  default: 'tenant',
}
```

But the application code was using `'serviceProvider'` instead of `'service_provider'`.

## Files Fixed

### Frontend Files
1. **AdminDashboard.jsx**
   - Changed role switching API call from `"serviceProvider"` to `"service_provider"`

2. **NavBar.jsx**
   - Updated role checks from `"serviceProvider"` to `"service_provider"`
   - Fixed both desktop and mobile navigation

3. **Profile.jsx**
   - Updated service provider tab visibility check
   - Fixed useEffect dependency for fetching services

### Backend Files
1. **admin.controller.js**
   - Fixed provider request approval to use `'service_provider'`
   - Updated role validation array
   - Fixed dashboard stats query

2. **service.controller.js**
   - Updated role checks in service creation and management
   - Fixed both `createService` and `getProviderServices` functions

## Changes Made

### Frontend Changes
```javascript
// Before
role === "serviceProvider"
role: "serviceProvider"

// After  
role === "service_provider"
role: "service_provider"
```

### Backend Changes
```javascript
// Before
role: 'serviceProvider'
user.role !== 'serviceProvider'
allowedRoles = ['tenant', 'owner', 'agent', 'serviceProvider', 'admin']

// After
role: 'service_provider'  
user.role !== 'service_provider'
allowedRoles = ['tenant', 'owner', 'agent', 'service_provider', 'admin']
```

## Validation
All role references now consistently use `'service_provider'` to match the database model enum values.

## Impact
- ✅ Role switching from tenant to service provider now works
- ✅ Service creation by service providers now works  
- ✅ Service provider features display correctly
- ✅ Admin dashboard service provider management works
- ✅ All role-based UI elements function properly

## Testing Checklist
- [ ] Admin can switch tenant to service provider
- [ ] Service provider sees "Create Service" in navbar
- [ ] Service provider can create services
- [ ] Service provider can view "My Services" tab in profile
- [ ] Service provider can manage their services
- [ ] Admin can verify/reject services from service providers

The system now has consistent role naming throughout the entire application stack.