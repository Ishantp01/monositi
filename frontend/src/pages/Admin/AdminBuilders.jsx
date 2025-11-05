import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/layout/NavBar";
import { toast } from "react-toastify";
import { buildersApi } from "../../utils/buildersApi";
import apiRequest from "../../utils/api";
import {
  Building2,
  Plus,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Loader2,
  Search,
  Filter,
  Link as LinkIcon,
} from "lucide-react";

const AdminBuilders = () => {
  const navigate = useNavigate();
  const [builders, setBuilders] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchBuilders();
    fetchProjects();
  }, []);

  const fetchBuilders = async () => {
    setLoading(true);
    try {
      const response = await buildersApi.getAllBuilders();
      if (response.success) {
        setBuilders(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching builders:", error);
      toast.error("Failed to fetch builders");
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await buildersApi.getAllProjects();
      if (response.success) {
        setProjects(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

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
        fetchProjects();
      } else {
        toast.error(response.message || "Failed to update project");
      }
    } catch (error) {
      console.error("Error verifying project:", error);
      toast.error("Failed to verify project");
    }
  };

  const filteredBuilders = builders.filter((builder) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "verified" && builder.monositi_verified) ||
      (filter === "unverified" && !builder.monositi_verified);

    const matchesSearch =
      searchTerm === "" ||
      builder.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      builder.description?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Builders & Projects Management
            </h1>
            <div className="flex gap-3">
              <Link
                to="/admin/builders/create-project"
                className="flex items-center gap-2 px-4 py-2 bg-[#f73c56] text-white rounded-lg hover:bg-[#e9334e] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Project
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search builders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent w-full md:w-64"
                  />
                </div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                >
                  <option value="all">All Builders</option>
                  <option value="verified">Verified Only</option>
                  <option value="unverified">Unverified Only</option>
                </select>
              </div>
              <div className="text-sm text-gray-500">
                Showing {filteredBuilders.length} of {builders.length} builders
              </div>
            </div>
          </div>

          {/* Builders List */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              All Builders
            </h2>
            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-[#f73c56] mx-auto" />
              </div>
            ) : filteredBuilders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBuilders.map((builder) => (
                  <div
                    key={builder._id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {builder.logo ? (
                          <img
                            src={builder.logo}
                            alt={builder.name}
                            className="w-12 h-12 rounded-lg object-contain"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {builder.name}
                          </h4>
                          {builder.monositi_verified && (
                            <span className="text-xs text-emerald-600 font-medium">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {builder.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        {builder.total_projects_completed || 0} Projects
                      </span>
                      <Link
                        to={`/admin/builders/${builder._id}`}
                        className="text-[#f73c56] hover:underline flex items-center gap-1"
                      >
                        View <LinkIcon className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No builders found</p>
              </div>
            )}
          </div>

          {/* Projects List */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              All Projects
            </h2>
            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-[#f73c56] mx-auto" />
              </div>
            ) : projects.length > 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                          Project Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                          Builder
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                          Verified
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {projects.map((project) => (
                        <tr key={project._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">
                              {project.project_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {project.location?.city}, {project.location?.state}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {project.builder?.name || "N/A"}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded ${
                                project.status === "upcoming"
                                  ? "bg-amber-100 text-amber-800"
                                  : project.status === "ongoing"
                                  ? "bg-blue-100 text-blue-800"
                                  : project.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {project.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {project.monositi_verified ? (
                              <CheckCircle className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-gray-400" />
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  handleVerifyProject(
                                    project._id,
                                    !project.monositi_verified
                                  )
                                }
                                className="text-[#f73c56] hover:text-[#e9334e]"
                                title={
                                  project.monositi_verified
                                    ? "Unverify"
                                    : "Verify"
                                }
                              >
                                {project.monositi_verified ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No projects found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminBuilders;

