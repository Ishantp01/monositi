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

export const monositiApi = {
    // ============================================
    // PUBLIC APIs (No authentication required)
    // ============================================

    /**
     * Get all public Monositi listings
     * @param {Object} filters - { category, city }
     * @returns {Promise} API response
     */
    getPublicListings: async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams(filters);
            const response = await fetch(`${API_BASE_URL}/monositi/public/listings?${queryParams}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching public Monositi listings:", error);
            return {
                success: false,
                message: "Failed to fetch Monositi listings",
                data: [],
            };
        }
    },

    /**
     * Get public listing details by ID
     * @param {string} id - Listing ID
     * @returns {Promise} API response
     */
    getPublicListingById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/monositi/public/listings/${id}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching public Monositi listing:", error);
            return {
                success: false,
                message: "Failed to fetch listing details",
                data: null,
            };
        }
    },

    // ============================================
    // ADMIN APIs (Authentication required)
    // ============================================

    /**
     * Create new Monositi listing (Admin only)
     * @param {FormData} formData - Listing data with images
     * @returns {Promise} API response
     */
    createListing: async (formData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/monositi/listings`, {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error creating Monositi listing:", error);
            return {
                success: false,
                message: "Failed to create listing",
            };
        }
    },

    /**
     * Get all listings with filters (Admin only)
     * @param {Object} filters - { category, city, status, verified }
     * @returns {Promise} API response
     */
    getAllListings: async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams(filters);
            const response = await fetch(`${API_BASE_URL}/monositi/listings?${queryParams}`, {
                headers: getAuthHeaders(),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching Monositi listings:", error);
            return {
                success: false,
                message: "Failed to fetch listings",
                data: [],
            };
        }
    },

    /**
     * Get listing by ID (Admin only)
     * @param {string} id - Listing ID
     * @returns {Promise} API response
     */
    getListingById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/monositi/listings/${id}`, {
                headers: getAuthHeaders(),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching Monositi listing:", error);
            return {
                success: false,
                message: "Failed to fetch listing",
                data: null,
            };
        }
    },

    /**
     * Update listing (Admin only)
     * @param {string} id - Listing ID
     * @param {FormData} formData - Updated listing data
     * @returns {Promise} API response
     */
    updateListing: async (id, formData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/monositi/listings/${id}`, {
                method: "PUT",
                body: formData,
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error updating Monositi listing:", error);
            return {
                success: false,
                message: "Failed to update listing",
            };
        }
    },

    /**
     * Verify/Unverify listing (Admin only)
     * @param {string} id - Listing ID
     * @param {boolean} verified - Verification status
     * @returns {Promise} API response
     */
    verifyListing: async (id, verified) => {
        try {
            const response = await fetch(`${API_BASE_URL}/monositi/listings/${id}/verify`, {
                method: "PATCH",
                headers: getAuthHeaders(),
                body: JSON.stringify({ verified }),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error verifying Monositi listing:", error);
            return {
                success: false,
                message: "Failed to verify listing",
            };
        }
    },

    /**
     * Delete listing (Admin only)
     * @param {string} id - Listing ID
     * @returns {Promise} API response
     */
    deleteListing: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/monositi/listings/${id}`, {
                method: "DELETE",
                headers: getAuthHeaders(),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error deleting Monositi listing:", error);
            return {
                success: false,
                message: "Failed to delete listing",
            };
        }
    },

    // ============================================
    // ROOM MANAGEMENT APIs (Admin only)
    // ============================================

    /**
     * Add room to hostel/PG listing (Admin only)
     * @param {string} listingId - Listing ID
     * @param {FormData} formData - Room data with images
     * @returns {Promise} API response
     */
    addRoom: async (listingId, formData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/monositi/listings/${listingId}/rooms`, {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error adding room:", error);
            return {
                success: false,
                message: "Failed to add room",
            };
        }
    },

    /**
     * Get all rooms for a listing (Admin only)
     * @param {string} listingId - Listing ID
     * @returns {Promise} API response
     */
    getListingRooms: async (listingId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/monositi/listings/${listingId}/rooms`, {
                headers: getAuthHeaders(),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching rooms:", error);
            return {
                success: false,
                message: "Failed to fetch rooms",
                data: [],
            };
        }
    },

    /**
     * Get room by ID (Admin only)
     * @param {string} roomId - Room ID
     * @returns {Promise} API response
     */
    getRoomById: async (roomId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/monositi/rooms/${roomId}`, {
                headers: getAuthHeaders(),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching room:", error);
            return {
                success: false,
                message: "Failed to fetch room",
                data: null,
            };
        }
    },

    /**
     * Update room (Admin only)
     * @param {string} roomId - Room ID
     * @param {FormData} formData - Updated room data
     * @returns {Promise} API response
     */
    updateRoom: async (roomId, formData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/monositi/rooms/${roomId}`, {
                method: "PUT",
                body: formData,
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error updating room:", error);
            return {
                success: false,
                message: "Failed to update room",
            };
        }
    },

    /**
     * Update room bed availability (Admin only)
     * @param {string} roomId - Room ID
     * @param {number} availableBeds - Number of available beds
     * @returns {Promise} API response
     */
    updateRoomStatus: async (roomId, availableBeds) => {
        try {
            const response = await fetch(`${API_BASE_URL}/monositi/rooms/${roomId}/status`, {
                method: "PATCH",
                headers: getAuthHeaders(),
                body: JSON.stringify({ available_beds: availableBeds }),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error updating room status:", error);
            return {
                success: false,
                message: "Failed to update room status",
            };
        }
    },

    /**
     * Delete room (Admin only)
     * @param {string} roomId - Room ID
     * @returns {Promise} API response
     */
    deleteRoom: async (roomId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/monositi/rooms/${roomId}`, {
                method: "DELETE",
                headers: getAuthHeaders(),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error deleting room:", error);
            return {
                success: false,
                message: "Failed to delete room",
            };
        }
    },
};

export default monositiApi;