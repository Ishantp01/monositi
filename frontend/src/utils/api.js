// utils/api.js
import API_BASE_URL from './constant';

// Get token from localStorage
const getAuthToken = () => localStorage.getItem("token");

// Default headers
const getAuthHeaders = (isJSON = true) => {
  const headers = {};
  const token = getAuthToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  // Don't set Content-Type for FormData - browser will set it with boundary
  if (isJSON) headers["Content-Type"] = "application/json";
  return headers;
};

// Universal API function
const apiRequest = async (
  endpoint,
  method = "GET",
  body = null,
  isJSON = true
) => {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: getAuthHeaders(isJSON),
      body: body && isJSON ? JSON.stringify(body) : body,
    });

    // Check if server is unreachable
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error(
          "Server not available. Please ensure the backend server is running."
        );
      }
      const data = await res.json();
      throw new Error(data.message || "API request failed");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("API Error:", err.message);
    // Add more specific error handling
    if (
      err.message.includes("Failed to fetch") ||
      err.message.includes("NetworkError")
    ) {
      throw new Error(
        "Network error. Please check your connection and ensure the backend server is running."
      );
    }
    throw err;
  }
};

export default apiRequest;
