import React, { useState, useEffect } from "react";
import Navbar from "../../components/layout/NavBar";
import Footer from "../../components/layout/Footer";
import {
  Building,
  Loader2,
  MapPin,
  Home,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { buildersApi } from "../../utils/buildersApi";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await buildersApi.getPublicProjects({
        limit: 20,
      });

      if (response.success) {
        setProjects(response.data || []);
      } else {
        toast.error("Failed to load projects");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Error loading projects");
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
              <Building className="w-10 h-10 text-[#f73c56]" />
              <h1 className="text-4xl font-bold text-gray-900">
                Builder Projects
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Explore verified construction projects from trusted builders
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-[#f73c56] mx-auto mb-4" />
                <p className="text-gray-600">Loading projects...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Projects Banner Grid */}
              {projects.length > 0 ? (
                <div className="space-y-6">
                  {projects.map((project) => (
                    <ProjectBanner key={project._id} project={project} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Projects Found
                  </h3>
                  <p className="text-gray-600">
                    Check back later for new projects.
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

// Project Banner Component
const ProjectBanner = ({ project }) => {
  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lac`;
    }
    return `₹${price.toLocaleString()}`;
  };

  return (
    <Link
      to={`/project/${project._id}`}
      className="block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-gray-200"
    >
      <div className="flex flex-col lg:flex-row">
        {/* Large Image Section */}
        <div className="lg:w-1/2 h-80 lg:h-96 relative overflow-hidden group">
          <img
            src={
              project.images?.[0] ||
              "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200"
            }
            alt={project.project_name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />

          {/* Overlay Badge */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {project.monositi_verified && (
              <span className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-full shadow-lg">
                ✓ Verified
              </span>
            )}
            {project.status && (
              <span className="px-4 py-2 bg-[#f73c56] text-white text-sm font-semibold rounded-full shadow-lg capitalize">
                {project.status}
              </span>
            )}
          </div>

          {/* Image Gallery Indicator */}
          {project.images && project.images.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {project.images.length} Photos
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="lg:w-1/2 p-8 flex flex-col justify-between">
          <div>
            {/* Project Header */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                {project.project_name}
              </h2>

              {project.builder?.name && (
                <p className="text-gray-600 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  by{" "}
                  <span className="font-semibold text-[#f73c56]">
                    {project.builder.name}
                  </span>
                </p>
              )}
            </div>

            {/* Description */}
            {project.description && (
              <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                {project.description}
              </p>
            )}

            {/* Project Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {project.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#f73c56] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Location</p>
                    <p className="text-sm font-medium text-gray-900">
                      {project.location.city}, {project.location.state}
                    </p>
                  </div>
                </div>
              )}

              {project.project_type && (
                <div className="flex items-start gap-3">
                  <Home className="w-5 h-5 text-[#f73c56] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Type</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {project.project_type}
                    </p>
                  </div>
                </div>
              )}

              {project.completion_date && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#f73c56] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">
                      Completion
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(project.completion_date).toLocaleDateString(
                        "en-US",
                        { month: "short", year: "numeric" }
                      )}
                    </p>
                  </div>
                </div>
              )}

              {project.total_units && (
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-[#f73c56] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">
                      Total Units
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {project.total_units} Units
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Amenities */}
            {project.amenities && project.amenities.length > 0 && (
              <div className="mb-6">
                <p className="text-xs text-gray-500 uppercase mb-2">
                  Amenities
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.amenities.slice(0, 5).map((amenity, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                  {project.amenities.length > 5 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      +{project.amenities.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Price and CTA */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div>
              {project.price_range && (
                <>
                  <p className="text-xs text-gray-500 uppercase mb-1">
                    Starting From
                  </p>
                  <p className="text-2xl font-bold text-[#f73c56]">
                    {formatPrice(
                      project.price_range.min || project.price_range.max
                    )}
                  </p>
                </>
              )}
            </div>
            <button className="px-8 py-3 bg-[#f73c56] text-white rounded-lg hover:bg-[#e9334e] transition-colors font-semibold shadow-md hover:shadow-lg">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectsList;
