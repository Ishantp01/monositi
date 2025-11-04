# Builders Module - Testing Guide

## Quick Start Testing

### Prerequisites
1. Server running on `http://localhost:5000` (or your configured port)
2. Admin user created with role = "admin"
3. API client (Postman, Thunder Client, or curl)

---

## 🔑 Step 1: Get Admin Token

```bash
POST /api/auth/send-otp
Content-Type: application/json

{
  "phone": "your_admin_phone"
}
```

```bash
POST /api/auth/verify-otp
Content-Type: application/json

{
  "phone": "your_admin_phone",
  "otp": "123456"
}
```

**Save the token from response!**

---

## 🏢 Step 2: Create a Builder

```bash
POST /api/builders
Authorization: Bearer <YOUR_TOKEN>
Content-Type: multipart/form-data

Form Data:
- name: "Lodha Group"
- description: "India's leading real estate developer"
- founded_year: 1980
- phone: "+91-9876543210"
- email: "info@lodha.com"
- address: "Mumbai, Maharashtra"
- website: "https://lodhagroup.com"
- certifications: ["RERA", "ISO 9001"]
- total_projects_completed: 50
- logo: [select logo image file]
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Builder created successfully",
  "data": {
    "_id": "64builder123abc...",
    "name": "Lodha Group",
    "logo": "https://res.cloudinary.com/...",
    "monositi_verified": false
  }
}
```

**Save the builder ID!**

---

## 🏗️ Step 3: Create a Builder Project

```bash
POST /api/builders/<BUILDER_ID>/projects
Authorization: Bearer <YOUR_TOKEN>
Content-Type: multipart/form-data

Form Data:
- project_name: "Lodha The Park"
- description: "Premium residential project with world-class amenities"
- address: "Worli Sea Face"
- city: "Mumbai"
- state: "Maharashtra"
- pincode: "400018"
- coordinates: {"lng": 72.8181, "lat": 18.9894}
- project_type: "residential"
- status: "ongoing"
- possession_date: "2026-12-31"
- rera_number: "P51900000123"
- total_units: 200
- available_units: 150
- price_min: 15000000
- price_max: 50000000
- unit_configurations: [{"type":"2BHK","carpet_area":"850 sq ft","price":20000000,"total_units":80,"available_units":60},{"type":"3BHK","carpet_area":"1200 sq ft","price":35000000,"total_units":120,"available_units":90}]
- amenities: ["Swimming Pool", "Gym", "Club House", "Garden", "Kids Play Area"]
- images: [select multiple image files]
- documents: [select brochure PDFs]
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Builder project created successfully",
  "data": {
    "_id": "64project123...",
    "project_name": "Lodha The Park",
    "builder": "64builder123abc...",
    "monositi_verified": false,
    "unit_configurations": [
      {
        "type": "2BHK",
        "carpet_area": "850 sq ft",
        "price": 20000000,
        "available_units": 60
      }
    ]
  }
}
```

**Save the project ID!**

---

## ✅ Step 4: Verify Builder and Project

### Verify Builder
```bash
PATCH /api/builders/<BUILDER_ID>/verify
Authorization: Bearer <YOUR_TOKEN>
Content-Type: application/json

{
  "verified": true
}
```

### Verify Project
```bash
PATCH /api/builders/projects/<PROJECT_ID>/verify
Authorization: Bearer <YOUR_TOKEN>
Content-Type: application/json

{
  "verified": true
}
```

**Expected:** Both should return success with `monositi_verified: true`

---

## 🔍 Step 5: Test Public APIs (No Auth Required)

### Get All Verified Builders

```bash
GET /api/builders/public
```

**Expected:** Should return your verified builder

### Get Builder Details with Projects

```bash
GET /api/builders/public/<BUILDER_ID>
```

**Expected:** Builder details with list of verified projects

### Browse Projects (Buy Section)

```bash
GET /api/builders/public/projects?city=Mumbai&project_type=residential
```

**Expected:** List of verified projects in Mumbai

### Get Project Details

```bash
GET /api/builders/public/projects/<PROJECT_ID>
```

**Expected:** Full project details with builder info and unit configurations

---

## 📊 Step 6: Test Unit Management

### Update Unit Availability (20 units sold)

```bash
PATCH /api/builders/projects/<PROJECT_ID>/units
Authorization: Bearer <YOUR_TOKEN>
Content-Type: application/json

{
  "available_units": 130,
  "unit_configurations": [
    {
      "type": "2BHK",
      "carpet_area": "850 sq ft",
      "price": 20000000,
      "total_units": 80,
      "available_units": 40
    },
    {
      "type": "3BHK",
      "carpet_area": "1200 sq ft",
      "price": 35000000,
      "total_units": 120,
      "available_units": 90
    }
  ]
}
```

**Expected:** Units updated successfully

---

## 🏢 Step 7: Create More Builders

### Create DLF Limited

```bash
POST /api/builders
Authorization: Bearer <YOUR_TOKEN>
Content-Type: multipart/form-data

Form Data:
- name: "DLF Limited"
- description: "India's largest real estate company"
- founded_year: 1946
- website: "https://dlf.in"
- total_projects_completed: 100
- logo: [select DLF logo]
```

### Create DLF Project

```bash
POST /api/builders/<DLF_BUILDER_ID>/projects
Authorization: Bearer <YOUR_TOKEN>
Content-Type: multipart/form-data

Form Data:
- project_name: "DLF Garden City"
- city: "Gurgaon"
- state: "Haryana"
- project_type: "residential"
- status: "ready_to_move"
- total_units: 300
- available_units: 50
- price_min: 25000000
- price_max: 75000000
- unit_configurations: [{"type":"2BHK","carpet_area":"900 sq ft","price":30000000},{"type":"3BHK","carpet_area":"1500 sq ft","price":50000000},{"type":"4BHK","carpet_area":"2200 sq ft","price":75000000}]
- images: [select images]
```

---

## 🔄 Step 8: Test All Filters

### Admin: Get All Builders (Verified)

```bash
GET /api/builders?verified=true
Authorization: Bearer <YOUR_TOKEN>
```

### Admin: Get All Projects by City

```bash
GET /api/builders/projects/all?city=Mumbai
Authorization: Bearer <YOUR_TOKEN>
```

### Public: Filter by Project Type

```bash
GET /api/builders/public/projects?project_type=residential
```

### Public: Filter by Status

```bash
GET /api/builders/public/projects?status=ready_to_move
```

### Public: Filter by Price Range

```bash
GET /api/builders/public/projects?min_price=20000000&max_price=40000000
```

### Public: Combined Filters

```bash
GET /api/builders/public/projects?city=Mumbai&project_type=residential&status=ongoing&min_price=15000000&max_price=50000000
```

---

## 🧹 Step 9: Test Updates

### Update Builder Details

```bash
PUT /api/builders/<BUILDER_ID>
Authorization: Bearer <YOUR_TOKEN>
Content-Type: application/json

{
  "description": "Updated description",
  "rating": 4.5,
  "total_projects_completed": 55
}
```

### Update Project Details

```bash
PUT /api/builders/projects/<PROJECT_ID>
Authorization: Bearer <YOUR_TOKEN>
Content-Type: application/json

{
  "status": "completed",
  "possession_date": "2025-12-31",
  "available_units": 100
}
```

---

## 🗑️ Step 10: Test Deletions (Careful!)

### Delete a Project

```bash
DELETE /api/builders/projects/<PROJECT_ID>
Authorization: Bearer <YOUR_TOKEN>
```

**Expected:** Project deleted, no longer appears in any API

### Delete a Builder (Deletes All Projects)

```bash
DELETE /api/builders/<BUILDER_ID>
Authorization: Bearer <YOUR_TOKEN>
```

**Expected:** Builder and all associated projects deleted

---

## 🧪 Test Scenarios

### Scenario 1: Complete Builder + Project Workflow
1. ✅ Create builder (Lodha Group)
2. ✅ Create 3 projects (The Park, Altamount, World Towers)
3. ✅ Upload images for each project
4. ✅ Verify builder
5. ✅ Verify all projects
6. ✅ Check public API - all should appear
7. ✅ Update unit availability
8. ✅ Check project details show updated availability

### Scenario 2: Unverified Builder
1. ✅ Create builder without verifying
2. ✅ Create projects
3. ✅ Try public API - should NOT appear
4. ✅ Verify builder and projects
5. ✅ Check public API - now should appear

### Scenario 3: Price Filtering
1. ✅ Create projects with different price ranges
   - Project A: ₹1.5Cr - ₹3Cr
   - Project B: ₹3Cr - ₹5Cr
   - Project C: ₹5Cr - ₹10Cr
2. ✅ Filter: min_price=20000000&max_price=40000000
3. ✅ Verify only relevant projects appear

### Scenario 4: Multi-City Testing
1. ✅ Create projects in Mumbai, Delhi, Bangalore
2. ✅ Filter by city
3. ✅ Verify correct results

---

## 📝 Postman Collection

```json
{
  "info": {
    "name": "Builders API Tests",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "1. Create Builder",
      "request": {
        "method": "POST",
        "header": [
          {"key": "Authorization", "value": "Bearer {{token}}"}
        ],
        "body": {
          "mode": "formdata",
          "formdata": [
            {"key": "name", "value": "Lodha Group"},
            {"key": "website", "value": "https://lodhagroup.com"},
            {"key": "founded_year", "value": "1980"}
          ]
        },
        "url": "{{baseUrl}}/api/builders"
      }
    },
    {
      "name": "2. Get All Builders",
      "request": {
        "method": "GET",
        "header": [
          {"key": "Authorization", "value": "Bearer {{token}}"}
        ],
        "url": "{{baseUrl}}/api/builders"
      }
    },
    {
      "name": "3. Create Project",
      "request": {
        "method": "POST",
        "header": [
          {"key": "Authorization", "value": "Bearer {{token}}"}
        ],
        "body": {
          "mode": "formdata",
          "formdata": [
            {"key": "project_name", "value": "Lodha The Park"},
            {"key": "city", "value": "Mumbai"},
            {"key": "total_units", "value": "200"}
          ]
        },
        "url": "{{baseUrl}}/api/builders/{{builderId}}/projects"
      }
    },
    {
      "name": "4. Verify Builder",
      "request": {
        "method": "PATCH",
        "header": [
          {"key": "Authorization", "value": "Bearer {{token}}"},
          {"key": "Content-Type", "value": "application/json"}
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"verified\": true}"
        },
        "url": "{{baseUrl}}/api/builders/{{builderId}}/verify"
      }
    },
    {
      "name": "5. Verify Project",
      "request": {
        "method": "PATCH",
        "header": [
          {"key": "Authorization", "value": "Bearer {{token}}"},
          {"key": "Content-Type", "value": "application/json"}
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"verified\": true}"
        },
        "url": "{{baseUrl}}/api/builders/projects/{{projectId}}/verify"
      }
    },
    {
      "name": "6. Get Public Projects",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/builders/public/projects?city=Mumbai"
      }
    },
    {
      "name": "7. Update Units",
      "request": {
        "method": "PATCH",
        "header": [
          {"key": "Authorization", "value": "Bearer {{token}}"},
          {"key": "Content-Type", "value": "application/json"}
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"available_units\": 130}"
        },
        "url": "{{baseUrl}}/api/builders/projects/{{projectId}}/units"
      }
    }
  ],
  "variable": [
    {"key": "baseUrl", "value": "http://localhost:5000"},
    {"key": "token", "value": "YOUR_TOKEN_HERE"},
    {"key": "builderId", "value": "BUILDER_ID_HERE"},
    {"key": "projectId", "value": "PROJECT_ID_HERE"}
  ]
}
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Not authenticated"
**Solution:** Make sure Authorization header is set with valid admin token

### Issue 2: "Admin only"
**Solution:** User role must be "admin". Update user in database:
```javascript
db.users.updateOne(
  { phone: "your-admin-phone" },
  { $set: { role: "admin" } }
)
```

### Issue 3: "Builder not found"
**Solution:** 
- Check builder ID is correct
- Make sure builder was created successfully

### Issue 4: Images not uploading
**Solution:** 
- Check Cloudinary configuration
- Verify environment variables:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
- Check file size (should be reasonable)

### Issue 5: Coordinates not saving
**Solution:** Pass coordinates as JSON string:
```json
{
  "coordinates": "{\"lng\": 72.8181, \"lat\": 18.9894}"
}
```

### Issue 6: Unit configurations not parsing
**Solution:** Pass as JSON string in form-data:
```json
{
  "unit_configurations": "[{\"type\":\"2BHK\",\"price\":20000000}]"
}
```

### Issue 7: Project not appearing in public API
**Solution:**
- Make sure builder is verified
- Make sure project is verified
- Check both `monositi_verified` should be `true`

---

## ✅ Testing Checklist

### Builder APIs
- [ ] Admin can create builders
- [ ] Admin can upload builder logo
- [ ] Admin can get all builders
- [ ] Admin can get single builder
- [ ] Admin can update builder details
- [ ] Admin can verify/unverify builders
- [ ] Admin can delete builders
- [ ] Public API shows only verified builders
- [ ] Deleting builder also deletes projects

### Project APIs
- [ ] Admin can create projects
- [ ] Admin can upload project images
- [ ] Admin can upload project documents
- [ ] Admin can get all projects (global)
- [ ] Admin can get projects for specific builder
- [ ] Admin can get single project details
- [ ] Admin can update project details
- [ ] Admin can verify/unverify projects
- [ ] Admin can update unit availability
- [ ] Admin can delete projects

### Public APIs
- [ ] Browse verified builders works
- [ ] Get builder details with projects works
- [ ] Browse projects works
- [ ] Filter by city works
- [ ] Filter by project_type works
- [ ] Filter by status works
- [ ] Filter by price range works
- [ ] Combined filters work
- [ ] Get project details works
- [ ] Unverified builders/projects don't appear

### Image Uploads
- [ ] Builder logo uploads to Cloudinary
- [ ] Project images upload to Cloudinary
- [ ] Project documents upload to Cloudinary
- [ ] Multiple images can be uploaded
- [ ] Local files are deleted after upload

### Data Integrity
- [ ] Coordinates save in GeoJSON format
- [ ] Unit configurations save correctly
- [ ] Amenities array saves correctly
- [ ] Price range saves correctly
- [ ] Dates save correctly

---

## 🎯 Frontend Integration Examples

### Display Projects in Buy Section

```javascript
// Fetch projects
const response = await fetch(
  'http://your-backend/api/builders/public/projects?city=Mumbai&project_type=residential'
);
const { data } = await response.json();

// Display projects
data.forEach(project => {
  console.log(`${project.project_name} by ${project.builder.name}`);
  console.log(`Price: ₹${project.price_range.min / 10000000}Cr - ₹${project.price_range.max / 10000000}Cr`);
  console.log(`Available: ${project.available_units}/${project.total_units} units`);
});
```

### Show Unit Configurations

```javascript
// Fetch project details
const response = await fetch(
  `http://your-backend/api/builders/public/projects/${projectId}`
);
const { data } = await response.json();

// Display unit types
data.unit_configurations.forEach(unit => {
  console.log(`${unit.type}: ${unit.carpet_area} - ₹${unit.price / 10000000}Cr`);
  console.log(`Available: ${unit.available_units}/${unit.total_units}`);
});
```

---

## 📊 Sample Test Data

### Builder 1: Lodha Group
- Name: Lodha Group
- Founded: 1980
- Projects: 50+
- Rating: 4.5

### Builder 2: DLF Limited
- Name: DLF Limited
- Founded: 1946
- Projects: 100+
- Rating: 4.3

### Builder 3: Godrej Properties
- Name: Godrej Properties
- Founded: 1990
- Projects: 75+
- Rating: 4.4

### Sample Projects:
1. **Lodha The Park** (Mumbai)
   - Type: Residential
   - Units: 200 (150 available)
   - Price: ₹1.5Cr - ₹5Cr
   - Configurations: 2BHK, 3BHK

2. **DLF Garden City** (Gurgaon)
   - Type: Residential
   - Units: 300 (50 available)
   - Price: ₹2.5Cr - ₹7.5Cr
   - Configurations: 2BHK, 3BHK, 4BHK

3. **Godrej Platinum** (Bangalore)
   - Type: Mixed
   - Units: 400 (200 available)
   - Price: ₹1Cr - ₹6Cr
   - Configurations: 1BHK, 2BHK, 3BHK, Penthouse

---

**Happy Testing! 🚀**

**For detailed API documentation, see [BUILDERS_API_DOCUMENTATION.md](./BUILDERS_API_DOCUMENTATION.md)**

