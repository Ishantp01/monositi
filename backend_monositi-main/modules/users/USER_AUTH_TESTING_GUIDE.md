# User Authentication Testing Guide

This guide provides comprehensive testing instructions for the user authentication system including registration, email verification, login, and role-based access control.

## Prerequisites

1. **Server Running**: Ensure the backend server is running on `http://localhost:5000`
2. **Environment Variables**: Configure `.env` file with all required variables
3. **MongoDB**: Database should be running and accessible
4. **Email Service**: Configure SMTP settings for email verification
5. **Testing Tool**: Use Postman, Thunder Client (VS Code), or curl

## Environment Setup

Create a `.env` file in the `backend_monositi-main` directory:

```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/monositi

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server Configuration
PORT=5000

# SMTP Configuration (for email sending)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Authentication Flow Testing

### 1. User Registration

**Endpoint**: `POST /api/users/register`  
**Access**: Public  
**Content-Type**: `application/json`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "photo": "https://example.com/photo.jpg" // optional
}
```

**Expected Response** (201):
```json
{
  "success": true,
  "message": "User registered. Please verify your email with the OTP sent."
}
```

**What happens**:
- User is created with `verified: false`
- OTP is generated and stored in database (expires in 10 minutes)
- Email is sent to user with OTP
- User cannot login until verified

---

### 2. Email Verification

**Endpoint**: `POST /api/users/verify-email`  
**Access**: Public  
**Content-Type**: `application/json`

**Request Body**:
```json
{
  "email": "john.doe@example.com",
  "otp": "123456"
}
```

**Expected Response** (200):
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

**Error Responses**:
- 404: User not found
- 400: Already verified / Invalid or expired OTP

---

### 3. User Login

**Endpoint**: `POST /api/users/login`  
**Access**: Public  
**Content-Type**: `application/json`

**Request Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Expected Response** (200):
```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "user",
    "photo": "https://example.com/photo.jpg"
  },
  "token": "jwt_token_here"
}
```

**Error Responses**:
- 401: Invalid credentials
- 403: Email not verified (unverified users cannot login)

---

### 4. Access Protected Routes

**Endpoint**: `GET /api/users/me`  
**Access**: Authenticated users only  
**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Expected Response** (200):
```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "user",
    "photo": "https://example.com/photo.jpg",
    "verified": true
  }
}
```

**Error Response** (403):
```json
{
  "message": "Account not verified. Please verify your email first."
}
```

---

## Role-Based Access Control Testing

### Admin Routes

**Create Monositi Tenant** (Admin only):
```http
POST /api/users/admin/monositi-tenant
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane.smith@monositi.com",
  "password": "password123",
  "photo": "https://example.com/photo.jpg"
}
```

**Get All Users** (Admin only):
```http
GET /api/users/
Authorization: Bearer ADMIN_TOKEN
```

**Get User by ID** (Admin only):
```http
GET /api/users/USER_ID
Authorization: Bearer ADMIN_TOKEN
```

---

## Testing Workflow

### Complete Authentication Flow:

1. **Register User** → Creates unverified user, sends OTP email
2. **Check Email** → Manually verify OTP was sent (check console/server logs)
3. **Verify Email** → Verifies user account
4. **Login** → Should work now (previously would fail)
5. **Access Protected Routes** → Should work with JWT token
6. **Test Admin Routes** → Create admin user separately and test admin functionality

### Testing Unverified User Restrictions:

1. **Register but don't verify** → User created but unverified
2. **Try to login** → Should fail with 403 "Email not verified"
3. **Try to access protected routes** → Should fail with 403 "Account not verified"
4. **Verify email** → Now login and protected routes should work

---

## Common Issues & Solutions

### 1. Email Not Sending
**Problem**: OTP email not received
**Solutions**:
- Check SMTP configuration in `.env`
- For Gmail: Use App Password instead of regular password
- Check server console for email sending errors
- Test with different email providers

### 2. JWT Token Issues
**Problem**: "Not authorized, token failed"
**Solutions**:
- Ensure `JWT_SECRET` is set in `.env`
- Check token expiration (default: 30 days)
- Verify token format in Authorization header

### 3. MongoDB Connection Issues
**Problem**: Database connection errors
**Solutions**:
- Ensure MongoDB is running
- Check `MONGO_URI` in `.env`
- Verify database name exists

### 4. Role-Based Access Issues
**Problem**: Access denied for admin routes
**Solutions**:
- Ensure user has `role: "admin"`
- Check JWT token contains correct user data
- Verify admin middleware is working

---

## Testing Scripts

### Using curl:

```bash
# 1. Register User
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# 2. Verify Email (use OTP from email/console)
curl -X POST http://localhost:5000/api/users/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456"
  }'

# 3. Login
TOKEN=$(curl -s -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' | jq -r '.token')

# 4. Access Protected Route
curl http://localhost:5000/api/users/me \
  -H "Authorization: Bearer $TOKEN"
```

### Using Postman:

1. Create a new collection "Monositi Auth Testing"
2. Set up environment variables for tokens and user IDs
3. Import the requests above as separate requests
4. Use variables like `{{TOKEN}}` in headers

---

## Security Features Tested

✅ **Email Verification**: Unverified users cannot login or access protected routes
✅ **JWT Authentication**: All protected routes require valid JWT token
✅ **Password Hashing**: Passwords are properly hashed using bcrypt
✅ **Role-Based Access**: Admin-only routes properly restricted
✅ **OTP Expiration**: Verification codes expire after 10 minutes
✅ **Input Validation**: Email uniqueness, password requirements enforced

---

## Notes

- **Unverified User Restrictions**: Unverified users cannot access ANY protected routes, even with a valid JWT token
- **OTP Security**: OTP codes are 6-digit numbers, expire in 10 minutes
- **Email Templates**: Professional HTML email templates for verification
- **Role System**: Supports admin, monositi-tenant, user, serviceProvider, tenant roles
- **Token Security**: JWT tokens expire in 30 days for security
- **Password Security**: Minimum 6 characters, hashed with bcrypt salt rounds 10

---

## Troubleshooting

If tests fail, check:

1. **Server logs** for detailed error messages
2. **Database** to verify user creation and verification status
3. **Email service** configuration and delivery
4. **Environment variables** are properly set
5. **Network connectivity** to MongoDB and SMTP servers

The authentication system is now fully functional with proper security measures in place!
