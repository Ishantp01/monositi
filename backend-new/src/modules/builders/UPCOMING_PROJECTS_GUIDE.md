# 🚀 Upcoming Projects Feature Guide

## Overview

The Builders module now includes dedicated support for **Upcoming Projects** - perfect for showcasing pre-launch and under-construction projects in your Buy section.

---

## 📌 Project Status Options

When creating or updating a project, you can set the `status` field to one of:

- **`upcoming`** - Pre-launch projects, not yet available for possession
- **`ongoing`** - Currently under construction
- **`completed`** - Construction finished, may have units available
- **`ready_to_move`** - Ready for immediate possession

---

## 🎯 Dedicated Upcoming Projects Endpoint

### **GET** `/api/builders/public/projects/upcoming`

**Access:** Public (No authentication required)

**Purpose:** Get all verified upcoming projects - perfect for a dedicated "Upcoming Projects" section on your Buy page.

**Query Parameters:**
- `city` - Filter by city (optional)
- `project_type` - Filter by type: residential | commercial | mixed (optional)

**Example Requests:**

```bash
# Get all upcoming projects
GET /api/builders/public/projects/upcoming

# Get upcoming residential projects in Mumbai
GET /api/builders/public/projects/upcoming?city=Mumbai&project_type=residential

# Get upcoming commercial projects in Bangalore
GET /api/builders/public/projects/upcoming?city=Bangalore&project_type=commercial
```

**Response Format:**

```json
{
  "success": true,
  "count": 5,
  "message": "Upcoming projects retrieved successfully",
  "data": [
    {
      "_id": "64project123...",
      "project_name": "Lodha Altamount",
      "description": "Ultra-luxury residential project",
      "builder": {
        "_id": "64builder123...",
        "name": "Lodha Group",
        "logo": "https://cloudinary.com/...",
        "rating": 4.5,
        "monositi_verified": true
      },
      "location": {
        "address": "Altamount Road",
        "city": "Mumbai",
        "state": "Maharashtra",
        "coordinates": {
          "type": "Point",
          "coordinates": [72.8081, 18.9694]
        }
      },
      "images": ["https://cloudinary.com/..."],
      "project_type": "residential",
      "status": "upcoming",
      "possession_date": "2027-12-31T00:00:00.000Z",
      "rera_number": "P51900000456",
      "total_units": 50,
      "available_units": 50,
      "price_range": {
        "min": 100000000,
        "max": 500000000
      },
      "unit_configurations": [
        {
          "type": "3BHK",
          "carpet_area": "2500 sq ft",
          "price": 150000000,
          "total_units": 20,
          "available_units": 20
        },
        {
          "type": "4BHK",
          "carpet_area": "3500 sq ft",
          "price": 250000000,
          "total_units": 20,
          "available_units": 20
        },
        {
          "type": "Penthouse",
          "carpet_area": "5000 sq ft",
          "price": 500000000,
          "total_units": 10,
          "available_units": 10
        }
      ],
      "amenities": [
        "Infinity Pool",
        "Private Elevator",
        "Sky Lounge",
        "Concierge Service"
      ],
      "documents": ["https://cloudinary.com/brochure.pdf"],
      "monositi_verified": true,
      "createdAt": "2025-01-01T10:00:00.000Z",
      "updatedAt": "2025-01-15T10:00:00.000Z"
    }
  ]
}
```

**Key Features:**
- ✅ Automatically sorted by possession date (earliest first)
- ✅ Only returns verified projects
- ✅ Only returns projects with status = "upcoming"
- ✅ Includes builder information
- ✅ Shows unit configurations and availability
- ✅ Includes possession date for planning

---

## 🎨 Frontend Integration Examples

### 1. Display Upcoming Projects Section

```javascript
// Fetch upcoming projects
const response = await fetch(
  'http://your-backend/api/builders/public/projects/upcoming'
);
const { data: upcomingProjects } = await response.json();

// Display in "Upcoming Projects" section
upcomingProjects.forEach(project => {
  console.log(`${project.project_name} by ${project.builder.name}`);
  console.log(`Launching: ${new Date(project.possession_date).toLocaleDateString()}`);
  console.log(`Starting from: ₹${project.price_range.min / 10000000}Cr`);
  console.log(`${project.total_units} units`);
});
```

### 2. Filter Upcoming Projects by City

```javascript
// City-specific upcoming projects
const city = "Mumbai";
const response = await fetch(
  `http://your-backend/api/builders/public/projects/upcoming?city=${city}`
);
const { data } = await response.json();

console.log(`${data.length} upcoming projects in ${city}`);
```

### 3. Create Upcoming Projects Card Component

```jsx
function UpcomingProjectCard({ project }) {
  const launchDate = new Date(project.possession_date);
  const monthsUntilLaunch = Math.ceil(
    (launchDate - new Date()) / (1000 * 60 * 60 * 24 * 30)
  );

  return (
    <div className="upcoming-project-card">
      <div className="badge">Coming Soon</div>
      <img src={project.images[0]} alt={project.project_name} />
      
      <h3>{project.project_name}</h3>
      <p>by {project.builder.name}</p>
      
      <div className="launch-info">
        <span>🚀 Launching in {monthsUntilLaunch} months</span>
        <span>📅 {launchDate.toLocaleDateString()}</span>
      </div>
      
      <div className="price-info">
        <span>Starting from</span>
        <h4>₹{project.price_range.min / 10000000}Cr</h4>
      </div>
      
      <div className="units-info">
        <span>{project.total_units} units available</span>
      </div>
      
      <button>Register Interest</button>
    </div>
  );
}

// Usage
function UpcomingProjectsPage() {
  const [upcomingProjects, setUpcomingProjects] = useState([]);
  
  useEffect(() => {
    fetch('/api/builders/public/projects/upcoming')
      .then(res => res.json())
      .then(data => setUpcomingProjects(data.data));
  }, []);
  
  return (
    <div className="upcoming-projects-section">
      <h2>Upcoming Projects</h2>
      <p>Be the first to invest in these pre-launch projects</p>
      
      <div className="projects-grid">
        {upcomingProjects.map(project => (
          <UpcomingProjectCard key={project._id} project={project} />
        ))}
      </div>
    </div>
  );
}
```

---

## 🔄 Alternative: Filter Existing Endpoint

You can also use the main projects endpoint with status filter:

```bash
# This works too!
GET /api/builders/public/projects?status=upcoming

# With additional filters
GET /api/builders/public/projects?status=upcoming&city=Mumbai&project_type=residential
```

**Dedicated endpoint benefits:**
- ✅ Cleaner, more semantic URL
- ✅ Specifically sorted by possession date
- ✅ Easier to understand and document
- ✅ Better for frontend routing

---

## 📊 Admin: Creating Upcoming Projects

### Create an Upcoming Project

```bash
POST /api/builders/:builderId/projects
Authorization: Bearer <admin-token>
Content-Type: multipart/form-data

Body:
- project_name: "Lodha World Towers 2"
- city: "Mumbai"
- project_type: "residential"
- status: "upcoming"  ⭐ Set status to upcoming
- possession_date: "2027-12-31"  ⭐ Set future date
- total_units: 100
- available_units: 100  ⭐ All units available for pre-launch
- price_min: 50000000
- price_max: 200000000
- unit_configurations: [...]
- images: [files]
```

### Update Project Status

When project starts construction, update status:

```bash
PUT /api/builders/projects/:projectId
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "status": "ongoing"  // Changed from "upcoming"
}
```

---

## 🎯 Use Cases

### 1. Pre-Launch Landing Page
Display upcoming projects with "Register Interest" forms

### 2. Investment Opportunities
Showcase early-bird investment options

### 3. Builder Portfolio
Show builder's upcoming pipeline

### 4. City-wise Launches
Display upcoming launches by city

### 5. Timeline View
Sort and display by possession date

---

## 📝 Project Status Workflow

```
upcoming → ongoing → completed → ready_to_move
   ↓          ↓          ↓            ↓
Pre-launch  Under      Finished    Move-in
            construction           ready
```

**Typical Timeline:**
- **Upcoming**: Project announced, bookings may start
- **Ongoing**: Construction in progress (1-3 years)
- **Completed**: Construction done, final touches
- **Ready to Move**: Immediate possession available

---

## ✨ SEO & Marketing Benefits

### Upcoming Projects Section:
- **Early bird offers** - Attract investors with pre-launch prices
- **Email campaigns** - "New launches in Mumbai"
- **Push notifications** - Alert users about new upcoming projects
- **Comparison** - Show price difference between upcoming vs ready-to-move
- **Builder credibility** - Display builder's upcoming pipeline

---

## 🧪 Testing

### Test the Endpoint

```bash
# 1. Create an upcoming project (Admin)
POST /api/builders/64builder.../projects
Authorization: Bearer <token>
{
  "project_name": "Test Upcoming Project",
  "city": "Mumbai",
  "status": "upcoming",
  "possession_date": "2027-12-31",
  "total_units": 50
}

# 2. Verify the project (Admin)
PATCH /api/builders/projects/64project.../verify
Authorization: Bearer <token>
{ "verified": true }

# 3. Check upcoming projects endpoint (Public)
GET /api/builders/public/projects/upcoming
# Should see your project!

# 4. Filter by city (Public)
GET /api/builders/public/projects/upcoming?city=Mumbai
# Should see your project!
```

---

## 📱 Sample Frontend Routes

```javascript
// React Router example
<Route path="/buy" element={<BuyPage />} />
<Route path="/buy/upcoming" element={<UpcomingProjectsPage />} />
<Route path="/buy/ready-to-move" element={<ReadyToMovePage />} />
<Route path="/buy/ongoing" element={<OngoingProjectsPage />} />
```

---

## 🎨 UI/UX Suggestions

### Upcoming Projects Badge
```jsx
{project.status === 'upcoming' && (
  <span className="badge-upcoming">
    🚀 Coming Soon
  </span>
)}
```

### Countdown Timer
```jsx
const daysUntilLaunch = Math.ceil(
  (new Date(project.possession_date) - new Date()) / (1000 * 60 * 60 * 24)
);

<div className="countdown">
  Launching in {daysUntilLaunch} days
</div>
```

### Pre-Launch Pricing Indicator
```jsx
<div className="pre-launch-offer">
  🎯 Pre-Launch Price: Save up to 20%
</div>
```

---

## ✅ Summary

**New Endpoint Added:**
```
GET /api/builders/public/projects/upcoming
```

**Features:**
- ✅ Dedicated endpoint for upcoming projects
- ✅ Sorted by possession date (earliest first)
- ✅ Filter by city and project type
- ✅ Perfect for Buy page "Upcoming Projects" section
- ✅ Public access (no authentication needed)
- ✅ Only returns verified upcoming projects

**Status Options Available:**
- `upcoming` - Pre-launch projects ⭐
- `ongoing` - Under construction
- `completed` - Construction finished
- `ready_to_move` - Immediate possession

---

**Ready to showcase upcoming projects on your Buy page!** 🚀

