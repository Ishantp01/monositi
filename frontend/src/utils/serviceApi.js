import API_BASE_URL from "./constant";

const getAuthToken = () => {
  return localStorage.getItem("token");
};

const getAuthHeaders = () => {
  return {
    Authorization: `Bearer ${getAuthToken()}`,
    "Content-Type": "application/json",
  };
};

export const serviceApi = {
  // Get all service providers (with optional category filter)
  getServiceProviders: async (category = "", city = "", availability = "") => {
    try {
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (city) params.append("city", city);
      if (availability) params.append("availability", availability);

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const response = await fetch(
        `${API_BASE_URL}/services/service-providers${queryString}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching service providers:", error);
      return {
        success: false,
        message: "Failed to fetch service providers",
        providers: [],
      };
    }
  },

  // Get service provider by ID
  getServiceProviderById: async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/services/service-providers/${id}`
      );
      return await response.json();
    } catch (error) {
      console.error("Error fetching service provider:", error);
      return { success: false, message: "Failed to fetch service provider" };
    }
  },

  // Create service request (requires authentication)
  createServiceRequest: async (formData) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/services/service-requests`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            // Don't set Content-Type for FormData, let browser set it with boundary
          },
          body: formData,
        }
      );
      return await response.json();
    } catch (error) {
      console.error("Error creating service request:", error);
      return { success: false, message: "Failed to create service request" };
    }
  },

  // Get service categories (returns predefined list from the model)
  getServiceCategories: () => {
    return [
      { id: "plumbing", name: "Plumbing", icon: "plumbing.svg" },
      { id: "electrical", name: "Electrical", icon: "electrical.svg" },
      { id: "cleaning", name: "Cleaning", icon: "cleaning.svg" },
      { id: "carpentry", name: "Carpentry", icon: "carpentry.svg" },
      { id: "painting", name: "Painting", icon: "painting.svg" },
      { id: "gardening", name: "Gardening", icon: "gardening.svg" },
      { id: "appliance", name: "Appliance Repair", icon: "appliance.svg" },
      { id: "other", name: "Other Services", icon: "other.svg" },
    ];
  },

  // Get all active services
  getAllServices: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `/services?${queryString}` : "/services";
      const response = await fetch(`${API_BASE_URL}${url}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching services:", error);
      return {
        success: false,
        message: "Failed to fetch services",
        services: [],
      };
    }
  },

  // Search services with advanced filters
  searchServices: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString
        ? `/services/search?${queryString}`
        : "/services/search";
      const response = await fetch(`${API_BASE_URL}${url}`);
      return await response.json();
    } catch (error) {
      console.error("Error searching services:", error);
      return {
        success: false,
        message: "Failed to search services",
        services: [],
      };
    }
  },

  // Get service categories
  getServiceCategories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/services/categories`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching service categories:", error);
      return {
        success: false,
        message: "Failed to fetch categories",
        categories: [],
      };
    }
  },

  // Get service by ID
  getServiceById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/services/${id}`, {
        headers: getAuthHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error("Error fetching service:", error);
      return { success: false, message: "Failed to fetch service" };
    }
  },

  // Create service booking (requires authentication)
  createServiceBooking: async (bookingData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/services/bookings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: bookingData, // FormData object
      });
      return await response.json();
    } catch (error) {
      console.error("Error creating service booking:", error);
      return { success: false, message: "Failed to create service booking" };
    }
  },

  // Get customer bookings
  getCustomerBookings: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString
        ? `/services/bookings/my-bookings?${queryString}`
        : "/services/bookings/my-bookings";
      const response = await fetch(`${API_BASE_URL}${url}`, {
        headers: getAuthHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error("Error fetching customer bookings:", error);
      return {
        success: false,
        message: "Failed to fetch bookings",
        bookings: [],
      };
    }
  },

  // Cancel booking
  cancelBooking: async (bookingId, reason = "") => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/services/bookings/${bookingId}/cancel`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({ reason }),
        }
      );
      return await response.json();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      return { success: false, message: "Failed to cancel booking" };
    }
  },

  // Rate service
  rateService: async (bookingId, rating, review = "") => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/services/bookings/${bookingId}/rate`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ rating, review }),
        }
      );
      return await response.json();
    } catch (error) {
      console.error("Error rating service:", error);
      return { success: false, message: "Failed to rate service" };
    }
  },

  // SERVICE PROVIDER FUNCTIONS

  // Create service (for service providers)
  createService: async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/services/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: formData,
      });
      return await response.json();
    } catch (error) {
      console.error("Error creating service:", error);
      return { success: false, message: "Failed to create service" };
    }
  },

  // Get provider's services
  getProviderServices: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString
        ? `/services/my-services?${queryString}`
        : "/services/my-services";
      const response = await fetch(`${API_BASE_URL}${url}`, {
        headers: getAuthHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error("Error fetching provider services:", error);
      return {
        success: false,
        message: "Failed to fetch services",
        services: [],
      };
    }
  },

  // Update service
  updateService: async (serviceId, formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: formData,
      });
      return await response.json();
    } catch (error) {
      console.error("Error updating service:", error);
      return { success: false, message: "Failed to update service" };
    }
  },

  // Delete service
  deleteService: async (serviceId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error("Error deleting service:", error);
      return { success: false, message: "Failed to delete service" };
    }
  },

  // Toggle service status
  toggleServiceStatus: async (serviceId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/services/${serviceId}/toggle-status`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
        }
      );
      return await response.json();
    } catch (error) {
      console.error("Error toggling service status:", error);
      return { success: false, message: "Failed to toggle service status" };
    }
  },
};
