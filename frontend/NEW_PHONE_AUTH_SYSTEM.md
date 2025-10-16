# New Phone-Based Authentication System

## Overview
Updated the frontend authentication system to work with the new backend that uses phone-based OTP authentication via WhatsApp. This system provides a unified login/signup experience with automatic user registration.

## New Backend API Structure

### Base URL: `http://localhost:5000/api`

### 1. Send OTP
- **Endpoint**: `POST /api/users/send-otp`
- **Payload**: 
  ```json
  {
    "phone": "+919876543210"
  }
  ```
- **Response**: 
  ```json
  {
    "success": true,
    "message": "OTP sent via WhatsApp"
  }
  ```

### 2. Verify OTP (Login/Register)
- **Endpoint**: `POST /api/users/verify-otp`
- **Payload**:
  ```json
  {
    "phone": "+919876543210",
    "otp": "123456"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "OTP verified successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "phone": "+919876543210",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "tenant",
      "verification_status": "pending",
      "monositi_verified": false
    }
  }
  ```

### 3. Update Profile
- **Endpoint**: `PUT /api/users/update-profile`
- **Headers**: `Authorization: Bearer <token>`
- **Payload**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "profile_img": "https://example.com/photo.jpg"
  }
  ```

## Frontend Components

### 1. New UnifiedPhoneAuth Component
- **Location**: `src/components/common/UnifiedPhoneAuth.jsx`
- **Route**: `/auth`
- **Features**:
  - **Step 1**: Phone number input with automatic formatting
  - **Step 2**: OTP verification via WhatsApp
  - **Step 3**: Profile completion for new users
  - Automatic user registration on first OTP verification
  - Default tenant role assignment
  - JWT token storage and management

### 2. Multi-Step Authentication Flow

#### Step 1: Phone Number Entry
- Input field with automatic phone formatting
- Supports multiple formats (with/without +91, with/without 0)
- Sends OTP via WhatsApp using Twilio

#### Step 2: OTP Verification
- 6-digit OTP input
- 2-minute expiration
- Automatic user creation if phone doesn't exist
- JWT token generation and storage

#### Step 3: Profile Completion (New Users Only)
- Name and email input
- Optional for existing users with complete profiles
- Updates user profile via authenticated API call

## Key Features

### 🔐 **Unified Authentication**
- Single component handles both login and registration
- No separate signup process needed
- Automatic user creation on first successful OTP verification

### 📱 **WhatsApp OTP Integration**
- Uses Twilio WhatsApp Business API
- 6-digit numeric OTP
- 2-minute expiration time
- Secure temporary storage in backend

### 👤 **Smart User Management**
- Default "tenant" role for new users
- Profile completion flow for new users
- Existing user direct login
- JWT token-based authentication

### 🎨 **Modern UI/UX**
- Clean, responsive design
- Step-by-step progress indication
- Loading states and error handling
- Toast notifications for user feedback
- Phone number formatting assistance

## User Experience Flow

### New User Journey
1. **Enter Phone**: User enters phone number
2. **Receive OTP**: WhatsApp OTP sent automatically
3. **Verify OTP**: User enters 6-digit code
4. **Auto Registration**: User account created automatically
5. **Complete Profile**: Name and email input
6. **Login Success**: Redirected to dashboard

### Existing User Journey
1. **Enter Phone**: User enters registered phone number
2. **Receive OTP**: WhatsApp OTP sent
3. **Verify OTP**: User enters 6-digit code
4. **Login Success**: Direct login, no profile step needed

## Technical Implementation

### Phone Number Formatting
```javascript
const formatPhoneNumber = (phone) => {
  if (phone.startsWith("+91")) return phone;
  if (phone.startsWith("91")) return "+" + phone;
  if (phone.startsWith("0")) return "+91" + phone.slice(1);
  return "+91" + phone;
};
```

### State Management
```javascript
const [step, setStep] = useState("phone"); // "phone", "otp", "profile"
const [formData, setFormData] = useState({
  phone: "",
  otp: "",
  name: "",
  email: "",
  role: "tenant"
});
```

### Error Handling
- Network connectivity issues
- Invalid OTP attempts
- Phone number validation
- Profile update failures
- Token storage errors

## Security Features

### Frontend Security
- Input validation and sanitization
- Secure token storage in localStorage
- Automatic token cleanup on errors
- Phone number format validation

### Backend Integration
- JWT token authentication
- OTP expiration handling (2 minutes)
- Secure temporary OTP storage
- WhatsApp API integration via Twilio

## Configuration

### Environment Variables (Backend)
```env
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
JWT_SECRET=your_jwt_secret
```

### API Base URL (Frontend)
```javascript
// src/utils/constant.js
const API_BASE_URL = "http://localhost:5000/api";
```

## Usage

### Route Integration
```jsx
// App.jsx
import UnifiedPhoneAuth from "./components/common/UnifiedPhoneAuth";

<Route path="/auth" element={<UnifiedPhoneAuth />} />
```

### Navigation
```javascript
// Redirect to auth page
window.location.href = "/auth";

// Or using React Router
navigate("/auth");
```

## Migration from Old System

### Advantages Over Email-Based Auth
1. **Faster Verification**: WhatsApp OTP vs Email OTP
2. **Higher Delivery Rate**: WhatsApp has better delivery rates
3. **Better UX**: Single phone number for login/signup
4. **Mobile-First**: Perfect for mobile app users
5. **Reduced Friction**: No email verification step

### Backward Compatibility
- Old email-based routes still available (`/login`, `/signup`)
- New phone-based route available at `/auth`
- Gradual migration possible

## Testing

### Test Scenarios
1. **New User Registration**:
   - Enter new phone number
   - Receive and verify OTP
   - Complete profile information
   - Successful login

2. **Existing User Login**:
   - Enter registered phone number
   - Receive and verify OTP
   - Direct login (skip profile step)

3. **Error Scenarios**:
   - Invalid phone number format
   - Wrong OTP entry
   - Network connectivity issues
   - Profile update failures

### Test Phone Numbers (Development)
- Use Twilio test credentials for development
- WhatsApp sandbox numbers for testing
- Mock OTP responses for automated testing

## Future Enhancements

### Potential Improvements
1. **Biometric Authentication**: Fingerprint/Face ID
2. **Social Login**: Google/Facebook integration
3. **SMS Fallback**: SMS OTP if WhatsApp fails
4. **Remember Device**: Skip OTP for trusted devices
5. **Multi-Language**: Support for regional languages

### Analytics Integration
- Track authentication success rates
- Monitor OTP delivery times
- User journey analytics
- Error rate monitoring

## Troubleshooting

### Common Issues
1. **OTP Not Received**: Check WhatsApp number, network connectivity
2. **Invalid OTP**: Ensure correct 6-digit code, check expiration
3. **Profile Update Failed**: Verify token validity, check network
4. **Phone Format Issues**: Use automatic formatting helper

### Debug Mode
```javascript
// Enable debug logging
console.log("Phone formatted:", formattedPhone);
console.log("OTP response:", response);
console.log("Token stored:", localStorage.getItem("token"));
```

## Support

### WhatsApp Business API
- Requires approved Twilio WhatsApp Business account
- Template messages for OTP delivery
- Compliance with WhatsApp Business policies

### Production Considerations
- Rate limiting for OTP requests
- Redis/Database for OTP storage (replace in-memory Map)
- Error monitoring and alerting
- Backup SMS delivery option