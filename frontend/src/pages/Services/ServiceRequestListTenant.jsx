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

// Review modal component
const ReviewModal = ({ request, onClose, onSubmitted }) => {
  const [tenantRating, setTenantRating] = useState(request.tenantRating || 0);
  const [tenantReview, setTenantReview] = useState(request.tenantReview || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!tenantRating || !tenantReview)
      return alert("Please provide rating and review");
    try {
      setLoading(true);
      const data = await apiRequest(
        `/services/services/requests/${request._id}/review`,
        "POST",
        { tenantRating, tenantReview }
      );
      if (data.success) {
        onSubmitted(data.data);
        onClose();
      } else {
        alert("Failed to submit review");
      }
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
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-theme-primary focus:border-theme-primary"
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
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-theme-primary focus:border-theme-primary resize-none"
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

const TenantRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Fetch tenant requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await apiRequest(
          "/services/services/requests/tenant",
          "GET"
        );
        setRequests(Array.isArray(data.services) ? data.services : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleReviewSubmitted = (updatedRequest) => {
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
            My Service Requests
          </h1>
          <p className="text-gray-600 text-lg">
            Track and manage your submitted requests
          </p>
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 flex items-center">
              <span className="mr-2 text-xl">📋</span>
              Service Requests
            </h2>
            <p className="text-gray-600 mt-1 text-sm">
              View all your service requests
            </p>
          </div>

          <div className="p-4">
            {loading ? (
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
                  You haven't submitted any service requests yet.
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
                              Before Photos:
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

                        {req.photosAfter?.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-700">
                              After Photos:
                            </p>
                            <div className="flex gap-2 flex-wrap">
                              {req.photosAfter.map((p, i) => (
                                <img
                                  key={i}
                                  src={p}
                                  alt="after"
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

        {/* Review Modal */}
        {selectedRequest && (
          <ReviewModal
            request={selectedRequest}
            onClose={() => setSelectedRequest(null)}
            onSubmitted={handleReviewSubmitted}
          />
        )}
      </div>
    </div>
  );
};

export default TenantRequestsPage;
