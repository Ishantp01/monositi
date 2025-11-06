import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/layout/NavBar";
import { propertyApi, createPropertyFormData } from "../../utils/propertyApi";
import { toast } from "react-toastify";
import {
  MapPin,
  Camera,
  DollarSign,
  Home,
  FileText,
  Navigation,
  Loader2,
  Upload,
  X,
  Building,
  Edit3,
  Save,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const AddProperty = () => {
  const [formData, setFormData] = useState({
    type: "",
    sub_category: "",
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    price: "",
    tags: "",
    amenities: "",
    nearby_places: "",
    contactNumber: "",
    size: "",
    units: "",
    photos: [],
    propertyDocs: [],
    geo_location: null,
  });

  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [hasLocation, setHasLocation] = useState(false);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [docPreviews, setDocPreviews] = useState([]);
  const [activeTab, setActiveTab] = useState("basic");

  const propertyTypeIcons = {
    residential: <Home className="w-8 h-8" />,
    commercial: <Building className="w-8 h-8" />,
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const previewURLs = files.map((file) => URL.createObjectURL(file));

    setFormData((prev) => ({
      ...prev,
      photos: files,
    }));

    setPhotoPreviews(previewURLs);
  };

  const removePhoto = (index) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index);
    const newPreviews = photoPreviews.filter((_, i) => i !== index);

    setFormData((prev) => ({
      ...prev,
      photos: newPhotos,
    }));

    setPhotoPreviews(newPreviews);
  };

  const handleDocChange = (e) => {
    const files = Array.from(e.target.files);
    const previewURLs = files.map((file) => ({
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      type: file.type,
    }));

    setFormData((prev) => ({
      ...prev,
      propertyDocs: files,
    }));

    setDocPreviews(previewURLs);
  };

  const removeDoc = (index) => {
    const newDocs = formData.propertyDocs.filter((_, i) => i !== index);
    const newPreviews = docPreviews.filter((_, i) => i !== index);

    setFormData((prev) => ({
      ...prev,
      propertyDocs: newDocs,
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

        setFormData((prev) => ({
          ...prev,
          geo_location: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
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
        maximumAge: 60000,
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

        setFormData((prev) => ({
          ...prev,
          address: data.locality || prev.address,
          city: data.city || prev.city,
          state: data.principalSubdivision || prev.state,
          pincode: data.postcode || prev.pincode,
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
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to add a property");
        setLoading(false);
        return;
      }

      // Use helper function to create FormData
      const formDataToSend = createPropertyFormData(formData);

      // Call API from helper
      const result = await propertyApi.createProperty(formDataToSend);

      if (result.success) {
        toast.success(
          "Property added successfully! It will be reviewed by admin."
        );

        // Reset form
        setFormData({
          type: "",
          sub_category: "",
          name: "",
          description: "",
          address: "",
          city: "",
          state: "",
          pincode: "",
          price: "",
          tags: "",
          amenities: "",
          nearby_places: "",
          contactNumber: "",
          size: "",
          units: "",
          photos: [],
          propertyDocs: [],
          geo_location: null,
        });
        setPhotoPreviews([]);
        setDocPreviews([]);
        setHasLocation(false);
        setActiveTab("basic");
      } else {
        toast.error("Error adding property: " + result.message);
      }
    } catch (error) {
      console.error("Property submission error:", error);
      toast.error("Error adding property: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-[#f73c56] to-[#e9334e] p-6 text-white">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-white/20 rounded-full flex items-center justify-center">
                  <Home className="w-12 h-12 md:w-16 md:h-16 text-white" />
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">
                    List Your Property
                  </h1>
                  <p className="text-white/90 text-sm md:text-base">
                    Join thousands of property owners and showcase your space to
                    potential tenants
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
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "basic"
                      ? "border-[#f73c56] text-[#f73c56]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Home className="w-4 h-4" />
                    <span>Basic Details</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("location")}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "location"
                      ? "border-[#f73c56] text-[#f73c56]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>Location</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("features")}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "features"
                      ? "border-[#f73c56] text-[#f73c56]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Features</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("media")}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "media"
                      ? "border-[#f73c56] text-[#f73c56]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Camera className="w-4 h-4" />
                    <span>Photos & Documents</span>
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
                  {/* Property Type Selection */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Property Type
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(propertyTypeIcons).map(([type, icon]) => (
                        <label key={type} className="relative cursor-pointer">
                          <input
                            type="radio"
                            name="type"
                            value={type}
                            checked={formData.type === type}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <div
                            className={`p-4 rounded-lg border-2 text-center transition-all ${
                              formData.type === type
                                ? "border-[#f73c56] bg-red-50 text-[#f73c56]"
                                : "border-gray-200 hover:border-[#f73c56] hover:bg-gray-50"
                            }`}
                          >
                            <div className="mb-2 flex justify-center">
                              {icon}
                            </div>
                            <span className="font-medium text-sm capitalize">
                              {type}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Sub Category Selection */}
                  {formData.type && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Property Category
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        {formData.type === "residential" ? (
                          <>
                            <label className="relative cursor-pointer">
                              <input
                                type="radio"
                                name="sub_category"
                                value="Buy"
                                checked={formData.sub_category === "Buy"}
                                onChange={handleInputChange}
                                className="sr-only"
                              />
                              <div
                                className={`p-4 rounded-lg border-2 text-center transition-all ${
                                  formData.sub_category === "Buy"
                                    ? "border-[#f73c56] bg-red-50 text-[#f73c56]"
                                    : "border-gray-200 hover:border-[#f73c56] hover:bg-gray-50"
                                }`}
                              >
                                <span className="font-medium text-sm">Buy</span>
                              </div>
                            </label>
                            <label className="relative cursor-pointer">
                              <input
                                type="radio"
                                name="sub_category"
                                value="Rent"
                                checked={formData.sub_category === "Rent"}
                                onChange={handleInputChange}
                                className="sr-only"
                              />
                              <div
                                className={`p-4 rounded-lg border-2 text-center transition-all ${
                                  formData.sub_category === "Rent"
                                    ? "border-[#f73c56] bg-red-50 text-[#f73c56]"
                                    : "border-gray-200 hover:border-[#f73c56] hover:bg-gray-50"
                                }`}
                              >
                                <span className="font-medium text-sm">
                                  Rent
                                </span>
                              </div>
                            </label>
                            <label className="relative cursor-pointer">
                              <input
                                type="radio"
                                name="sub_category"
                                value="Monositi"
                                checked={formData.sub_category === "Monositi"}
                                onChange={handleInputChange}
                                className="sr-only"
                              />
                              <div
                                className={`p-4 rounded-lg border-2 text-center transition-all ${
                                  formData.sub_category === "Monositi"
                                    ? "border-[#f73c56] bg-red-50 text-[#f73c56]"
                                    : "border-gray-200 hover:border-[#f73c56] hover:bg-gray-50"
                                }`}
                              >
                                <span className="font-medium text-sm">
                                  Monositi
                                </span>
                              </div>
                            </label>
                          </>
                        ) : (
                          // For commercial, show all categories
                          <>
                            <label className="relative cursor-pointer">
                              <input
                                type="radio"
                                name="sub_category"
                                value="Buy"
                                checked={formData.sub_category === "Buy"}
                                onChange={handleInputChange}
                                className="sr-only"
                              />
                              <div
                                className={`p-4 rounded-lg border-2 text-center transition-all ${
                                  formData.sub_category === "Buy"
                                    ? "border-[#f73c56] bg-red-50 text-[#f73c56]"
                                    : "border-gray-200 hover:border-[#f73c56] hover:bg-gray-50"
                                }`}
                              >
                                <span className="font-medium text-sm">Buy</span>
                              </div>
                            </label>
                            <label className="relative cursor-pointer">
                              <input
                                type="radio"
                                name="sub_category"
                                value="Rent"
                                checked={formData.sub_category === "Rent"}
                                onChange={handleInputChange}
                                className="sr-only"
                              />
                              <div
                                className={`p-4 rounded-lg border-2 text-center transition-all ${
                                  formData.sub_category === "Rent"
                                    ? "border-[#f73c56] bg-red-50 text-[#f73c56]"
                                    : "border-gray-200 hover:border-[#f73c56] hover:bg-gray-50"
                                }`}
                              >
                                <span className="font-medium text-sm">
                                  Rent
                                </span>
                              </div>
                            </label>
                            <label className="relative cursor-pointer">
                              <input
                                type="radio"
                                name="sub_category"
                                value="Monositi"
                                checked={formData.sub_category === "Monositi"}
                                onChange={handleInputChange}
                                className="sr-only"
                              />
                              <div
                                className={`p-4 rounded-lg border-2 text-center transition-all ${
                                  formData.sub_category === "Monositi"
                                    ? "border-[#f73c56] bg-red-50 text-[#f73c56]"
                                    : "border-gray-200 hover:border-[#f73c56] hover:bg-gray-50"
                                }`}
                              >
                                <span className="font-medium text-sm">
                                  Monositi
                                </span>
                              </div>
                            </label>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter property name"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter price"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Size (sq ft)
                      </label>
                      <input
                        type="number"
                        name="size"
                        value={formData.size}
                        onChange={handleInputChange}
                        placeholder="Enter size in sq ft"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Units/Rooms
                      </label>
                      <input
                        type="number"
                        name="units"
                        value={formData.units}
                        onChange={handleInputChange}
                        placeholder="Number of units/rooms"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
                          setFormData((prev) => ({
                            ...prev,
                            contactNumber: value,
                          }));
                        }}
                        required
                        placeholder="9876543210"
                        pattern="[0-9]{10}"
                        maxLength="10"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter 10 digit mobile number
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      placeholder="Describe your property..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#f73c56] focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Next Button for Basic Tab */}
                  <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setActiveTab("location")}
                      className="flex items-center space-x-2 px-6 py-3 bg-[#f73c56] text-white rounded-lg hover:bg-[#e9334e] transition-colors"
                    >
                      <span>Next: Location</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === "location" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Location Details
                    </h3>
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={locationLoading}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                    >
                      {locationLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Navigation className="w-4 h-4" />
                      )}
                      <span>
                        {locationLoading ? "Getting..." : "Use My Location"}
                      </span>
                    </button>
                  </div>

                  {hasLocation && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700">
                          Location captured:{" "}
                          {formData.geo_location?.coordinates[1]?.toFixed(6)},{" "}
                          {formData.geo_location?.coordinates[0]?.toFixed(6)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter street address"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter city"
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter state"
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          PIN Code
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter PIN code"
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Navigation Buttons for Location Tab */}
                  <div className="flex justify-between mt-6 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setActiveTab("basic")}
                      className="flex items-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("features")}
                      className="flex items-center space-x-2 px-6 py-3 bg-[#f73c56] text-white rounded-lg hover:bg-[#e9334e] transition-colors"
                    >
                      <span>Next: Features</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === "features" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    Property Features
                  </h3>

                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amenities
                      </label>
                      <input
                        type="text"
                        name="amenities"
                        value={formData.amenities}
                        onChange={handleInputChange}
                        placeholder="WiFi, Furnished, AC, Parking (comma separated)"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags
                      </label>
                      <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        placeholder="PG, Boys, Girls, Family (comma separated)"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nearby Places
                      </label>
                      <input
                        type="text"
                        name="nearby_places"
                        value={formData.nearby_places}
                        onChange={handleInputChange}
                        placeholder="Metro, Mall, Hospital, School (comma separated)"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Navigation Buttons for Features Tab */}
                  <div className="flex justify-between mt-6 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setActiveTab("location")}
                      className="flex items-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("media")}
                      className="flex items-center space-x-2 px-6 py-3 bg-[#f73c56] text-white rounded-lg hover:bg-[#e9334e] transition-colors"
                    >
                      <span>Next: Photos & Documents</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === "media" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    Photos & Documents
                  </h3>

                  {/* Photo Upload */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700">
                      Property Photos (Max 8)
                    </h4>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">
                        Upload property photos
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full"
                      />
                    </div>

                    {photoPreviews.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {photoPreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Document Upload */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700">
                      Property Documents (Max 6)
                    </h4>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">
                        Upload property documents
                      </p>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={handleDocChange}
                        className="w-full"
                      />
                    </div>

                    {docPreviews.length > 0 && (
                      <div className="space-y-2">
                        {docPreviews.map((doc, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <FileText className="w-5 h-5 text-gray-500" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {doc.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {doc.size}
                                </p>
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
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveTab("features")}
                    className="flex items-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span>Back</span>
                  </button>
                  <div className="text-right">
                    <h4 className="font-medium text-gray-900">
                      Ready to submit?
                    </h4>
                    <p className="text-sm text-gray-600">
                      Your property will be reviewed before going live
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center space-x-2 px-6 py-3 bg-[#f73c56] text-white rounded-lg hover:bg-[#e9334e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    <span>{loading ? "Submitting..." : "Submit Property"}</span>
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AddProperty;
