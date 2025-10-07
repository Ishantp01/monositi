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

export const serviceApi = {
  // Get all service providers (with optional category filter)
  getServiceProviders: async (category = '') => {
    try {
      const queryParams = category ? `?category=${category}` : '';
      const response = await fetch(`${API_BASE_URL}/services/service-providers${queryParams}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching service providers:", error);
      return { success: false, message: "Failed to fetch service providers", providers: [] };
    }
  },

  // Get service provider by ID
  getServiceProviderById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/services/service-providers/${id}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching service provider:", error);
      return { success: false, message: "Failed to fetch service provider" };
    }
  },

  // Create service request (requires authentication)
  createServiceRequest: async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/services/service-requests`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });
      return await response.json();
    } catch (error) {
      console.error("Error creating service request:", error);
      return { success: false, message: "Failed to create service request" };
    }
  },

  // Get service categories (returns predefined list from the model)
  getServiceCategories: () => {
    return [
      { id: 'plumbing', name: 'Plumbing', icon: 'plumbing.svg' },
      { id: 'electrical', name: 'Electrical', icon: 'electrical.svg' },
      { id: 'cleaning', name: 'Cleaning', icon: 'cleaning.svg' },
      { id: 'carpentry', name: 'Carpentry', icon: 'carpentry.svg' },
      { id: 'painting', name: 'Painting', icon: 'painting.svg' },
      { id: 'gardening', name: 'Gardening', icon: 'gardening.svg' },
      { id: 'appliance', name: 'Appliance Repair', icon: 'appliance.svg' },
      { id: 'other', name: 'Other Services', icon: 'other.svg' }
    ];
  }
};