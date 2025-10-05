const API_BASE_URL = 'http://localhost:5000/api';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const getAuthHeaders = () => {
  return {
    'Authorization': `Bearer ${getAuthToken()}`,
    'Content-Type': 'application/json'
  };
};

export const propertyApi = {
  getAllProperties: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/properties?${queryParams}`);
    return await response.json();
  },

  getPropertyById: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/properties/${userId}`);
    return await response.json();
  },

  getPropertyByLandlord: async () => {
    const response = await fetch(`${API_BASE_URL}/properties/landlord/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });
  

    return await response.json();
  },

  getPropertiesByType: async (type) => {
    const response = await fetch(`${API_BASE_URL}/properties/properties/search/type?type=${encodeURIComponent(type)}`);
    return await response.json();
  },
  createProperty: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/properties/properties`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });
    return await response.json();
  },

  updateProperty: async (id, formData) => {
    const response = await fetch(`${API_BASE_URL}/properties/properties/${id}`, {
      method: 'PUT',
      body: formData,
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });
    return await response.json();
  },

  deleteProperty: async (id) => {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return await response.json();
  },

  getPropertiesByTags: async (tags) => {
    const response = await fetch(`${API_BASE_URL}/properties/properties/search/type?type=${tags}`);
    return await response.json();
  }
};

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

export const createPropertyFormData = (propertyData) => {
  const formData = new FormData();

  Object.keys(propertyData).forEach(key => {
    if (key !== 'photos' && propertyData[key] !== null && propertyData[key] !== undefined) {
      formData.append(key, propertyData[key]);
    }
  });

  if (propertyData.photos && propertyData.photos.length > 0) {
    propertyData.photos.forEach((photo, index) => {
      formData.append('photos', photo);
    });
  }

  return formData;
};

export default propertyApi;
