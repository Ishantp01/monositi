// API utility functions for property operations
const API_BASE_URL = '/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Get auth headers
const getAuthHeaders = () => {
  return {
    'Authorization': `Bearer ${getAuthToken()}`,
    'Content-Type': 'application/json'
  };
};

// Property API functions
export const propertyApi = {
  // Get all properties (public)
  getAllProperties: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/properties?${queryParams}`);
    return await response.json();
  },

  // Get property by ID (public)
  getPropertyById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`);
    return await response.json();
  },

  // Get landlord's properties
  getMyProperties: async () => {
    const response = await fetch(`${API_BASE_URL}/properties/my-properties`, {
      headers: getAuthHeaders()
    });
    return await response.json();
  },

  // Create new property
  createProperty: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/properties`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });
    return await response.json();
  },

  // Update property
  updateProperty: async (id, formData) => {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
      method: 'PUT',
      body: formData,
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });
    return await response.json();
  },

  // Delete property
  deleteProperty: async (id) => {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return await response.json();
  },

  // Get properties by tags
  getPropertiesByTags: async (tags) => {
    const response = await fetch(`${API_BASE_URL}/properties/search/by-tags?tags=${tags}`);
    return await response.json();
  }
};

// Helper function to format property data for forms
export const formatPropertyForForm = (property) => {
  return {
    type: property.type || '',
    name: property.name || '',
    description: property.description || '',
    address: property.address || '',
    city: property.city || '',
    state: property.state || '',
    price: property.price || '',
    tags: property.tags ? property.tags.join(', ') : '',
    genderPreference: property.genderPreference || '',
    contactNumber: property.contactNumber || '',
    photos: []
  };
};

// Helper function to create FormData from property object
export const createPropertyFormData = (propertyData) => {
  const formData = new FormData();
  
  // Append all form fields except photos
  Object.keys(propertyData).forEach(key => {
    if (key !== 'photos' && propertyData[key] !== null && propertyData[key] !== undefined) {
      formData.append(key, propertyData[key]);
    }
  });

  // Append photos if they exist
  if (propertyData.photos && propertyData.photos.length > 0) {
    propertyData.photos.forEach((photo, index) => {
      formData.append('photos', photo);
    });
  }

  return formData;
};

export default propertyApi;
