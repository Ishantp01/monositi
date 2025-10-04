const express = require("express");
const router = express.Router();

// 🧩 Import Module Routes
const userRoutes = require("../modules/users/user.routes");

// 🛣 Mount Routes
router.use("/users", userRoutes); // Final path → /api/users/...



module.exports = router;
