import React, { useState, useEffect } from "react";
import { X, Calendar, MapPin, DollarSign, FileText, Camera, Navigation, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { serviceApi } from "../../utils/serviceApi";
import { useSelector } from "react-redux";

const ServiceBookingForm = ({ isOpen, onClose, service }) => {
    const { user } = useSelector((state) => state.auth);
    const [formData, setFormData] = useState({
        scheduled_for: "",
        total_amount: "",
        notes: "",
        service_address: {
            street: "",
            city: "",
            state: "",
            pincode: "",
            coordinates: {
                type: "Point",
                coordinates: [] // [longitude, latitude]
            }
        }
    });
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const [hasLocation, setHasLocation] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
    };

    // Get user's current location
    const getCurrentLocation = () => {
        setLocationLoading(true);

        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by this browser");
            setLocationLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                setFormData(prev => ({
                    ...prev,
                    service_address: {
                        ...prev.service_address,
                        coordinates: {
                            type: "Point",
                            coordinates: [longitude, latitude]
                        }
                    }
                }));

                setHasLocation(true);
                setLocationLoading(false);
                toast.success("Location captured successfully!");

                // Try to get address from coordinates using reverse geocoding
                reverseGeocode(latitude, longitude);
            },
            (error) => {
                console.error("Geolocation error:", error);
                let errorMessage = "Unable to get location";

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "Location access denied by user";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "Location information unavailable";
                        break;
                    case error.TIMEOUT:
                        errorMessage = "Location request timed out";
                        break;
                }

                toast.error(errorMessage);
                setLocationLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    };

    // Reverse geocoding to get address from coordinates
    const reverseGeocode = async (latitude, longitude) => {
        try {
            // Using a free geocoding service (you can replace with your preferred service)
            const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );

            if (response.ok) {
                const data = await response.json();

                setFormData(prev => ({
                    ...prev,
                    service_address: {
                        ...prev.service_address,
                        street: data.locality || prev.service_address.street,
                        city: data.city || prev.service_address.city,
                        state: data.principalSubdivision || prev.service_address.state,
                        pincode: data.postcode || prev.service_address.pincode
                    }
                }));

                toast.info("Address auto-filled from location");
            }
        } catch (error) {
            console.error("Reverse geocoding error:", error);
            // Don't show error to user as this is optional
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check user status before allowing booking
        if (!user) {
            toast.error("Please login to book a service");
            return;
        }

        if (user.is_active === false) {
            toast.error("Your account has been suspended. Please contact support.");
            return;
        }

        if (user.verification_status === 'rejected') {
            toast.error("Your account verification was rejected. Please contact support.");
            return;
        }

        if (user.verification_status === 'pending') {
            toast.warning("Your account is pending verification. You can still book services.");
        }

        setLoading(true);

        try {
            // Check if user is logged in
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error("Please login to book a service");
                setLoading(false);
                return;
            }

            // Create FormData object
            const bookingFormData = new FormData();

            // Add service ID
            bookingFormData.append('service_id', service._id);

            // Add form fields
            bookingFormData.append('scheduled_for', formData.scheduled_for);
            bookingFormData.append('total_amount', formData.total_amount);
            bookingFormData.append('notes', formData.notes);

            // Add address as JSON string
            bookingFormData.append('service_address', JSON.stringify(formData.service_address));

            // Add images
            images.forEach((image, index) => {
                bookingFormData.append('images_before', image);
            });

            const response = await serviceApi.createServiceBooking(bookingFormData);

            if (response.success) {
                toast.success("Service booking created successfully!");
                onClose();
                // Reset form
                setFormData({
                    scheduled_for: "",
                    total_amount: "",
                    notes: "",
                    service_address: {
                        street: "",
                        city: "",
                        state: "",
                        pincode: "",
                        coordinates: {
                            type: "Point",
                            coordinates: []
                        }
                    }
                });
                setImages([]);
                setHasLocation(false);
            } else {
                toast.error(response.message || "Failed to create booking");
            }
        } catch (error) {
            console.error("Booking error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Book Service</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {service?.service_name} - {service?.category}
                        </p>
                        <p className="text-sm text-gray-500">
                            Provider: {service?.provider?.name}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Service Date */}
                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                            <Calendar className="w-4 h-4 mr-2" />
                            Service Date & Time
                        </label>
                        <input
                            type="datetime-local"
                            name="scheduled_for"
                            value={formData.scheduled_for}
                            onChange={handleInputChange}
                            required
                            min={new Date().toISOString().slice(0, 16)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
                        />
                    </div>

                    {/* Service Address */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="flex items-center text-sm font-medium text-gray-700">
                                <MapPin className="w-4 h-4 mr-2" />
                                Service Address
                            </label>
                            <button
                                type="button"
                                onClick={getCurrentLocation}
                                disabled={locationLoading}
                                className="flex items-center space-x-2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 text-sm"
                            >
                                {locationLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Navigation className="w-4 h-4" />
                                )}
                                <span>{locationLoading ? "Getting..." : "Use My Location"}</span>
                            </button>
                        </div>

                        {hasLocation && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <div className="flex items-center space-x-2">
                                    <MapPin className="w-4 h-4 text-green-600" />
                                    <span className="text-sm text-green-700">
                                        Location captured: {formData.service_address.coordinates.coordinates[1]?.toFixed(6)}, {formData.service_address.coordinates.coordinates[0]?.toFixed(6)}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-3">
                            <input
                                type="text"
                                name="service_address.street"
                                placeholder="Street Address"
                                value={formData.service_address.street}
                                onChange={handleInputChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    name="service_address.city"
                                    placeholder="City"
                                    value={formData.service_address.city}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
                                />
                                <input
                                    type="text"
                                    name="service_address.state"
                                    placeholder="State"
                                    value={formData.service_address.state}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
                                />
                            </div>
                            <input
                                type="text"
                                name="service_address.pincode"
                                placeholder="PIN Code"
                                value={formData.service_address.pincode}
                                onChange={handleInputChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
                            />
                        </div>

                        <div className="text-xs text-gray-500">
                            <strong>Tip:</strong> Click "Use My Location" to automatically fill your address and provide accurate coordinates for the service provider.
                        </div>
                    </div>

                    {/* Total Amount */}
                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                            <DollarSign className="w-4 h-4 mr-2" />
                            Estimated Amount (₹)
                        </label>
                        <input
                            type="number"
                            name="total_amount"
                            placeholder={`Base price: ₹${service?.base_price || 0}`}
                            value={formData.total_amount}
                            onChange={handleInputChange}
                            required
                            min="0"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
                        />
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                            <FileText className="w-4 h-4 mr-2" />
                            Service Description / Notes
                        </label>
                        <textarea
                            name="notes"
                            placeholder="Describe the service you need..."
                            value={formData.notes}
                            onChange={handleInputChange}
                            required
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 resize-none"
                        />
                    </div>

                    {/* Images */}
                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                            <Camera className="w-4 h-4 mr-2" />
                            Photos (Optional)
                        </label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
                        />
                        {images.length > 0 && (
                            <p className="text-sm text-gray-600">
                                {images.length} image(s) selected
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-[#f73c56] hover:bg-[#e9334e] text-white py-2 rounded-lg transition-colors disabled:opacity-60"
                        >
                            {loading ? "Booking..." : "Book Service"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServiceBookingForm;