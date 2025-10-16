# Profile System Documentation

## Overview
Comprehensive profile management system integrated with the new backend API. Users can view and update their profile information, upload KYC documents, and track verification status.

## Features Implemented

### 🔐 **Profile Management**
- **View Profile**: Display user information with modern UI
- **Edit Profile**: Update name, email, and profile image
- **Real-time Updates**: Instant profile updates with toast notifications
- **Responsive Design**: Works seamlessly on desktop and mobile

### 📄 **KYC Document Management**
- **Document Upload**: Upload multiple KYC documents (images/PDF)
- **Document Viewing**: View uploaded documents in grid layout
- **Verification Status**: Track KYC verification progress
- **File Validation**: Support for JPG, PNG, PDF with size limits

### 🔔 **Contact Preferences Management**
- **Notification Settings**: Control email, SMS, and WhatsApp notifications
- **Toggle Controls**: Easy on/off switches for each notification type
- **Real-time Updates**: Instant preference updates with backend sync
- **Notification Types**: Property updates, service updates, account updates

### 🎨 **Modern UI Components**
- **Animated Interface**: Smooth animations using Framer Motion
- **Status Indicators**: Visual verification status badges
- **Tabbed Interface**: Organized profile and KYC sections
- **Gradient Headers**: Beautiful gradient backgrounds

## Backend API Integration

### 1. Get Profile
- **Endpoint**: `GET /api/users/users/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: User profile data with verification status

### 2. Update Profile
- **Endpoint**: `PUT /api/users/users/me`
- **Headers**: `Authorization: Bearer <token>`
- **Payload**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "profile_img": "https://example.com/photo.jpg"
  }
  ```

### 3. Upload KYC Documents
- **Endpoint**: `PATCH /api/users/users/me/kyc`
- **Headers**: `Authorization: Bearer <token>`
- **Content-Type**: `multipart/form-data`
- **Files**: Up to 5 files with field name `kycDocs`

### 4. Update Contact Preferences
- **Endpoint**: `PATCH /api/users/users/me/contact-preferences`
- **Headers**: `Authorization: Bearer <token>`
- **Payload**:
  ```json
  {
    "email": true,
    "sms": false,
    "whatsapp": true
  }
  ```

## Component Structure

### Profile.jsx
- **Location**: `src/pages/Profile.jsx`
- **Dependencies**: 
  - Framer Motion for animations
  - Lucide React for icons
  - React Toastify for notifications
  - Custom API utility

### Key State Variables
```javascript
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
const [isEditing, setIsEditing] = useState(false);
const [editedUser, setEditedUser] = useState({});
const [kycFiles, setKycFiles] = useState([]);
const [kycUploading, setKycUploading] = useState(false);
const [activeTab, setActiveTab] = useState("profile");
```

## UI Sections

### 1. Profile Header
- **User Avatar**: Profile image with verification badge
- **User Info**: Name, phone, email display
- **Status Badges**: Role and verification status
- **Edit Controls**: Edit/Save/Cancel buttons

### 2. Tabbed Interface
- **Profile Tab**: Personal information management
- **KYC Tab**: Document upload and verification
- **Preferences Tab**: Communication and notification settings

### 3. Profile Details Tab
- **View Mode**: Display user information in organized layout
- **Edit Mode**: Form inputs for updating profile data
- **Contact Info**: Phone and email display
- **Account Status**: Verification and membership details

### 4. KYC Documents Tab
- **Status Overview**: Current verification status
- **Document Gallery**: Grid view of uploaded documents
- **Upload Interface**: File selection and upload controls
- **Progress Tracking**: Upload progress and status

### 5. Contact Preferences Tab
- **Notification Controls**: Toggle switches for each notification type
- **Email Preferences**: Control email notifications
- **SMS Preferences**: Control SMS notifications
- **WhatsApp Preferences**: Control WhatsApp notifications
- **Save Functionality**: Update preferences with backend sync
- **Information Panel**: Details about notification types

## Verification Status System

### Status Types
1. **Pending**: Documents under review
2. **Verified**: Documents approved
3. **Rejected**: Documents rejected, need resubmission

### Visual Indicators
- **Icons**: CheckCircle, Clock, AlertCircle
- **Colors**: Green (verified), Yellow (pending), Red (rejected)
- **Badges**: Colored status badges with text

### Monositi Verification
- **Special Badge**: Green checkmark for Monositi verified users
- **Premium Features**: Access to enhanced features
- **Trust Indicator**: Builds user trust and credibility

## File Upload System

### Supported Formats
- **Images**: JPG, PNG
- **Documents**: PDF
- **Size Limit**: 5MB per file
- **Quantity**: Maximum 5 files

### Upload Process
1. **File Selection**: Multiple file selection with validation
2. **Preview**: Display selected files with size info
3. **Upload**: FormData submission to backend
4. **Feedback**: Progress indication and success/error messages
5. **Refresh**: Automatic profile refresh after upload

## Error Handling

### Authentication Errors
- **No Token**: Redirect to login page
- **Invalid Token**: Show error and redirect to auth
- **Expired Token**: Automatic logout and redirect

### API Errors
- **Network Issues**: Toast error messages
- **Validation Errors**: Field-specific error display
- **Upload Failures**: Retry options and error details

### User Feedback
- **Success Messages**: Green toast notifications
- **Error Messages**: Red toast notifications
- **Loading States**: Spinner animations and disabled buttons

## Responsive Design

### Mobile Optimization
- **Flexible Layout**: Adapts to screen sizes
- **Touch-Friendly**: Large buttons and touch targets
- **Readable Text**: Appropriate font sizes
- **Optimized Images**: Responsive image sizing

### Desktop Features
- **Multi-Column Layout**: Efficient space usage
- **Hover Effects**: Interactive hover states
- **Keyboard Navigation**: Full keyboard accessibility

## Security Features

### Data Protection
- **Token Validation**: Secure API authentication
- **Input Sanitization**: XSS prevention
- **File Validation**: Secure file upload handling
- **HTTPS Only**: Secure data transmission

### Privacy Controls
- **Profile Visibility**: User-controlled information display
- **Document Security**: Secure document storage
- **Access Control**: Role-based feature access

## Performance Optimizations

### Loading Strategies
- **Lazy Loading**: Images loaded on demand
- **Skeleton Loading**: Smooth loading transitions
- **Caching**: LocalStorage for user data
- **Optimistic Updates**: Immediate UI updates

### Animation Performance
- **Hardware Acceleration**: GPU-accelerated animations
- **Reduced Motion**: Respect user preferences
- **Smooth Transitions**: 60fps animations

## Usage Examples

### Basic Profile Update
```javascript
// Update user profile
const handleSave = async () => {
  const data = await apiRequest("/users/users/me", "PUT", {
    name: editedUser.name,
    email: editedUser.email,
    profile_img: editedUser.profile_img
  });
  
  if (data.success) {
    setUser(data.user);
    toast.success("Profile updated successfully!");
  }
};
```

### KYC Document Upload
```javascript
// Upload KYC documents
const handleKycUpload = async () => {
  const formData = new FormData();
  kycFiles.forEach((file) => {
    formData.append('kycDocs', file);
  });

  const response = await fetch(`${API_URL}/users/users/me/kyc`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
};
```

## Testing Scenarios

### Profile Management
1. **View Profile**: Load and display user data
2. **Edit Profile**: Update name, email, profile image
3. **Cancel Edit**: Revert changes without saving
4. **Save Changes**: Persist updates to backend

### KYC Management
1. **View Documents**: Display uploaded KYC documents
2. **Upload New**: Select and upload multiple files
3. **File Validation**: Test file type and size limits
4. **Status Tracking**: Monitor verification progress

### Error Scenarios
1. **Network Failure**: Handle API connection issues
2. **Invalid Files**: Reject unsupported file types
3. **Large Files**: Handle file size limit exceeded
4. **Authentication**: Handle token expiration

## Future Enhancements

### Planned Features
1. **Profile Photo Upload**: Direct image upload from device
2. **Document Scanner**: Mobile camera integration
3. **Verification Timeline**: Step-by-step progress tracking
4. **Notification Center**: In-app notification system
5. **Privacy Settings**: Granular privacy controls

### Technical Improvements
1. **Real-time Updates**: WebSocket integration
2. **Offline Support**: PWA capabilities
3. **Advanced Validation**: Enhanced form validation
4. **Accessibility**: WCAG compliance improvements

## Conclusion

The new Profile system provides a comprehensive, user-friendly interface for managing personal information and KYC documents. It integrates seamlessly with the new backend API and offers a modern, responsive experience across all devices.