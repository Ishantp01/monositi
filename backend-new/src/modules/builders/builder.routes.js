import express from "express";
const router = express.Router();

import {
  // Builder Management
  createBuilder,
  getAllBuilders,
  getBuilderById,
  updateBuilder,
  verifyBuilder,
  deleteBuilder,
  // Project Management
  createBuilderProject,
  getBuilderProjects,
  getAllProjects,
  getProjectById,
  updateProject,
  verifyProject,
  updateProjectUnits,
  deleteProject,
  // Public APIs
  getPublicBuilders,
  getPublicBuilderById,
  getPublicProjects,
  getPublicProjectById,
  getUpcomingProjects,
} from "./builder.controller.js";

import { protect, adminOnly } from "../../middlewares/authMiddleware.js";
import upload from "../../config/multer.js";

//================================================================
// PUBLIC ROUTES (No authentication required)
//================================================================

// Get verified builders
router.get("/public", getPublicBuilders);
// Get verified projects (for Buy section)
router.get("/public/projects", getPublicProjects);
// Get builder details with projects


router.get("/public/:id", getPublicBuilderById);

// Get upcoming projects (MUST be before /:projectId route)
router.get("/public/projects/upcoming", getUpcomingProjects);

// Get project details
router.get("/public/projects/:projectId", getPublicProjectById);

//================================================================
// ADMIN-ONLY ROUTES (Authentication + Admin role required)
//================================================================

// Apply admin protection to all routes below
router.use(protect, adminOnly);

//----------------------------------------------------------------
// A. BUILDER MANAGEMENT
//----------------------------------------------------------------

// Create new builder with logo
router.post("/", upload.fields([{ name: "logo", maxCount: 1 }]), createBuilder);

// Get all builders
router.get("/", getAllBuilders);

// Update builder details
router.put("/:id", upload.fields([{ name: "logo", maxCount: 1 }]), updateBuilder);

// Verify or unverify a builder
router.patch("/:id/verify", verifyBuilder);

// Delete a builder
router.delete("/:id", deleteBuilder);

//----------------------------------------------------------------
// B. BUILDER PROJECTS MANAGEMENT
//----------------------------------------------------------------

// Create new project for a builder
router.post(
  "/:builderId/projects",
  upload.fields([
    { name: "images", maxCount: 15 },
    { name: "documents", maxCount: 10 },
  ]),
  createBuilderProject
);

// Get all projects for a specific builder
router.get("/:builderId/projects", getBuilderProjects);

// Get all projects (with filters)
router.get("/projects/all", getAllProjects);

// Get single project details
router.get("/projects/:projectId", getProjectById);

// Update project details
router.put(
  "/projects/:projectId",
  upload.fields([
    { name: "images", maxCount: 15 },
    { name: "documents", maxCount: 10 },
  ]),
  updateProject
);

// Verify or unverify a project
router.patch("/projects/:projectId/verify", verifyProject);

// Update project unit availability
router.patch("/projects/:projectId/units", updateProjectUnits);

// Delete a project
router.delete("/projects/:projectId", deleteProject);

// Get single builder details
// NOTE: placed after the /projects routes to avoid route param conflicts
router.get("/:id", getBuilderById);

export default router;

