import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/layout/NavBar";
import { toast } from "react-toastify";
import { buildersApi } from "../../utils/buildersApi";
import apiRequest from "../../utils/api";
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
  Edit3,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  X,
  Award,
} from "lucide-react";
import ProjectCard from "../../components/Cards/ProjectCard";

const AdminBuilderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [builder, setBuilder] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchBuilderDetails();
      fetchBuilderProjects();
    }
  }, [id]);

  const fetchBuilderDetails = async () => {
    try {
      setLoading(true);
      const response = await buildersApi.getAllBuilders();
      if (response.success) {
        const foundBuilder = response.data.find((b) => b._id === id);
        if (foundBuilder) {
          setBuilder(foundBuilder);
        } else {
          toast.error("Builder not found");
          navigate("/admin");
        }
      } else {
        toast.error("Failed to fetch builder");
        navigate("/admin");
      }
    } catch (error) {
      console.error("Error fetching builder details:", error);
      toast.error("Error loading builder details");
      navigate("/admin");
    } finally {
      setLoading(false);
    }
  };

  const fetchBuilderProjects = async () => {
    try {
      const response = await buildersApi.getBuilderProjects(id);
      if (response.success) {
        setProjects(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching builder projects:", error);
    }
  };

  const handleVerifyBuilder = async (verify) => {
    try {
      const response = await apiRequest(`/builders/${id}/verify`, "PATCH", {
        verified: verify,
      });
      if (response.success) {
        toast.success(verify ? "Builder verified" : "Builder unverified");
        fetchBuilderDetails();
      } else {
        toast.error(response.message || "Failed to update builder");
      }
    } catch (error) {
      console.error("Error verifying builder:", error);
      toast.error("Failed to verify builder");
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      const response = await apiRequest(`/builders/projects/${projectId}`, "DELETE");
      if (response.success) {
        toast.success("Project deleted successfully");
        fetchBuilderProjects();
      } else {
        toast.error(response.message || "Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

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
              to="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#f73c56] text-white rounded-lg hover:bg-[#e9334e] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Admin
            </Link>
          </div>
        </div>
      </>
    );
  }

  const handleVerifyProject = async (projectId, verify) => {
    try {
      const response = await apiRequest(
        `/builders/projects/${projectId}/verify`,
        "PATCH",
        {
          verified: verify,
        }
      );
      if (response.success) {
        toast.success(verify ? "Project verified" : "Project unverified");
        fetchBuilderProjects();
      } else {
        toast.error(response.message || "Failed to update project");
      }
    } catch (error) {
      console.error("Error verifying project:", error);
      toast.error("Failed to verify project");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigate("/admin")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Admin
              </button>
              <div className="flex gap-3">
                <Link
                  to={`/admin/builders/create-project?builder=${id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-[#f73c56] text-white rounded-lg hover:bg-[#e9334e] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Project
                </Link>
                <button
                  onClick={() => handleVerifyBuilder(!builder.monositi_verified)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    builder.monositi_verified
                      ? "bg-yellow-500 text-white hover:bg-yellow-600"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                >
                  {builder.monositi_verified ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      Unverify
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Verify
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Builder Logo */}
              <div className="w-24 h-24 bg-gray-100 rounded-xl p-4 flex items-center justify-center">
                {builder.logo ? (
                  <img
                    src={builder.logo}
                    alt={builder.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Building2 className="w-12 h-12 text-gray-400" />
                )}
              </div>

              {/* Builder Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {builder.name}
                  </h1>
                  {builder.monositi_verified && (
                    <span className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
                {builder.description && (
                  <p className="text-gray-700 mb-3">{builder.description}</p>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
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
                  {builder.rating > 0 && (
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{builder.rating}/5</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                        <span className="text-gray-700">
                          {builder.contact_info.phone}
                        </span>
                      </div>
                    )}
                    {builder.contact_info?.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-[#f73c56]" />
                        <span className="text-gray-700">
                          {builder.contact_info.email}
                        </span>
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
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Projects ({projects.length})
                  </h2>
                </div>
                {loading ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-[#f73c56] mx-auto" />
                  </div>
                ) : projects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((project) => (
                      <div key={project._id} className="relative">
                        <ProjectCard project={project} />
                        <div className="absolute top-2 right-2 flex gap-2">
                          <button
                            onClick={() =>
                              handleVerifyProject(project._id, !project.monositi_verified)
                            }
                            className={`p-2 rounded-full ${
                              project.monositi_verified
                                ? "bg-yellow-500 text-white hover:bg-yellow-600"
                                : "bg-emerald-600 text-white hover:bg-emerald-700"
                            } transition-colors`}
                            title={
                              project.monositi_verified ? "Unverify" : "Verify"
                            }
                          >
                            {project.monositi_verified ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project._id)}
                            className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                    <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      No projects found for this builder.
                    </p>
                    <Link
                      to={`/admin/builders/create-project?builder=${id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#f73c56] text-white rounded-lg hover:bg-[#e9334e] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Create First Project
                    </Link>
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

              {/* Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Actions
                </h3>
                <div className="space-y-2">
                  <Link
                    to={`/admin/builders/create-project?builder=${id}`}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#f73c56] text-white rounded-lg hover:bg-[#e9334e] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Project
                  </Link>
                  <Link
                    to={`/builder/${id}`}
                    target="_blank"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-[#f73c56] text-[#f73c56] rounded-lg hover:bg-[#f73c56]/5 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View Public Page
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminBuilderDetail;

