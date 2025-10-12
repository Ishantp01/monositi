"use client";

import React, { useState, useEffect } from "react";
import apiRequest from "../../utils/api";

// Status badge component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      color: "bg-yellow-50 text-yellow-700 border-yellow-200",
      icon: "⏳",
    },
    "in-progress": {
      color: "bg-blue-50 text-blue-700 border-blue-200",
      icon: "🔄",
    },
    completed: {
      color: "bg-green-50 text-green-700 border-green-200",
      icon: "✅",
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

// Review Modal Component
const ServiceRequestReviewModal = ({ requestId, onClose, onSubmitted }) => {
  const [tenantRating, setTenantRating] = useState(0);
  const [tenantReview, setTenantReview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!tenantRating || !tenantReview)
      return alert("Please provide both rating and review");
    try {
      setLoading(true);
      const data = await apiRequest(
        `/services/services/requests/${requestId}/review`,
        "POST",
        {
          tenantRating,
          tenantReview,
        }
      );
      if (data.success) {
        onSubmitted && onSubmitted(data.data);
        onClose();
      } else alert(data.message || "Failed to submit review");
    } catch (err) {
      console.error(err);
      alert("Error submitting review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md border border-gray-200">
        <div className="bg-theme-primary p-4 rounded-t-lg">
          <h2 className="text-lg font-bold text-white flex items-center">
            <span className="mr-2">⭐</span>
            Rate & Review Service
          </h2>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating (1-5)
            </label>
            <input
              type="number"
              min="1"
              max="5"
              value={tenantRating}
              onChange={(e) => setTenantRating(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-theme-primary"
              placeholder="Enter rating"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              rows="4"
              value={tenantReview}
              onChange={(e) => setTenantReview(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-theme-primary resize-none"
              placeholder="Share your experience..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 rounded-md bg-theme-primary text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TenantServiceRequestsPage = () => {
  // Form state
  const [serviceCategory, setServiceCategory] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Requests state
  const [requests, setRequests] = useState([]);
  const [fetching, setFetching] = useState(true);

  // Review modal
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Upload photos preview
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const previewURLs = files.map((file) => URL.createObjectURL(file));
    setPhotos(previewURLs);
  };

  // Submit new request
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!serviceCategory || !description)
      return alert("Please fill all fields");

    const payload = {
      serviceCategory,
      description,
      photosBefore: photos,
    };

    try {
      setLoading(true);
      const data = await apiRequest(
        "/services/services/requests",
        "POST",
        payload
      );
      if (data.success) {
        setRequests((prev) => [data.data, ...prev]);
        setServiceCategory("");
        setDescription("");
        setPhotos([]);
      } else {
        alert("Request failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting request");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all tenant requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setFetching(true);
        const data = await apiRequest(
          "/services/services/requests/tenant",
          "GET"
        );
        if (data.success && Array.isArray(data.services)) {
          setRequests(data.services);
        } else {
          setRequests([]);
        }
      } catch (err) {
        console.error("Error fetching requests:", err);
        setRequests([]);
      } finally {
        setFetching(false); // ✅ FIXED: should toggle fetching, not loading
      }
    };
    fetchRequests();
  }, []);

  // Update request after review submission
  const handleReviewSubmit = (updatedRequest) => {
    setRequests((prev) =>
      prev.map((r) => (r._id === updatedRequest._id ? updatedRequest : r))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-theme-primary">
            Service Requests
          </h1>
          <p className="text-gray-600 text-lg">
            Submit and track your service requests
          </p>
        </div>

        {/* New Request Form */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-theme-primary p-4">
            <h2 className="text-lg font-bold text-white flex items-center">
              <span className="mr-2 text-xl">🛠️</span>
              Submit New Service Request
            </h2>
            <p className="text-red-100 mt-1 text-sm">
              Get help from our service providers
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Service Category
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Plumbing, Electrical, Cleaning..."
                    value={serviceCategory}
                    onChange={(e) => setServiceCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-3 pl-10 focus:outline-none focus:ring-1 focus:ring-theme-primary focus:border-theme-primary"
                    required
                  />
                  <div className="absolute left-3 top-3.5 text-gray-400">
                    🔧
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Photo Upload (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-theme-primary focus:border-theme-primary file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                rows="5"
                placeholder="Please describe your issue in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-theme-primary focus:border-theme-primary resize-none"
                required
              />
            </div>

            {photos.length > 0 && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Photo Preview
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {photos.map((p, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={p}
                        alt="preview"
                        className="w-full h-24 rounded-lg object-cover border border-gray-300 group-hover:border-theme-primary transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setPhotos(photos.filter((_, idx) => idx !== i))
                        }
                        className="absolute -top-2 -right-2 bg-theme-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-theme-primary text-white font-medium py-3 px-6 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? "Submitting..." : "Submit Service Request"}
            </button>
          </form>
        </div>

        {/* List of Requests */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 flex items-center">
              <span className="mr-2 text-xl">📋</span>
              My Service Requests
            </h2>
            <p className="text-gray-600 mt-1 text-sm">
              Track and manage your submitted requests
            </p>
          </div>

          <div className="p-4">
            {fetching ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-primary"></div>
                <p className="text-gray-600 text-sm">
                  Loading your requests...
                </p>
              </div>
            ) : requests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <div className="text-4xl">📭</div>
                <h3 className="text-lg font-medium text-gray-700">
                  No service requests yet
                </h3>
                <p className="text-gray-500 text-center text-sm max-w-md">
                  You haven't submitted any service requests yet. Create your
                  first request above to get started!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((req) => (
                  <div
                    key={req._id}
                    className="bg-gray-50 border border-gray-200 rounded-md p-4 hover:border-gray-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="text-xl">
                              {req.serviceCategory
                                .toLowerCase()
                                .includes("plumb")
                                ? "🔧"
                                : req.serviceCategory
                                    .toLowerCase()
                                    .includes("elect")
                                ? "⚡"
                                : req.serviceCategory
                                    .toLowerCase()
                                    .includes("clean")
                                ? "🧽"
                                : req.serviceCategory
                                    .toLowerCase()
                                    .includes("repair")
                                ? "🔨"
                                : "🛠️"}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">
                                {req.serviceCategory}
                              </h3>
                              <StatusBadge status={req.status} />
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm leading-relaxed">
                          {req.description}
                        </p>

                        {req.photosBefore?.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-700">
                              Attached Photos:
                            </p>
                            <div className="flex gap-2 flex-wrap">
                              {req.photosBefore.map((p, i) => (
                                <img
                                  key={i}
                                  src={p}
                                  alt="before"
                                  className="w-16 h-16 object-cover rounded border border-gray-300 hover:border-theme-primary transition-colors cursor-pointer"
                                  onClick={() => window.open(p, "_blank")}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {req.tenantRating && (
                          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm">⭐</span>
                              <span className="font-medium text-blue-800">
                                {req.tenantRating} star
                                {req.tenantRating !== 1 ? "s" : ""}
                              </span>
                            </div>
                            <p className="text-blue-700 text-sm italic">
                              "{req.tenantReview}"
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex-shrink-0">
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                            req.tenantRating
                              ? "bg-theme-secondary text-theme-primary hover:bg-yellow-100"
                              : "bg-theme-primary text-white hover:bg-red-700"
                          }`}
                        >
                          {req.tenantRating
                            ? "✏️ Edit Review"
                            : "⭐ Add Review"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {selectedRequest && (
        <ServiceRequestReviewModal
          requestId={selectedRequest._id}
          onClose={() => setSelectedRequest(null)}
          onSubmitted={handleReviewSubmit}
        />
      )}
    </div>
  );
};

export default TenantServiceRequestsPage;
