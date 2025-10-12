import Property from "../../models/property.model.js";
import User from "../../models/user.model.js";
import { uploadFileToCloudinary } from "../../utils/uploadToCloudinary.js";
import fs from "fs";

/**
 * Helper function to safely get files from multer
 * @param {Object} files - Files object from multer
 * @param {string} key - File field name
 * @returns {Array} Array of files or empty array
 */
const safeFiles = (files, key) => (files && files[key] ? files[key] : []);

/**
 * Create property listing
 * @route POST /api/properties
 * @access Private (authenticated users only)
 */
export const createPropertyListing = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ success: false, message: "Not authenticated" });
        }

        // Extract fields from request body
        const {
            type,
            name,
            description,
            address,
            city,
            state,
            pincode,
            price,
            tags,
            amenities,
            size,
            units,
            nearby_places,
            listing_visibility,
            contactNumber,
            geo // optional JSON string or fields lng/lat
        } = req.body;

        // Basic validation
        const allowedTypes = ["residential", "commercial"];
        if (!type || !allowedTypes.includes(type)) {
            return res.status(400).json({
                success: false,
                message: `type is required and must be one of ${allowedTypes.join(", ")}`
            });
        }

        if (!address || !city || !state) {
            return res.status(400).json({
                success: false,
                message: "address, city and state are required"
            });
        }

        if (!price || isNaN(Number(price)) || Number(price) <= 0) {
            return res.status(400).json({
                success: false,
                message: "price is required and must be a positive number"
            });
        }

        // Normalize tags, amenities, nearby_places (handle both arrays and comma-separated strings)
        const normalizeArrayField = (val) => {
            if (!val) return [];
            if (Array.isArray(val)) return val.map(t => String(t).trim()).filter(Boolean);
            return String(val).split(",").map(t => t.trim()).filter(Boolean);
        };

        const tagsArray = normalizeArrayField(tags).map(t => t.toLowerCase());
        const amenitiesArray = normalizeArrayField(amenities);
        const nearbyArray = normalizeArrayField(nearby_places);

        // Handle geo location if provided
        let geo_location = undefined;
        if (geo) {
            try {
                const g = typeof geo === "string" ? JSON.parse(geo) : geo;
                if (g && typeof g.lng === "number" && typeof g.lat === "number") {
                    geo_location = { type: "Point", coordinates: [g.lng, g.lat] };
                }
            } catch (e) {
                // ignore parse errors
            }
        } else if (req.body.lng && req.body.lat) {
            const lng = parseFloat(req.body.lng);
            const lat = parseFloat(req.body.lat);
            if (!Number.isNaN(lng) && !Number.isNaN(lat)) {
                geo_location = { type: "Point", coordinates: [lng, lat] };
            }
        }

        // Handle file uploads
        const files = req.files || {};
        const photoFiles = safeFiles(files, "photos");
        const propertyDocFiles = safeFiles(files, "propertyDocs");

        // Upload images to Cloudinary
        const images = [];
        for (const file of photoFiles) {
            try {
                const uploadResult = await uploadFileToCloudinary(file.path, "monositi/properties/photos");
                if (uploadResult.success) {
                    images.push(uploadResult.secure_url);
                } else {
                    console.error('Failed to upload image:', uploadResult.error);
                }
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }

        // Upload property documents to Cloudinary
        const documents = [];
        for (const file of propertyDocFiles) {
            try {
                const uploadResult = await uploadFileToCloudinary(file.path, "monositi/properties/docs");
                if (uploadResult.success) {
                    documents.push(uploadResult.secure_url);
                } else {
                    console.error('Failed to upload document:', uploadResult.error);
                }
            } catch (error) {
                console.error('Error uploading document:', error);
            }
        }

        // Build property document according to model schema
        const propertyPayload = {
            owner_id: user._id,
            type,
            status: "pending",
            name: name || `${type} Property in ${city}`,
            address,
            city,
            state,
            pincode,
            property_features: {
                size: size ? Number(size) : undefined,
                units: units ? Number(units) : undefined,
                amenities: amenitiesArray,
                nearby_places: nearbyArray,
                images: images,
            },
            price: Number(price),
            occupancy_rate: 0,
            performance_metrics: { views: 0, leads: 0 },
            tags: tagsArray,
            listing_visibility: listing_visibility || "public",
            documents: documents,
            verification_status: "pending",
            monositi_verified: false,
        };

        // Add geo location if provided
        if (geo_location) {
            propertyPayload.geo_location = geo_location;
        }

        // Add contact number if provided
        if (contactNumber) {
            propertyPayload.contactNumber = contactNumber;
        }

        // Create property
        const property = await Property.create(propertyPayload);

        // Clean up uploaded files
        try {
            if (req.files) {
                Object.values(req.files).flat().forEach(file => {
                    if (file && file.path && fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                });
            }
        } catch (cleanupError) {
            console.error("Error cleaning up files:", cleanupError);
        }

        return res.status(201).json({
            success: true,
            message: "Property created successfully (pending verification)",
            property: {
                _id: property._id,
                name: property.name,
                type: property.type,
                address: property.address,
                city: property.city,
                state: property.state,
                price: property.price,
                status: property.status,
                verification_status: property.verification_status,
                images: property.property_features?.images || [],
                owner: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                },
                createdAt: property.createdAt,
            }
        });

    } catch (err) {
        console.error("createPropertyListing error:", err);

        // Clean up any uploaded files on error
        try {
            if (req.files) {
                Object.values(req.files).flat().forEach(file => {
                    if (file && file.path && fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                });
            }
        } catch (cleanupError) {
            console.error("Error cleaning up files on error:", cleanupError);
        }

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message
        });
    }
};

/**
 * Get all properties with filtering and pagination
 * @route GET /api/properties
 * @access Public
 */
export const getProperties = async (req, res) => {
    try {
        const {
            type,
            city,
            state,
            minPrice,
            maxPrice,
            bedrooms,
            amenities,
            page = 1,
            limit = 20,
            sort = '-createdAt'
        } = req.query;

        // Build filter object
        const filter = {
            status: 'active',
            verification_status: 'verified'
        };

        if (type) filter.type = type;
        if (city) filter.city = { $regex: city, $options: 'i' };
        if (state) filter.state = { $regex: state, $options: 'i' };

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        // Pagination
        const skip = (Number(page) - 1) * Number(limit);

        const properties = await Property.find(filter)
            .populate('owner_id', 'name email phone')
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        const total = await Property.countDocuments(filter);

        return res.status(200).json({
            success: true,
            properties,
            pagination: {
                current: Number(page),
                total: Math.ceil(total / Number(limit)),
                count: properties.length,
                totalCount: total
            }
        });
    } catch (err) {
        console.error("getProperties error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message
        });
    }
};

/**
 * Get property by ID
 * @route GET /api/properties/:id
 * @access Public
 */
export const getPropertyById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid property ID format"
            });
        }

        const property = await Property.findOne({
            _id: id,
            status: 'active',
            verification_status: 'verified'
        }).populate('owner_id', 'name email phone');

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }

        // Increment view count
        property.performance_metrics.views += 1;
        await property.save();

        return res.status(200).json({
            success: true,
            property
        });
    } catch (err) {
        console.error("getPropertyById error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message
        });
    }
};

/**
 * Update property
 * @route PUT /api/properties/:id
 * @access Private (owner only)
 */
export const updateProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        const property = await Property.findOne({
            _id: id,
            owner_id: user._id
        });

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found or you're not the owner"
            });
        }

        // Extract updatable fields
        const {
            name,
            description,
            address,
            city,
            state,
            pincode,
            price,
            tags,
            amenities,
            size,
            units,
            nearby_places,
            listing_visibility,
            contactNumber,
            geo
        } = req.body;

        // Update basic fields
        if (name) property.name = name;
        if (description) property.description = description;
        if (address) property.address = address;
        if (city) property.city = city;
        if (state) property.state = state;
        if (pincode) property.pincode = pincode;
        if (price) property.price = Number(price);

        // Update property features
        if (property.property_features) {
            if (size !== undefined) property.property_features.size = Number(size);
            if (units !== undefined) property.property_features.units = Number(units);
            if (amenities) {
                const amenitiesArray = Array.isArray(amenities)
                    ? amenities.map(a => String(a).trim()).filter(Boolean)
                    : String(amenities).split(",").map(a => a.trim()).filter(Boolean);
                property.property_features.amenities = amenitiesArray;
            }
            if (nearby_places) {
                const nearbyArray = Array.isArray(nearby_places)
                    ? nearby_places.map(n => String(n).trim()).filter(Boolean)
                    : String(nearby_places).split(",").map(n => n.trim()).filter(Boolean);
                property.property_features.nearby_places = nearbyArray;
            }
        }

        // Update other fields
        if (tags) {
            const tagsArray = Array.isArray(tags)
                ? tags.map(t => String(t).trim().toLowerCase()).filter(Boolean)
                : String(tags).split(",").map(t => t.trim().toLowerCase()).filter(Boolean);
            property.tags = tagsArray;
        }

        if (listing_visibility) property.listing_visibility = listing_visibility;
        if (contactNumber) property.contactNumber = contactNumber;

        // Update geo location if provided
        if (geo) {
            try {
                const g = typeof geo === "string" ? JSON.parse(geo) : geo;
                if (g && typeof g.lng === "number" && typeof g.lat === "number") {
                    property.geo_location = { type: "Point", coordinates: [g.lng, g.lat] };
                }
            } catch (e) {
                // ignore parse errors
            }
        }

        await property.save();

        return res.status(200).json({
            success: true,
            message: "Property updated successfully",
            property
        });
    } catch (err) {
        console.error("updateProperty error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message
        });
    }
};

/**
 * Delete property (soft delete)
 * @route DELETE /api/properties/:id
 * @access Private (owner only)
 */
export const deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        const property = await Property.findOne({
            _id: id,
            owner_id: user._id
        });

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found or you're not the owner"
            });
        }

        // Soft delete
        property.status = 'sold'; // or add a deleted field
        await property.save();

        return res.status(200).json({
            success: true,
            message: "Property deleted successfully"
        });
    } catch (err) {
        console.error("deleteProperty error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message
        });
    }
};

export const getOwnerProperties = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const {
      status,
      type,
      page = 1,
      limit = 20,
      sort = "-createdAt"
    } = req.query;

    // Build filter
    const filter = {
      owner_id: user._id
    };

    if (status) filter.status = status;
    if (type) filter.type = type;

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const properties = await Property.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Property.countDocuments(filter);

    return res.status(200).json({
      success: true,
      properties,
      pagination: {
        current: Number(page),
        total: Math.ceil(total / Number(limit)),
        count: properties.length,
        totalCount: total
      }
    });
  } catch (err) {
    console.error("getOwnerProperties error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};


export const getNearbyProperties = async (req, res) => {
  try {
    const { latitude, longitude, radius = 5 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required"
      });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const radiusKm = parseFloat(radius);

    // Validate coordinates
    if (isNaN(lat) || isNaN(lng) || isNaN(radiusKm)) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude, longitude, or radius values"
      });
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({
        success: false,
        message: "Invalid coordinate range. Latitude: -90 to 90, Longitude: -180 to 180"
      });
    }

    // Convert radius from km to radians (1 km = 1/6371 radians approximately)
    const radiusInRadians = radiusKm / 6371;

    const properties = await Property.find({
      geo_location: {
        $geoWithin: {
          $centerSphere: [[lng, lat], radiusInRadians],
        }
      },
      status: 'active',
      verification_status: 'verified'
    }).populate('owner_id', 'name email phone');

    return res.status(200).json({
      success: true,
      message: `Found ${properties.length} properties within ${radiusKm}km`,
      properties,
      searchParams: {
        latitude: lat,
        longitude: lng,
        radius: radiusKm,
        radiusUnit: 'km'
      }
    });
  } catch (err) {
    console.error("getNearbyProperties error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

export const searchProperties = async (req, res) => {
  try {
    const { q, city, type, minPrice, maxPrice, limit = 20, page = 1, sort } = req.query;

    // Trim all string parameters to remove extra spaces
    const trimmedCity = city ? city.trim() : null;
    const trimmedType = type ? type.trim() : null;
    const trimmedQ = q ? q.trim() : null;

    // Validate and set default sort
    const validSortFields = ['createdAt', '-createdAt', 'price', '-price', 'name', '-name'];
    const sortField = sort && validSortFields.includes(sort) ? sort : '-createdAt';

    // Build filter object
    const filter = {
      status: 'active',
      verification_status: 'verified'
    };

    // Add filters
    if (trimmedCity) filter.city = { $regex: trimmedCity, $options: 'i' };
    if (trimmedType) filter.type = trimmedType;

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Search query filter
    if (trimmedQ) {
      filter.$or = [
        { name: { $regex: trimmedQ, $options: "i" } },
        { description: { $regex: trimmedQ, $options: "i" } },
        { address: { $regex: trimmedQ, $options: "i" } },
        { city: { $regex: trimmedQ, $options: "i" } },
        { state: { $regex: trimmedQ, $options: "i" } },
        { tags: { $in: [new RegExp(trimmedQ, 'i')] } },
        { 'property_features.amenities': { $in: [new RegExp(trimmedQ, 'i')] } },
        { 'property_features.nearby_places': { $in: [new RegExp(trimmedQ, 'i')] } }
      ];
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const properties = await Property.find(filter)
      .populate('owner_id', 'name email phone')
      .sort(sortField)
      .skip(skip)
      .limit(Number(limit));

    const total = await Property.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: `Found ${properties.length} properties matching your search`,
      properties,
      pagination: {
        current: Number(page),
        total: Math.ceil(total / Number(limit)),
        count: properties.length,
        totalCount: total
      },
      searchParams: {
        query: trimmedQ || null,
        city: trimmedCity || null,
        type: trimmedType || null,
        minPrice: minPrice || null,
        maxPrice: maxPrice || null,
        sort: sortField
      }
    });
  } catch (error) {
    console.error("searchProperties error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


