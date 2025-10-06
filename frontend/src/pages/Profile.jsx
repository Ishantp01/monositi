"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../components/NavBar";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const token = localStorage.getItem("token");

  // ✅ Fetch current user profile
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
      } else {
        console.error("Failed to fetch user:", data.message);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // ✅ Handle field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle profile photo upload
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

  // ✅ Save updated profile
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
      } else {
        console.error("Failed to update profile:", data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-primary"></div>
          <p className="text-lg font-medium text-gray-700">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center space-y-2">
          <div className="text-4xl">👤</div>
          <p className="text-gray-600 text-lg">User profile not found.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-theme-primary">
              User Profile
            </h1>
            <p className="text-gray-600 text-lg">Manage your account information</p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="mr-2 text-2xl">👤</span>
                Profile Information
              </h2>
              <p className="text-gray-600 mt-1 text-sm">View and manage your personal details</p>
            </div>

            <div className="p-6">
              <div className="flex flex-col lg:flex-row items-center lg:items-start lg:space-x-8">
                {/* Profile Photo */}
                <div className="relative mb-6 lg:mb-0">
                  <img
                    src={user.photo || "https://via.placeholder.com/150"}
                    alt={user.name}
                    className="w-32 h-32 lg:w-40 lg:h-40 rounded-full border-4 border-theme-primary shadow-lg object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-theme-primary w-8 h-8 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user.role?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="text-center lg:text-left flex-1 mt-4 lg:mt-0 space-y-3">
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-1">
                      {user.name}
                    </h3>
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-theme-secondary text-theme-primary border border-theme-primary border-opacity-20">
                      {user.role?.toUpperCase()}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span className="text-sm">📧</span>
                      <span className="text-sm font-medium">{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <span className="text-sm">📱</span>
                        <span className="text-sm font-medium">{user.phone}</span>
                      </div>
                    )}
                    {user.address && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <span className="text-sm">📍</span>
                        <span className="text-sm font-medium">{user.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleEdit}
                  className="bg-theme-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors shadow-md flex items-center space-x-2"
                >
                  <span>✏️</span>
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl border border-gray-200 transform transition-all">
              <div className="bg-theme-primary p-6 rounded-t-xl">
                <h2 className="text-xl font-bold text-white flex items-center justify-center">
                  <span className="mr-2">✏️</span>
                  Edit Profile
                </h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Photo Upload */}
                <div className="flex justify-center">
                  <div className="relative group">
                    <img
                      src={editedUser.photo || "https://via.placeholder.com/150"}
                      alt="Preview"
                      className="w-32 h-32 rounded-full border-4 border-theme-primary object-cover shadow-lg group-hover:shadow-xl transition-shadow"
                    />
                    <div className="absolute bottom-0 right-0 bg-theme-primary w-10 h-10 rounded-full flex justify-center items-center shadow-lg cursor-pointer hover:bg-red-700 transition-colors group-hover:scale-110">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M4 7h4l2-3h4l2 3h4a2 2 0 012 2v11a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2zm8 11a5 5 0 100-10 5 5 0 000 10z" />
                        <circle cx="12" cy="12" r="3" fill="white" />
                      </svg>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
                    />
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editedUser.name}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-theme-primary transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editedUser.email}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-theme-primary transition-all"
                    placeholder="Enter your email address"
                  />
                </div>

                {/* Phone (if available) */}
                {editedUser.phone !== undefined && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={editedUser.phone || ''}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-theme-primary transition-all"
                      placeholder="Enter your phone number"
                    />
                  </div>
                )}

                {/* Address (if available) */}
                {editedUser.address !== undefined && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Address (Optional)
                    </label>
                    <textarea
                      name="address"
                      value={editedUser.address || ''}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-theme-primary transition-all resize-none"
                      placeholder="Enter your address"
                    />
                  </div>
                )}

                {/* Save / Cancel */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 rounded-lg bg-theme-primary text-white font-medium hover:bg-red-700 transition-colors shadow-lg"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
