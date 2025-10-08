// src/components/sections/PgHotel.js
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GradientHeading from "../GradientHeading";
import OutlineButton from "../MoreButton";
import { propertyApi } from "../../utils/propertyApi";
import uparrow from "../../assets/Rent/upload.png";
import downarrow from "../../assets/Rent/down-arrow.png";

const MONOSITI_FILTER_SECTIONS = {
  Category: ["PG", "Hostel", "Flat", "Shared Room"],
  "Gender Preference": ["Boys", "Girls", "Co-ed", "Any"],
};

const DEFAULT_POSTED_BY = [
  "Ravindra",
  "Nikhil",
  "Siddharth",
  "Ramesh",
  "Suresh",
  "Amit",
];

const PgHotel = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    genderPreference: "",
    postedBy: [],
  });
  const [postedByOpen, setPostedByOpen] = useState(false);
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);
  const [filterSearch, setFilterSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Category");
  const [searchQuery, setSearchQuery] = useState("");
  const postedByRef = useRef(null);
  const modalRef = useRef(null);
  const themeColor = "#E34F4F"; // Match FilterBar theme

  useEffect(() => {
    fetchMonositiListings();
  }, [filters]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (postedByRef.current && !postedByRef.current.contains(event.target)) {
        setPostedByOpen(false);
      }
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setMoreFiltersOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchMonositiListings = async () => {
    try {
      setLoading(true);
      const response = await propertyApi.getAllMonositiListings(filters);
      if (response.success) {
        setListings(response.listings || []);
      } else {
        console.error("Failed to fetch listings:", response.message);
      }
    } catch (error) {
      console.error("Error fetching Monositi listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePostedByChange = (name) => {
    setFilters((prev) => ({
      ...prev,
      postedBy: prev.postedBy.includes(name)
        ? prev.postedBy.filter((p) => p !== name)
        : [...prev.postedBy, name],
    }));
  };

  const filteredSections = Object.keys(MONOSITI_FILTER_SECTIONS).filter(
    (section) => section.toLowerCase().includes(filterSearch.toLowerCase())
  );

  return (
    <div className="w-full max-w-[90%] mx-auto">
      <div className="w-full h-16"></div>
      <GradientHeading text={"Find Hostel, PG & Shared Accommodations"} />

      {/* Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <motion.div
            initial={{ width: "160px" }}
            whileHover={{ width: "300px" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex items-center bg-gray-50 rounded-full px-3 py-2 border border-gray-200 shadow-sm"
          >
            <span className="text-sm font-medium text-gray-600 mr-2">
              Monositi
            </span>
            <input
              type="text"
              placeholder="Enter Locality/Project"
              className="outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search by locality or project"
            />
          </motion.div>

          {/* Category Buttons */}
          <div className="flex flex-wrap gap-2">
            {MONOSITI_FILTER_SECTIONS.Category.map((category) => (
              <motion.button
                key={category}
                className={`px-4 py-2 border rounded-full text-sm w-full sm:w-auto ${
                  filters.category === category
                    ? `bg-red-100 text-${themeColor}`
                    : ""
                }`}
                style={{ borderColor: themeColor, color: themeColor }}
                onClick={() => handleFilterChange("category", category)}
                whileHover={{ backgroundColor: `${themeColor}33`, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                aria-label={`Filter by ${category}`}
              >
                {category}
              </motion.button>
            ))}
          </div>

          {/* Posted By */}
          <div className="relative" ref={postedByRef}>
            <motion.button
              className="px-4 py-2 border rounded-full text-sm flex items-center gap-2 w-full sm:w-auto justify-between"
              style={{ borderColor: themeColor, color: themeColor }}
              onClick={() => setPostedByOpen(!postedByOpen)}
              whileHover={{ backgroundColor: `${themeColor}33`, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              aria-expanded={postedByOpen}
              aria-controls="posted-by-dialog"
              aria-label="Toggle Posted By filter options"
            >
              Posted By
              <img
                src={postedByOpen ? uparrow : downarrow}
                alt={
                  postedByOpen
                    ? "Close Posted By options"
                    : "Open Posted By options"
                }
                className="w-4 h-4"
              />
            </motion.button>

            <AnimatePresence>
              {postedByOpen && (
                <motion.div
                  className="absolute top-12 left-0 z-20 bg-white rounded-lg shadow-lg p-4 border w-full sm:w-48"
                  style={{ borderColor: themeColor }}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  {DEFAULT_POSTED_BY.map((name) => (
                    <label
                      key={name}
                      className="flex items-center gap-2 text-sm text-gray-700 mb-2"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        style={{ accentColor: themeColor }}
                        checked={filters.postedBy.includes(name)}
                        onChange={() => handlePostedByChange(name)}
                        aria-label={`Select ${name}`}
                      />
                      {name}
                    </label>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* More Filters */}
          <motion.button
            className="px-4 py-2 border rounded-full text-sm flex items-center gap-2 w-full sm:w-auto"
            style={{ borderColor: themeColor, color: themeColor }}
            onClick={() => setMoreFiltersOpen(true)}
            whileHover={{ backgroundColor: `${themeColor}33`, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            aria-label="Open More Filters modal"
          >
            More Filters
            <img
              src={moreFiltersOpen ? uparrow : downarrow}
              alt={moreFiltersOpen ? "Close More Filters" : "Open More Filters"}
              className="w-4 h-4"
            />
          </motion.button>
        </div>

        {/* More Filters Modal */}
        <AnimatePresence>
          {moreFiltersOpen && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute inset-0 bg-black bg-opacity-30"
                onClick={() => setMoreFiltersOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <motion.div
                ref={modalRef}
                className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full h-[80vh] flex flex-col sm:flex-row overflow-hidden"
                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 50 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                {/* Sidebar: Filter Categories */}
                <div className="w-full sm:w-1/4 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
                  <input
                    type="text"
                    placeholder="Search filters..."
                    className="w-full p-2 border rounded-lg text-sm mb-4 focus:ring-2"
                    style={{
                      borderColor: themeColor,
                      outlineColor: themeColor,
                    }}
                    value={filterSearch}
                    onChange={(e) => setFilterSearch(e.target.value)}
                    aria-label="Search filter categories"
                  />
                  <div className="space-y-2">
                    {filteredSections.length > 0 ? (
                      filteredSections.map((section) => (
                        <motion.button
                          key={section}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                            selectedCategory === section
                              ? "bg-gradient-to-r from-gray-100 to-gray-200 font-semibold"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                          onClick={() => setSelectedCategory(section)}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          aria-label={`Select filter category: ${section}`}
                        >
                          {section}
                        </motion.button>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        No filter categories found
                      </p>
                    )}
                  </div>
                </div>

                {/* Main Content: Filter Options */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h2
                      className="text-lg sm:text-xl font-semibold"
                      style={{ color: themeColor }}
                    >
                      {selectedCategory}
                    </h2>
                    <button
                      className="text-gray-500 hover:text-red-500 text-lg"
                      onClick={() => setMoreFiltersOpen(false)}
                      aria-label="Close More Filters modal"
                    >
                      ✖
                    </button>
                  </div>

                  {selectedCategory && (
                    <motion.div
                      key={selectedCategory}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="flex flex-wrap gap-3"
                    >
                      {MONOSITI_FILTER_SECTIONS[selectedCategory].length > 0 ? (
                        selectedCategory === "Price Range" ? (
                          <div className="flex gap-3 w-full">
                            <input
                              type="number"
                              placeholder="Min"
                              className="border px-3 py-2 rounded-lg w-[48%] text-sm focus:ring-2"
                              style={{
                                borderColor: themeColor,
                                outlineColor: themeColor,
                              }}
                              value={filters.minPrice}
                              onChange={(e) =>
                                handleFilterChange("minPrice", e.target.value)
                              }
                              aria-label="Minimum price"
                            />
                            <input
                              type="number"
                              placeholder="Max"
                              className="border px-3 py-2 rounded-lg w-[48%] text-sm focus:ring-2"
                              style={{
                                borderColor: themeColor,
                                outlineColor: themeColor,
                              }}
                              value={filters.maxPrice}
                              onChange={(e) =>
                                handleFilterChange("maxPrice", e.target.value)
                              }
                              aria-label="Maximum price"
                            />
                          </div>
                        ) : (
                          MONOSITI_FILTER_SECTIONS[selectedCategory].map(
                            (opt) => (
                              <motion.label
                                key={opt}
                                className="flex items-center gap-2 text-sm w-full sm:w-auto"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 rounded focus:ring-2"
                                  style={{ accentColor: themeColor }}
                                  checked={
                                    selectedCategory === "Gender Preference"
                                      ? filters.genderPreference === opt
                                      : filters[
                                          selectedCategory.toLowerCase()
                                        ]?.includes(opt)
                                  }
                                  onChange={() =>
                                    selectedCategory === "Gender Preference"
                                      ? handleFilterChange(
                                          "genderPreference",
                                          opt
                                        )
                                      : handleFilterChange(
                                          selectedCategory.toLowerCase(),
                                          opt
                                        )
                                  }
                                  aria-label={`Select ${opt}`}
                                />
                                {opt}
                              </motion.label>
                            )
                          )
                        )
                      ) : (
                        <p className="text-sm text-gray-500">
                          No options available
                        </p>
                      )}
                    </motion.div>
                  )}

                  {/* Footer */}
                  <div className="mt-6 flex justify-end gap-4">
                    <motion.button
                      className="px-5 py-2 border rounded-full text-sm w-full sm:w-auto"
                      style={{ borderColor: themeColor, color: themeColor }}
                      onClick={() => setMoreFiltersOpen(false)}
                      whileHover={{
                        backgroundColor: `${themeColor}33`,
                        scale: 1.05,
                      }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Cancel filter changes"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      className="px-6 py-2 rounded-full text-sm text-white w-full sm:w-auto"
                      style={{ backgroundColor: themeColor }}
                      onClick={() => setMoreFiltersOpen(false)}
                      whileHover={{
                        backgroundColor: `${themeColor}cc`,
                        scale: 1.05,
                      }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Apply selected filters"
                    >
                      Apply Filters
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Listings */}
      <div className="my-8 md:my-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {loading ? (
          <div className="col-span-full text-center py-8 text-gray-600">
            Loading...
          </div>
        ) : listings.length > 0 ? (
          listings.map((listing) => (
            <motion.div
              key={listing._id}
              className="relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {listing.photos && listing.photos.length > 0 ? (
                <img
                  src={listing.photos[0]}
                  alt={listing.name || listing.title}
                  className="w-full h-56 object-cover"
                />
              ) : (
                <div className="w-full h-56 bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {listing.name || listing.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {listing.address}, {listing.city}
                </p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-lg font-bold text-theme-primary">
                    ₹{listing.price}
                  </span>
                  {listing.category && (
                    <span className="text-xs px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {listing.category}
                    </span>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {listing.genderPreference && (
                    <span className="bg-gray-100 px-2.5 py-1 rounded-full text-gray-700">
                      {listing.genderPreference}
                    </span>
                  )}
                  {listing.isFeatured && (
                    <span className="bg-yellow-100 px-2.5 py-1 rounded-full text-yellow-800">
                      Featured
                    </span>
                  )}
                  {listing.popular && !listing.isFeatured && (
                    <span className="bg-blue-100 px-2.5 py-1 rounded-full text-blue-800">
                      Popular
                    </span>
                  )}
                </div>
                {listing.facilities && listing.facilities.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    {listing.facilities.slice(0, 2).map((facility, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 px-2.5 py-1 rounded-full text-gray-700"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-600">
            No listings found matching your criteria.
          </div>
        )}
      </div>

      <div className="text-center">
        <OutlineButton link="/monositi" />
      </div>
    </div>
  );
};

export default PgHotel;