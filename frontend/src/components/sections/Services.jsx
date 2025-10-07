import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { serviceApi } from '../../utils/serviceApi';
import GradientHeading from '../GradientHeading';

// Import service icons
import plumbingIcon from '../../assets/services/faucet.png';
import electricalIcon from '../../assets/services/eco-house.png';
import carpentryIcon from '../../assets/services/hammer.png';
import paintingIcon from '../../assets/services/varnish.png';
import gardeningIcon from '../../assets/services/trimming.png';
import applianceIcon from '../../assets/services/refrigerator.png';
import cleaningIcon from '../../assets/services/products.png';
import otherIcon from '../../assets/services/more.png';

const Services = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Map category IDs to icons
  const categoryIcons = {
    'Plumbing': plumbingIcon,
    'Electrical': electricalIcon,
    'Carpentry': carpentryIcon,
    'Painting': paintingIcon,
    'Gardening': gardeningIcon,
    'Appliance Repair': applianceIcon,
    'Cleaning': cleaningIcon,
    'Other': otherIcon
  };

  // Fetch service providers when category changes
  useEffect(() => {
    if (selectedCategory) {
      fetchServiceProviders(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchServiceProviders = async (category) => {
    setLoading(true);
    try {
      const response = await serviceApi.getServiceProviders(category);
      if (response.success) {
        setServiceProviders(response.providers || []);
      } else {
        console.error("Failed to fetch providers:", response.message);
        setServiceProviders([]);
      }
    } catch (error) {
      console.error("Error fetching service providers:", error);
      setServiceProviders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleViewDetails = (providerId) => {
    navigate(`/service-providers/${providerId}`);
  };

  const handleCreateRequest = (providerId) => {
    navigate(`/service-request/new`, { state: { providerId } });
  };

  // Get categories from the API
  const categories = Object.keys(categoryIcons);

  return (
    <div className="py-8">
      <GradientHeading text="Home Services" />
      
      {/* Service Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8 px-4">
        {categories.map((category) => (
          <div 
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition-all
                      ${selectedCategory === category 
                        ? 'bg-blue-100 border-2 border-theme-primary' 
                        : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md'}`}
          >
            <img 
              src={categoryIcons[category]} 
              alt={category} 
              className="w-16 h-16 object-contain mb-3" 
            />
            <h3 className="text-center font-medium">{category}</h3>
          </div>
        ))}
      </div>

      {/* Service Providers List */}
      {selectedCategory && (
        <div className="mt-8 px-4">
          <h2 className="text-xl font-semibold mb-4">{selectedCategory} Service Providers</h2>
          
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : serviceProviders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviceProviders.map((provider) => (
                <div key={provider._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {provider.photo ? (
                    <img 
                      src={provider.photo} 
                      alt={provider.name} 
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{provider.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{provider.address}, {provider.city}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span>{provider.averageRating || 'New'}</span>
                      <span className="mx-2 text-gray-300">|</span>
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        {provider.availability}
                      </span>
                    </div>
                    <p className="text-sm mt-2 line-clamp-2">{provider.description}</p>
                    <div className="flex justify-between mt-4">
                      <button 
                        onClick={() => handleViewDetails(provider._id)}
                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => handleCreateRequest(provider._id)}
                        className="px-4 py-2 bg-theme-primary text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Request Service
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No service providers found for {selectedCategory}.</p>
              <p className="mt-2 text-sm text-gray-500">Please check back later or try another category.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Services;
