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

export const buildersApi = {
  // Get all verified builders (public)
  getPublicBuilders: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`${API_BASE_URL}/builders/public?${queryParams}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching builders:", error);
      return {
        success: false,
        message: "Failed to fetch builders",
        data: [],
      };
    }
  },

  // Get builder by ID (public)
  getPublicBuilderById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/builders/public/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching builder:", error);
      return {
        success: false,
        message: "Failed to fetch builder",
        data: null,
      };
    }
  },

  // Get all verified projects (public)
  getPublicProjects: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`${API_BASE_URL}/builders/public/projects?${queryParams}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching projects:", error);
      return {
        success: false,
        message: "Failed to fetch projects",
        data: [],
      };
    }
  },

  // Get project by ID (public)
  getPublicProjectById: async (projectId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/builders/public/projects/${projectId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching project:", error);
      return {
        success: false,
        message: "Failed to fetch project",
        data: null,
      };
    }
  },

  // Get upcoming projects
  getUpcomingProjects: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`${API_BASE_URL}/builders/public/projects/upcoming?${queryParams}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching upcoming projects:", error);
      return {
        success: false,
        message: "Failed to fetch upcoming projects",
        data: [],
      };
    }
  },

  // Admin functions
  getAllBuilders: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`${API_BASE_URL}/builders?${queryParams}`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching builders:", error);
      return {
        success: false,
        message: "Failed to fetch builders",
        data: [],
      };
    }
  },

  createBuilder: async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/builders`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating builder:", error);
      return {
        success: false,
        message: "Failed to create builder",
      };
    }
  },

  getAllProjects: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`${API_BASE_URL}/builders/projects/all?${queryParams}`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching projects:", error);
      return {
        success: false,
        message: "Failed to fetch projects",
        data: [],
      };
    }
  },

  getBuilderProjects: async (builderId, filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`${API_BASE_URL}/builders/${builderId}/projects?${queryParams}`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching builder projects:", error);
      return {
        success: false,
        message: "Failed to fetch builder projects",
        data: [],
      };
    }
  },
};

export default buildersApi;

