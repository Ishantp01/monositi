import express from "express";
const router = express.Router();


import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/users/user.routes.js";
import propertyRoutes from "../modules/properties/property.routes.js";
import providerRoutes from "../modules/services/provider.routes.js";
import serviceRoutes from "../modules/services/service.routes.js";
import adminRoutes from "../modules/services/admin.routes.js";
import monositiRoutes from "../modules/Monositi/monositi.routes.js";


router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/properties", propertyRoutes);
router.use("/services/provider", providerRoutes);
router.use("/services", serviceRoutes);
router.use("/admin", adminRoutes);
router.use("/monositi", monositiRoutes);

export default router;
