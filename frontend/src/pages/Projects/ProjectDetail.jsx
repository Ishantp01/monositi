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
  Ruler,
  Users,
  ChevronLeft,
  ChevronRight,
  Download,
  Star,
  Loader2,
  Home,
  Award,
} from "lucide-react";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    if (id) {
      fetchProjectDetails();
    }
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const response = await buildersApi.getPublicProjectById(id);
      if (response.success) {
        setProject(response.data);
      } else {
        toast.error(response.message || "Project not found");
        navigate("/");
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
      toast.error("Error loading project details");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return "Price on request";
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lac`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    toast.success("Contact request submitted! We'll get back to you soon.");
    setContactForm({ name: "", email: "", phone: "", message: "" });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#f73c56]" />
            <p className="text-gray-600">Loading project details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <div className="text-center">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Project Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              The project you're looking for doesn't exist.
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

  const images = project.images || [];
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Hero Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-[#f73c56] transition-colors mb-4"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {project.project_name}
                  </h1>
                  {project.monositi_verified && (
                    <span className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                      project.status === "upcoming"
                        ? "bg-amber-100 text-amber-800"
                        : project.status === "ongoing"
                        ? "bg-blue-100 text-blue-800"
                        : project.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {project.status?.charAt(0).toUpperCase() +
                      project.status?.slice(1)}
                  </span>
                </div>
                {project.builder?.name && (
                  <Link
                    to={`/builder/${project.builder._id || project.builder}`}
                    className="text-[#f73c56] hover:underline font-medium mb-2 inline-block"
                  >
                    by {project.builder.name}
                  </Link>
                )}
                <div className="flex items-center gap-4 text-gray-600 mt-2">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {project.location?.city}, {project.location?.state}
                    </span>
                  </div>
                  {project.possession_date && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Possession:{" "}
                        {new Date(project.possession_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                {(project.price_range?.min || project.price_range?.max) && (
                  <div>
                    <p className="text-[#f73c56] font-bold text-2xl">
                      {project.price_range.min && project.price_range.max
                        ? `${formatPrice(
                            project.price_range.min
                          )} - ${formatPrice(project.price_range.max)}`
                        : project.price_range.min
                        ? formatPrice(project.price_range.min)
                        : formatPrice(project.price_range.max)}
                    </p>
                    <p className="text-xs text-gray-500">Price Range</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              {images.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="relative h-96 bg-gray-100">
                    <img
                      src={images[currentImageIndex]}
                      alt={`${project.project_name} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </div>
                  {images.length > 1 && (
                    <div className="p-4 grid grid-cols-4 gap-2">
                      {images.slice(0, 4).map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`relative h-20 rounded-lg overflow-hidden border-2 ${
                            currentImageIndex === index
                              ? "border-[#f73c56]"
                              : "border-transparent"
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-96 flex items-center justify-center">
                  <Building2 className="w-24 h-24 text-gray-300" />
                </div>
              )}

              {/* Description */}
              {project.description && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    About This Project
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {project.description}
                  </p>
                </div>
              )}

              {/* Project Specifications */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Project Specifications
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {project.project_type && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Project Type</p>
                      <p className="font-semibold text-gray-900 capitalize">
                        {project.project_type}
                      </p>
                    </div>
                  )}
                  {project.total_units > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Total Units</p>
                      <p className="font-semibold text-gray-900">
                        {project.total_units}
                      </p>
                    </div>
                  )}
                  {project.available_units !== undefined && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Available Units
                      </p>
                      <p className="font-semibold text-gray-900">
                        {project.available_units}
                      </p>
                    </div>
                  )}
                  {project.rera_number && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">RERA Number</p>
                      <p className="font-semibold text-gray-900">
                        {project.rera_number}
                      </p>
                    </div>
                  )}
                  {project.possession_date && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Possession Date
                      </p>
                      <p className="font-semibold text-gray-900">
                        {new Date(project.possession_date).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {project.status && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Status</p>
                      <p className="font-semibold text-gray-900 capitalize">
                        {project.status}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Unit Configurations */}
              {project.unit_configurations &&
                project.unit_configurations.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      Unit Configurations
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {project.unit_configurations.map((unit, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {unit.type}
                            </h3>
                            {unit.price && (
                              <p className="text-[#f73c56] font-bold">
                                {formatPrice(unit.price)}
                              </p>
                            )}
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            {unit.carpet_area && (
                              <div className="flex items-center gap-2">
                                <Ruler className="w-4 h-4" />
                                <span>{unit.carpet_area}</span>
                              </div>
                            )}
                            {unit.total_units > 0 && (
                              <div className="flex items-center gap-2">
                                <Home className="w-4 h-4" />
                                <span>
                                  {unit.available_units || unit.total_units} /
                                  {unit.total_units} Units Available
                                </span>
                              </div>
                            )}
                          </div>
                          {unit.floor_plan && (
                            <div className="mt-3">
                              <img
                                src={unit.floor_plan}
                                alt={`${unit.type} Floor Plan`}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Amenities */}
              {project.amenities && project.amenities.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Amenities
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {project.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Location */}
              {project.location && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Location
                  </h2>
                  <div className="space-y-2 text-gray-700">
                    {project.location.address && (
                      <p className="flex items-start gap-2">
                        <MapPin className="w-5 h-5 text-[#f73c56] mt-0.5 flex-shrink-0" />
                        <span>{project.location.address}</span>
                      </p>
                    )}
                    <p>
                      {project.location.city}, {project.location.state}
                      {project.location.pincode && ` - ${project.location.pincode}`}
                    </p>
                  </div>
                </div>
              )}

              {/* Documents */}
              {project.documents && project.documents.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Documents
                  </h2>
                  <div className="space-y-2">
                    {project.documents.map((doc, index) => (
                      <a
                        key={index}
                        href={doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Download className="w-5 h-5 text-[#f73c56]" />
                        <span className="text-gray-700">
                          Document {index + 1}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Form */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Get in Touch
                </h2>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={contactForm.name}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, name: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, email: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Your Phone"
                      value={contactForm.phone}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, phone: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Your Message"
                      value={contactForm.message}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          message: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#f73c56] text-white py-3 px-4 rounded-lg hover:bg-[#e9334e] transition-colors font-semibold"
                  >
                    Send Inquiry
                  </button>
                </form>
              </div>

              {/* Builder Info */}
              {project.builder && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Builder Information
                  </h3>
                  <div className="flex items-center gap-3 mb-4">
                    {project.builder.logo ? (
                      <img
                        src={project.builder.logo}
                        alt={project.builder.name}
                        className="w-16 h-16 rounded-lg object-contain"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <Link
                        to={`/builder/${project.builder._id || project.builder}`}
                        className="font-semibold text-gray-900 hover:text-[#f73c56] transition-colors"
                      >
                        {project.builder.name}
                      </Link>
                      {project.builder.monositi_verified && (
                        <div className="flex items-center gap-1 text-xs text-emerald-600 mt-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Verified Builder</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {project.builder.rating > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">
                        {project.builder.rating}/5
                      </span>
                    </div>
                  )}
                  {project.builder.contact_info?.phone && (
                    <a
                      href={`tel:${project.builder.contact_info.phone}`}
                      className="flex items-center gap-2 text-gray-700 hover:text-[#f73c56] transition-colors mb-2"
                    >
                      <Phone className="w-4 h-4" />
                      <span>{project.builder.contact_info.phone}</span>
                    </a>
                  )}
                  {project.builder.contact_info?.email && (
                    <a
                      href={`mailto:${project.builder.contact_info.email}`}
                      className="flex items-center gap-2 text-gray-700 hover:text-[#f73c56] transition-colors mb-2"
                    >
                      <Mail className="w-4 h-4" />
                      <span>{project.builder.contact_info.email}</span>
                    </a>
                  )}
                  {project.builder.website && (
                    <a
                      href={project.builder.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-700 hover:text-[#f73c56] transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      <span>Visit Website</span>
                    </a>
                  )}
                </div>
              )}

              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Facts
                </h3>
                <div className="space-y-3">
                  {project.total_units > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Units</span>
                      <span className="font-semibold text-gray-900">
                        {project.total_units}
                      </span>
                    </div>
                  )}
                  {project.available_units !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Available</span>
                      <span className="font-semibold text-gray-900">
                        {project.available_units}
                      </span>
                    </div>
                  )}
                  {project.rera_number && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">RERA</span>
                      <span className="font-semibold text-gray-900 text-xs">
                        {project.rera_number}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status</span>
                    <span className="font-semibold text-gray-900 capitalize">
                      {project.status}
                    </span>
                  </div>
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

export default ProjectDetail;

