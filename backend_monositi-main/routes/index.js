const express = require("express");
const router = express.Router();

// 🧩 Import Module Routes
const userRoutes = require("../modules/users/user.routes");
const propertyRoutes = require("../modules/property/property.routes")
const serviceRoutes = require("../modules/services/service.routes")
const monositiRoutes = require("../modules/monositi/monositi.routes");

// 🛣 Mount Routes
router.use("/users", userRoutes); // Final path → /api/users/...
router.use("/properties", propertyRoutes)
router.use("/services", serviceRoutes)
router.use("/monositi", monositiRoutes)


module.exports = router;
