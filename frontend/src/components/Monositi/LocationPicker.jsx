import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    MapPin,
    Loader2,
    Navigation,
    Search,
    CheckCircle,
    AlertCircle,
    RefreshCw
} from "lucide-react";
import {
    getCurrentLocation,
    getAddressFromCoordinates,
    getCoordinatesFromAddress,
    formatCoordinates
} from "../../utils/locationUtils";
import { toast } from "react-toastify";

const LocationPicker = ({
    onLocationSelect,
    initialCoordinates = null,
    initialAddress = "",
    className = ""
}) => {
    const [coordinates, setCoordinates] = useState(initialCoordinates || { lat: "", lng: "" });
    const [address, setAddress] = useState(initialAddress);
    const [isDetecting, setIsDetecting] = useState(false);
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [locationStatus, setLocationStatus] = useState("idle"); // idle, success, error
    const [manualInput, setManualInput] = useState(false);

    useEffect(() => {
        if (initialCoordinates && initialCoordinates.lat && initialCoordinates.lng) {
            setCoordinates(initialCoordinates);
            if (!initialAddress) {
                reverseGeocode(initialCoordinates.lat, initialCoordinates.lng);
            }
        }
    }, [initialCoordinates, initialAddress]);

    const detectCurrentLocation = async () => {
        setIsDetecting(true);
        setLocationStatus("idle");

        try {
            const location = await getCurrentLocation();
            setCoordinates(location);

            // Get address from coordinates
            await reverseGeocode(location.lat, location.lng);

            setLocationStatus("success");
            toast.success("Location detected successfully!");

            // Notify parent component
            if (onLocationSelect) {
                onLocationSelect({
                    coordinates: location,
                    address: address
                });
            }
        } catch (error) {
            console.error("Location detection error:", error);
            setLocationStatus("error");
            toast.error(error.message || "Failed to detect location");
        } finally {
            setIsDetecting(false);
        }
    };

    const reverseGeocode = async (lat, lng) => {
        setIsGeocoding(true);
        try {
            const addressData = await getAddressFromCoordinates(lat, lng);
            const formattedAddress = `${addressData.formatted.address}, ${addressData.formatted.city}, ${addressData.formatted.state}`.replace(/^,\s*/, '');
            setAddress(formattedAddress);

            if (onLocationSelect) {
                onLocationSelect({
                    coordinates: { lat, lng },
                    address: formattedAddress,
                    addressComponents: addressData.formatted
                });
            }
        } catch (error) {
            console.error("Reverse geocoding error:", error);
            toast.error("Failed to get address from coordinates");
        } finally {
            setIsGeocoding(false);
        }
    };

    const forwardGeocode = async (searchAddress) => {
        if (!searchAddress.trim()) return;

        setIsGeocoding(true);
        try {
            const location = await getCoordinatesFromAddress(searchAddress);
            setCoordinates(location);
            setAddress(searchAddress);
            setLocationStatus("success");

            if (onLocationSelect) {
                onLocationSelect({
                    coordinates: location,
                    address: searchAddress
                });
            }

            toast.success("Address found successfully!");
        } catch (error) {
            console.error("Forward geocoding error:", error);
            setLocationStatus("error");
            toast.error("Address not found. Please try a more specific address.");
        } finally {
            setIsGeocoding(false);
        }
    };

    const handleCoordinateChange = (field, value) => {
        const newCoordinates = { ...coordinates, [field]: value };
        setCoordinates(newCoordinates);

        // If both coordinates are valid, reverse geocode
        if (newCoordinates.lat && newCoordinates.lng &&
            !isNaN(newCoordinates.lat) && !isNaN(newCoordinates.lng)) {
            const lat = parseFloat(newCoordinates.lat);
            const lng = parseFloat(newCoordinates.lng);

            if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
                reverseGeocode(lat, lng);
            }
        }
    };

    const handleAddressSearch = (e) => {
        e.preventDefault();
        forwardGeocode(address);
    };

    const clearLocation = () => {
        setCoordinates({ lat: "", lng: "" });
        setAddress("");
        setLocationStatus("idle");
        setManualInput(false);

        if (onLocationSelect) {
            onLocationSelect({
                coordinates: { lat: "", lng: "" },
                address: ""
            });
        }
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-[#f73c56]" />
                    Location Information
                </h3>

                {(coordinates.lat || coordinates.lng || address) && (
                    <button
                        onClick={clearLocation}
                        className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                    >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Clear
                    </button>
                )}
            </div>

            {/* Auto-detect Location */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-gray-900">Auto-detect Location</h4>
                        <p className="text-sm text-gray-600">Use your device's GPS to get current location</p>
                    </div>
                    <button
                        onClick={detectCurrentLocation}
                        disabled={isDetecting}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isDetecting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Navigation className="w-4 h-4" />
                        )}
                        <span>{isDetecting ? "Detecting..." : "Detect Location"}</span>
                    </button>
                </div>
            </motion.div>

            {/* Manual Address Input */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Search by Address</h4>
                <form onSubmit={handleAddressSearch} className="space-y-3">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter full address (e.g., 123 Main Street, Mumbai, Maharashtra)"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                        />
                        <button
                            type="submit"
                            disabled={isGeocoding || !address.trim()}
                            className="flex items-center space-x-2 px-4 py-2 bg-[#f73c56] text-white rounded-lg hover:bg-[#e9334e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isGeocoding ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Search className="w-4 h-4" />
                            )}
                            <span className="hidden sm:inline">Search</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Manual Coordinate Input */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Manual Coordinates</h4>
                    <button
                        onClick={() => setManualInput(!manualInput)}
                        className="text-sm text-[#f73c56] hover:text-[#e9334e]"
                    >
                        {manualInput ? "Hide" : "Show"} Manual Input
                    </button>
                </div>

                {manualInput && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Latitude
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    value={coordinates.lat}
                                    onChange={(e) => handleCoordinateChange('lat', e.target.value)}
                                    placeholder="e.g., 19.0760"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Longitude
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    value={coordinates.lng}
                                    onChange={(e) => handleCoordinateChange('lng', e.target.value)}
                                    placeholder="e.g., 72.8777"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                />
                            </div>
                        </div>
                        <p className="text-xs text-gray-500">
                            Enter coordinates in decimal degrees format. Latitude should be between -90 and 90, Longitude between -180 and 180.
                        </p>
                    </motion.div>
                )}
            </div>

            {/* Location Status */}
            {(coordinates.lat && coordinates.lng) && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg border ${locationStatus === "success"
                            ? "bg-green-50 border-green-200"
                            : locationStatus === "error"
                                ? "bg-red-50 border-red-200"
                                : "bg-gray-50 border-gray-200"
                        }`}
                >
                    <div className="flex items-start space-x-3">
                        {locationStatus === "success" ? (
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        ) : locationStatus === "error" ? (
                            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                        ) : (
                            <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
                        )}

                        <div className="flex-1">
                            <h4 className="font-medium text-gray-900">Selected Location</h4>

                            {address && (
                                <p className="text-sm text-gray-600 mt-1">
                                    <strong>Address:</strong> {address}
                                </p>
                            )}

                            <p className="text-sm text-gray-600 mt-1">
                                <strong>Coordinates:</strong> {formatCoordinates(parseFloat(coordinates.lat), parseFloat(coordinates.lng))}
                            </p>

                            {isGeocoding && (
                                <div className="flex items-center space-x-2 mt-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                    <span className="text-sm text-blue-600">Getting address...</span>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Help Text */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> For best results, use the auto-detect feature or enter a complete address including street, city, and state.
                </p>
            </div>
        </div>
    );
};

export default LocationPicker;