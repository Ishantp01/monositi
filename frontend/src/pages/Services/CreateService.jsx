import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/layout/NavBar";
import { serviceApi } from "../../utils/serviceApi";
import { toast } from "react-toastify";
import {
    MapPin,
    Camera,
    DollarSign,
    Settings,
    FileText,
    Navigation,
    Loader2,
    Upload,
    X,
    Calendar,
    Tag,
    Plus
} from "lucide-react";

const CreateService = () => {
    const [formData, setFormData] = useState({
        service_name: "",
        category: "",
        description: "",
        base_price: "",
        variable_price: "",
        location: "",
        addons: "",
        tags: "",
        availability_calendar: "",
        images: [],
        service_docs: []
    });

    const [loading, setLoading] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const [hasLocation, setHasLocation] = useState(false);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [docPreviews, setDocPreviews] = useState([]);
    const [activeTab, setActiveTab] = useState("basic");

    const serviceCategories = [
        "Cleaning",
        "Plumbing",
        "Electrical",
        "Carpentry",
        "Painting",
        "Gardening",
        "Appliance Repair",
        "Home Security",
        "Interior Design",
        "Moving & Packing",
        "Pest Control",
        "AC Repair",
        "Other"
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const previewURLs = files.map((file) => URL.createObjectURL(file));

        setFormData((prev) => ({
            ...prev,
            images: files,
        }));

        setImagePreviews(previewURLs);
    };

    const removeImage = (index) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);

        setFormData((prev) => ({
            ...prev,
            images: newImages,
        }));

        setImagePreviews(newPreviews);
    };

    const handleDocChange = (e) => {
        const files = Array.from(e.target.files);
        const previewURLs = files.map((file) => ({
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
            type: file.type
        }));

        setFormData((prev) => ({
            ...prev,
            service_docs: files,
        }));

        setDocPreviews(previewURLs);
    };

    const removeDoc = (index) => {
        const newDocs = formData.service_docs.filter((_, i) => i !== index);
        const newPreviews = docPreviews.filter((_, i) => i !== index);

        setFormData((prev) => ({
            ...prev,
            service_docs: newDocs,
        }));

        setDocPreviews(newPreviews);
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
                    location: JSON.stringify({
                        type: "Point",
                        coordinates: [longitude, latitude]
                    })
                }));

                setHasLocation(true);
                setLocationLoading(false);
                toast.success("Location captured successfully!");

                // Try to get address from coordinates
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
            const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );

            if (response.ok) {
                const data = await response.json();
                const address = `${data.locality || ''}, ${data.city || ''}, ${data.principalSubdivision || ''}`.replace(/^,\s*|,\s*$/g, '');

                // Update the location field with a readable address while keeping coordinates
                setFormData(prev => ({
                    ...prev,
                    location: JSON.stringify({
                        type: "Point",
                        coordinates: [longitude, latitude],
                        address: address
                    })
                }));

                toast.info("Address auto-filled from location");
            }
        } catch (error) {
            console.error("Reverse geocoding error:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Check if user is logged in
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error("Please login to create a service");
                setLoading(false);
                return;
            }

            // Create FormData for file upload
            const formDataToSend = new FormData();

            // Add text fields
            Object.keys(formData).forEach(key => {
                if (key !== 'images' && key !== 'service_docs' && formData[key]) {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Add image files
            formData.images.forEach((file) => {
                formDataToSend.append('images', file);
            });

            // Add document files
            formData.service_docs.forEach((file) => {
                formDataToSend.append('service_docs', file);
            });

            // Call API
            const result = await serviceApi.createService(formDataToSend);

            if (result.success) {
                toast.success("Service created successfully! It will be reviewed by admin.");

                // Reset form
                setFormData({
                    service_name: "",
                    category: "",
                    description: "",
                    base_price: "",
                    variable_price: "",
                    location: "",
                    addons: "",
                    tags: "",
                    availability_calendar: "",
                    images: [],
                    service_docs: []
                });
                setImagePreviews([]);
                setDocPreviews([]);
                setActiveTab("basic");
            } else {
                toast.error("Error creating service: " + result.message);
            }
        } catch (error) {
            console.error("Service creation error:", error);
            toast.error("Error creating service: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 pt-20">
                <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                    >
                        <div className="bg-gradient-to-r from-[#f73c56] to-[#e9334e] p-6 text-white">
                            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                                <div className="w-24 h-24 md:w-32 md:h-32 bg-white/20 rounded-full flex items-center justify-center">
                                    <Settings className="w-12 h-12 md:w-16 md:h-16 text-white" />
                                </div>

                                <div className="flex-1 text-center md:text-left">
                                    <h1 className="text-2xl md:text-3xl font-bold mb-2">
                                        Create Your Service
                                    </h1>
                                    <p className="text-white/90 text-sm md:text-base">
                                        Join our service provider network and showcase your skills to customers
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Tabbed Interface */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl shadow-lg border border-gray-200"
                    >
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8 px-6">
                                <button
                                    onClick={() => setActiveTab("basic")}
                                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === "basic"
                                        ? "border-[#f73c56] text-[#f73c56]"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <Settings className="w-4 h-4" />
                                        <span>Basic Details</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab("pricing")}
                                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === "pricing"
                                        ? "border-[#f73c56] text-[#f73c56]"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <DollarSign className="w-4 h-4" />
                                        <span>Pricing & Availability</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab("media")}
                                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === "media"
                                        ? "border-[#f73c56] text-[#f73c56]"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <Camera className="w-4 h-4" />
                                        <span>Images & Documents</span>
                                    </div>
                                </button>
                            </nav>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            {activeTab === "basic" && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Service Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="service_name"
                                                value={formData.service_name}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Enter service name"
                                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Category *
                                            </label>
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                            >
                                                <option value="">Select a category</option>
                                                {serviceCategories.map((category) => (
                                                    <option key={category} value={category}>
                                                        {category}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="md:col-span-2">
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Service Location
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
                                                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                                                    <div className="flex items-center space-x-2">
                                                        <MapPin className="w-4 h-4 text-green-600" />
                                                        <span className="text-sm text-green-700">
                                                            Location captured successfully! Address will be auto-filled.
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            <input
                                                type="text"
                                                name="location"
                                                value={(() => {
                                                    try {
                                                        if (formData.location && formData.location.includes('coordinates')) {
                                                            const locationObj = JSON.parse(formData.location);
                                                            return locationObj.address || `Coordinates: ${locationObj.coordinates[1].toFixed(6)}, ${locationObj.coordinates[0].toFixed(6)}`;
                                                        }
                                                        return formData.location;
                                                    } catch (e) {
                                                        return formData.location;
                                                    }
                                                })()}
                                                onChange={handleInputChange}
                                                placeholder="Service area/location or use location button"
                                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Enter your service area or click "Use My Location" to capture coordinates
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description *
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            required
                                            rows={4}
                                            placeholder="Describe your service in detail..."
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#f73c56] focus:border-transparent resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tags (comma-separated)
                                        </label>
                                        <input
                                            type="text"
                                            name="tags"
                                            value={formData.tags}
                                            onChange={handleInputChange}
                                            placeholder="e.g., professional, reliable, quick"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "pricing" && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Base Price (₹) *
                                            </label>
                                            <input
                                                type="number"
                                                name="base_price"
                                                value={formData.base_price}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Enter base price"
                                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Variable Price (₹/hour)
                                            </label>
                                            <input
                                                type="number"
                                                name="variable_price"
                                                value={formData.variable_price}
                                                onChange={handleInputChange}
                                                placeholder="Hourly rate (optional)"
                                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Availability Calendar
                                        </label>
                                        <textarea
                                            name="availability_calendar"
                                            value={formData.availability_calendar}
                                            onChange={handleInputChange}
                                            rows={3}
                                            placeholder="Describe your availability (e.g., Mon-Fri 9AM-6PM, Weekends available)"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#f73c56] focus:border-transparent resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Add-ons (comma-separated)
                                        </label>
                                        <input
                                            type="text"
                                            name="addons"
                                            value={formData.addons}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Express service, Premium materials, Extended warranty"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "media" && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    {/* Service Images */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Service Images (Max 10)
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#f73c56] transition-colors">
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                                id="images"
                                            />
                                            <label htmlFor="images" className="cursor-pointer">
                                                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-600">Click to upload service images</p>
                                                <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 5MB each</p>
                                            </label>
                                        </div>

                                        {imagePreviews.length > 0 && (
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                                {imagePreviews.map((preview, index) => (
                                                    <div key={index} className="relative">
                                                        <img
                                                            src={preview}
                                                            alt={`Preview ${index + 1}`}
                                                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(index)}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Service Documents */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Service Documents (Max 5)
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#f73c56] transition-colors">
                                            <input
                                                type="file"
                                                multiple
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                onChange={handleDocChange}
                                                className="hidden"
                                                id="documents"
                                            />
                                            <label htmlFor="documents" className="cursor-pointer">
                                                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-600">Click to upload certificates/documents</p>
                                                <p className="text-sm text-gray-500 mt-1">PDF, DOC, JPG up to 5MB each</p>
                                            </label>
                                        </div>

                                        {docPreviews.length > 0 && (
                                            <div className="space-y-2 mt-4">
                                                {docPreviews.map((doc, index) => (
                                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div className="flex items-center space-x-3">
                                                            <FileText className="w-5 h-5 text-gray-500" />
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                                                                <p className="text-xs text-gray-500">{doc.size}</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeDoc(index)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* Submit Button */}
                            <div className="flex justify-end pt-6 border-t border-gray-200">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center space-x-2 px-8 py-3 bg-[#f73c56] text-white rounded-lg hover:bg-[#e9334e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Plus className="w-5 h-5" />
                                    )}
                                    <span>{loading ? "Creating..." : "Create Service"}</span>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default CreateService;