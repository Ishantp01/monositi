import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import apiRequest from "../../utils/api";

// Tab-specific filter configurations (unchanged)
const FILTER_CONFIGS = {
  "Real Estate": {
    searchPlaceholder: "Search properties for buy, sell, or rent",
    categories: ["Buy", "Sell", "Rent"],
    filters: {
      "Property Type": ["Residential", "Commercial"],
      "BHK Type": ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"],
      "Property Status": [
        "Ready to Move",
        "Under Construction",
        "New Builder Projects",
      ],
      "Price Range": ["Under 50L", "50L-1Cr", "1Cr-2Cr", "2Cr-5Cr", "Above 5Cr"],
    },
    additionalOptions: ["New Builder Projects"],
  },
  Buy: {
    searchPlaceholder: "Search upto 3 localities or landmarks",
    categories: ["Full House", "Land/Plot"],
    filters: {
      "BHK Type": ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"],
      "Property Status": [
        "Ready to Move",
        "Under Construction",
        "New Builder Projects",
      ],
      "Price Range": ["Under 50L", "50L-1Cr", "1Cr-2Cr", "2Cr-5Cr", "Above 5Cr"],
    },
    additionalOptions: ["New Builder Projects"],
  },
  Monositi: {
    searchPlaceholder: "Search hostels, commercial spaces, or land plots",
    categories: ["Commercial Space", "Hostel & PG", "Land & Plot"],
    filters: {
      "Property Type": ["Commercial Space", "Hostel & PG", "Land & Plot"],
      "Price Range": ["Under 10K", "10K-50K", "50K-1L", "1L-5L", "Above 5L"],
      "Availability": ["Available", "Booked", "Full House"],
      "Verification": ["Verified", "Unverified"],
    },
  },
  Rent: {
    searchPlaceholder: "Search upto 3 localities or landmarks",
    categories: ["Full House", "PG/Hostel", "Flatmates"],
    filters: {
      "BHK Type": ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"],
      Availability: [
        "Immediate",
        "Within 15 days",
        "Within 30 days",
        "Flexible",
      ],
      "Price Range": ["Under 10K", "10K-25K", "25K-50K", "50K-1L", "Above 1L"],
    },
  },
  "PG/Hostel": {
    searchPlaceholder: "Search upto 3 localities or landmarks",
    location: "Bangalore",
    categories: ["PG", "Hostel", "Co-living"],
    filters: {
      "Room Type": ["Single", "Double", "Triple", "Dormitory"],
      "Gender Preference": ["Male", "Female", "Co-ed"],
      "Meals Included": ["Yes", "No", "Optional"],
      Availability: ["Immediate", "Within 7 days", "Within 15 days"],
    },
  },
  Commercial: {
    searchPlaceholder: "Search upto 3 localities or landmarks",
    categories: ["Rent", "Buy"],
    filters: {
      "Property Type": [
        "Office Space",
        "Co-Working",
        "Shop",
        "Showroom",
        "Industrial Building",
        "Industrial Shed",
        "Godown/Warehouse",
        "Other business",
      ],
      "Price Range": ["Under 50K", "50K-1L", "1L-5L", "5L-10L", "Above 10L"],
    },
  },
  Services: {
    searchPlaceholder: "Search for services, providers, or categories",
    categories: ["All Services", "Home Services", "Professional Services"],
    filters: {
      "Service Type": [
        "Plumbing",
        "Electrical",
        "Cleaning",
        "Carpentry",
        "Painting",
        "Gardening",
        "Appliance Repair",
        "Other Services",
      ],
      "Price Range": ["Under 500", "500-1000", "1000-2500", "2500-5000", "Above 5000"],
      "Availability": ["Available Now", "Within 24 hours", "Within 3 days", "Flexible"],
    },
  },
};

const DynamicFilterBar = ({ activeTab, themeColor = "#E34F4F", onSearchResults }) => {
  const config = FILTER_CONFIGS[activeTab] || FILTER_CONFIGS["Real Estate"];
  const [expandedFilters, setExpandedFilters] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    config.categories[0]
  );
  const [selectedFilters, setSelectedFilters] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const filterRefs = useRef({});
  const searchInputRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.values(filterRefs.current).forEach((ref) => {
        if (ref && !ref.contains(event.target)) {
          setExpandedFilters((prev) => ({
            ...prev,
            [Object.keys(prev).find((key) => prev[key])]: false,
          }));
        }
      });
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation for accessibility
  const handleKeyDown = (e, filterName) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFilter(filterName);
    }
  };

  const toggleFilter = (filterName) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const handleFilterSelect = (filterName, value) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };
      if (value === null) {
        delete newFilters[filterName];
      } else {
        newFilters[filterName] = value;
      }
      return newFilters;
    });
    setExpandedFilters((prev) => ({
      ...prev,
      [filterName]: false,
    }));
  };

  const handleSearch = async () => {
    if (!searchValue.trim() && Object.keys(selectedFilters).length === 0) {
      toast.warning("Please enter a search term or select filters");
      return;
    }

    setIsSearching(true);

    try {
      let results = [];

      if (activeTab === "Services") {
        // Search services
        const searchParams = new URLSearchParams();
        if (searchValue.trim()) searchParams.append('query', searchValue.trim());
        if (selectedFilters['Service Type']) searchParams.append('category', selectedFilters['Service Type']);
        if (selectedFilters['Price Range']) {
          const [min, max] = selectedFilters['Price Range'].split('-');
          if (min) searchParams.append('min_price', min);
          if (max) searchParams.append('max_price', max);
        }

        const response = await apiRequest(`/services/search?${searchParams.toString()}`, "GET");
        if (response.success) {
          results = response.services || [];
          toast.success(`Found ${results.length} services`);
        }
      } else if (activeTab === "Monositi") {
        // Search Monositi listings
        const searchParams = new URLSearchParams();
        if (searchValue.trim()) searchParams.append('q', searchValue.trim());
        if (selectedCategory && selectedCategory !== "all") {
          // Map display names back to category values
          const categoryMap = {
            "Commercial Space": "commercial",
            "Hostel & PG": "hostel_pg",
            "Land & Plot": "land_plot"
          };
          const categoryValue = categoryMap[selectedCategory] || selectedCategory.toLowerCase().replace(/\s+/g, '_');
          searchParams.append('category', categoryValue);
        }
        if (selectedFilters['Property Type']) {
          const typeMap = {
            "Commercial Space": "commercial",
            "Hostel & PG": "hostel_pg",
            "Land & Plot": "land_plot"
          };
          const typeValue = typeMap[selectedFilters['Property Type']] || selectedFilters['Property Type'].toLowerCase().replace(/\s+/g, '_');
          // Only set category if not already set from selectedCategory
          if (!selectedCategory || selectedCategory === "all" || !searchParams.has('category')) {
            searchParams.set('category', typeValue);
          }
        }
        if (selectedFilters['Price Range']) {
          const [min, max] = selectedFilters['Price Range'].split('-');
          if (min) searchParams.append('minPrice', min);
          if (max) searchParams.append('maxPrice', max);
        }
        if (selectedFilters['Verification']) {
          searchParams.append('verified', selectedFilters['Verification'] === 'Verified' ? 'true' : 'false');
        }

        // Use monositiApi for Monositi search
        const { monositiApi } = await import('../../utils/monositiApi');
        const response = await monositiApi.getPublicListings(Object.fromEntries(searchParams));
        if (response.success) {
          results = response.data || [];
          toast.success(`Found ${results.length} Monositi listings`);
        }
      } else if (activeTab === "Real Estate") {
        // Search Real Estate properties (Buy, Sell, Rent)
        const searchParams = new URLSearchParams();
        if (searchValue.trim()) searchParams.append('q', searchValue.trim());
        
        // Map category to sub_category
        if (selectedCategory && selectedCategory !== "all") {
          const categoryMap = {
            "Buy": "Buy",
            "Sell": "Buy", // Sell uses Buy sub_category for now
            "Rent": "Rent"
          };
          const subCategory = categoryMap[selectedCategory] || selectedCategory;
          searchParams.append('sub_category', subCategory);
        }
        
        if (selectedFilters['Property Type']) {
          searchParams.append('type', selectedFilters['Property Type'].toLowerCase());
        }
        
        if (selectedFilters['BHK Type']) {
          const bhk = selectedFilters['BHK Type'].split(' ')[0];
          searchParams.append('bedrooms', bhk);
        }
        
        if (selectedFilters['Price Range']) {
          const [min, max] = selectedFilters['Price Range'].split('-');
          if (min) searchParams.append('minPrice', min);
          if (max) searchParams.append('maxPrice', max);
        }

        const response = await apiRequest(`/properties/search?${searchParams.toString()}`, "GET");
        if (response.success) {
          results = response.properties || [];
          toast.success(`Found ${results.length} properties`);
        }
      } else {
        // Search properties (Buy, Rent, Commercial)
        const searchParams = new URLSearchParams();
        if (searchValue.trim()) searchParams.append('q', searchValue.trim());
        if (selectedCategory && selectedCategory !== "Full House") {
          searchParams.append('type', selectedCategory);
        }
        if (selectedFilters['BHK Type']) {
          // Extract number from BHK Type (e.g., "2 BHK" -> "2")
          const bhk = selectedFilters['BHK Type'].split(' ')[0];
          searchParams.append('bhk', bhk);
        }
        if (selectedFilters['Price Range']) {
          const [min, max] = selectedFilters['Price Range'].split('-');
          if (min) searchParams.append('minPrice', min);
          if (max) searchParams.append('maxPrice', max);
        }

        const response = await apiRequest(`/properties/search?${searchParams.toString()}`, "GET");
        if (response.success) {
          results = response.properties || [];
          toast.success(`Found ${results.length} properties`);
        }
      }

      setSearchResults(results);

      // Add to search history
      const searchEntry = {
        query: searchValue,
        filters: selectedFilters,
        category: selectedCategory,
        timestamp: new Date(),
        resultsCount: results.length
      };
      setSearchHistory(prev => [searchEntry, ...prev.slice(0, 4)]); // Keep last 5 searches

      // Call parent callback if provided
      if (onSearchResults) {
        onSearchResults(results, {
          query: searchValue,
          filters: selectedFilters,
          category: selectedCategory,
          tab: activeTab
        });
      }

    } catch (error) {
      console.error("Search error:", error);
      toast.error("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  // Handle Enter key press in search input
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // Clear search results
  const clearSearch = () => {
    setSearchValue("");
    setSelectedFilters({});
    setSearchResults([]);
    if (onSearchResults) {
      onSearchResults([], null);
    }
  };

  // Generate gradient for theme
  const gradientStyle = {
    background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}CC 100%)`,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-xl p-6 mx-auto max-w-7xl border border-gray-100"
      style={{ boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)" }}
    >
      {/* Search Bar Section */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        {/* Location */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2 text-sm font-semibold text-gray-600"
        >
          <span>in</span>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-700">
            {config.location || "Select Location"}
          </span>
        </motion.div>

        {/* Search Bar with Boxed Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex-1 relative"
        >
          <div
            className="flex items-center border border-gray-200 rounded-full px-4 py-3 bg-white shadow-inner focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-theme-primary transition-all duration-300"
          // style={{
          //   ...gradientStyle,
          //   boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
          // }}
          >
            <input
              ref={searchInputRef}
              type="text"
              placeholder={config.searchPlaceholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              className="flex-1 outline-none text-sm bg-transparent text-gray-800 placeholder-gray-400"
              aria-label={`Search for ${activeTab?.toLowerCase() || 'properties'}`}
              disabled={isSearching}
            />
            <motion.button
              onClick={handleSearch}
              disabled={isSearching}
              className="p-2 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: themeColor }}
              whileHover={{ scale: isSearching ? 1 : 1.1, backgroundColor: isSearching ? themeColor : `${themeColor}CC` }}
              whileTap={{ scale: isSearching ? 1 : 0.9 }}
              aria-label="Search"
            >
              {isSearching ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Search size={18} />
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Category Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="flex flex-wrap gap-3 mb-6"
      >
        {config.categories.map((category) => (
          <motion.button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === category
              ? "text-white shadow-lg"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
            whileTap={{ scale: 0.95 }}
            style={selectedCategory === category ? gradientStyle : {}}
            aria-pressed={selectedCategory === category}
          >
            {category}
          </motion.button>
        ))}
      </motion.div>

      {/* Dynamic Filters */}
      <div className="flex flex-wrap gap-4">
        {Object.entries(config.filters).map(([filterName, options]) => (
          <div
            key={filterName}
            className="relative"
            ref={(el) => (filterRefs.current[filterName] = el)}
          >
            <motion.button
              onClick={() => toggleFilter(filterName)}
              onKeyDown={(e) => handleKeyDown(e, filterName)}
              className="flex items-center gap-2 px-5 py-2 border border-gray-200 rounded-full text-sm font-medium bg-white hover:border-theme-primary hover:shadow-md transition-all duration-200"
              whileHover={{
                scale: 1.03,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
              whileTap={{ scale: 0.97 }}
              style={{ borderColor: themeColor }}
              aria-expanded={expandedFilters[filterName]}
              aria-haspopup="listbox"
            >
              <span>{filterName}</span>
              <motion.div
                animate={{ rotate: expandedFilters[filterName] ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {expandedFilters[filterName] && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-12 left-0 z-30 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 min-w-52"
                  style={{ boxShadow: "0 8px 20px rgba(0,0,0,0.12)" }}
                  role="listbox"
                >
                  <div className="space-y-1">
                    {options.map((option) => (
                      <motion.button
                        key={option}
                        onClick={() => handleFilterSelect(filterName, option)}
                        className={`w-full text-left px-4 py-2 text-sm rounded-md transition-all duration-200 ${selectedFilters[filterName] === option
                          ? "text-white"
                          : "text-gray-700 hover:bg-gray-100"
                          }`}
                        whileHover={{
                          scale: 1.02,
                          backgroundColor:
                            selectedFilters[filterName] === option
                              ? themeColor
                              : "#F5F5F5",
                        }}
                        whileTap={{ scale: 0.98 }}
                        style={
                          selectedFilters[filterName] === option
                            ? gradientStyle
                            : {}
                        }
                        role="option"
                        aria-selected={selectedFilters[filterName] === option}
                      >
                        {option}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {/* Additional Options for Buy tab */}
        {activeTab === "Buy" && config.additionalOptions && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="flex items-center gap-3"
          >
            {config.additionalOptions.map((option) => (
              <motion.button
                key={option}
                className="px-5 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-all duration-200"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                {option}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Selected Filters Display */}
      {Object.keys(selectedFilters).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6 pt-4 border-t border-gray-200"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-600">Selected:</span>
            {Object.entries(selectedFilters).map(([filterName, value]) => (
              <motion.span
                key={`${filterName}-${value}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-3 py-1 text-white rounded-full text-xs font-medium flex items-center gap-1"
                style={gradientStyle}
              >
                {filterName}: {value}
                <button
                  onClick={() => handleFilterSelect(filterName, null)}
                  className="ml-1 text-white hover:text-gray-200"
                  aria-label={`Remove ${filterName} filter`}
                >
                  ×
                </button>
              </motion.span>
            ))}
            <button
              onClick={clearSearch}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Clear all
            </button>
          </div>
        </motion.div>
      )}

      {/* Search Results Summary */}
      {searchResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6 pt-4 border-t border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">
                Found {searchResults.length} {activeTab?.toLowerCase() || 'results'}
              </span>
              {searchValue && (
                <span className="text-xs text-gray-500">
                  for "{searchValue}"
                </span>
              )}
            </div>
            <button
              onClick={clearSearch}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Clear results
            </button>
          </div>
        </motion.div>
      )}

      {/* Search History */}
      {searchHistory.length > 0 && !searchValue && Object.keys(selectedFilters).length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6 pt-4 border-t border-gray-200"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-gray-600">Recent searches:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchHistory.slice(0, 3).map((search, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setSearchValue(search.query);
                  setSelectedFilters(search.filters);
                  setSelectedCategory(search.category);
                }}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {search.query || 'Filter search'} ({search.resultsCount} results)
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DynamicFilterBar;
