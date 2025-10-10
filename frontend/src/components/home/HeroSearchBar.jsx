import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Building, Home, Filter } from "lucide-react";
import { useDispatch } from "react-redux";
import { setFilters } from "../../redux/slices/propertySlice";

const propertyTypes = [
  { id: "all", label: "All Properties" },
  { id: "pg", label: "PG/Hostel" },
  { id: "flat", label: "Flats & Apartments" },
  { id: "commercial", label: "Commercial" },
  { id: "villa", label: "Villas & Houses" },
];

const HeroSearchBar = () => {
  const [activeTab, setActiveTab] = useState("buy");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [showPropertyTypeDropdown, setShowPropertyTypeDropdown] =
    useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSearch = () => {
    // Set filters in Redux store
    dispatch(
      setFilters({
        type: activeTab,
        location: location,
        propertyType: propertyType,
      })
    );

    // Navigate to properties page with query params
    navigate(
      `/properties?type=${activeTab}&location=${encodeURIComponent(
        location
      )}&propertyType=${propertyType}`
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 -mt-20 relative z-10">
      <div className="bg-white rounded-xl shadow-xl p-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {["buy", "rent", "pg", "commercial"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Search Inputs */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Location Input */}
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <MapPin size={18} />
            </div>
            <input
              type="text"
              placeholder="Enter location, city, or area"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Property Type Dropdown */}
          <div className="relative">
            <button
              onClick={() =>
                setShowPropertyTypeDropdown(!showPropertyTypeDropdown)
              }
              className="w-full md:w-48 flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white"
            >
              <div className="flex items-center">
                <Building size={18} className="text-gray-400 mr-2" />
                <span>
                  {propertyTypes.find((type) => type.id === propertyType)
                    ?.label || "Property Type"}
                </span>
              </div>
              <Filter size={16} className="text-gray-400" />
            </button>

            {showPropertyTypeDropdown && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                {propertyTypes.map((type) => (
                  <div
                    key={type.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setPropertyType(type.id);
                      setShowPropertyTypeDropdown(false);
                    }}
                  >
                    {type.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center justify-center transition-colors"
          >
            <Search size={18} className="mr-2" />
            <span>Search</span>
          </button>
        </div>

        {/* Quick Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-gray-500 mr-2 self-center">
            Popular:
          </span>
          {[
            "Apartments",
            "PG near me",
            "Furnished",
            "Pet Friendly",
            "New Launch",
          ].map((filter) => (
            <button
              key={filter}
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSearchBar;
