'use client';

import React, { useState, useEffect } from 'react';
import apiRequest from '../utils/api';

// Review modal component
const ReviewModal = ({ request, onClose, onSubmitted }) => {
  const [tenantRating, setTenantRating] = useState(request.tenantRating || 0);
  const [tenantReview, setTenantReview] = useState(request.tenantReview || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!tenantRating || !tenantReview) return alert('Please provide rating and review');
    try {
      setLoading(true);
      const data = await apiRequest(
        `/services/services/requests/${request._id}/review`,
        'POST',
        { tenantRating, tenantReview }
      );
      if (data.success) {
        onSubmitted(data.data);
        onClose();
      } else {
        alert('Failed to submit review');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Rate & Review Service</h2>
        <label className="block mb-2">Rating (1-5)</label>
        <input
          type="number"
          min="1"
          max="5"
          value={tenantRating}
          onChange={(e) => setTenantRating(Number(e.target.value))}
          className="w-full border border-gray-300 rounded-md p-2 mb-4"
        />
        <label className="block mb-2">Review</label>
        <textarea
          rows="4"
          value={tenantReview}
          onChange={(e) => setTenantReview(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 mb-4"
        />
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

const TenantRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Fetch tenant requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await apiRequest('/services/services/requests/tenant', 'GET');
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

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">My Service Requests</h1>
      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => (
            <li
              key={req._id}
              className="border p-4 rounded-lg shadow-sm bg-white flex flex-col md:flex-row md:justify-between items-start md:items-center"
            >
              <div>
                <h2 className="font-semibold">{req.serviceCategory}</h2>
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

                {req.photosAfter?.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {req.photosAfter.map((p, i) => (
                      <img
                        key={i}
                        src={p}
                        alt="after"
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
                className="mt-2 md:mt-0 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {req.tenantRating ? 'Edit Review' : 'Add Review'}
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedRequest && (
        <ReviewModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onSubmitted={handleReviewSubmitted}
        />
      )}
    </div>
  );
};

export default TenantRequestsPage;
