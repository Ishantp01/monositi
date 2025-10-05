// utils/api.js

const API_BASE_URL = "http://localhost:5000/api";

// Get token from localStorage
const getAuthToken = () => localStorage.getItem("token");

// Default headers
const getAuthHeaders = (isJSON = true) => {
  const headers = {};
  const token = getAuthToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (isJSON) headers["Content-Type"] = "application/json";
  return headers;
};

// Universal API function
const apiRequest = async (endpoint, method = "GET", body = null, isJSON = true) => {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: getAuthHeaders(isJSON),
      body: body && isJSON ? JSON.stringify(body) : body,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "API request failed");
    return data;
  } catch (err) {
    console.error("API Error:", err.message);
    throw err;
  }
};

export default apiRequest;
