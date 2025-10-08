import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { serviceApi } from "../../utils/serviceApi";
import GradientHeading from "../../components/common/GradientHeading";

const ServiceProviderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProviderDetails = async () => {
      setLoading(true);
      try {
        const response = await serviceApi.getServiceProviderById(id);
        if (response.success) {
          setProvider(response.provider);
        } else {
          setError(response.message || "Failed to fetch provider details");
        }
      } catch (error) {
        console.error("Error fetching provider details:", error);
        setError("An error occurred while fetching provider details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProviderDetails();
    }
  }, [id]);

  const handleRequestService = () => {
    navigate("/service-request/new", { state: { providerId: id } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-theme-primary"></div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700 mb-6">{error || "Provider not found"}</p>
        <button
          onClick={() => navigate("/services")}
          className="px-6 py-2 bg-theme-primary text-white rounded-md hover:bg-blue-700"
        >
          Back to Services
        </button>
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

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header with photo */}
        <div className="relative h-64 bg-gray-200">
          {provider.photo ? (
            <img
              src={provider.photo}
              alt={provider.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-500 text-lg">No Image Available</span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <h1 className="text-3xl font-bold text-white">{provider.name}</h1>
            <p className="text-white/90">{provider.category}</p>
          </div>
        </div>

        {/* Provider details */}
        <div className="p-6">
          <div className="flex flex-wrap items-center mb-6">
            <div className="mr-6 mb-2">
              <span className="text-sm text-gray-500">Rating</span>
              <div className="flex items-center">
                <span className="text-yellow-500 mr-1">★</span>
                <span className="font-medium">
                  {provider.averageRating || "New"}
                </span>
              </div>
            </div>
            <div className="mr-6 mb-2">
              <span className="text-sm text-gray-500">Experience</span>
              <div className="font-medium">
                {provider.experience || "Not specified"}
              </div>
            </div>
            <div className="mr-6 mb-2">
              <span className="text-sm text-gray-500">Availability</span>
              <div className="font-medium">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {provider.availability}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">About</h2>
            <p className="text-gray-700">{provider.description}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Phone</span>
                <p className="font-medium">{provider.contactNumber}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Email</span>
                <p className="font-medium">
                  {provider.email || "Not provided"}
                </p>
              </div>
              <div className="md:col-span-2">
                <span className="text-sm text-gray-500">Address</span>
                <p className="font-medium">
                  {provider.address}, {provider.city}
                </p>
              </div>
            </div>
          </div>

          {provider.reviews && provider.reviews.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Reviews</h2>
              <div className="space-y-4">
                {provider.reviews.map((review, index) => (
                  <div key={index} className="border-b pb-4">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${
                              i < review.rating
                                ? "text-yellow-500"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <button
              onClick={handleRequestService}
              className="w-full md:w-auto px-6 py-3 bg-theme-primary text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Request Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderDetail;
