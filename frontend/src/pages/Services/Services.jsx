"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/layout/NavBar";
import { Loader2, CheckCircle, Clock } from "lucide-react";
import { toast } from "react-toastify";
import API_BASE_URL from "../../utils/constant";

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

  // Fetch provider's services (services offered by the provider)
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // First, try to get provider's services (services they offer)
        const response = await axios.get(
          `${API_BASE_URL}/services/my-services`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setServices(response.data.services || []);
        } else {
          toast.error("Failed to fetch services.");
        }
      } catch (error) {
        console.error("Error fetching services:", error);

        // If the endpoint doesn't work, show an appropriate message
        if (error.response?.status === 404) {
          toast.info(
            "No services found. Create your first service to get started!"
          );
        } else {
          toast.error("Something went wrong while fetching services.");
        }
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
              Manage your services and offerings
            </p>
          </div>

          {/* Services Grid */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 flex items-center">
                <span className="mr-2 text-xl">🔧</span>
                My Services
              </h2>
              <p className="text-gray-600 mt-1 text-sm">
                View and manage your service offerings
              </p>
            </div>

            <div className="p-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-theme-primary"></div>
                  <p className="text-gray-600 font-medium">
                    Loading your services...
                  </p>
                </div>
              ) : services.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                  <div className="text-5xl">📋</div>
                  <h3 className="text-xl font-semibold text-gray-700">
                    No services created yet
                  </h3>
                  <p className="text-gray-500 text-center max-w-md">
                    You haven't created any services yet. Start by creating your
                    first service to offer to customers.
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {services.map((service) => (
                    <div
                      key={service._id}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">
                              {service.category?.toLowerCase().includes("plumb")
                                ? "🔧"
                                : service.category
                                    ?.toLowerCase()
                                    .includes("elect")
                                ? "⚡"
                                : service.category
                                    ?.toLowerCase()
                                    .includes("clean")
                                ? "🧽"
                                : service.category
                                    ?.toLowerCase()
                                    .includes("carpenter")
                                ? "🔨"
                                : service.category
                                    ?.toLowerCase()
                                    .includes("paint")
                                ? "🎨"
                                : "🛠️"}
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-gray-800">
                                {service.service_name}
                              </h3>
                              <span className="inline-block text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                                {service.category}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                          {service.description || "No description provided."}
                        </p>

                        {/* Service Images */}
                        {service.images?.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-700">
                              Service Images:
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              {service.images.slice(0, 4).map((photo, i) => (
                                <img
                                  key={i}
                                  src={photo}
                                  alt={`service-${i}`}
                                  className="w-full h-20 object-cover rounded border border-gray-300 hover:border-theme-primary transition-colors cursor-pointer"
                                  onClick={() => window.open(photo, "_blank")}
                                />
                              ))}
                              {service.images.length > 4 && (
                                <div className="w-full h-20 bg-gray-100 rounded border border-gray-300 flex items-center justify-center text-xs text-gray-600">
                                  +{service.images.length - 4} more
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Service Details */}
                        <div className="space-y-2 pt-2 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              Base Price:
                            </span>
                            <span className="text-lg font-bold text-[#f73c56]">
                              ₹{service.base_price}
                            </span>
                          </div>

                          {service.variable_price && (
                            <div className="flex items-center text-xs text-gray-500">
                              <span>+ Variable pricing available</span>
                            </div>
                          )}

                          {service.monositi_verified && (
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="w-4 h-4 text-emerald-600" />
                              <span className="text-xs font-medium text-emerald-700">
                                Monositi Verified
                              </span>
                            </div>
                          )}

                          {service.ratings && (
                            <div className="flex items-center space-x-1">
                              <span className="text-sm">⭐</span>
                              <span className="text-sm font-medium text-blue-700">
                                {service.ratings}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Status */}
                        <div className="pt-2">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              service.status === "active"
                                ? "bg-green-100 text-green-700 border border-green-200"
                                : "bg-gray-100 text-gray-700 border border-gray-200"
                            }`}
                          >
                            {service.status === "active"
                              ? "✅ Active"
                              : "⏸️ Inactive"}
                          </span>
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
