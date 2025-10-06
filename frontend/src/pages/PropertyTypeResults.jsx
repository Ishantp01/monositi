import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminNavbar from "../components/Admin/AdminNavbar";
import { propertyApi } from "../utils/propertyApi";
import { toast } from 'react-toastify';

// Property type icons and styling
const propertyTypeConfig = {
  'Rent': { icon: '🏡', color: 'blue' },
  'Buy': { icon: '🏘️', color: 'green' },
  'Commercial': { icon: '🏢', color: 'orange' }
};

// Enhanced status badge component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    'Pending': { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: '⏳' },
    'Verified': { color: 'bg-green-50 text-green-700 border-green-200', icon: '✅' },
    'Rejected': { color: 'bg-red-50 text-red-700 border-red-200', icon: '❌' },
    'Suspended': { color: 'bg-gray-50 text-gray-700 border-gray-200', icon: '⛔' }
  };

  const config = statusConfig[status] || statusConfig.Pending;

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
      <span className="mr-1">{config.icon}</span>
      {status}
    </span>
  );
};

export default function PropertyTypeResults() {
  const { type } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [propertyDetails, setPropertyDetails] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await propertyApi.getAllPropertiesForAdmin();
        if (data.success) {
          const decodedType = decodeURIComponent(type);
          const filtered = (data.properties || []).filter((p) => p.type === decodedType);
          setItems(filtered);
        } else {
          setError(data.message || "Failed to load properties");
        }
      } catch (e) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [type]);

  const handleViewProperty = async (propertyId) => {
    try {
      const res = await propertyApi.getPropertyById(propertyId);
      if (res.success) {
        setPropertyDetails(res.property);
        setSelectedProperty(propertyId);
      } else {
        alert(res.message || 'Failed to fetch property details');
      }
    } catch (err) {
      alert(err.message || 'Something went wrong');
    }
  };

  const closePropertyModal = () => {
    setSelectedProperty(null);
    setPropertyDetails(null);
  };

  const handleVerifyProperty = async (propertyId) => {
    try {
      const res = await propertyApi.verifyProperty(propertyId, "Verified");
      if (res.success) {
        setItems((prev) =>
          prev.map((it) =>
            it._id === propertyId ? { ...it, status: "Verified" } : it
          )
        );
        setPropertyDetails(prev => prev ? { ...prev, status: "Verified" } : null);

        toast.success("✅ Property verified successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error(`❌ ${res.message || "Failed to verify property"}`, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (err) {
      toast.error(`❌ ${err.message || "Something went wrong"}`, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleSuspendProperty = async (propertyId) => {
    try {
      const res = await propertyApi.suspendProperty(propertyId);
      if (res.success) {
        setItems((prev) =>
          prev.map((it) =>
            it._id === propertyId ? { ...it, status: "Suspended" } : it
          )
        );
        setPropertyDetails(prev => prev ? { ...prev, status: "Suspended" } : null);

        toast.warning("⏸️ Property suspended successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error(`❌ ${res.message || "Failed to suspend property"}`, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (err) {
      toast.error(`❌ ${err.message || "Something went wrong"}`, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="sticky top-0 z-40">
        <AdminNavbar />
      </div>
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-gray-800">
            {type} Properties
          </h1>
          <p className="text-gray-600 text-lg">
            Review and manage {type.toLowerCase()} property listings
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
            <div className="flex items-center space-x-2">
              <span className="text-lg">⚠️</span>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            <p className="text-lg font-medium text-gray-700">Loading properties...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <h3 className="text-xl font-bold text-gray-800">No {type} Properties Found</h3>
            <p className="text-gray-600 text-center max-w-md">
              There are currently no {type.toLowerCase()} properties waiting for review.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p) => (
              <div key={p._id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                {/* Property Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  <img
                    src={(p.photos && p.photos[0]) || "https://via.placeholder.com/400x240"}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={p.status} />
                  </div>

                  {/* Property Type Badge */}
                  <div className="absolute top-3 left-3">
                    <div className="bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {propertyTypeConfig[p.type]?.icon || '🏠'} {p.type}
                    </div>
                  </div>

                  {/* Photo Count */}
                  {p.photos && p.photos.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs">
                      📷 {p.photos.length} photos
                    </div>
                  )}
                </div>

                {/* Property Details */}
                <div className="p-5">
                  <div className="space-y-4">
                    {/* Header */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                        {p.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <span className="text-sm">📍</span>
                        <span className="text-sm">{p.city}, {p.state}</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-green-600">
                        ₹{p.price?.toLocaleString() || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        per month
                      </div>
                    </div>

                    {/* Tags */}
                    {p.tags && p.tags.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Features:</p>
                        <div className="flex flex-wrap gap-2">
                          {p.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium border border-blue-200"
                            >
                              {tag}
                            </span>
                          ))}
                          {p.tags.length > 3 && (
                            <span className="bg-gray-50 text-gray-600 px-2 py-1 rounded-full text-xs font-medium border border-gray-200">
                              +{p.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-200">
                      <button
                        onClick={async () => {
                          try {
                            const res = await propertyApi.verifyProperty(p._id, "Verified"); // ✅ pass status here
                            if (res.success) {
                              setItems((prev) =>
                                prev.map((it) =>
                                  it._id === p._id ? { ...it, status: "Verified" } : it
                                )
                              );
                            } else {
                              alert(res.message || "Failed to verify");
                            }
                          } catch (err) {
                            alert(err.message || "Something went wrong");
                          }
                        }}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
                      >
                        ✅ Verify
                      </button>

                      <button
                        onClick={async () => {
                          const res = await propertyApi.suspendProperty(p._id);
                          if (res.success) {
                            setItems((prev) => prev.map((it) => (it._id === p._id ? { ...it, status: 'Suspended' } : it)));
                          } else {
                            alert(res.message || 'Failed to suspend');
                          }
                        }}
                        className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-md hover:shadow-lg"
                      >
                        ⏸️ Suspend
                      </button>

                      <button
                        onClick={() => handleViewProperty(p._id)}
                        className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-3 py-2 rounded-lg text-sm font-medium hover:from-gray-700 hover:to-gray-800 transition-all shadow-md hover:shadow-lg"
                      >
                        👁️ View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Property Details Modal */}
        {selectedProperty && propertyDetails && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <span className="mr-2">🏠</span>
                    Property Details
                  </h2>
                  <button
                    onClick={closePropertyModal}
                    className="text-white hover:text-gray-200 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Property Images */}
                {propertyDetails.photos && propertyDetails.photos.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-800">Property Images</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {propertyDetails.photos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`${propertyDetails.name} - Photo ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
                          onClick={() => window.open(photo, '_blank')}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Basic Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                      Basic Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-600">🏷️</span>
                        <span className="font-medium">Type:</span>
                        <span>{propertyDetails.type}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-600">📍</span>
                        <span className="font-medium">Location:</span>
                        <span>{propertyDetails.address}, {propertyDetails.city}, {propertyDetails.state}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600">💰</span>
                        <span className="font-medium">Price:</span>
                        <span className="text-lg font-bold text-green-600">
                          ₹{propertyDetails.price?.toLocaleString() || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-purple-600">🏷️</span>
                        <span className="font-medium">Status:</span>
                        <StatusBadge status={propertyDetails.status} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                      Contact Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-600">👤</span>
                        <span className="font-medium">Owner:</span>
                        <span>{propertyDetails.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-600">📞</span>
                        <span className="font-medium">Contact:</span>
                        <span>{propertyDetails.contactNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {propertyDetails.description && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                      Description
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{propertyDetails.description}</p>
                  </div>
                )}

                {/* Features */}
                {propertyDetails.tags && propertyDetails.tags.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                      Features & Amenities
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {propertyDetails.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Gender Preference */}
                {propertyDetails.genderPreference && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                      Gender Preference
                    </h3>
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-700 border border-purple-200">
                      {propertyDetails.genderPreference === 'Boys' && '👦 Boys Only'}
                      {propertyDetails.genderPreference === 'Girls' && '👧 Girls Only'}
                      {propertyDetails.genderPreference === 'Co-ed' && '👥 Co-ed'}
                      {propertyDetails.genderPreference === 'Any' && '✅ Any Gender'}
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">Created</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(propertyDetails.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">Last Updated</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(propertyDetails.updatedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {/* Admin Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => handleVerifyProperty(propertyDetails._id)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                  >
                    <span>✅</span>
                    <span>Verify Property</span>
                  </button>

                  <button
                    onClick={() => handleSuspendProperty(propertyDetails._id)}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                  >
                    <span>⏸️</span>
                    <span>Suspend Property</span>
                  </button>

                  <button
                    onClick={closePropertyModal}
                    className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                  >
                    <span>❌</span>
                    <span>Close</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


