"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/layout/NavBar";
import { Loader2, CheckCircle, Clock } from "lucide-react";
import { toast } from "react-toastify";

// Status badge component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    completed: {
      color: "bg-green-50 text-green-700 border-green-200",
      icon: "✅",
    },
    "in-progress": {
      color: "bg-blue-50 text-blue-700 border-blue-200",
      icon: "🔄",
    },
    pending: {
      color: "bg-yellow-50 text-yellow-700 border-yellow-200",
      icon: "⏳",
    },
    cancelled: { color: "bg-red-50 text-red-700 border-red-200", icon: "❌" },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}
    >
      <span className="mr-1">{config.icon}</span>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all assigned & completed requests
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token"); // assuming token stored in localStorage
        const response = await axios.get(
          "http://localhost:5000/api/services/services/requests/provider",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setServices(response.data.data);
        } else {
          toast.error("Failed to fetch services.");
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        toast.error("Something went wrong while fetching services.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-theme-primary">
              Service Provider Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Manage your assigned service requests
            </p>
          </div>

          {/* Services Grid */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 flex items-center">
                <span className="mr-2 text-xl">🔧</span>
                My Service Requests
              </h2>
              <p className="text-gray-600 mt-1 text-sm">
                View and manage your assigned requests
              </p>
            </div>

            <div className="p-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-theme-primary"></div>
                  <p className="text-gray-600 font-medium">
                    Loading your service requests...
                  </p>
                </div>
              ) : services.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                  <div className="text-5xl">📋</div>
                  <h3 className="text-xl font-semibold text-gray-700">
                    No service requests assigned
                  </h3>
                  <p className="text-gray-500 text-center max-w-md">
                    You don't have any service requests assigned to you yet. New
                    requests will appear here when assigned.
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {services.map((req) => (
                    <div
                      key={req._id}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">
                              {req.category?.toLowerCase().includes("plumb")
                                ? "🔧"
                                : req.category?.toLowerCase().includes("elect")
                                ? "⚡"
                                : req.category?.toLowerCase().includes("clean")
                                ? "🧽"
                                : req.category?.toLowerCase().includes("repair")
                                ? "🔨"
                                : "🛠️"}
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-gray-800">
                                {req.category || "Service Request"}
                              </h3>
                              <StatusBadge status={req.status} />
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {req.description || "No description provided."}
                        </p>

                        {/* Photos Section */}
                        {req.photosBefore?.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-700">
                              Before Photos:
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              {req.photosBefore.slice(0, 4).map((photo, i) => (
                                <img
                                  key={i}
                                  src={photo}
                                  alt={`before-${i}`}
                                  className="w-full h-20 object-cover rounded border border-gray-300 hover:border-theme-primary transition-colors cursor-pointer"
                                  onClick={() => window.open(photo, "_blank")}
                                />
                              ))}
                              {req.photosBefore.length > 4 && (
                                <div className="w-full h-20 bg-gray-100 rounded border border-gray-300 flex items-center justify-center text-xs text-gray-600">
                                  +{req.photosBefore.length - 4} more
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {req.photosAfter?.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-700">
                              After Photos:
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              {req.photosAfter.slice(0, 4).map((photo, i) => (
                                <img
                                  key={i}
                                  src={photo}
                                  alt={`after-${i}`}
                                  className="w-full h-20 object-cover rounded border border-gray-300 hover:border-theme-primary transition-colors cursor-pointer"
                                  onClick={() => window.open(photo, "_blank")}
                                />
                              ))}
                              {req.photosAfter.length > 4 && (
                                <div className="w-full h-20 bg-gray-100 rounded border border-gray-300 flex items-center justify-center text-xs text-gray-600">
                                  +{req.photosAfter.length - 4} more
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">📅</span>
                            <span className="text-xs text-gray-600">
                              {new Date(req.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {req.tenantRating && (
                            <div className="flex items-center space-x-1">
                              <span className="text-sm">⭐</span>
                              <span className="text-sm font-medium text-blue-700">
                                {req.tenantRating}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;
