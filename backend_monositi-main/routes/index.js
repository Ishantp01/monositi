const express = require("express");
const router = express.Router();

// 🧩 Import Module Routes
const userRoutes = require("../modules/users/user.routes");
const propertyRoutes = require("../modules/property/property.routes")

// 🛣 Mount Routes
router.use("/users", userRoutes); // Final path → /api/users/...
router.use("/properties", propertyRoutes)


module.exports = router;
