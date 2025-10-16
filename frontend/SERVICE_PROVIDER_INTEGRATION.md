# Service Provider Integration Documentation

## Overview
Complete service provider system integration allowing users to switch from tenant to service provider role, create and manage services, and access service provider features through a dedicated interface.

## Features Implemented

### 1. Role Switching System
- **Admin Control**: Admins can switch tenants to service providers
- **Role-based UI**: Different navbar options based on user role
- **Automatic Access**: Service provider features unlock automatically

### 2. Service Creation System
- **Create Service Page**: Comprehensive service creation form
- **File Upload**: Support for service images and documents
- **Category Selection**: Predefined service categories
- **Pricing Options**: Base price and variable pricing
- **Availability Management**: Calendar and scheduling options

### 3. Service Management in Profile
- **My Services Tab**: Dedicated tab for service providers
- **Service Cards**: Visual service display with status indicators
- **Status Management**: Activate/deactivate services
- **Service Actions**: Edit, delete, and manage services

### 4. Admin Dashboard Integration
- **Service Verification**: Admin can verify/reject services
- **Service Filtering**: Filter by verification status, activity
- **Service Search**: Search by name, category, provider
- **Role Management**: Switch users to service provider role

## Backend API Integration

### Service Management APIs
```
POST /api/services/create - Create new service
GET /api/services/my-services - Get provider's services
GET /api/services/:id - Get service details
PUT /api/services/:id - Update service
DELETE /api/services/:id - Delete service
PATCH /api/services/:id/toggle-status - Toggle service status
```

### Admin APIs
```
PATCH /api/admin/users/:id/role - Update user role
PATCH /api/admin/services/:id/verify - Verify/reject service
GET /api/admin/services - Get all services (admin view)
```

## Frontend Implementation

### 1. Navbar Updates
**Dynamic Navigation Based on Role:**
```jsx
{role === "serviceProvider" ? (
  <Link to="/create-service" className={buttonClass}>
    Create Service
  </Link>
) : (
  <Link to="/add-property" className={buttonClass}>
    Post Property
  </Link>
)}
```

### 2. CreateService Component
**Location:** `monositi/frontend/src/pages/Services/CreateService.jsx`

**Features:**
- Tabbed interface (Basic Details, Pricing, Media)
- File upload for images and documents
- Form validation and error handling
- Integration with serviceApi

**Key Functions:**
```jsx
const handleSubmit = async (e) => {
  // Create FormData for file upload
  const formDataToSend = new FormData();
  
  // Add text fields and files
  Object.keys(formData).forEach(key => {
    if (key !== 'images' && key !== 'service_docs' && formData[key]) {
      formDataToSend.append(key, formData[key]);
    }
  });
  
  // Call API
  const result = await serviceApi.createService(formDataToSend);
};
```

### 3. Profile Component Updates
**New Services Tab for Service Providers:**
```jsx
{user.role === "serviceProvider" && (
  <button onClick={() => setActiveTab("services")}>
    <Settings className="w-4 h-4" />
    <span>My Services</span>
  </button>
)}
```

**Service Management Functions:**
```jsx
const handleToggleServiceStatus = async (serviceId) => {
  const data = await serviceApi.toggleServiceStatus(serviceId);
  if (data.success) {
    toast.success("Service status updated successfully");
    fetchServices();
  }
};

const handleDeleteService = async (serviceId) => {
  if (!window.confirm("Are you sure?")) return;
  const data = await serviceApi.deleteService(serviceId);
  if (data.success) {
    toast.success("Service deleted successfully");
    fetchServices();
  }
};
```

### 4. Admin Dashboard Updates
**Role Switching Button:**
```jsx
{user.role === 'tenant' && (
  <button onClick={() => handleSwitchToServiceProvider(user._id)}>
    <UserCheck className="w-4 h-4" />
    <span>Make Service Provider</span>
  </button>
)}
```

**Service Verification:**
```jsx
const handleVerifyService = async (serviceId, action) => {
  const response = await apiRequest(`/admin/services/${serviceId}/verify`, "PATCH", { action });
  if (response.success) {
    toast.success(`Service ${action}ed successfully`);
    fetchServices();
  }
};
```

## Service API Extensions

### New Functions Added to serviceApi.js
```javascript
// Create service (for service providers)
createService: async (formData) => {
  const response = await fetch(`${API_BASE_URL}/services/create`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${getAuthToken()}` },
    body: formData
  });
  return await response.json();
},

// Get provider's services
getProviderServices: async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `/services/my-services?${queryString}` : '/services/my-services';
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: getAuthHeaders()
  });
  return await response.json();
},

// Update service
updateService: async (serviceId, formData) => {
  const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${getAuthToken()}` },
    body: formData
  });
  return await response.json();
},

// Delete service
deleteService: async (serviceId) => {
  const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return await response.json();
},

// Toggle service status
toggleServiceStatus: async (serviceId) => {
  const response = await fetch(`${API_BASE_URL}/services/${serviceId}/toggle-status`, {
    method: 'PATCH',
    headers: getAuthHeaders()
  });
  return await response.json();
}
```

## User Experience Flow

### 1. Tenant to Service Provider Journey
1. **Admin Action**: Admin clicks "Make Service Provider" button
2. **Role Update**: User role changes from "tenant" to "serviceProvider"
3. **UI Update**: Navbar shows "Create Service" instead of "Post Property"
4. **Profile Update**: "My Services" tab appears in profile
5. **Access Granted**: User can now create and manage services

### 2. Service Creation Flow
1. **Navigation**: Service provider clicks "Create Service" in navbar
2. **Form Filling**: Complete service details in tabbed interface
3. **File Upload**: Add service images and documents
4. **Submission**: Service created with "pending" verification status
5. **Admin Review**: Admin verifies or rejects the service
6. **Activation**: Verified services become available to customers

### 3. Service Management Flow
1. **Profile Access**: Service provider goes to Profile > My Services
2. **Service Overview**: View all created services with status
3. **Status Control**: Activate/deactivate services as needed
4. **Service Actions**: Edit, delete, or manage individual services
5. **Performance Tracking**: View ratings and booking statistics

## UI Components

### Service Card in Profile
```jsx
<div className="bg-white border border-gray-200 rounded-xl p-6">
  {/* Service Image */}
  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
    {service.images?.[0] ? (
      <img src={service.images[0]} alt={service.service_name} />
    ) : (
      <Settings className="w-6 h-6 text-gray-400" />
    )}
  </div>
  
  {/* Service Details */}
  <div className="flex-1">
    <h4 className="text-lg font-semibold">{service.service_name}</h4>
    <p className="text-sm text-gray-600">{service.category}</p>
    
    {/* Status Badges */}
    <div className="flex items-center space-x-2">
      <span className={`px-2 py-1 rounded-full text-xs ${
        service.monositi_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
      }`}>
        {service.monositi_verified ? 'Verified' : 'Pending'}
      </span>
      <span className={`px-2 py-1 rounded-full text-xs ${
        service.active_status ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {service.active_status ? 'Active' : 'Inactive'}
      </span>
    </div>
    
    {/* Actions */}
    <div className="flex items-center space-x-2 mt-4">
      <button onClick={() => handleToggleServiceStatus(service._id)}>
        {service.active_status ? 'Deactivate' : 'Activate'}
      </button>
      <button onClick={() => handleDeleteService(service._id)}>
        Delete
      </button>
    </div>
  </div>
</div>
```

### Create Service Form Structure
```jsx
<form onSubmit={handleSubmit}>
  {/* Tab Navigation */}
  <nav className="flex space-x-8">
    <button onClick={() => setActiveTab("basic")}>Basic Details</button>
    <button onClick={() => setActiveTab("pricing")}>Pricing & Availability</button>
    <button onClick={() => setActiveTab("media")}>Images & Documents</button>
  </nav>
  
  {/* Tab Content */}
  {activeTab === "basic" && (
    <div className="space-y-6">
      <input name="service_name" placeholder="Service Name" required />
      <select name="category" required>
        {serviceCategories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
      <textarea name="description" placeholder="Service Description" required />
    </div>
  )}
  
  {activeTab === "pricing" && (
    <div className="space-y-6">
      <input name="base_price" type="number" placeholder="Base Price" required />
      <input name="variable_price" type="number" placeholder="Hourly Rate" />
      <textarea name="availability_calendar" placeholder="Availability" />
    </div>
  )}
  
  {activeTab === "media" && (
    <div className="space-y-6">
      <input type="file" multiple accept="image/*" onChange={handleImageChange} />
      <input type="file" multiple accept=".pdf,.doc,.docx" onChange={handleDocChange} />
    </div>
  )}
  
  <button type="submit" disabled={loading}>
    {loading ? "Creating..." : "Create Service"}
  </button>
</form>
```

## Security & Validation

### Backend Validation
- **Role Verification**: Only service providers can create services
- **File Upload Security**: File type and size validation
- **Input Sanitization**: All inputs validated and sanitized
- **Authentication**: JWT token required for all operations

### Frontend Validation
- **Required Fields**: Form validation for mandatory fields
- **File Validation**: Client-side file type and size checks
- **Role-based Access**: UI elements shown based on user role
- **Confirmation Dialogs**: Prevent accidental deletions

## Performance Considerations

### Optimizations
- **Lazy Loading**: Services loaded only when tab is active
- **Image Optimization**: Cloudinary integration for image processing
- **Caching**: Client-side caching of service data
- **Debounced Search**: Prevent excessive API calls

### File Upload
- **Progress Indicators**: Show upload progress for large files
- **Error Handling**: Graceful handling of upload failures
- **File Compression**: Automatic image compression via Cloudinary
- **Multiple Upload**: Support for multiple files simultaneously

## Error Handling

### Common Error Scenarios
1. **Unauthorized Access**: Non-service providers trying to create services
2. **File Upload Failures**: Network issues during file upload
3. **Validation Errors**: Invalid form data submission
4. **API Failures**: Backend service unavailability

### Error Recovery
- **Retry Mechanisms**: Automatic retry for failed uploads
- **Form Persistence**: Save form data on errors
- **User Feedback**: Clear error messages and recovery instructions
- **Fallback Options**: Alternative actions when primary fails

## Testing Recommendations

### Unit Tests
- Service creation form validation
- File upload functionality
- Role-based UI rendering
- API integration functions

### Integration Tests
- End-to-end service creation flow
- Role switching workflow
- Admin verification process
- Profile service management

### User Acceptance Tests
- Service provider onboarding
- Service creation and management
- Admin dashboard functionality
- Customer service discovery

## Future Enhancements

### Advanced Features
- **Service Analytics**: Detailed performance metrics
- **Booking Management**: Integrated booking system
- **Payment Integration**: Direct payment processing
- **Review System**: Customer feedback and ratings

### UI/UX Improvements
- **Drag & Drop**: File upload with drag and drop
- **Rich Text Editor**: Enhanced service description editing
- **Image Editor**: Basic image editing capabilities
- **Bulk Operations**: Manage multiple services simultaneously

### Business Features
- **Subscription Plans**: Tiered service provider plans
- **Commission System**: Revenue sharing model
- **Promotional Tools**: Marketing and promotion features
- **Advanced Analytics**: Business intelligence dashboard

This comprehensive service provider integration provides a complete ecosystem for service providers to join, create, and manage their services while giving admins full control over the verification and management process.