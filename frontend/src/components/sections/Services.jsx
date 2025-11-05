import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { serviceApi } from "../../utils/serviceApi";
import GradientHeading from "../common/GradientHeading";
import ServiceBookingForm from "../Services/ServiceBookingForm";
import { Search, Filter, Star, MapPin, DollarSign, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

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

      {/* Search Bar */}
      <div className="px-4 mb-6">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for services..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 border rounded-lg flex items-center gap-2 transition-colors
                      ${showFilters ? 'bg-blue-100 border-blue-300' : 'border-gray-300 hover:border-blue-300'}`}
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
          {(selectedCategory || searchQuery || Object.values(filters).some(f => f)) && (
            <button
              onClick={clearFilters}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
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
                    ? "bg-blue-100 border-2 border-[#f73c56]"
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
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300 flex flex-col h-full"
                >
                  {/* Service Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    {service.images && service.images.length > 0 ? (
                      <img
                        src={service.images[0]}
                        alt={service.service_name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">No Image</span>
                      </div>
                    )}
                    
                    {/* Verified Badge */}
                    {service.monositi_verified && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1.5 rounded-full shadow-md flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Verified
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Service Details */}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2 flex-1">
                        {service.service_name}
                      </h3>
                    </div>

                    <p className="text-sm text-[#f73c56] font-medium mb-3">{service.category}</p>

                    <div className="text-sm text-gray-600 flex items-center mb-3">
                      <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0 text-gray-400" />
                      <span className="line-clamp-1">
                        {service.provider?.name || 'Service Provider'}
                      </span>
                    </div>

                    {service.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {service.description}
                      </p>
                    )}

                    {/* Price and Rating */}
                    <div className="mb-4 pt-3 border-t border-gray-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-lg font-bold text-[#f73c56]">₹{service.base_price}</span>
                          {service.variable_price && (
                            <span className="text-xs text-gray-500 ml-1">+ variables</span>
                          )}
                        </div>
                        {service.ratings > 0 && (
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 mr-1 fill-yellow-500" />
                            <span className="text-sm font-medium text-gray-700">{service.ratings}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Book Button */}
                    <button
                      onClick={() => handleBookService(service)}
                      className="mt-auto w-full text-center bg-[#f73c56] text-white py-2.5 px-4 rounded-lg hover:bg-[#e9334e] transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Show All Services Button */}
            <div className="text-center mt-8">
              <Link
                to="/services"
                className="inline-flex items-center px-8 py-3 bg-[#f73c56] text-white font-semibold rounded-lg hover:bg-[#e9334e] transition-colors shadow-md"
              >
                Show All Services
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
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
