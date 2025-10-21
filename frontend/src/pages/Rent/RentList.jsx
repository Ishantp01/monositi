import React, { useState, useEffect } from "react";
import RentCard from "../../components/Cards/RentCard";
import Navbar from "../../components/layout/NavBar";
import Footer from "../../components/layout/Footer";
import { MapPinned, Loader2 } from "lucide-react";
import DynamicFilterBar from "../../components/Tabs/DynamicFilterBar";
import { propertyApi } from "../../utils/propertyApi";
import { toast } from "react-toastify";

const RentList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    sub_category: 'Rent',
    type: 'residential'
  });

  useEffect(() => {
    fetchRentProperties();
  }, [filters]);

  const fetchRentProperties = async () => {
    try {
      setLoading(true);
      const response = await propertyApi.searchProperties(filters);

      if (response.success) {
        setProperties(response.properties || []);
      } else {
        toast.error("Failed to load rental properties");
      }
    } catch (error) {
      console.error("Error fetching rent properties:", error);
      toast.error("Error loading properties");
    } finally {
      setLoading(false);
    }
  };

  // Transform API properties to match RentCard component format
  const transformPropertyForRentCard = (property) => ({
    image: property.property_features?.images?.[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
    title: property.name || `${property.type} Property in ${property.city}`,
    subtitle: property.address,
    description: property.description || `A beautiful ${property.type} property available for rent in ${property.city}, ${property.state}`,
    price: `₹${property.price.toLocaleString()}/month`,
    pricePer: property.property_features?.size ? `₹${Math.round(property.price / property.property_features.size)} per sqft` : "Price on request",
    ownerName: property.owner_id?.name || "Property Owner",
    since: new Date(property.createdAt).getFullYear().toString(),
    features: [
      { label: "Super Area", value: property.property_features?.size ? `${property.property_features.size} sqft` : "N/A" },
      { label: "Status", value: property.verification_status === 'verified' ? "Verified" : "Pending" },
      { label: "Transaction", value: property.sub_category },
      { label: "Type", value: property.type },
      { label: "Units", value: property.property_features?.units?.toString() || "1" },
      { label: "Location", value: `${property.city}, ${property.state}` },
    ],
    _id: property._id,
    contactNumber: property.contactNumber,
    owner: property.owner_id
  });

  const rentData = properties.map(transformPropertyForRentCard);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Properties for Rent
            </h1>
            <p className="text-gray-600">
              Find the perfect rental property for your needs
            </p>
          </div>

          {/* Filter Bar */}
          <div className="mb-8">
            <DynamicFilterBar
              activeTab="Rent"
              onSearchResults={(results, searchData) => {
                if (results && results.length > 0) {
                  setProperties(results);
                } else if (searchData) {
                  // Update filters based on search data
                  setFilters(prev => ({
                    ...prev,
                    ...searchData.filters
                  }));
                }
              }}
            />
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-[#f73c56] mx-auto mb-4" />
                <p className="text-gray-600">Loading rental properties...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Properties Grid */}
              {rentData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rentData.map((property, index) => (
                    <RentCard key={property._id || index} {...property} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <MapPinned className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Rental Properties Found</h3>
                  <p className="text-gray-600">Try adjusting your filters to see more results.</p>
                </div>
              )}

              {/* Load More Button */}
              {rentData.length > 0 && (
                <div className="text-center mt-12">
                  <button
                    onClick={fetchRentProperties}
                    className="bg-[#f73c56] text-white px-8 py-3 rounded-lg hover:bg-[#e9334e] transition-colors"
                  >
                    Refresh Properties
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RentList;
