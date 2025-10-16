"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../components/layout/NavBar";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Camera,
  Upload,
  FileText,
  Shield,
  Edit3,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Settings,
  Bell,
  MessageSquare,
  Calendar,
  Star,
  MapPin
} from "lucide-react";
import { toast } from "react-toastify";
import apiRequest from "../utils/api";
import { serviceApi } from "../utils/serviceApi";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [kycFiles, setKycFiles] = useState([]);
  const [kycUploading, setKycUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile"); // profile, kyc, preferences, bookings
  const [contactPreferences, setContactPreferences] = useState({
    email: true,
    sms: true,
    whatsapp: true
  });
  const [preferencesLoading, setPreferencesLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const token = localStorage.getItem("token");

  // ---------------- Fetch User ----------------
  const fetchUserProfile = async () => {
    try {
      const data = await apiRequest("/users/me", "GET");
      if (data.success) {
        setUser(data.user);
        setEditedUser(data.user);
        // Set contact preferences if available
        if (data.user.contact_preferences) {
          setContactPreferences(data.user.contact_preferences);
        }
      } else {
        console.error("Failed to fetch user:", data.message);
        toast.error("Failed to fetch profile");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Error fetching profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please login to view profile");
      window.location.href = "/auth";
      return;
    }
    fetchUserProfile();
    fetchBookings();
  }, [token]);

  // ---------------- User Handlers ----------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const data = await apiRequest("/users/me", "PUT", {
        name: editedUser.name,
        email: editedUser.email,
        profile_img: editedUser.profile_img
      });

      if (data.success) {
        setUser(data.user);
        setIsEditing(false);
        toast.success("Profile updated successfully!");

        // Update localStorage user data
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    }
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  // ---------------- KYC Handlers ----------------
  const handleKycFileChange = (e) => {
    const files = Array.from(e.target.files);
    setKycFiles(files);
  };

  const handleKycUpload = async () => {
    if (kycFiles.length === 0) {
      toast.error("Please select KYC documents to upload");
      return;
    }

    setKycUploading(true);
    try {
      const formData = new FormData();
      kycFiles.forEach((file) => {
        formData.append('kycDocs', file);
      });

      const response = await fetch(`${'http://localhost:5000/api'}/users/me/kyc`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setKycFiles([]);
        fetchUserProfile(); // Refresh user data
      } else {
        toast.error(data.message || "Failed to upload KYC documents");
      }
    } catch (error) {
      console.error("Error uploading KYC:", error);
      toast.error("Error uploading KYC documents");
    } finally {
      setKycUploading(false);
    }
  };

  // ---------------- Contact Preferences Handlers ----------------
  const handlePreferenceChange = (type, value) => {
    setContactPreferences(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleSavePreferences = async () => {
    setPreferencesLoading(true);
    try {
      const data = await apiRequest("/users/me/contact-preferences", "PATCH", contactPreferences);

      if (data.success) {
        toast.success("Contact preferences updated successfully!");
        setContactPreferences(data.contact_preferences);
      } else {
        toast.error(data.message || "Failed to update preferences");
      }
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast.error("Error updating contact preferences");
    } finally {
      setPreferencesLoading(false);
    }
  };

  // ---------------- Bookings Handlers ----------------
  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const data = await serviceApi.getCustomerBookings();
      if (data.success) {
        setBookings(data.bookings || []);
      } else {
        toast.error("Failed to fetch bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Error fetching bookings");
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId, reason = '') => {
    try {
      const data = await serviceApi.cancelBooking(bookingId, reason);
      if (data.success) {
        toast.success("Booking cancelled successfully");
        fetchBookings(); // Refresh bookings
      } else {
        toast.error(data.message || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Error cancelling booking");
    }
  };

  const handleRateService = async () => {
    try {
      const data = await serviceApi.rateService(selectedBooking._id, rating, review);
      if (data.success) {
        toast.success("Service rated successfully");
        setShowRatingModal(false);
        setSelectedBooking(null);
        setRating(5);
        setReview('');
        fetchBookings(); // Refresh bookings
      } else {
        toast.error(data.message || "Failed to rate service");
      }
    } catch (error) {
      console.error("Error rating service:", error);
      toast.error("Error rating service");
    }
  };

  const openRatingModal = (booking) => {
    setSelectedBooking(booking);
    setShowRatingModal(true);
  };

  // ---------------- Helper Functions ----------------
  const getVerificationStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'rejected':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getVerificationStatusText = (status) => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'pending':
        return 'Pending Review';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Not Submitted';
    }
  };

  const getVerificationStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'rejected':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // ---------------- UI ----------------
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center space-y-4"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f73c56]"></div>
          <p className="text-lg font-medium text-gray-700">Loading profile...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="text-6xl">👤</div>
          <p className="text-gray-600 text-lg">User profile not found.</p>
          <button
            onClick={() => window.location.href = "/auth"}
            className="px-6 py-2 bg-[#f73c56] text-white rounded-lg hover:bg-[#e9334e] transition-colors"
          >
            Login Again
          </button>
        </motion.div>
      </div>
    );
  }

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
                <div className="relative">
                  <img
                    src={user.profile_img || "https://via.placeholder.com/120"}
                    alt={user.name || "User"}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  {user.monositi_verified && (
                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">
                    {user.name || "User"}
                  </h1>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{user.phone}</span>
                    </div>
                    {user.email && (
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>{user.email}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                      {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getVerificationStatusColor(user.verification_status)}`}>
                      {getVerificationStatusText(user.verification_status)}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {!isEditing ? (
                    <button
                      onClick={handleEdit}
                      className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200"
          >
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === "profile"
                    ? "border-[#f73c56] text-[#f73c56]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Profile Details</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("kyc")}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === "kyc"
                    ? "border-[#f73c56] text-[#f73c56]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>KYC Documents</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("preferences")}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === "preferences"
                    ? "border-[#f73c56] text-[#f73c56]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                  <div className="flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>Preferences</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("bookings")}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === "bookings"
                    ? "border-[#f73c56] text-[#f73c56]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>My Bookings</span>
                  </div>
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "profile" && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            name="name"
                            value={editedUser.name || ""}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                            placeholder="Enter your full name"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="email"
                            name="email"
                            value={editedUser.email || ""}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Profile Image URL
                        </label>
                        <div className="relative">
                          <Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="url"
                            name="profile_img"
                            value={editedUser.profile_img || ""}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                            placeholder="https://example.com/photo.jpg"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Contact Information</h3>
                          <div className="mt-2 space-y-3">
                            <div className="flex items-center space-x-3">
                              <Phone className="w-5 h-5 text-gray-400" />
                              <span className="text-gray-900">{user.phone}</span>
                            </div>
                            {user.email && (
                              <div className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-gray-400" />
                                <span className="text-gray-900">{user.email}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Account Status</h3>
                          <div className="mt-2 space-y-3">
                            <div className="flex items-center space-x-3">
                              {getVerificationStatusIcon(user.verification_status)}
                              <span className="text-gray-900">{getVerificationStatusText(user.verification_status)}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              {user.monositi_verified ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                                <AlertCircle className="w-5 h-5 text-gray-400" />
                              )}
                              <span className="text-gray-900">
                                {user.monositi_verified ? "Monositi Verified" : "Not Monositi Verified"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Account Details</h3>
                        <div className="mt-2 space-y-3">
                          <div>
                            <span className="text-sm text-gray-500">Role:</span>
                            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Member since:</span>
                            <span className="ml-2 text-gray-900">
                              {new Date(user.registered_on || user.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {user.rating > 0 && (
                            <div>
                              <span className="text-sm text-gray-500">Rating:</span>
                              <span className="ml-2 text-gray-900">{user.rating}/5 ⭐</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "kyc" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <FileText className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-blue-900">KYC Verification</h3>
                        <p className="text-sm text-blue-700 mt-1">
                          Upload your identity documents to verify your account and access premium features.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Current KYC Status */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900">Verification Status</h3>
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getVerificationStatusColor(user.verification_status)}`}>
                        {getVerificationStatusIcon(user.verification_status)}
                        <span>{getVerificationStatusText(user.verification_status)}</span>
                      </div>
                    </div>

                    {user.KYC_docs && user.KYC_docs.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Documents:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {user.KYC_docs.map((doc, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={doc}
                                alt={`KYC Document ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-75 transition-opacity"
                                onClick={() => window.open(doc, '_blank')}
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
                                <span className="text-white text-xs opacity-0 group-hover:opacity-100">Click to view</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Upload New Documents */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-4">Upload New Documents</h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select KYC Documents (Max 5 files)
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            multiple
                            accept="image/*,.pdf"
                            onChange={handleKycFileChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Accepted formats: JPG, PNG, PDF. Max file size: 5MB each.
                        </p>
                      </div>

                      {kycFiles.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {kycFiles.map((file, index) => (
                              <li key={index} className="flex items-center space-x-2">
                                <FileText className="w-4 h-4" />
                                <span>{file.name}</span>
                                <span className="text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <button
                        onClick={handleKycUpload}
                        disabled={kycFiles.length === 0 || kycUploading}
                        className="flex items-center space-x-2 px-6 py-3 bg-[#f73c56] text-white rounded-lg hover:bg-[#e9334e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Upload className="w-4 h-4" />
                        <span>{kycUploading ? "Uploading..." : "Upload Documents"}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "preferences" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Bell className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-blue-900">Communication Preferences</h3>
                        <p className="text-sm text-blue-700 mt-1">
                          Choose how you'd like to receive notifications and updates from Monositi.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="font-medium text-gray-900 mb-6">Notification Settings</h3>

                    <div className="space-y-6">
                      {/* Email Notifications */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Mail className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Email Notifications</h4>
                            <p className="text-sm text-gray-600">Receive updates via email</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={contactPreferences.email}
                            onChange={(e) => handlePreferenceChange('email', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f73c56]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f73c56]"></div>
                        </label>
                      </div>

                      {/* SMS Notifications */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                            <p className="text-sm text-gray-600">Receive updates via SMS</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={contactPreferences.sms}
                            onChange={(e) => handlePreferenceChange('sms', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f73c56]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f73c56]"></div>
                        </label>
                      </div>

                      {/* WhatsApp Notifications */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Phone className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">WhatsApp Notifications</h4>
                            <p className="text-sm text-gray-600">Receive updates via WhatsApp</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={contactPreferences.whatsapp}
                            onChange={(e) => handlePreferenceChange('whatsapp', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f73c56]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f73c56]"></div>
                        </label>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Save Changes</h4>
                          <p className="text-sm text-gray-600">Update your notification preferences</p>
                        </div>
                        <button
                          onClick={handleSavePreferences}
                          disabled={preferencesLoading}
                          className="flex items-center space-x-2 px-6 py-3 bg-[#f73c56] text-white rounded-lg hover:bg-[#e9334e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Save className="w-4 h-4" />
                          <span>{preferencesLoading ? "Saving..." : "Save Preferences"}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Notification Types Info */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">What notifications will you receive?</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Property Updates</h5>
                        <ul className="text-gray-600 space-y-1">
                          <li>• New property matches</li>
                          <li>• Price changes</li>
                          <li>• Property status updates</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Service Updates</h5>
                        <ul className="text-gray-600 space-y-1">
                          <li>• Service booking confirmations</li>
                          <li>• Service provider updates</li>
                          <li>• Service completion</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Account Updates</h5>
                        <ul className="text-gray-600 space-y-1">
                          <li>• KYC verification status</li>
                          <li>• Security alerts</li>
                          <li>• Important announcements</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "bookings" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-blue-900">My Service Bookings</h3>
                        <p className="text-sm text-blue-700 mt-1">
                          View and manage your service bookings, track status, and rate completed services.
                        </p>
                      </div>
                    </div>
                  </div>

                  {bookingsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f73c56] mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading bookings...</p>
                    </div>
                  ) : bookings.length > 0 ? (
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <div key={booking._id} className="bg-white border border-gray-200 rounded-lg p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg text-gray-900">
                                {booking.service?.service_name}
                              </h3>
                              <p className="text-sm text-gray-600">{booking.service?.category}</p>
                              <div className="flex items-center mt-2 text-sm text-gray-500">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span>Provider: {booking.provider?.name}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-500">Scheduled Date</p>
                              <p className="font-medium">
                                {booking.scheduled_for
                                  ? new Date(booking.scheduled_for).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })
                                  : 'Not scheduled'
                                }
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Total Amount</p>
                              <p className="font-medium text-green-600">₹{booking.total_amount}</p>
                            </div>
                          </div>

                          {booking.notes && (
                            <div className="mb-4">
                              <p className="text-sm text-gray-500">Notes</p>
                              <p className="text-sm text-gray-700">{booking.notes}</p>
                            </div>
                          )}

                          {booking.service_address && (
                            <div className="mb-4">
                              <p className="text-sm text-gray-500">Service Address</p>
                              <p className="text-sm text-gray-700">
                                {booking.service_address.street}, {booking.service_address.city}, {booking.service_address.state} {booking.service_address.zipCode}
                              </p>
                            </div>
                          )}

                          {booking.customer_rating && (
                            <div className="mb-4">
                              <p className="text-sm text-gray-500">Your Rating</p>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < booking.customer_rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                                      }`}
                                  />
                                ))}
                                <span className="ml-2 text-sm text-gray-600">({booking.customer_rating}/5)</span>
                              </div>
                              {booking.customer_review && (
                                <p className="text-sm text-gray-700 mt-1">{booking.customer_review}</p>
                              )}
                            </div>
                          )}

                          <div className="flex gap-2 pt-4 border-t border-gray-200">
                            {booking.status === 'pending' && (
                              <button
                                onClick={() => handleCancelBooking(booking._id, 'Cancelled by customer')}
                                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                              >
                                Cancel Booking
                              </button>
                            )}

                            {booking.status === 'completed' && !booking.customer_rating && (
                              <button
                                onClick={() => openRatingModal(booking)}
                                className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm"
                              >
                                Rate Service
                              </button>
                            )}

                            <div className="text-xs text-gray-500 flex items-center ml-auto">
                              Booked on {new Date(booking.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                      <p className="text-gray-600">
                        Your service bookings will appear here once you book a service.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Rating Modal */}
            {showRatingModal && selectedBooking && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Rate Service</h3>
                      <button
                        onClick={() => setShowRatingModal(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Service: {selectedBooking.service?.service_name}</p>
                      <p className="text-sm text-gray-600">Provider: {selectedBooking.provider?.name}</p>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-8 h-8 ${star <= rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                                }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Review (Optional)</label>
                      <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Share your experience..."
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#f73c56] focus:border-transparent resize-none"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowRatingModal(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleRateService}
                        className="flex-1 px-4 py-2 bg-[#f73c56] text-white rounded-lg hover:bg-[#e9334e] transition-colors"
                      >
                        Submit Rating
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}
