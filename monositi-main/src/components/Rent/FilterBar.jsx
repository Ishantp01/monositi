import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import uparrow from "../../assets/Rent/upload.png";
import downarrow from "../../assets/Rent/down-arrow.png";

const DEFAULT_POSTED_BY = [
  "Ravindra",
  "Nikhil",
  "Siddharth",
  "Ramesh",
  "Suresh",
  "Amit",
];

const DEFAULT_FILTER_SECTIONS = {
  "Sub Property Type": [
    "Multistorey Apartment",
    "Studio Apartment",
    "Builder Floor Apartment",
    "Penthouse",
    "Residential House",
    "Villa",
  ],
  "Sale Type": ["New", "Resale"],
  Ownership: [
    "Freehold",
    "Co-operative Society",
    "Leasehold",
    "Power Of Attorney",
  ],
  Furnishing: ["Furnished", "Semi-Furnished", "Unfurnished"],
  Amenities: [
    "Reserved Park",
    "Lift",
    "Piped Gas",
    "Power Back Up",
    "Park",
    "Club House",
    "Gymnasium",
    "Vaastu Compliant",
    "Swimming Pool",
    "Kids Play Area",
  ],
  "Photos and Videos": ["Photos", "Videos"],
  Facing: [
    "East",
    "North",
    "North-East",
    "South-East",
    "South",
    "South-West",
    "North-West",
    "West",
  ],
  Floor: ["Basement", "Ground", "1-4", "5-8", "9-12", "13-16", "16+"],
  Bathroom: ["1", "2", "3", "4", "5"],
  "Covered Area (sqft)": ["Min", "Max"],
  "Possession Status": ["Ready To Move", "Under Construction"],
};

// FilterBar Component
export const FilterBar = ({
  searchPlaceholder = "Enter Locality/Project",
  categories = ["1 BHK", "2 BHK", "3 BHK"],
  themeColor = "#E34F4F",
  postedByOptions = DEFAULT_POSTED_BY,
  filterSections = DEFAULT_FILTER_SECTIONS,
}) => {
  const [postedByOpen, setPostedByOpen] = useState(false);
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);
  const [filterSearch, setFilterSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    Object.keys(filterSections)[0]
  );
  const postedByRef = useRef(null);
  const modalRef = useRef(null);

  // Close dialogs when clicking outside
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

  // Filter sections based on search
  const filteredSections = Object.keys(filterSections).filter((section) =>
    section.toLowerCase().includes(filterSearch.toLowerCase())
  );

  return (
    <div className="bg-white">
      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3 p-4 mx-auto max-w-[90%] rounded-lg shadow-sm bg-white">
        {/* Search Input */}
        <motion.div
          initial={{ width: "160px" }}
          whileHover={{ width: "300px" }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="flex items-center bg-gray-50 rounded-full px-3 py-2 border border-gray-200 shadow-sm"
        >
          <span className="text-sm font-medium text-gray-600 mr-2">Buy</span>
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent w-full"
            aria-label="Search by locality or project"
          />
        </motion.div>

        {/* Category Buttons */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <motion.button
              key={category}
              className="px-4 py-2 border rounded-full text-sm w-full sm:w-auto"
              style={{ borderColor: themeColor, color: themeColor }}
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
                {postedByOptions.map((name) => (
                  <label
                    key={name}
                    className="flex items-center gap-2 text-sm text-gray-700 mb-2"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      style={{ accentColor: themeColor }}
                      aria-label={`Select ${name}`}
                    />
                    {name}
                  </label>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* <div className="relative" ref={postedByRef}>
          <button
            className="px-4 py-2 border rounded-full text-sm flex items-center gap-2 hover:bg-red-100 transition"
            style={{ borderColor: themeColor, color: themeColor }}
            onClick={() => setPostedByOpen(!postedByOpen)}
          >
            Posted By
            <img
              src={postedByOpen ? uparrow : downarrow}
              alt="toggle"
              className="w-4 h-4"
            />
          </button>

          <AnimatePresence>
            {postedByOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 6, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute top-12 right-0 bg-white shadow-lg rounded-lg border border-gray-200 w-60 z-50 p-3 flex flex-wrap gap-2"
              >
                {DEFAULT_POSTED_BY.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setActivePostedBy(opt)}
                    className={`px-4 py-1 rounded-full border text-sm transition ${
                      activePostedBy === opt
                        ? "bg-red-100 text-red-600 border-red-500"
                        : "hover:bg-gray-100 border-gray-300"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div> */}

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
              className="absolute inset-0"
              // style={{ backgroundColor: `${themeColor}4D` }} // 30% opacity
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
                    focusRingColor: themeColor,
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
                    {filterSections[selectedCategory].length > 0 ? (
                      selectedCategory === "Covered Area (sqft)" ? (
                        <div className="flex gap-3 w-full">
                          <input
                            type="number"
                            placeholder="Min"
                            className="border px-3 py-2 rounded-lg w-[48%] text-sm focus:ring-2"
                            style={{
                              borderColor: themeColor,
                              focusRingColor: themeColor,
                            }}
                            aria-label="Minimum covered area"
                          />
                          <input
                            type="number"
                            placeholder="Max"
                            className="border px-3 py-2 rounded-lg w-[48%] text-sm focus:ring-2"
                            style={{
                              borderColor: themeColor,
                              focusRingColor: themeColor,
                            }}
                            aria-label="Maximum covered area"
                          />
                        </div>
                      ) : (
                        filterSections[selectedCategory].map((opt) => (
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
                              style={{
                                accentColor: themeColor,
                                focusRingColor: themeColor,
                              }}
                              aria-label={`Select ${opt}`}
                            />
                            {opt}
                          </motion.label>
                        ))
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
  );
};
