"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../components/layout/NavBar";
import { propertyApi, createPropertyFormData } from "../utils/propertyApi";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [properties, setProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [actionType, setActionType] = useState(""); // view/update
  const [updatingProperty, setUpdatingProperty] = useState({});
  const [updatingLoading, setUpdatingLoading] = useState(false);
  const token = localStorage.getItem("token");

  // ---------------- Fetch User ----------------
  const fetchUserProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/me", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setEditedUser(data.user);
      } else console.error("Failed to fetch user:", data.message);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Fetch Properties ----------------
  const fetchUserProperties = async () => {
    setPropertiesLoading(true);
    try {
      const data = await propertyApi.getPropertyByLandlord();
      if (data.success) setProperties(data.properties);
      else console.error("Failed to fetch properties:", data.message);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setPropertiesLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchUserProperties();
  }, []);

  // ---------------- User Handlers ----------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedUser((prev) => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedUser),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setIsEditing(false);
      } else console.error("Failed to update profile:", data.message);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  // ---------------- Property Actions ----------------
  const handleDeleteProperty = async (id) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    try {
      const data = await propertyApi.deleteProperty(id);
      if (data.success) {
        fetchUserProperties();
        alert("Property deleted successfully!");
      } else {
        alert("Failed to delete property: " + data.message);
      }
    } catch (error) {
      alert("Error deleting property: " + error.message);
    }
  };

  const handleViewProperty = (property) => {
    setSelectedProperty(property);
    setActionType("view");
  };

  const handleUpdateProperty = (property) => {
    setSelectedProperty(property);
    setUpdatingProperty(property); // Load data for update
    setActionType("update");
  };

  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatingProperty((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdatePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUpdatingProperty((prev) => ({
        ...prev,
        photos: [...(prev.photos || []), file],
      }));
    }
  };

  const handleSavePropertyUpdate = async () => {
    setUpdatingLoading(true);
    try {
      const formData = createPropertyFormData(updatingProperty);
      const data = await propertyApi.updateProperty(
        selectedProperty._id,
        formData
      );
      if (data.success) {
        fetchUserProperties();
        setSelectedProperty(null);
        setActionType("");
        alert("Property updated successfully!");
      } else alert("Failed to update property: " + data.message);
    } catch (error) {
      alert("Error updating property: " + error.message);
    } finally {
      setUpdatingLoading(false);
    }
  };

  const closePropertyModal = () => {
    setSelectedProperty(null);
    setActionType("");
    setUpdatingProperty({});
  };

  // ---------------- UI ----------------
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-primary"></div>
          <p className="text-lg font-medium text-gray-700">
            Loading profile...
          </p>
        </div>
      </div>
    );

  if (!user)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center space-y-2">
          <div className="text-4xl">👤</div>
          <p className="text-gray-600 text-lg">User profile not found.</p>
        </div>
      </div>
    );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* ---------------- User Profile Card ---------------- */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="mr-2 text-2xl">👤</span>
                {user.name}'s Profile
              </h2>
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-theme-primary text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
              >
                Edit Profile
              </button>
            </div>
            <div className="p-6 flex flex-col lg:flex-row items-center lg:items-start lg:space-x-8">
              <img
                src={
                  user.photo ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQq6gaTf6N93kzolH98ominWZELW881HqCgw&s"
                }
                alt={user.name}
                className="w-32 h-32 lg:w-40 lg:h-40 rounded-full  object-cover"
              />
              <div className="flex-1 mt-4 lg:mt-0 space-y-2 text-center lg:text-left">
                <h3 className="text-2xl font-bold">{user.name}</h3>
                <p className="text-gray-600">Email: {user.email}</p>
                {user.phone && (
                  <p className="text-gray-600">Phone: {user.phone}</p>
                )}
                {user.address && (
                  <p className="text-gray-600">Address: {user.address}</p>
                )}
              </div>
            </div>
          </div>

          {/* ---------------- User Properties ---------------- */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="mr-2 text-2xl">🏘️</span>
                Your Properties
              </h2>
              <button
                onClick={fetchUserProperties}
                className="px-4 py-2 bg-theme-primary text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
              >
                Refresh
              </button>
            </div>
            <div className="p-6">
              {propertiesLoading ? (
                <p className="text-gray-600 text-center">
                  Loading properties...
                </p>
              ) : properties.length === 0 ? (
                <p className="text-gray-600 text-center">
                  No properties found.
                </p>
              ) : (
                <div className="space-y-4">
                  {properties.map((prop) => (
                    <div
                      key={prop._id}
                      className="flex justify-between items-center border-b border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {prop.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {prop.city}, {prop.state}
                        </p>
                        <p className="text-sm text-gray-500">₹ {prop.price}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewProperty(prop)}
                          className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleUpdateProperty(prop)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600 transition-colors"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(prop._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Property Modal ---------------- */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl border border-gray-200 overflow-y-auto max-h-[90vh]">
            <div className="bg-theme-primary p-6 rounded-t-xl flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {actionType === "view" ? "Property Details" : "Update Property"}
              </h2>
              <button
                onClick={closePropertyModal}
                className="text-white text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-4">
              {actionType === "view" ? (
                <>
                  <h3 className="text-lg font-semibold">
                    {selectedProperty.name}
                  </h3>
                  <p className="text-gray-600">
                    {selectedProperty.description}
                  </p>
                  <p className="text-gray-600 font-medium">
                    Type: {selectedProperty.type}
                  </p>
                  <p className="text-gray-600 font-medium">
                    City: {selectedProperty.city}
                  </p>
                  <p className="text-gray-600 font-medium">
                    State: {selectedProperty.state}
                  </p>
                  <p className="text-gray-600 font-medium">
                    Price: ₹ {selectedProperty.price}
                  </p>
                  <p className="text-gray-600 font-medium">
                    Tags: {selectedProperty.tags.join(", ")}
                  </p>
                  <p className="text-gray-600 font-medium">
                    Contact: {selectedProperty.contactNumber}
                  </p>
                  {selectedProperty.photos && (
                    <div className="flex gap-2 overflow-x-auto py-2">
                      {selectedProperty.photos.map((photo, i) => (
                        <img
                          key={i}
                          src={photo}
                          alt="Property"
                          className="w-32 h-24 object-cover rounded-lg border border-gray-200"
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <input
                    type="text"
                    name="name"
                    value={updatingProperty.name || ""}
                    onChange={handleUpdateInputChange}
                    placeholder="Property Name"
                    className="w-full border p-2 rounded-lg"
                  />
                  <input
                    type="text"
                    name="description"
                    value={updatingProperty.description || ""}
                    onChange={handleUpdateInputChange}
                    placeholder="Description"
                    className="w-full border p-2 rounded-lg"
                  />
                  <input
                    type="text"
                    name="city"
                    value={updatingProperty.city || ""}
                    onChange={handleUpdateInputChange}
                    placeholder="City"
                    className="w-full border p-2 rounded-lg"
                  />
                  <input
                    type="text"
                    name="state"
                    value={updatingProperty.state || ""}
                    onChange={handleUpdateInputChange}
                    placeholder="State"
                    className="w-full border p-2 rounded-lg"
                  />
                  <input
                    type="number"
                    name="price"
                    value={updatingProperty.price || ""}
                    onChange={handleUpdateInputChange}
                    placeholder="Price"
                    className="w-full border p-2 rounded-lg"
                  />
                  <input
                    type="text"
                    name="tags"
                    value={updatingProperty.tags?.join(", ") || ""}
                    onChange={(e) =>
                      setUpdatingProperty((prev) => ({
                        ...prev,
                        tags: e.target.value
                          .split(",")
                          .map((tag) => tag.trim()),
                      }))
                    }
                    placeholder="Tags (comma separated)"
                    className="w-full border p-2 rounded-lg"
                  />
                  <input
                    type="file"
                    multiple
                    onChange={handleUpdatePhotoChange}
                    className="w-full border p-2 rounded-lg"
                  />
                  <button
                    onClick={handleSavePropertyUpdate}
                    disabled={updatingLoading}
                    className="px-4 py-2 bg-theme-primary text-white rounded-lg mt-2 hover:bg-red-700 transition-colors"
                  >
                    {updatingLoading ? "Saving..." : "Save Changes"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
