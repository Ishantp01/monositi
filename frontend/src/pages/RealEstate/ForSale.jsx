import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/NavBar";
import Footer from "../../components/layout/Footer";
import DynamicFilterBar from "../../components/Tabs/DynamicFilterBar";
import UnifiedPropertyCard from "../../components/Cards/UnifiedPropertyCard";
import BuilderCard from "../../components/Cards/BuilderCard";
import ProjectCard from "../../components/Cards/ProjectCard";
import Banner from "../../components/common/Banner";
import { propertyApi } from "../../utils/propertyApi";
import { buildersApi } from "../../utils/buildersApi";
import { Loader2, MapPin } from "lucide-react";
import { toast } from "react-toastify";

const ForSale = () => {
  const [properties, setProperties] = useState([]);
  const [builders, setBuilders] = useState([]);
  const [upcomingProjects, setUpcomingProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ sub_category: 'Buy' });
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch properties for sale
      const propertiesResponse = await propertyApi.searchProperties({
        sub_category: 'Buy',
        limit: 20
      });

      // Fetch builders
      const buildersResponse = await buildersApi.getPublicBuilders({ limit: 6 });

      // Fetch upcoming projects
      const projectsResponse = await buildersApi.getUpcomingProjects({ limit: 6 });

      if (propertiesResponse.success) {
        setProperties(propertiesResponse.properties || []);
      }

      if (buildersResponse.success) {
        setBuilders(buildersResponse.data || []);
      }

      if (projectsResponse.success) {
        setUpcomingProjects(projectsResponse.data || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchResults = (results, searchParams) => {
    if (results && results.length > 0) {
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const transformProperties = (apiProperties) => {
    return apiProperties.map(property => ({
      _id: property._id,
      name: property.name,
      title: property.name || `${property.type} Property in ${property.city}`,
      price: property.price,
      propertyType: property.type,
      type: property.type,
      address: property.address,
      city: property.city,
      state: property.state,
      photos: property.property_features?.images || [],
      images: property.property_features?.images || [],
      bedrooms: property.property_features?.units || 0,
      bathrooms: Math.ceil((property.property_features?.units || 1) / 2),
      area: property.property_features?.size || 0,
      size: property.property_features?.size || 0,
      isVerified: property.verification_status === 'verified',
      monositi_verified: property.verification_status === 'verified',
      isFeatured: property.isFeatured || false,
      sub_category: property.sub_category || 'Buy'
    }));
  };

  const displayProperties = searchResults.length > 0 
    ? transformProperties(searchResults) 
    : transformProperties(properties);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Properties for Sale
            </h1>
            <p className="text-gray-600">
              Discover verified properties available for purchase
            </p>
          </div>

          {/* Dynamic Filter Bar */}
          <div className="mb-8">
            <DynamicFilterBar
              activeTab="Real Estate"
              themeColor="#f73c56"
              onSearchResults={handleSearchResults}
            />
          </div>

          {/* Banner */}
          <div className="mb-8">
            <Banner 
              title="Find Your Dream Property"
              subtitle="Explore our verified listings"
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-[#f73c56] mx-auto mb-4" />
                <p className="text-gray-600">Loading properties...</p>
              </div>
            </div>
          ) : (
            <>
              {/* 1. Builders Section */}
              {builders.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Verified Builders</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {builders.map((builder) => (
                      <BuilderCard key={builder._id} builder={builder} />
                    ))}
                  </div>
                </section>
              )}

              {/* 2. Properties for Sale Section */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Properties for Sale</h2>
                {displayProperties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayProperties.map((property) => (
                      <div key={property._id} className="flex">
                        <UnifiedPropertyCard property={property} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Found</h3>
                    <p className="text-gray-600">
                      {searchResults.length === 0 && properties.length === 0
                        ? "No properties available at the moment."
                        : "Try adjusting your search filters to see more results."
                      }
                    </p>
                  </div>
                )}
              </section>

              {/* 3. Upcoming Projects Section */}
              {upcomingProjects.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Projects</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingProjects.map((project) => (
                      <ProjectCard key={project._id} project={project} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ForSale;

