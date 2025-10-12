import API_BASE_URL from './constant';

const getAuthToken = () => {
  return localStorage.getItem("token");
};

const getAuthHeaders = () => {
  return {
    Authorization: `Bearer ${getAuthToken()}`,
    "Content-Type": "application/json",
  };
};

export const propertyApi = {
  // Monositi API functions
  getAllMonositiListings: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`${API_BASE_URL}/monositi?${queryParams}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching Monositi listings:", error);
      return {
        success: false,
        message: "Failed to fetch Monositi listings",
        listings: [],
      };
    }
  },

  getMonositiListingById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/monositi/${id}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching Monositi listing:", error);
      return { success: false, message: "Failed to fetch Monositi listing" };
    }
  },

  // Original property API functions
  getAllProperties: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/properties?${queryParams}`);
    const data = await response.json();

    // Sort properties: featured first, then popular, then the rest
    if (data.properties) {
      data.properties.sort((a, b) => {
        // Featured properties come first
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;

        // Then popular properties
        if (a.popular && !b.popular) return -1;
        if (!a.popular && b.popular) return 1;

        // Default sorting (could be by date, price, etc.)
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    }

    return data;
  },

  getFilteredProperties: async (type, filters = {}) => {
    try {
      // Use the correct endpoint for type-based property search
      const response = await fetch(
        `${API_BASE_URL}/properties/properties/search/type?type=${type}`
      );
      const data = await response.json();

      // Sort properties: featured first, then popular, then the rest
      if (data.properties) {
        data.properties.sort((a, b) => {
          // Featured properties come first
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;

          // Then popular properties
          if (a.popular && !b.popular) return -1;
          if (!a.popular && b.popular) return 1;

          // Default sorting (could be by date, price, etc.)
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
      }

      return data;
    } catch (error) {
      console.error("Error fetching filtered properties:", error);
      return {
        success: false,
        message: "Failed to fetch properties",
        properties: [],
      };
    }
  },

  // Property APIs
  getPropertyById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/properties/properties/${id}`);
    return await response.json();
  },

  getPropertyByLandlord: async () => {
    const response = await fetch(`${API_BASE_URL}/properties/properties`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return await response.json();
  },

  createProperty: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/properties/properties`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return await response.json();
  },

  updateProperty: async (id, formData) => {
    const response = await fetch(
      `${API_BASE_URL}/properties/properties/${id}`,
      {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return await response.json();
  },

  deleteProperty: async (id) => {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return await response.json();
  },

  getPropertiesByTags: async (tags) => {
    const response = await fetch(
      `${API_BASE_URL}/properties/properties/search/type?type=${tags}`
    );
    const data = await response.json();

    // Sort properties: featured first, then popular, then the rest
    if (data.properties) {
      data.properties.sort((a, b) => {
        // Featured properties come first
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;

        // Then popular properties
        if (a.popular && !b.popular) return -1;
        if (!a.popular && b.popular) return 1;

        // Default sorting (could be by date, price, etc.)
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    }

    return data;
  },

  // Admin endpoints
  getAllPropertiesForAdmin: async () => {
    const response = await fetch(
      `${API_BASE_URL}/properties/admin/properties/all`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return await response.json();
  },

  verifyProperty: async (id, status) => {
    const response = await fetch(
      `${API_BASE_URL}/properties/admin/properties/${id}/verify`,
      {
        method: "PATCH",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );
    return await response.json();
  },

  suspendProperty: async (id) => {
    const response = await fetch(
      `${API_BASE_URL}/properties/admin/properties/${id}/suspend`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
      }
    );
    return await response.json();
  },

  // =======================
  // Monositi helper functions
  // =======================

  // Get all Monositi listings
  getAllMonositiListings: async () => {
    const response = await fetch(`${API_BASE_URL}/monositi`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return await response.json();
  },

  // Get single Monositi listing by ID
  getMonositiListingById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/monositi/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return await response.json();
  },

  // Create new Monositi listing
  createMonositiListing: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/monositi`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return await response.json();
  },

  // Update Monositi listing
  updateMonositiListing: async (id, formData) => {
    const response = await fetch(`${API_BASE_URL}/monositi/${id}`, {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return await response.json();
  },

  // Delete Monositi listing
  deleteMonositiListing: async (id) => {
    const response = await fetch(`${API_BASE_URL}/monositi/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return await response.json();
  },
};

// Format for Monositi form
export const formatPropertyForForm = (property) => {
  return {
    type: property.type || "",
    name: property.name || "",
    description: property.description || "",
    address: property.address || "",
    city: property.city || "",
    state: property.state || "",
    price: property.price || "",
    tags: property.tags ? property.tags.join(", ") : "",
    genderPreference: property.genderPreference || "",
    contactNumber: property.contactNumber || "",
    photos: [],
  };
};

// Create FormData
export const createPropertyFormData = (propertyData) => {
  const formData = new FormData();

  Object.keys(propertyData).forEach((key) => {
    if (
      key !== "photos" &&
      propertyData[key] !== null &&
      propertyData[key] !== undefined
    ) {
      formData.append(key, propertyData[key]);
    }
  });

  if (propertyData.photos && propertyData.photos.length > 0) {
    propertyData.photos.forEach((photo, index) => {
      formData.append("photos", photo);
    });
  }

  return formData;
};

export default propertyApi;
