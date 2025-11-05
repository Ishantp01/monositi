import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/NavBar";
import { toast } from "react-toastify";
import { buildersApi } from "../../utils/buildersApi";
import apiRequest from "../../utils/api";
import API_BASE_URL from "../../utils/constant";
import {
  Building2,
  MapPin,
  Camera,
  FileText,
  Navigation,
  Loader2,
  X,
  Plus,
  Save,
  Calendar,
  DollarSign,
  Home,
  Building,
  Layers,
} from "lucide-react";

const CreateBuilderProject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [builders, setBuilders] = useState([]);
  const [formData, setFormData] = useState({
    builder: "",
    project_name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    project_type: "residential",
    status: "ongoing",
    possession_date: "",
    rera_number: "",
    total_units: "",
    available_units: "",
    price_min: "",
    price_max: "",
    coordinates: null,
  });
  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [unitConfigs, setUnitConfigs] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [newAmenity, setNewAmenity] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    fetchBuilders();
    
    // Check if builder ID is in URL params
    const urlParams = new URLSearchParams(window.location.search);
    const builderId = urlParams.get("builder");
    if (builderId) {
      setFormData((prev) => ({ ...prev, builder: builderId }));
    }
  }, []);

  const fetchBuilders = async () => {
    try {
      const response = await buildersApi.getPublicBuilders();
      if (response.success) {
        setBuilders(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching builders:", error);
      toast.error("Failed to load builders");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDocumentChange = (e) => {
    const files = Array.from(e.target.files);
    setDocuments((prev) => [...prev, ...files]);
  };

  const removeDocument = (index) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGetLocation = () => {
    setLocationLoading(true);
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          coordinates: { lat: latitude, lng: longitude },
        }));
        toast.success("Location captured successfully");
        setLocationLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("Failed to get location");
        setLocationLoading(false);
      }
    );
  };

  const addUnitConfig = () => {
    setUnitConfigs((prev) => [
      ...prev,
      {
        type: "",
        carpet_area: "",
        price: "",
        total_units: "",
        available_units: "",
      },
    ]);
  };

  const updateUnitConfig = (index, field, value) => {
    setUnitConfigs((prev) =>
      prev.map((config, i) =>
        i === index ? { ...config, [field]: value } : config
      )
    );
  };

  const removeUnitConfig = (index) => {
    setUnitConfigs((prev) => prev.filter((_, i) => i !== index));
  };

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setAmenities((prev) => [...prev, newAmenity.trim()]);
      setNewAmenity("");
    }
  };

  const removeAmenity = (index) => {
    setAmenities((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.builder) {
        toast.error("Please select a builder");
        setLoading(false);
        return;
      }

      if (!formData.project_name) {
        toast.error("Project name is required");
        setLoading(false);
        return;
      }

      const submitData = new FormData();
      
      // Basic fields
      Object.keys(formData).forEach((key) => {
        if (key !== "coordinates" && formData[key]) {
          submitData.append(key, formData[key]);
        }
      });

      // Coordinates
      if (formData.coordinates) {
        submitData.append("coordinates", JSON.stringify(formData.coordinates));
      }

      // Images
      images.forEach((image) => {
        submitData.append("images", image);
      });

      // Documents
      documents.forEach((doc) => {
        submitData.append("documents", doc);
      });

      // Unit configurations
      if (unitConfigs.length > 0) {
        submitData.append("unit_configurations", JSON.stringify(unitConfigs));
      }

      // Amenities
      if (amenities.length > 0) {
        submitData.append("amenities", JSON.stringify(amenities));
      }

      // Use fetch directly for FormData to ensure proper handling
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/builders/${formData.builder}/projects`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type - browser will set it with boundary for FormData
          },
          body: submitData,
        }
      );

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        throw new Error("Invalid response from server");
      }

      if (!response.ok) {
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      if (data.success) {
        toast.success("Builder project created successfully!");
        // Navigate to admin dashboard - user can manually switch to builders tab
        navigate("/admin");
      } else {
        toast.error(data.message || "Failed to create project");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create builder project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Create Builder Project
              </h1>
              <button
                onClick={() => navigate("/admin")}
                className="text-gray-600 hover:text-gray-900"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                {["basic", "location", "units", "media"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab
                        ? "border-[#f73c56] text-[#f73c56]"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>

            <form onSubmit={handleSubmit}>
              {activeTab === "basic" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Builder *
                    </label>
                    <select
                      name="builder"
                      value={formData.builder}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                      required
                    >
                      <option value="">Select a builder</option>
                      {builders.map((builder) => (
                        <option key={builder._id} value={builder._id}>
                          {builder.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      name="project_name"
                      value={formData.project_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Type
                      </label>
                      <select
                        name="project_type"
                        value={formData.project_type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                      >
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="mixed">Mixed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                        <option value="ready_to_move">Ready to Move</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Units
                      </label>
                      <input
                        type="number"
                        name="total_units"
                        value={formData.total_units}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Available Units
                      </label>
                      <input
                        type="number"
                        name="available_units"
                        value={formData.available_units}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Min Price (₹)
                      </label>
                      <input
                        type="number"
                        name="price_min"
                        value={formData.price_min}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Price (₹)
                      </label>
                      <input
                        type="number"
                        name="price_max"
                        value={formData.price_max}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Possession Date
                      </label>
                      <input
                        type="date"
                        name="possession_date"
                        value={formData.possession_date}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        RERA Number
                      </label>
                      <input
                        type="text"
                        name="rera_number"
                        value={formData.rera_number}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "location" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pincode
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location Coordinates
                    </label>
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={locationLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-[#f73c56] text-white rounded-lg hover:bg-[#e9334e] transition-colors disabled:opacity-50"
                    >
                      {locationLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Navigation className="w-4 h-4" />
                      )}
                      Get Current Location
                    </button>
                    {formData.coordinates && (
                      <p className="mt-2 text-sm text-gray-600">
                        Lat: {formData.coordinates.lat}, Lng:{" "}
                        {formData.coordinates.lng}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "units" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Unit Configurations</h3>
                    <button
                      type="button"
                      onClick={addUnitConfig}
                      className="flex items-center gap-2 px-4 py-2 bg-[#f73c56] text-white rounded-lg hover:bg-[#e9334e] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Unit Type
                    </button>
                  </div>

                  {unitConfigs.map((config, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 space-y-4"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Unit {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeUnitConfig(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type (e.g., 1BHK, 2BHK)
                          </label>
                          <input
                            type="text"
                            value={config.type}
                            onChange={(e) =>
                              updateUnitConfig(index, "type", e.target.value)
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Carpet Area
                          </label>
                          <input
                            type="text"
                            value={config.carpet_area}
                            onChange={(e) =>
                              updateUnitConfig(
                                index,
                                "carpet_area",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                            placeholder="e.g., 650 sq ft"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price (₹)
                          </label>
                          <input
                            type="number"
                            value={config.price}
                            onChange={(e) =>
                              updateUnitConfig(index, "price", e.target.value)
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Total Units
                          </label>
                          <input
                            type="number"
                            value={config.total_units}
                            onChange={(e) =>
                              updateUnitConfig(
                                index,
                                "total_units",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Available Units
                          </label>
                          <input
                            type="number"
                            value={config.available_units}
                            onChange={(e) =>
                              updateUnitConfig(
                                index,
                                "available_units",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Amenities</h3>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={newAmenity}
                        onChange={(e) => setNewAmenity(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
                        placeholder="Add amenity"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={addAmenity}
                        className="px-4 py-2 bg-[#f73c56] text-white rounded-lg hover:bg-[#e9334e] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                        >
                          {amenity}
                          <button
                            type="button"
                            onClick={() => removeAmenity(index)}
                            className="text-blue-700 hover:text-blue-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "media" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Images (Max 15)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                    />
                    {images.length > 0 && (
                      <div className="grid grid-cols-4 gap-4 mt-4">
                        {images.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Preview ${index}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Documents (Max 10)
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      multiple
                      onChange={handleDocumentChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                    />
                    {documents.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {documents.map((doc, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <span className="text-sm text-gray-700">
                              {doc.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeDocument(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate("/admin")}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 bg-[#f73c56] text-white rounded-lg hover:bg-[#e9334e] transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateBuilderProject;

