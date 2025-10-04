const express = require("express");
const router = express.Router();

// 🧩 Import Module Routes
const userRoutes = require("../modules/users/user.routes");
const propertyRoutes = require("../modules/property/property.routes")
const serviceRoutes = require("../modules/services/service.routes")

// 🛣 Mount Routes
router.use("/users", userRoutes); // Final path → /api/users/...
router.use("/properties", propertyRoutes)
router.use("/services", serviceRoutes)


module.exports = router;
