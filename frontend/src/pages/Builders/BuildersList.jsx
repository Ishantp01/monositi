import React, { useState, useEffect } from "react";
import Navbar from "../../components/layout/NavBar";
import Footer from "../../components/layout/Footer";
import { Building2, Loader2, MapPinned, Award, Briefcase } from "lucide-react";
import { buildersApi } from "../../utils/buildersApi";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const BuildersList = () => {
  const [builders, setBuilders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    limit: 20,
  });

  useEffect(() => {
    fetchBuilders();
  }, [filters]);

  const fetchBuilders = async () => {
    try {
      setLoading(true);
      const response = await buildersApi.getPublicBuilders(filters);

      if (response.success) {
        setBuilders(response.data || []);
      } else {
        toast.error("Failed to load builders");
      }
    } catch (error) {
      console.error("Error fetching builders:", error);
      toast.error("Error loading builders");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto max-w-7xl px-4 lg:px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="w-10 h-10 text-[#f73c56]" />
              <h1 className="text-4xl font-bold text-gray-900">
                Verified Builders
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Trusted builders with verified projects and quality construction
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-[#f73c56] mx-auto mb-4" />
                <p className="text-gray-600">Loading builders...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Builders Grid */}
              {builders.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {builders.map((builder) => (
                    <BuilderCard key={builder._id} builder={builder} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Builders Found
                  </h3>
                  <p className="text-gray-600">
                    Check back later for verified builders.
                  </p>
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

// Builder Card Component for List View
const BuilderCard = ({ builder }) => {
  return (
    <Link
      to={`/builder/${builder._id}`}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-200"
    >
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-1/3 h-64 md:h-auto">
          <img
            src={
              builder.logo ||
              builder.images?.[0] ||
              "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200"
            }
            alt={builder.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="md:w-2/3 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {builder.name}
                </h3>
                {builder.monositi_verified && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Award className="w-3 h-3 mr-1" />
                    Monositi Verified
                  </span>
                )}
              </div>
            </div>

            {builder.description && (
              <p className="text-gray-600 mb-4 line-clamp-2">
                {builder.description}
              </p>
            )}

            {/* Builder Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {builder.experience_years && (
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="w-4 h-4 text-[#f73c56]" />
                  <span className="text-gray-600">
                    {builder.experience_years}+ Years
                  </span>
                </div>
              )}

              {builder.location?.city && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPinned className="w-4 h-4 text-[#f73c56]" />
                  <span className="text-gray-600">
                    {builder.location.city}, {builder.location.state}
                  </span>
                </div>
              )}

              {builder.total_projects > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4 text-[#f73c56]" />
                  <span className="text-gray-600">
                    {builder.total_projects} Projects
                  </span>
                </div>
              )}
            </div>

            {/* Specializations */}
            {builder.specializations && builder.specializations.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {builder.specializations.slice(0, 4).map((spec, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {spec}
                  </span>
                ))}
                {builder.specializations.length > 4 && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    +{builder.specializations.length - 4} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* View Projects Button */}
          <div className="flex justify-end">
            <Link
              to={`/builder/${builder._id}`}
              className="inline-flex items-center px-6 py-2 bg-[#f73c56] text-white rounded-lg hover:bg-[#e9334e] transition-colors text-sm font-semibold"
            >
              View Projects
            </Link>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BuildersList;
