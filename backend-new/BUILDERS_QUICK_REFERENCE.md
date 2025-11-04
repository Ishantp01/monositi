# 🏗️ Builders Module - Quick Reference Card

## ✅ Implementation Complete!

All APIs have been implemented for the Builders section of the Buy feature.

---

## 📍 Base URL
```
http://localhost:5000/api/builders  (Development)
https://your-backend.com/api/builders  (Production)
```

---

## 🔑 Admin Authentication
All admin routes require:
```javascript
Headers: {
  "Authorization": "Bearer <YOUR_JWT_TOKEN>"
}
```

---

## 📋 Quick API Reference

### 🏢 CREATE BUILDER (Admin)
```bash
POST /api/builders
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body:
- name: "Lodha Group"
- founded_year: 1980
- website: "https://lodhagroup.com"
- phone: "+91-9876543210"
- email: "info@lodha.com"
- certifications: ["RERA", "ISO 9001"]
- logo: [file]
```

### 🏗️ CREATE PROJECT (Admin)
```bash
POST /api/builders/:builderId/projects
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body:
- project_name: "Lodha The Park"
- city: "Mumbai"
- project_type: "residential"
- total_units: 200
- available_units: 150
- price_min: 15000000
- price_max: 50000000
- unit_configurations: [{"type":"2BHK","price":20000000,"available_units":60}]
- amenities: ["Swimming Pool", "Gym"]
- images: [files]
- documents: [files]
```

### ✅ VERIFY BUILDER (Admin)
```bash
PATCH /api/builders/:id/verify
Content-Type: application/json
Authorization: Bearer <token>

Body:
{ "verified": true }
```

### ✅ VERIFY PROJECT (Admin)
```bash
PATCH /api/builders/projects/:projectId/verify
Content-Type: application/json
Authorization: Bearer <token>

Body:
{ "verified": true }
```

### 🔄 UPDATE UNITS (Admin)
```bash
PATCH /api/builders/projects/:projectId/units
Content-Type: application/json
Authorization: Bearer <token>

Body:
{
  "available_units": 130,
  "unit_configurations": [
    {
      "type": "2BHK",
      "available_units": 40
    }
  ]
}
```

### 🌍 BROWSE PROJECTS - BUY SECTION (Public)
```bash
GET /api/builders/public/projects?city=Mumbai&project_type=residential&min_price=10000000&max_price=50000000
# No authentication needed!
```

### 🚀 BROWSE UPCOMING PROJECTS (Public)
```bash
GET /api/builders/public/projects/upcoming?city=Mumbai&project_type=residential
# Dedicated endpoint for upcoming/pre-launch projects!
# No authentication needed!
```

### 👁️ VIEW PROJECT DETAILS (Public)
```bash
GET /api/builders/public/projects/:projectId
# No authentication needed!
```

### 🏢 VIEW BUILDER PORTFOLIO (Public)
```bash
GET /api/builders/public/:builderId
# No authentication needed!
```

---

## 📊 All Endpoints at a Glance

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| **PUBLIC ROUTES** ||||
| GET | `/public` | Public | Browse verified builders |
| GET | `/public/:id` | Public | View builder with projects |
| GET | `/public/projects` | Public | Browse projects (Buy section) |
| GET | `/public/projects/upcoming` | Public | Browse upcoming projects ⭐ |
| GET | `/public/projects/:projectId` | Public | View project details |
| **ADMIN ROUTES - BUILDERS** ||||
| POST | `/` | Admin | Create builder |
| GET | `/` | Admin | Get all builders |
| GET | `/:id` | Admin | Get single builder |
| PUT | `/:id` | Admin | Update builder |
| PATCH | `/:id/verify` | Admin | Verify builder |
| DELETE | `/:id` | Admin | Delete builder |
| **ADMIN ROUTES - PROJECTS** ||||
| POST | `/:builderId/projects` | Admin | Create project |
| GET | `/:builderId/projects` | Admin | Get builder's projects |
| GET | `/projects/all` | Admin | Get all projects |
| GET | `/projects/:projectId` | Admin | Get project details |
| PUT | `/projects/:projectId` | Admin | Update project |
| PATCH | `/projects/:projectId/verify` | Admin | Verify project |
| PATCH | `/projects/:projectId/units` | Admin | Update units |
| DELETE | `/projects/:projectId` | Admin | Delete project |

---

## 🎯 Common Use Cases

### 1️⃣ Create Complete Builder with Projects
```javascript
// Step 1: Create builder
POST /api/builders
{ name: "Lodha Group", founded_year: 1980 }

// Step 2: Create projects
POST /api/builders/64builder.../projects
{ project_name: "Lodha The Park", city: "Mumbai" }

// Step 3: Verify both
PATCH /api/builders/64builder.../verify { verified: true }
PATCH /api/builders/projects/64project.../verify { verified: true }
```

### 2️⃣ Manage Unit Availability (Admin)
```javascript
// Mark 20 units as sold
PATCH /api/builders/projects/64project.../units
{
  "available_units": 130,  // was 150
  "unit_configurations": [
    { "type": "2BHK", "available_units": 40 }  // was 60
  ]
}
```

### 3️⃣ Browse Projects (Frontend - Buy Section)
```javascript
// Get residential projects in Mumbai under ₹5 Crore
fetch('/api/builders/public/projects?city=Mumbai&project_type=residential&max_price=50000000')
  .then(res => res.json())
  .then(data => console.log(data))
```

### 4️⃣ Display Upcoming Projects Section
```javascript
// Get upcoming projects for pre-launch section
fetch('/api/builders/public/projects/upcoming?city=Mumbai')
  .then(res => res.json())
  .then(({ data: upcomingProjects }) => {
    upcomingProjects.forEach(project => {
      console.log(`🚀 ${project.project_name}`);
      console.log(`Launching: ${new Date(project.possession_date).toLocaleDateString()}`);
      console.log(`Starting from: ₹${project.price_range.min / 10000000}Cr`);
    });
  })
```

---

## 🔄 Data Flow

### For Buy Section Display:
1. **Builder Created** → Admin adds builder (Lodha, DLF, etc.)
2. **Projects Added** → Admin adds projects with units
3. **Verification** → Admin verifies builder + projects
4. **Public Display** → Projects appear in Buy section
5. **User Browses** → Filter by city, type, price
6. **User Views Details** → See units, amenities, builder info

---

## 📂 Files Created/Modified

### ✅ Created (7 files)
- `src/models/Builder.model.js`
- `src/models/BuilderProject.model.js`
- `src/modules/builders/builder.controller.js`
- `src/modules/builders/builder.routes.js`
- `src/modules/builders/BUILDERS_API_DOCUMENTATION.md`
- `src/modules/builders/TESTING_GUIDE.md`
- `src/modules/builders/README.md`

### ✅ Modified (1 file)
- `src/routes/index.js` (added Builder routes)

---

## 🧪 Quick Test

```bash
# 1. Get admin token
POST /api/auth/verify-otp
{ "phone": "your_admin_phone", "otp": "123456" }
# Save the token!

# 2. Create builder
POST /api/builders
Authorization: Bearer <token>
{ "name": "Test Builder", "founded_year": 2020 }
# Save the builder ID!

# 3. Create project
POST /api/builders/<BUILDER_ID>/projects
Authorization: Bearer <token>
{ 
  "project_name": "Test Project",
  "city": "Mumbai",
  "project_type": "residential",
  "total_units": 100
}
# Save the project ID!

# 4. Verify both
PATCH /api/builders/<BUILDER_ID>/verify
Authorization: Bearer <token>
{ "verified": true }

PATCH /api/builders/projects/<PROJECT_ID>/verify
Authorization: Bearer <token>
{ "verified": true }

# 5. Check public API (no auth needed!)
GET /api/builders/public/projects?city=Mumbai
# Should see your project!
```

---

## 🐛 Troubleshooting

### Issue: "Not authenticated"
→ Add Authorization header with Bearer token

### Issue: "Admin only"
→ User role must be "admin" in database

### Issue: "Builder not found"
→ Check builder ID is correct

### Issue: Images not uploading
→ Check Cloudinary config in `.env`:
```
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

### Issue: Project not in public API
→ Both builder AND project must be verified

---

## 📚 Full Documentation

- **Complete API Docs:** `src/modules/builders/BUILDERS_API_DOCUMENTATION.md`
- **Testing Guide:** `src/modules/builders/TESTING_GUIDE.md`
- **Implementation Summary:** `BUILDERS_MODULE_IMPLEMENTATION.md`

---

## ✨ What's Working

✅ Create, Read, Update, Delete builders  
✅ Create, Read, Update, Delete projects  
✅ Upload logos, images, documents  
✅ Manage unit configurations  
✅ Track unit availability  
✅ Verification system  
✅ Public browsing for Buy section  
✅ Advanced filtering (city, type, price)  
✅ GeoJSON location support  
✅ Complete error handling  

---

## 🎉 Ready to Use!

All APIs are live at `/api/builders` once you start the server.

**Start the server:**
```bash
cd backend-new
npm start
```

**Test immediately with the endpoints above!**

---

## 💡 Frontend Integration Tips

### Display Projects in Buy Section
```javascript
// Fetch and display
const res = await fetch('/api/builders/public/projects?city=Mumbai');
const { data } = await res.json();

data.forEach(project => {
  // Show project name, builder name
  // Display price range
  // Show unit types (2BHK, 3BHK)
  // Display availability (green/red)
  // Show amenities
});
```

### Show Unit Configurations
```javascript
// Display different unit types
project.unit_configurations.forEach(unit => {
  console.log(`${unit.type}: ₹${unit.price / 10000000}Cr`);
  console.log(`${unit.available_units} available`);
  const status = unit.available_units > 0 ? '🟢' : '🔴';
});
```

---

**Need Help?** Check the full documentation files listed above.

**Happy Coding! 🚀**

