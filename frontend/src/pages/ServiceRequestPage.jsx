'use client';

import React, { useState, useEffect } from 'react';
import apiRequest from '../utils/api';

// Review Modal Component
const ServiceRequestReviewModal = ({ requestId, onClose, onSubmitted }) => {
  const [tenantRating, setTenantRating] = useState(0);
  const [tenantReview, setTenantReview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!tenantRating || !tenantReview) return alert('Please provide both rating and review');
    try {
      setLoading(true);
      const data = await apiRequest(`/services/services/requests/${requestId}/review`, 'POST', {
        tenantRating,
        tenantReview,
      });
      if (data.success) {
        onSubmitted && onSubmitted(data.data);
        onClose();
      } else alert(data.message || 'Failed to submit review');
    } catch (err) {
      console.error(err);
      alert('Error submitting review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Rate & Review Service</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Rating (1-5)</label>
          <input
            type="number"
            min="1"
            max="5"
            value={tenantRating}
            onChange={(e) => setTenantRating(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Review</label>
          <textarea
            rows="4"
            value={tenantReview}
            onChange={(e) => setTenantReview(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

const TenantServiceRequestsPage = () => {
  // Form state
  const [serviceCategory, setServiceCategory] = useState('');
  const [description, setDescription] = useState('');
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
      return alert('Please fill all fields');

    const payload = {
      serviceCategory,
      description,
      photosBefore: photos,
    };

    try {
      setLoading(true);
      const data = await apiRequest('/services/services/requests', 'POST', payload);
      if (data.success) {
        setRequests((prev) => [data.data, ...prev]);
        setServiceCategory('');
        setDescription('');
        setPhotos([]);
      } else {
        alert('Request failed: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting request');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all tenant requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setFetching(true);
        const data = await apiRequest('/services/services/requests/tenant', 'GET');
        if (data.success && Array.isArray(data.services)) {
          setRequests(data.services);
        } else {
          setRequests([]);
        }
      } catch (err) {
        console.error('Error fetching requests:', err);
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* New Request Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            🧰 Submit Service Request
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Service Category"
              value={serviceCategory}
              onChange={(e) => setServiceCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <textarea
              rows="4"
              placeholder="Describe your issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="w-full"
            />
            {photos.length > 0 && (
              <div className="flex gap-3 mb-2 flex-wrap">
                {photos.map((p, i) => (
                  <img
                    key={i}
                    src={p}
                    alt="preview"
                    className="w-20 h-20 rounded-md object-cover border"
                  />
                ))}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>

        {/* List of Requests */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold mb-4">My Service Requests</h2>
          {fetching ? (
            <p>Loading...</p>
          ) : requests.length === 0 ? (
            <p>No requests found.</p>
          ) : (
            <ul className="space-y-4">
              {requests.map((req) => (
                <li
                  key={req._id}
                  className="border p-4 rounded-lg shadow-sm bg-gray-50 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold">{req.serviceCategory}</h3>
                    <p className="text-gray-600">{req.description}</p>
                    {req.photosBefore?.length > 0 && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {req.photosBefore.map((p, i) => (
                          <img
                            key={i}
                            src={p}
                            alt="before"
                            className="w-20 h-20 object-cover rounded-md border"
                          />
                        ))}
                      </div>
                    )}
                    {req.tenantRating && (
                      <p className="mt-2 text-gray-700">
                        ⭐ {req.tenantRating} — {req.tenantReview}
                      </p>
                    )}
                    <p className="text-gray-500 mt-1">Status: {req.status}</p>
                  </div>
                  <button
                    onClick={() => setSelectedRequest(req)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {req.tenantRating ? 'Edit Review' : 'Add Review'}
                  </button>
                </li>
              ))}
            </ul>
          )}
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
