import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/NavBar";
import Footer from "../../components/layout/Footer";
import { buildersApi } from "../../utils/buildersApi";
import { toast } from "react-toastify";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  CheckCircle,
  Calendar,
  Star,
  Loader2,
  ChevronLeft,
  ArrowRight,
} from "lucide-react";
import ProjectCard from "../../components/Cards/ProjectCard";

const BuilderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [builder, setBuilder] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBuilderProjects = async () => {
    try {
      const response = await buildersApi.getPublicProjects({});
      if (response.success) {
        // Filter projects by builder ID
        const builderProjects = (response.data || []).filter(
          (project) => project.builder?._id === id || project.builder === id
        );
        setProjects(builderProjects);
      }
    } catch (error) {
      console.error("Error fetching builder projects:", error);
    }
  };

  const fetchBuilderDetails = async () => {
    try {
      setLoading(true);
      const response = await buildersApi.getPublicBuilderById(id);
      if (response.success) {
        setBuilder(response.data);
        // If builder response includes projects, use them
        if (response.data.projects && Array.isArray(response.data.projects)) {
          setProjects(response.data.projects);
        } else {
          // Fetch projects separately if not included in builder response
          await fetchBuilderProjects();
        }
      } else {
        toast.error("Builder not found");
        navigate("/");
      }
    } catch (error) {
      console.error("Error fetching builder details:", error);
      toast.error("Error loading builder details");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBuilderDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#f73c56]" />
            <p className="text-gray-600">Loading builder details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!builder) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <div className="text-center">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Builder Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              The builder you're looking for doesn't exist.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#f73c56] text-white rounded-lg hover:bg-[#e9334e] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Go Back Home
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Builder Header */}
        <div className="bg-gradient-to-r from-[#f73c56] to-[#e9334e] text-white">
          <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Builder Logo */}
              <div className="w-32 h-32 bg-white rounded-xl p-4 flex items-center justify-center shadow-lg">
                {builder.logo ? (
                  <img
                    src={builder.logo}
                    alt={builder.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Building2 className="w-16 h-16 text-[#f73c56]" />
                )}
              </div>

              {/* Builder Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{builder.name}</h1>
                  {builder.monositi_verified && (
                    <span className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" />
                      Verified
                    </span>
                  )}
                </div>
                {builder.description && (
                  <p className="text-white/90 text-lg mb-4">
                    {builder.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-4 text-sm">
                  {builder.founded_year && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Founded {builder.founded_year}</span>
                    </div>
                  )}
                  {builder.total_projects_completed > 0 && (
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span>{builder.total_projects_completed} Projects</span>
                    </div>
                  )}
                  {builder.rating && (
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{builder.rating}/5</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              {(builder.contact_info?.phone ||
                builder.contact_info?.email ||
                builder.website) && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Contact Information
                  </h2>
                  <div className="space-y-3">
                    {builder.contact_info?.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-[#f73c56]" />
                        <a
                          href={`tel:${builder.contact_info.phone}`}
                          className="text-gray-700 hover:text-[#f73c56] transition-colors"
                        >
                          {builder.contact_info.phone}
                        </a>
                      </div>
                    )}
                    {builder.contact_info?.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-[#f73c56]" />
                        <a
                          href={`mailto:${builder.contact_info.email}`}
                          className="text-gray-700 hover:text-[#f73c56] transition-colors"
                        >
                          {builder.contact_info.email}
                        </a>
                      </div>
                    )}
                    {builder.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-[#f73c56]" />
                        <a
                          href={builder.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 hover:text-[#f73c56] transition-colors"
                        >
                          {builder.website}
                        </a>
                      </div>
                    )}
                    {builder.contact_info?.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-[#f73c56] mt-1" />
                        <span className="text-gray-700">
                          {builder.contact_info.address}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {builder.certifications && builder.certifications.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Certifications
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {builder.certifications.map((cert, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg border border-blue-200 font-medium"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Projects ({projects.length})
                </h2>
                {projects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((project) => (
                      <ProjectCard key={project._id} project={project} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                    <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      No projects available for this builder yet.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Projects</span>
                    <span className="font-semibold text-gray-900">
                      {projects.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Verified</span>
                    <span className="font-semibold text-gray-900">
                      {builder.monositi_verified ? "Yes" : "No"}
                    </span>
                  </div>
                  {builder.founded_year && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Experience</span>
                      <span className="font-semibold text-gray-900">
                        {new Date().getFullYear() - builder.founded_year} years
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BuilderDetail;

