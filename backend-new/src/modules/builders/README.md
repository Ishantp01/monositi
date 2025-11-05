# Builders Module

## 📌 Overview

The Builders module is a comprehensive system for managing real estate builders/developers and their projects. It's designed for the **Buy section** of the Monositi platform, allowing users to browse verified builder projects with detailed unit configurations, pricing, and availability tracking.

## 🗂️ Module Structure

```
builders/
├── builder.controller.js            # All business logic and API handlers
├── builder.routes.js                # Route definitions and middleware
├── BUILDERS_API_DOCUMENTATION.md    # Complete API reference
├── TESTING_GUIDE.md                 # Step-by-step testing guide
└── README.md                        # This file
```

## 🚀 Features

### Admin Features (Protected Routes)
- ✅ Create/Update/Delete builders (companies/developers)
- ✅ Create/Update/Delete builder projects
- ✅ Upload logos, project images, and documents
- ✅ Manage unit configurations (1BHK, 2BHK, 3BHK, etc.)
- ✅ Track unit availability in real-time
- ✅ Verify/Unverify builders and projects
- ✅ Filter by city, type, status, price range
- ✅ Complete RERA and possession date tracking

### Public Features (Open Routes)
- ✅ Browse verified builders
- ✅ View builder details with portfolio
- ✅ Browse verified projects (Buy section)
- ✅ Filter by city, type, status, price
- ✅ View complete project details with units
- ✅ View builder contact information

## 📊 Data Models

### Builder (Company/Developer)
```javascript
{
  name, logo, description, founded_year,
  contact_info: { phone, email, address },
  website, certifications, rating,
  total_projects_completed,
  monositi_verified, status
}
```

### BuilderProject (Individual Development)
```javascript
{
  builder (ref), project_name, description,
  location: { address, city, state, coordinates },
  images, project_type, status,
  possession_date, rera_number,
  total_units, available_units,
  price_range: { min, max },
  unit_configurations: [
    { type, carpet_area, price, total_units, available_units }
  ],
  amenities, documents,
  monositi_verified
}
```

## 🔗 Base Routes

- **Admin Routes:** `/api/builders/*` (Requires admin authentication)
- **Public Routes:** `/api/builders/public/*` (No authentication)

## 📖 Quick Links

- **[Complete API Documentation](./BUILDERS_API_DOCUMENTATION.md)** - All endpoints with examples
- **[Testing Guide](./TESTING_GUIDE.md)** - Step-by-step testing instructions

## 🔧 Setup

1. **Models are integrated** - `Builder.model.js` and `BuilderProject.model.js`
2. **Routes are registered** - Module is connected to `/api/builders`
3. **Authentication works** - Uses existing `protect` and `adminOnly` middleware
4. **File uploads ready** - Uses existing Multer and Cloudinary configuration

## 🎯 Quick Start

### 1. Create a Builder (Admin)
```bash
POST /api/builders
Authorization: Bearer <token>
Body: { name: "Lodha Group", founded_year: 1980, ... }
```

### 2. Create a Project
```bash
POST /api/builders/:builderId/projects
Authorization: Bearer <token>
Body: { 
  project_name: "Lodha The Park",
  city: "Mumbai",
  unit_configurations: [...],
  ...
}
```

### 3. Verify Builder & Project
```bash
PATCH /api/builders/:id/verify
PATCH /api/builders/projects/:id/verify
Authorization: Bearer <token>
Body: { verified: true }
```

### 4. Browse Projects (Public - Buy Section)
```bash
GET /api/builders/public/projects?city=Mumbai&project_type=residential
# No authentication needed!
```

## 🔄 Automatic Features

### Unit Tracking
- Automatically tracks total vs available units
- Updates availability at project and unit-type level
- Real-time availability for frontend

### Image Management
- Uploads to Cloudinary
- Auto-deletes local files
- Supports multiple images per project

## 🧪 Testing

See **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** for:
- Step-by-step API testing
- Postman collection
- Common issues & solutions
- Complete test scenarios

## 📝 API Endpoints Summary

### Builder Management (Admin)
- `POST /builders` - Create builder
- `GET /builders` - Get all builders (with filters)
- `GET /builders/:id` - Get single builder
- `PUT /builders/:id` - Update builder
- `PATCH /builders/:id/verify` - Verify builder
- `DELETE /builders/:id` - Delete builder

### Project Management (Admin)
- `POST /builders/:builderId/projects` - Create project
- `GET /builders/:builderId/projects` - Get builder's projects
- `GET /builders/projects/all` - Get all projects (with filters)
- `GET /builders/projects/:projectId` - Get single project
- `PUT /builders/projects/:projectId` - Update project
- `PATCH /builders/projects/:projectId/verify` - Verify project
- `PATCH /builders/projects/:projectId/units` - Update units
- `DELETE /builders/projects/:projectId` - Delete project

### Public APIs (Buy Section)
- `GET /builders/public` - Get verified builders
- `GET /builders/public/:id` - Get builder details with projects
- `GET /builders/public/projects` - Browse projects (with filters)
- `GET /builders/public/projects/:projectId` - Get project details

## 🔐 Authentication

### Admin Routes
```javascript
Headers: {
  Authorization: "Bearer <JWT_TOKEN>"
}
```
User role must be "admin"

### Public Routes
No authentication required

## 📦 Dependencies

- **Express** - Routing
- **Mongoose** - Database ORM
- **Multer** - File upload handling
- **Cloudinary** - Image & document storage
- **JWT** - Authentication (existing middleware)

## 🌍 Use Cases

### 1. Builder Portfolio
- List all builders with logos
- Show builder ratings and certifications
- Display number of completed projects
- Show contact information

### 2. Project Browsing (Buy Section)
- Filter by city (Mumbai, Delhi, Bangalore)
- Filter by type (Residential, Commercial, Mixed)
- Filter by status (Ongoing, Completed, Ready to Move)
- Filter by price range
- View unit configurations (1BHK, 2BHK, 3BHK)
- Check availability
- View amenities and documents

### 3. Unit Management
- Track different unit types in one project
- Manage availability per unit type
- Update prices per unit type
- Show floor plans for each type

## 🎨 Frontend Integration

### Display Projects in Buy Section
```javascript
// Fetch projects with filters
const response = await fetch(
  '/api/builders/public/projects?city=Mumbai&project_type=residential&min_price=10000000&max_price=50000000'
);
const { data } = await response.json();

// Display projects
data.forEach(project => {
  // Show project with builder info
  // Display unit configurations
  // Show availability
});
```

### Show Unit Configurations
```javascript
// Fetch project details
const response = await fetch(`/api/builders/public/projects/${projectId}`);
const { data } = await response.json();

// Display unit types
data.unit_configurations.forEach(unit => {
  // Show type (2BHK, 3BHK)
  // Show price and carpet area
  // Show availability (green/red indicator)
});
```

## 🔮 Future Enhancements

- [ ] Booking/inquiry system
- [ ] Virtual tours integration
- [ ] Loan calculator
- [ ] EMI calculator
- [ ] Site visit scheduling
- [ ] Comparison feature
- [ ] Review and rating system
- [ ] Distance-based search
- [ ] Price alerts

## 👥 Integration with Monositi Platform

The Builders module integrates seamlessly with:
- **Properties Module** - For individual property listings
- **Monositi Module** - For admin-managed hostel/PG listings
- **Users Module** - For authentication and authorization
- **Services Module** - For related services (interior design, legal, etc.)

## 📄 License

Part of Monositi Backend System - January 2025

---

**For detailed API documentation, see [BUILDERS_API_DOCUMENTATION.md](./BUILDERS_API_DOCUMENTATION.md)**

**For testing instructions, see [TESTING_GUIDE.md](./TESTING_GUIDE.md)**

