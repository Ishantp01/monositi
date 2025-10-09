import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

// Tab-specific filter configurations (unchanged)
const FILTER_CONFIGS = {
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
    },
    additionalOptions: ["New Builder Projects"],
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
    },
  },
};

const DynamicFilterBar = ({ activeTab, themeColor = "#E34F4F" }) => {
  const config = FILTER_CONFIGS[activeTab] || FILTER_CONFIGS.Buy;
  const [expandedFilters, setExpandedFilters] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    config.categories[0]
  );
  const [selectedFilters, setSelectedFilters] = useState({});
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
    setSelectedFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
    setExpandedFilters((prev) => ({
      ...prev,
      [filterName]: false,
    }));
  };

  const handleSearch = () => {
    console.log("Search:", {
      tab: activeTab,
      searchValue,
      selectedCategory,
      selectedFilters,
    });
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
              className="flex-1 outline-none text-sm bg-transparent text-gray-800 placeholder-gray-400"
              aria-label="Search for properties"
            />
            <motion.button
              onClick={handleSearch}
              className="p-2 rounded-full text-white"
              style={{ backgroundColor: themeColor }}
              whileHover={{ scale: 1.1, backgroundColor: `${themeColor}CC` }}
              whileTap={{ scale: 0.9 }}
              aria-label="Search"
            >
              <Search size={18} />
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
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedCategory === category
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
                        className={`w-full text-left px-4 py-2 text-sm rounded-md transition-all duration-200 ${
                          selectedFilters[filterName] === option
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
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-600">Selected:</span>
            {Object.entries(selectedFilters).map(([filterName, value]) => (
              <motion.span
                key={`${filterName}-${value}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-3 py-1 text-white rounded-full text-xs font-medium"
                style={gradientStyle}
              >
                {filterName}: {value}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DynamicFilterBar;
