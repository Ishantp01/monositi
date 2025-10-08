import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { serviceApi } from "../../utils/serviceApi";
import GradientHeading from "../../components/common/GradientHeading";

const ServiceRequestForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const providerId = location.state?.providerId;

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    description: "",
    photos: [],
  });

  useEffect(() => {
    const fetchProviderDetails = async () => {
      if (!providerId) return;

      setLoading(true);
      try {
        const response = await serviceApi.getServiceProviderById(providerId);
        if (response.success) {
          setProvider(response.provider);
        } else {
          setError("Failed to fetch provider details");
        }
      } catch (error) {
        console.error("Error fetching provider details:", error);
        setError("An error occurred while fetching provider details");
      } finally {
        setLoading(false);
      }
    };

    fetchProviderDetails();
  }, [providerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, photos: files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!providerId) {
      setError("No service provider selected");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Create FormData object for file upload
      const requestData = new FormData();
      requestData.append("serviceProviderId", providerId);
      requestData.append("description", formData.description);

      // Append each photo to the FormData
      formData.photos.forEach((photo, index) => {
        requestData.append("photos", photo);
      });

      const response = await serviceApi.createServiceRequest(requestData);

      if (response.success) {
        setSuccess(true);
        // Reset form
        setFormData({
          description: "",
          photos: [],
        });

        // Redirect after a short delay
        setTimeout(() => {
          navigate("/profile/service-requests");
        }, 2000);
      } else {
        setError(response.message || "Failed to create service request");
      }
    } catch (error) {
      console.error("Error creating service request:", error);
      setError("An error occurred while creating the service request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-theme-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-theme-primary hover:underline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </button>
      </div>

      <div className="max-w-2xl mx-auto">
        <GradientHeading text="Request Service" />

        {provider && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-lg">Service Provider</h3>
            <p>
              {provider.name} - {provider.category}
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6">
            Service request created successfully! Redirecting to your
            requests...
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-gray-700 font-medium mb-2"
            >
              Describe your service need
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Please describe what service you need, including any relevant details..."
              required
            ></textarea>
          </div>

          <div className="mb-6">
            <label
              htmlFor="photos"
              className="block text-gray-700 font-medium mb-2"
            >
              Upload Photos (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                id="photos"
                name="photos"
                onChange={handleFileChange}
                multiple
                accept="image/*"
                className="hidden"
              />
              <label htmlFor="photos" className="cursor-pointer">
                <div className="flex flex-col items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-gray-400 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-gray-600">Click to upload photos</span>
                  <span className="text-gray-500 text-sm mt-1">
                    {formData.photos.length > 0
                      ? `${formData.photos.length} file(s) selected`
                      : "JPG, PNG up to 5MB each"}
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || success}
              className={`px-6 py-2 rounded-md text-white ${
                submitting || success
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-theme-primary hover:bg-blue-700"
              }`}
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceRequestForm;
