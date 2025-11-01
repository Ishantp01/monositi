// Location detection and geocoding utilities

/**
 * Get user's current location using browser geolocation API
 * @returns {Promise<{lat: number, lng: number}>}
 */
export const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by this browser'));
            return;
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes cache
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy
                });
            },
            (error) => {
                let errorMessage = 'Unable to get location';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location access denied by user';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information unavailable';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out';
                        break;
                }
                reject(new Error(errorMessage));
            },
            options
        );
    });
};

/**
 * Get address from coordinates using reverse geocoding
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Object>} Address components
 */
export const getAddressFromCoordinates = async (lat, lng) => {
    try {
        // Using OpenStreetMap Nominatim API (free alternative to Google Maps)
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
        );

        if (!response.ok) {
            throw new Error('Geocoding request failed');
        }

        const data = await response.json();

        if (!data || !data.address) {
            throw new Error('No address found for these coordinates');
        }

        const address = data.address;

        return {
            fullAddress: data.display_name,
            street: address.road || address.pedestrian || '',
            city: address.city || address.town || address.village || address.municipality || '',
            state: address.state || address.region || '',
            country: address.country || '',
            pincode: address.postcode || '',
            formatted: {
                address: `${address.house_number || ''} ${address.road || address.pedestrian || ''}`.trim(),
                city: address.city || address.town || address.village || address.municipality || '',
                state: address.state || address.region || '',
                pincode: address.postcode || ''
            }
        };
    } catch (error) {
        console.error('Reverse geocoding error:', error);
        throw error;
    }
};

/**
 * Get coordinates from address using forward geocoding
 * @param {string} address - Full address string
 * @returns {Promise<{lat: number, lng: number}>}
 */
export const getCoordinatesFromAddress = async (address) => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`
        );

        if (!response.ok) {
            throw new Error('Geocoding request failed');
        }

        const data = await response.json();

        if (!data || data.length === 0) {
            throw new Error('No coordinates found for this address');
        }

        return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
            accuracy: data[0].importance || 0.5
        };
    } catch (error) {
        console.error('Forward geocoding error:', error);
        throw error;
    }
};

/**
 * Calculate distance between two coordinates (in kilometers)
 * @param {number} lat1 
 * @param {number} lng1 
 * @param {number} lat2 
 * @param {number} lng2 
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

/**
 * Format coordinates for display
 * @param {number} lat 
 * @param {number} lng 
 * @returns {string}
 */
export const formatCoordinates = (lat, lng) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
};