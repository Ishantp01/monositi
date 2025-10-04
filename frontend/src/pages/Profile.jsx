"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../components/NavBar";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});

  const token = localStorage.getItem("token"); // JWT stored in localStorage

  // Fetch user profile
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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
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
      } else {
        console.error("Failed to update profile:", data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        <p className="ml-4 text-lg font-medium text-gray-700">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white py-10 px-4 mt-24">
        <div className="max-w-4xl mx-auto">
          {/* Main Profile Card */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden -mt-20 relative z-10 hover:shadow-red-300 transition-shadow duration-300">
            <div className="px-8 pt-20 pb-8 bg-white">
              <div className="flex flex-col lg:flex-row items-center lg:items-start lg:space-x-10">
                {/* Profile Photo */}
                <div className="relative mb-6 lg:mb-0">
                  <img
                    src={user.photo || "https://via.placeholder.com/150"}
                    alt={user.name}
                    className="w-32 h-32 lg:w-40 lg:h-40 rounded-full border-4 border-red-600 shadow-lg object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>

                {/* Profile Details */}
                <div className="text-center lg:text-left flex-1 mt-4 lg:mt-0">
                  <h1 className="text-3xl lg:text-4xl font-bold text-black mb-2">
                    {user.name}
                  </h1>
                  <p className="text-red-600 text-lg mb-3 font-medium">
                    {user.role?.toUpperCase()}
                  </p>
                  <div className="flex items-center space-x-3 justify-center lg:justify-start text-gray-700">
                    <svg
                      className="w-5 h-5 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <div className="px-8 pb-8 flex justify-center">
              <button
                onClick={handleEdit}
                className="bg-red-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors shadow-md text-lg"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-lg p-8 relative shadow-2xl animate-slide-in">
              <h2 className="text-2xl font-bold text-black mb-6 text-center">
                Edit Profile
              </h2>

              <div className="flex flex-col space-y-6">
                {/* Photo Upload */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <img
                      src={editedUser.photo || "https://via.placeholder.com/150"}
                      alt="Preview"
                      className="w-32 h-32 rounded-full border-4 border-red-600 object-cover shadow-lg"
                    />
                    <div className="absolute bottom-0 right-0 bg-red-600 w-10 h-10 rounded-full flex justify-center items-center shadow-lg cursor-pointer hover:bg-red-700 transition-colors">
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
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={editedUser.name}
                    onChange={handleInputChange}
                    className="w-full text-lg text-gray-900 py-3 mt-5 px-2 bg-transparent border-b-2 border-gray-300 focus:border-red-600 focus:outline-none peer"
                    placeholder=" "
                  />
                  <label className="absolute left-2 top-2 bottom-5 text-gray-400 text-sm ">
                    Name
                  </label>
                </div>

                {/* Email */}
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={editedUser.email}
                    onChange={handleInputChange}
                    className="w-full text-gray-700 py-3 px-2 mt-5 bg-transparent border-b-2 border-gray-300 focus:border-red-600 focus:outline-none peer"
                    placeholder=" "
                  />
                  <label className="absolute left-2 top-2 bottom-5 text-gray-400 text-sm ">
                    Email
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex justify-center space-x-4 mt-6">
                  <button
                    onClick={handleSave}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                  >
                    Cancel
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
