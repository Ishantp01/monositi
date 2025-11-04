import Builder from "../../models/Builder.model.js";
import BuilderProject from "../../models/BuilderProject.model.js";
import { uploadFileToCloudinary } from "../../utils/uploadToCloudinary.js";
import fs from "fs";

/**
 * Helper function to safely get files from multer
 * @param {Object} files - Files object from multer
 * @param {string} key - File field name
 * @returns {Array} Array of files or empty array
 */
const safeFiles = (files, key) => (files && files[key] ? files[key] : []);

//================================================================
// A. BUILDER MANAGEMENT (Admin Only)
//================================================================

/**
 * Create a new builder
 * @route POST /api/builders
 * @access Admin only
 */
export const createBuilder = async (req, res) => {
  try {
    const {
      name,
      description,
      founded_year,
      phone,
      email,
      address,
      website,
      certifications,
      total_projects_completed,
    } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Builder name is required",
      });
    }

    // Handle logo upload
    let logoUrl = null;
    if (req.files && req.files.logo && req.files.logo[0]) {
      try {
        const result = await uploadFileToCloudinary(req.files.logo[0].path, "builders/logos");
        if (result.success) {
          logoUrl = result.secure_url;
        }
      } catch (err) {
        console.error("Logo upload error:", err.message);
      }
    }

    // Parse certifications if string
    let certificationsArray = [];
    if (certifications) {
      certificationsArray = Array.isArray(certifications) 
        ? certifications 
        : JSON.parse(certifications);
    }

    // Create builder
    const builder = new Builder({
      name,
      logo: logoUrl,
      description,
      founded_year: founded_year ? Number(founded_year) : undefined,
      contact_info: {
        phone,
        email,
        address,
      },
      website,
      certifications: certificationsArray,
      total_projects_completed: total_projects_completed ? Number(total_projects_completed) : 0,
      createdBy: req.user._id,
    });

    await builder.save();

    return res.status(201).json({
      success: true,
      message: "Builder created successfully",
      data: builder,
    });
  } catch (error) {
    console.error("Create builder error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create builder",
      error: error.message,
    });
  }
};

/**
 * Get all builders with filters
 * @route GET /api/builders?status=&verified=
 * @access Admin only
 */
export const getAllBuilders = async (req, res) => {
  try {
    const { status, verified } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (verified !== undefined) filter.monositi_verified = verified === "true";

    const builders = await Builder.find(filter)
      .populate("createdBy", "name email phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: builders.length,
      data: builders,
    });
  } catch (error) {
    console.error("Get all builders error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch builders",
      error: error.message,
    });
  }
};

/**
 * Get single builder details
 * @route GET /api/builders/:id
 * @access Admin only
 */
export const getBuilderById = async (req, res) => {
  try {
    const { id } = req.params;

    const builder = await Builder.findById(id)
      .populate("createdBy", "name email phone");

    if (!builder) {
      return res.status(404).json({
        success: false,
        message: "Builder not found",
      });
    }

    // Get projects count for this builder
    const projectsCount = await BuilderProject.countDocuments({ builder: id });

    return res.status(200).json({
      success: true,
      data: {
        ...builder.toObject(),
        projectsCount,
      },
    });
  } catch (error) {
    console.error("Get builder by ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch builder",
      error: error.message,
    });
  }
};

/**
 * Update builder details
 * @route PUT /api/builders/:id
 * @access Admin only
 */
export const updateBuilder = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      founded_year,
      phone,
      email,
      address,
      website,
      certifications,
      total_projects_completed,
      rating,
      status,
    } = req.body;

    const builder = await Builder.findById(id);
    if (!builder) {
      return res.status(404).json({
        success: false,
        message: "Builder not found",
      });
    }

    // Update fields
    if (name) builder.name = name;
    if (description) builder.description = description;
    if (founded_year) builder.founded_year = Number(founded_year);
    if (website) builder.website = website;
    if (total_projects_completed !== undefined) {
      builder.total_projects_completed = Number(total_projects_completed);
    }
    if (rating !== undefined) builder.rating = Number(rating);
    if (status) builder.status = status;

    // Update contact info
    if (phone) builder.contact_info.phone = phone;
    if (email) builder.contact_info.email = email;
    if (address) builder.contact_info.address = address;

    // Update certifications
    if (certifications) {
      builder.certifications = Array.isArray(certifications) 
        ? certifications 
        : JSON.parse(certifications);
    }

    // Handle logo upload
    if (req.files && req.files.logo && req.files.logo[0]) {
      try {
        const result = await uploadFileToCloudinary(req.files.logo[0].path, "builders/logos");
        if (result.success) {
          builder.logo = result.secure_url;
        }
      } catch (err) {
        console.error("Logo upload error:", err.message);
      }
    }

    await builder.save();

    return res.status(200).json({
      success: true,
      message: "Builder updated successfully",
      data: builder,
    });
  } catch (error) {
    console.error("Update builder error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update builder",
      error: error.message,
    });
  }
};

/**
 * Verify or unverify a builder
 * @route PATCH /api/builders/:id/verify
 * @access Admin only
 */
export const verifyBuilder = async (req, res) => {
  try {
    const { id } = req.params;
    const { verified } = req.body;

    const builder = await Builder.findById(id);
    if (!builder) {
      return res.status(404).json({
        success: false,
        message: "Builder not found",
      });
    }

    builder.monositi_verified = verified === true || verified === "true";
    await builder.save();

    return res.status(200).json({
      success: true,
      message: `Builder ${builder.monositi_verified ? "verified" : "unverified"} successfully`,
      data: builder,
    });
  } catch (error) {
    console.error("Verify builder error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify builder",
      error: error.message,
    });
  }
};

/**
 * Delete a builder
 * @route DELETE /api/builders/:id
 * @access Admin only
 */
export const deleteBuilder = async (req, res) => {
  try {
    const { id } = req.params;

    const builder = await Builder.findById(id);
    if (!builder) {
      return res.status(404).json({
        success: false,
        message: "Builder not found",
      });
    }

    // Delete all associated projects
    await BuilderProject.deleteMany({ builder: id });

    // Delete the builder
    await Builder.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Builder and associated projects deleted successfully",
    });
  } catch (error) {
    console.error("Delete builder error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete builder",
      error: error.message,
    });
  }
};

//================================================================
// B. BUILDER PROJECTS MANAGEMENT (Admin Only)
//================================================================

/**
 * Create a new builder project
 * @route POST /api/builders/:builderId/projects
 * @access Admin only
 */
export const createBuilderProject = async (req, res) => {
  try {
    const { builderId } = req.params;
    const {
      project_name,
      description,
      address,
      city,
      state,
      pincode,
      coordinates,
      project_type,
      status,
      possession_date,
      rera_number,
      total_units,
      available_units,
      price_min,
      price_max,
      unit_configurations,
      amenities,
    } = req.body;

    // Validation
    const builder = await Builder.findById(builderId);
    if (!builder) {
      return res.status(404).json({
        success: false,
        message: "Builder not found",
      });
    }

    if (!project_name) {
      return res.status(400).json({
        success: false,
        message: "Project name is required",
      });
    }

    const allowedProjectTypes = ["residential", "commercial", "mixed"];
    if (project_type && !allowedProjectTypes.includes(project_type)) {
      return res.status(400).json({
        success: false,
        message: `project_type must be one of: ${allowedProjectTypes.join(", ")}`,
      });
    }

    // Parse coordinates if provided
    let geoCoordinates = null;
    if (coordinates) {
      try {
        const coords = typeof coordinates === "string" ? JSON.parse(coordinates) : coordinates;
        if (coords.lng && coords.lat) {
          geoCoordinates = {
            type: "Point",
            coordinates: [parseFloat(coords.lng), parseFloat(coords.lat)],
          };
        }
      } catch (err) {
        console.log("Error parsing coordinates:", err.message);
      }
    }

    // Handle image uploads
    let uploadedImages = [];
    if (req.files && req.files.images) {
      const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      
      for (const file of imageFiles) {
        try {
          const result = await uploadFileToCloudinary(file.path, "builders/projects");
          if (result.success) {
            uploadedImages.push(result.secure_url);
          }
        } catch (err) {
          console.error("Image upload error:", err.message);
        }
      }
    }

    // Handle document uploads
    let uploadedDocuments = [];
    if (req.files && req.files.documents) {
      const docFiles = Array.isArray(req.files.documents) ? req.files.documents : [req.files.documents];
      
      for (const file of docFiles) {
        try {
          const result = await uploadFileToCloudinary(file.path, "builders/documents");
          if (result.success) {
            uploadedDocuments.push(result.secure_url);
          }
        } catch (err) {
          console.error("Document upload error:", err.message);
        }
      }
    }

    // Parse unit configurations if string
    let unitConfigsArray = [];
    if (unit_configurations) {
      try {
        unitConfigsArray = typeof unit_configurations === "string" 
          ? JSON.parse(unit_configurations) 
          : unit_configurations;
      } catch (err) {
        console.log("Error parsing unit_configurations:", err.message);
      }
    }

    // Parse amenities if string
    let amenitiesArray = [];
    if (amenities) {
      amenitiesArray = Array.isArray(amenities) 
        ? amenities 
        : JSON.parse(amenities);
    }

    // Create project
    const project = new BuilderProject({
      builder: builderId,
      project_name,
      description,
      location: {
        address,
        city,
        state,
        pincode,
        coordinates: geoCoordinates,
      },
      images: uploadedImages,
      project_type: project_type || "residential",
      status: status || "ongoing",
      possession_date: possession_date ? new Date(possession_date) : undefined,
      rera_number,
      total_units: total_units ? Number(total_units) : 0,
      available_units: available_units !== undefined ? Number(available_units) : Number(total_units) || 0,
      price_range: {
        min: price_min ? Number(price_min) : undefined,
        max: price_max ? Number(price_max) : undefined,
      },
      unit_configurations: unitConfigsArray,
      amenities: amenitiesArray,
      documents: uploadedDocuments,
      createdBy: req.user._id,
    });

    await project.save();

    return res.status(201).json({
      success: true,
      message: "Builder project created successfully",
      data: project,
    });
  } catch (error) {
    console.error("Create builder project error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create builder project",
      error: error.message,
    });
  }
};

/**
 * Get all projects for a builder
 * @route GET /api/builders/:builderId/projects
 * @access Admin only
 */
export const getBuilderProjects = async (req, res) => {
  try {
    const { builderId } = req.params;
    const { status, verified } = req.query;

    const builder = await Builder.findById(builderId);
    if (!builder) {
      return res.status(404).json({
        success: false,
        message: "Builder not found",
      });
    }

    // Build filter
    const filter = { builder: builderId };
    if (status) filter.status = status;
    if (verified !== undefined) filter.monositi_verified = verified === "true";

    const projects = await BuilderProject.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error("Get builder projects error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch builder projects",
      error: error.message,
    });
  }
};

/**
 * Get all projects (with filters)
 * @route GET /api/builders/projects?city=&project_type=&status=
 * @access Admin only
 */
export const getAllProjects = async (req, res) => {
  try {
    const { city, project_type, status, verified } = req.query;

    // Build filter
    const filter = {};
    if (city) filter["location.city"] = new RegExp(city, "i");
    if (project_type) filter.project_type = project_type;
    if (status) filter.status = status;
    if (verified !== undefined) filter.monositi_verified = verified === "true";

    const projects = await BuilderProject.find(filter)
      .populate("builder", "name logo monositi_verified rating")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error("Get all projects error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
};

/**
 * Get single project details
 * @route GET /api/builders/projects/:projectId
 * @access Admin only
 */
export const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await BuilderProject.findById(projectId)
      .populate("builder", "name logo contact_info website monositi_verified rating")
      .populate("createdBy", "name email phone");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Get project by ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch project",
      error: error.message,
    });
  }
};

/**
 * Update project details
 * @route PUT /api/builders/projects/:projectId
 * @access Admin only
 */
export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const {
      project_name,
      description,
      address,
      city,
      state,
      pincode,
      coordinates,
      project_type,
      status,
      possession_date,
      rera_number,
      total_units,
      available_units,
      price_min,
      price_max,
      unit_configurations,
      amenities,
    } = req.body;

    const project = await BuilderProject.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Update fields
    if (project_name) project.project_name = project_name;
    if (description) project.description = description;
    if (project_type) project.project_type = project_type;
    if (status) project.status = status;
    if (rera_number) project.rera_number = rera_number;
    if (possession_date) project.possession_date = new Date(possession_date);
    if (total_units !== undefined) project.total_units = Number(total_units);
    if (available_units !== undefined) project.available_units = Number(available_units);

    // Update location
    if (address) project.location.address = address;
    if (city) project.location.city = city;
    if (state) project.location.state = state;
    if (pincode) project.location.pincode = pincode;

    // Update coordinates if provided
    if (coordinates) {
      try {
        const coords = typeof coordinates === "string" ? JSON.parse(coordinates) : coordinates;
        if (coords.lng && coords.lat) {
          project.location.coordinates = {
            type: "Point",
            coordinates: [parseFloat(coords.lng), parseFloat(coords.lat)],
          };
        }
      } catch (err) {
        console.log("Error parsing coordinates:", err.message);
      }
    }

    // Update price range
    if (price_min !== undefined) project.price_range.min = Number(price_min);
    if (price_max !== undefined) project.price_range.max = Number(price_max);

    // Update unit configurations
    if (unit_configurations) {
      try {
        project.unit_configurations = typeof unit_configurations === "string" 
          ? JSON.parse(unit_configurations) 
          : unit_configurations;
      } catch (err) {
        console.log("Error parsing unit_configurations:", err.message);
      }
    }

    // Update amenities
    if (amenities) {
      project.amenities = Array.isArray(amenities) 
        ? amenities 
        : JSON.parse(amenities);
    }

    // Handle new image uploads
    if (req.files && req.files.images) {
      const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      
      for (const file of imageFiles) {
        try {
          const result = await uploadFileToCloudinary(file.path, "builders/projects");
          if (result.success) {
            project.images.push(result.secure_url);
          }
        } catch (err) {
          console.error("Image upload error:", err.message);
        }
      }
    }

    // Handle new document uploads
    if (req.files && req.files.documents) {
      const docFiles = Array.isArray(req.files.documents) ? req.files.documents : [req.files.documents];
      
      for (const file of docFiles) {
        try {
          const result = await uploadFileToCloudinary(file.path, "builders/documents");
          if (result.success) {
            project.documents.push(result.secure_url);
          }
        } catch (err) {
          console.error("Document upload error:", err.message);
        }
      }
    }

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    console.error("Update project error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update project",
      error: error.message,
    });
  }
};

/**
 * Verify or unverify a project
 * @route PATCH /api/builders/projects/:projectId/verify
 * @access Admin only
 */
export const verifyProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { verified } = req.body;

    const project = await BuilderProject.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    project.monositi_verified = verified === true || verified === "true";
    await project.save();

    return res.status(200).json({
      success: true,
      message: `Project ${project.monositi_verified ? "verified" : "unverified"} successfully`,
      data: project,
    });
  } catch (error) {
    console.error("Verify project error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify project",
      error: error.message,
    });
  }
};

/**
 * Update project unit availability
 * @route PATCH /api/builders/projects/:projectId/units
 * @access Admin only
 */
export const updateProjectUnits = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { total_units, available_units, unit_configurations } = req.body;

    const project = await BuilderProject.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Update overall units
    if (total_units !== undefined) {
      project.total_units = Number(total_units);
    }
    if (available_units !== undefined) {
      project.available_units = Number(available_units);
    }

    // Update specific unit configurations
    if (unit_configurations) {
      try {
        const updatedConfigs = typeof unit_configurations === "string" 
          ? JSON.parse(unit_configurations) 
          : unit_configurations;
        
        // Merge with existing configurations
        project.unit_configurations = updatedConfigs;
      } catch (err) {
        console.log("Error parsing unit_configurations:", err.message);
      }
    }

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Project units updated successfully",
      data: project,
    });
  } catch (error) {
    console.error("Update project units error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update project units",
      error: error.message,
    });
  }
};

/**
 * Delete a project
 * @route DELETE /api/builders/projects/:projectId
 * @access Admin only
 */
export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await BuilderProject.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await BuilderProject.findByIdAndDelete(projectId);

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete project",
      error: error.message,
    });
  }
};

//================================================================
// C. PUBLIC/FRONTEND APIs (Read-only)
//================================================================

/**
 * Get verified builders (public)
 * @route GET /api/builders/public
 * @access Public
 */
export const getPublicBuilders = async (req, res) => {
  try {
    const filter = {
      monositi_verified: true,
      status: "active",
    };

    const builders = await Builder.find(filter)
      .select("-createdBy")
      .sort({ rating: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: builders.length,
      data: builders,
    });
  } catch (error) {
    console.error("Get public builders error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch builders",
      error: error.message,
    });
  }
};

/**
 * Get public builder details with projects
 * @route GET /api/builders/public/:id
 * @access Public
 */
export const getPublicBuilderById = async (req, res) => {
  try {
    const { id } = req.params;

    const builder = await Builder.findById(id).select("-createdBy");

    if (!builder) {
      return res.status(404).json({
        success: false,
        message: "Builder not found",
      });
    }

    if (!builder.monositi_verified) {
      return res.status(403).json({
        success: false,
        message: "This builder is not verified",
      });
    }

    // Get verified projects for this builder
    const projects = await BuilderProject.find({
      builder: id,
      monositi_verified: true,
    }).select("-createdBy");

    return res.status(200).json({
      success: true,
      data: {
        ...builder.toObject(),
        projects,
      },
    });
  } catch (error) {
    console.error("Get public builder by ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch builder",
      error: error.message,
    });
  }
};

/**
 * Get verified projects (public) - for Buy section
 * @route GET /api/builders/public/projects?city=&project_type=&status=
 * @access Public
 */
export const getPublicProjects = async (req, res) => {
  try {
    const { city, project_type, status, min_price, max_price } = req.query;

    // Build filter - only verified
    const filter = {
      monositi_verified: true,
    };

    if (city) filter["location.city"] = new RegExp(city, "i");
    if (project_type) filter.project_type = project_type;
    if (status) filter.status = status;
    
    // Price range filter
    if (min_price || max_price) {
      filter.$or = [];
      if (min_price && max_price) {
        filter.$or.push({
          "price_range.min": { $gte: Number(min_price) },
          "price_range.max": { $lte: Number(max_price) },
        });
      } else if (min_price) {
        filter.$or.push({ "price_range.min": { $gte: Number(min_price) } });
      } else if (max_price) {
        filter.$or.push({ "price_range.max": { $lte: Number(max_price) } });
      }
    }

    const projects = await BuilderProject.find(filter)
      .populate("builder", "name logo rating monositi_verified")
      .select("-createdBy")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error("Get public projects error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
};

/**
 * Get public project details
 * @route GET /api/builders/public/projects/:projectId
 * @access Public
 */
export const getPublicProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await BuilderProject.findById(projectId)
      .populate("builder", "name logo description contact_info website monositi_verified rating founded_year")
      .select("-createdBy");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (!project.monositi_verified) {
      return res.status(403).json({
        success: false,
        message: "This project is not verified",
      });
    }

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Get public project by ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch project",
      error: error.message,
    });
  }
};

/**
 * Get upcoming projects (public) - for Buy section
 * @route GET /api/builders/public/projects/upcoming?city=&project_type=
 * @access Public
 */
export const getUpcomingProjects = async (req, res) => {
  try {
    const { city, project_type } = req.query;

    // Build filter - only verified and upcoming
    const filter = {
      monositi_verified: true,
      status: "upcoming",
    };

    if (city) filter["location.city"] = new RegExp(city, "i");
    if (project_type) filter.project_type = project_type;

    const projects = await BuilderProject.find(filter)
      .populate("builder", "name logo rating monositi_verified")
      .select("-createdBy")
      .sort({ possession_date: 1 }); // Sort by possession date (earliest first)

    return res.status(200).json({
      success: true,
      count: projects.length,
      message: "Upcoming projects retrieved successfully",
      data: projects,
    });
  } catch (error) {
    console.error("Get upcoming projects error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch upcoming projects",
      error: error.message,
    });
  }
};

