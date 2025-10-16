import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { serviceApi } from "../../utils/serviceApi";
import GradientHeading from "../common/GradientHeading";
import ServiceBookingForm from "../Services/ServiceBookingForm";
import { Search, Filter, Star, MapPin, DollarSign } from "lucide-react";

// Import service icons
import plumbingIcon from "../../assets/services/faucet.png";
import electricalIcon from "../../assets/services/eco-house.png";
import carpentryIcon from "../../assets/services/hammer.png";
import paintingIcon from "../../assets/services/varnish.png";
import gardeningIcon from "../../assets/services/trimming.png";
import applianceIcon from "../../assets/services/refrigerator.png";
import cleaningIcon from "../../assets/services/products.png";
import otherIcon from "../../assets/services/more.png";

const Services = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    min_price: '',
    max_price: '',
    monositi_verified: false
  });
  const [showFilters, setShowFilters] = useState(false);

  // Map category IDs to icons
  const categoryIcons = {
    Plumbing: plumbingIcon,
    Electrical: electricalIcon,
    Carpentry: carpentryIcon,
    Painting: paintingIcon,
    Gardening: gardeningIcon,
    "Appliance Repair": applianceIcon,
    Cleaning: cleaningIcon,
    Other: otherIcon,
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, []);

  // Fetch services when filters change
  useEffect(() => {
    fetchServices();
  }, [selectedCategory, searchQuery, filters]);

  const fetchCategories = async () => {
    try {
      const response = await serviceApi.getServiceCategories();
      if (response.success) {
        setCategories(response.categories || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery) params.query = searchQuery;
      if (filters.min_price) params.min_price = filters.min_price;
      if (filters.max_price) params.max_price = filters.max_price;
      if (filters.monositi_verified) params.monositi_verified = 'true';

      const response = searchQuery || Object.values(filters).some(f => f)
        ? await serviceApi.searchServices(params)
        : await serviceApi.getAllServices(params);

      if (response.success) {
        setServices(response.services || []);
      } else {
        console.error("Failed to fetch services:", response.message);
        setServices([]);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(selectedCategory === category ? '' : category);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleBookService = (service) => {
    setSelectedService(service);
    setShowBookingForm(true);
  };

  const handleCloseBookingForm = () => {
    setShowBookingForm(false);
    setSelectedService(null);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setFilters({
      min_price: '',
      max_price: '',
      monositi_verified: false
    });
  };

  // Use categories from API or fallback to predefined ones
  const displayCategories = categories.length > 0 ? categories : Object.keys(categoryIcons);

  return (
    <div className="py-8">
      <GradientHeading text="Home Services" />

      {/* Search and Filters */}
      <div className="px-4 mb-6 space-y-4">


        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Price (₹)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.min_price}
                  onChange={(e) => handleFilterChange('min_price', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Price (₹)</label>
                <input
                  type="number"
                  placeholder="10000"
                  value={filters.max_price}
                  onChange={(e) => handleFilterChange('max_price', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.monositi_verified}
                    onChange={(e) => handleFilterChange('monositi_verified', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Monositi Verified Only</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Service Categories */}
      {displayCategories.length > 0 && (
        <div className="px-4 mb-8">
          <h3 className="text-lg font-semibold mb-4">Browse by Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {displayCategories.map((category) => (
              <div
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition-all
                          ${selectedCategory === category
                    ? "bg-blue-100 border-2 border-theme-primary"
                    : "bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md"
                  }`}
              >
                <img
                  src={categoryIcons[category] || otherIcon}
                  alt={category}
                  className="w-12 h-12 object-contain mb-2"
                />
                <h4 className="text-center font-medium text-sm">{category}</h4>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Services List */}
      <div className="px-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading services...</p>
          </div>
        ) : services.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {selectedCategory ? `${selectedCategory} Services` : 'Available Services'}
              </h2>
              <span className="text-sm text-gray-600">{services.length} services found</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div
                  key={service._id}
                  className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
                >
                  {service.images && service.images.length > 0 ? (
                    <img
                      src={service.images[0]}
                      alt={service.service_name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold line-clamp-1">{service.service_name}</h3>
                      {service.monositi_verified && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-2">{service.category}</p>

                    <div className="flex items-center mb-2">
                      <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-600">
                        {service.provider?.name || 'Service Provider'}
                      </span>
                    </div>

                    <div className="flex items-center mb-3">
                      <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-lg font-semibold text-green-600">₹{service.base_price}</span>
                      {service.variable_price && (
                        <span className="text-sm text-gray-500 ml-1">+ variables</span>
                      )}
                    </div>

                    {service.ratings > 0 && (
                      <div className="flex items-center mb-3">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{service.ratings}</span>
                        <span className="text-sm text-gray-500 ml-1">rating</span>
                      </div>
                    )}

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {service.description}
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleBookService(service)}
                        className="flex-1 px-4 py-2 bg-theme-primary text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-600 text-lg mb-2">No services found</p>
            <p className="text-sm text-gray-500">
              {selectedCategory || searchQuery || Object.values(filters).some(f => f)
                ? "Try adjusting your search or filters"
                : "Services will appear here when available"}
            </p>
          </div>
        )}
      </div>

      {/* Service Booking Form Modal */}
      <ServiceBookingForm
        isOpen={showBookingForm}
        onClose={handleCloseBookingForm}
        service={selectedService}
      />
    </div>
  );
};

export default Services;
