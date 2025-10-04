import React, { useState } from "react";
import apiRequest from "../utils/api"; // import universal API

const SimpleServiceRequestForm = () => {
  const [serviceCategory, setServiceCategory] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const previewURLs = files.map((file) => URL.createObjectURL(file));
    setPhotos(previewURLs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!serviceCategory || !description) return alert("Please fill all fields");

    const payload = {
      serviceCategory,
      description,
      photosBefore: photos,
    };

    try {
      setLoading(true);
      // Call universal apiRequest directly
      const data = await apiRequest("/services/services/requests", "POST", payload);
      if (data.success) setSubmitted(true);
      else alert("Request failed: " + (data.message || ""));
    } catch (err) {
      console.error(err);
      alert("Error submitting request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          🧰 Service Request Form
        </h1>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block font-medium mb-1">Service Category</label>
              <input
                type="text"
                placeholder="e.g., Plumbing"
                value={serviceCategory}
                onChange={(e) => setServiceCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Description</label>
              <textarea
                rows="4"
                placeholder="Describe your issue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Upload Photos</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="w-full"
              />
            </div>

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
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        ) : (
          <div className="bg-green-100 border border-green-400 text-green-800 p-4 rounded-md text-center">
            🎉 Your request has been submitted successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleServiceRequestForm;
