# Critical Fixes Required - Priority List

## 🔴 HIGH PRIORITY (Security & Core Functionality)

### 1. ✅ Phone Number Validation
**Issue:** Users can enter alphabets in phone number field
**Location:** All phone input fields across the application
**Fix Required:**
- Add input type="tel" with pattern validation
- Add regex validation: `/^[0-9]{10}$/`
- Add real-time validation feedback
- Implement phone verification via OTP

### 2. ✅ Phone Verification System
**Issue:** No verification that phone number is real/working
**Solution:** 
- Implement OTP verification via SMS gateway (Twilio/MSG91)
- Verify phone before account activation
- Re-verify on phone number change

### 3. ✅ Ban Button Not Working in Admin
**Issue:** Admin cannot ban users
**Location:** `/admin/users` - AdminDashboard.jsx
**Fix Required:**
- Check API endpoint `/admin/users/:id/ban`
- Verify authentication middleware
- Fix state update after ban action

### 4. ✅ Rejected Tenant Can Book Services
**Issue:** Banned/rejected users can still access services
**Location:** Service booking flow
**Fix Required:**
- Add user status check before booking
- Block banned/rejected users from service access
- Show appropriate error message

### 5. ✅ Admin Property Hide Error
**Issue:** Error when admin tries to hide property
**Location:** Admin property management
**Fix Required:**
- Check visibility toggle API endpoint
- Fix error handling in property controller
- Update frontend state management

---

## 🟡 MEDIUM PRIORITY (UX & Workflow)

### 6. ✅ Multi-Step Form - Submit Button Timing
**Issue:** Submit button appears too early in create service/property forms
**Location:** 
- `/create-service` - CreateService.jsx
- `/add-property` - AddProperty.jsx
**Fix Required:**
- Show "Next" button in early phases
- Show "Submit" only in final phase
- Add progress indicator

### 7. ✅ Remove SignUp Page Button
**Issue:** Unnecessary signup button somewhere
**Location:** To be identified
**Fix Required:**
- Remove redundant signup button
- Keep only necessary auth entry points

### 8. ✅ Service Provider Dashboard Missing
**Issue:** Service providers cannot see their received service requests
**Location:** Need to create new page
**Fix Required:**
- Create `/service-provider/requests` page
- Add API endpoint to fetch provider's bookings
- Show booking details, customer info, status

### 9. ✅ Contact/Enquiry API Integration
**Issue:** Contact form on Monositi details page not integrated
**Location:** MonositiDetails.jsx
**Fix Required:**
- Create enquiry API endpoint
- Integrate with contact form
- Send email notifications
- Store enquiries in database

---

## 🟢 LOW PRIORITY (Polish & Enhancement)

### 10. ✅ Terms & Conditions in Login
**Issue:** No T&C checkbox in login page
**Location:** Login.jsx / UnifiedPhoneAuth.jsx
**Fix Required:**
- Add T&C checkbox
- Create T&C page/modal
- Require acceptance before login

### 11. ✅ Enhance Home Page Property Cards
**Issue:** Property cards are too long and not professional
**Location:** Home.jsx, PropertyCard.jsx, SaleCard.jsx
**Fix Required:**
- Reduce card height
- Improve layout and spacing
- Better image aspect ratios
- More compact information display
- Professional styling

---

## 📋 Implementation Priority Order

### Phase 1: Security & Critical Bugs (Do First)
1. Phone number validation (alphabets issue)
2. Ban button fix
3. Rejected tenant service access block
4. Admin property hide error

### Phase 2: Core Functionality
5. Phone verification system
6. Service provider dashboard
7. Contact/Enquiry API
8. Multi-step form improvements

### Phase 3: UX Polish
9. Remove signup button
10. Terms & conditions
11. Home page card enhancement

---

## 🛠️ Technical Details for Each Fix

### Fix 1: Phone Number Validation
```javascript
// Add to all phone inputs
<input
  type="tel"
  pattern="[0-9]{10}"
  maxLength="10"
  onKeyPress={(e) => {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  }}
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, '');
    e.target.value = value;
  }}
/>
```

### Fix 2: Phone Verification
- Integrate SMS gateway (MSG91 recommended for India)
- Add OTP verification step after phone entry
- Store verification status in user model

### Fix 3: Ban Button Fix
- Check backend route: `PATCH /api/admin/users/:id/ban`
- Verify middleware: `protect, adminOnly`
- Fix frontend state update after API call

### Fix 4: Service Access Control
```javascript
// Add to service booking
if (user.is_active === false || user.verification_status === 'rejected') {
  return res.status(403).json({
    success: false,
    message: "Your account is not active. Please contact support."
  });
}
```

### Fix 5: Property Visibility Toggle
- Check API: `PATCH /api/admin/properties/:id/visibility`
- Add proper error handling
- Update frontend optimistically

### Fix 6: Multi-Step Forms
- Add step state management
- Show "Next" for steps 1-n
- Show "Submit" only for final step
- Add progress bar component

### Fix 7: Service Provider Dashboard
- Create new route: `/service-provider/bookings`
- API: `GET /api/services/provider/bookings`
- Show: pending, accepted, completed requests

### Fix 8: Enquiry API
```javascript
// Backend
POST /api/monositi/listings/:id/enquiry
{
  name, email, phone, message
}

// Frontend - integrate with contact form
```

### Fix 9: Terms & Conditions
- Create T&C modal component
- Add checkbox to login/signup
- Store acceptance in user model

### Fix 10: Property Card Enhancement
- Reduce card height from current to max 400px
- Use aspect-ratio for images (16:9)
- Compact info display
- Better typography hierarchy

---

## 🎯 Quick Wins (Can be done immediately)

1. **Phone input validation** - 15 minutes
2. **Remove signup button** - 5 minutes  
3. **Multi-step button labels** - 30 minutes
4. **Property card height reduction** - 20 minutes

## 🔧 Requires Backend Work

1. **Phone verification** - 2-3 hours
2. **Ban button fix** - 30 minutes
3. **Service provider dashboard** - 2 hours
4. **Enquiry API** - 1 hour
5. **User status checks** - 1 hour

---

## 📝 Notes

- All fixes should include proper error handling
- Add loading states for async operations
- Include user feedback (toasts/alerts)
- Test on mobile devices
- Update documentation after fixes

---

**Created:** Current Session
**Status:** Pending Implementation
**Estimated Total Time:** 12-15 hours for all fixes
