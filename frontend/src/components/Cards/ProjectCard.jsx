import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Building2, Calendar, CheckCircle, Ruler } from "lucide-react";

const ProjectCard = ({ project }) => {
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

  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-2xl hover:border-gray-200 transition-all duration-300 flex flex-col h-full group">
      {/* Project Image */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Premium overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 opacity-60"></div>

        <img
          src={
            project.images?.[0] ||
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
          }
          alt={project.project_name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
          }}
        />

        {/* Luxury corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-transparent rounded-bl-full z-10"></div>

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
          {project.monositi_verified && (
            <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl border border-emerald-400/30 flex items-center gap-1 backdrop-blur-sm">
              <CheckCircle className="w-3.5 h-3.5" />
              Verified
            </span>
          )}
          {project.status === "upcoming" && (
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl border border-amber-400/30">
              🚀 Upcoming
            </span>
          )}
        </div>

        {/* Price badge on image */}
        {(project.price_range?.min ||
          project.price_range?.max ||
          project.starting_price) && (
          <div className="absolute bottom-3 left-3 right-3 z-20">
            <div className="bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-2xl border border-white/20">
              <p className="text-[#f73c56] font-black text-xl tracking-tight">
                {project.price_range?.min
                  ? project.price_range.max
                    ? `${formatPrice(project.price_range.min)} - ${formatPrice(
                        project.price_range.max
                      )}`
                    : formatPrice(project.price_range.min)
                  : project.starting_price
                  ? formatPrice(project.starting_price)
                  : project.price_range}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Project Details */}
      <div className="p-6 flex flex-col flex-grow bg-gradient-to-b from-white to-gray-50/30">
        <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2 mb-3">
          {project.project_name}
        </h3>

        {(project.builder_name || project.builder?.name) && (
          <div className="flex items-center gap-2 mb-3 bg-red-50/80 px-3 py-2 rounded-lg border border-red-100">
            <Building2 className="w-4 h-4 text-[#f73c56]" />
            <p className="text-sm text-[#f73c56] font-bold">
              by {project.builder_name || project.builder?.name}
            </p>
          </div>
        )}

        {project.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        )}

        <div className="text-sm text-gray-600 flex items-start mb-4 bg-gray-50/80 px-3 py-2 rounded-lg">
          <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-[#f73c56]" />
          <span className="line-clamp-2 font-medium">
            {project.location?.address && `${project.location.address}, `}
            {project.location?.city}, {project.location?.state}
          </span>
        </div>

        {/* Project Specs */}
        <div className="space-y-2.5 mb-4 pt-4 border-t-2 border-gray-100">
          {project.expected_launch_date && (
            <div className="flex items-center gap-3 text-sm text-gray-700 bg-white px-3 py-2 rounded-lg shadow-sm">
              <div className="p-1.5 rounded-lg bg-red-100">
                <Calendar className="w-4 h-4 text-[#f73c56]" />
              </div>
              <span className="font-semibold">
                Launch:{" "}
                {new Date(project.expected_launch_date).toLocaleDateString()}
              </span>
            </div>
          )}

          {project.total_units && (
            <div className="flex items-center gap-3 text-sm text-gray-700 bg-white px-3 py-2 rounded-lg shadow-sm">
              <div className="p-1.5 rounded-lg bg-red-100">
                <Building2 className="w-4 h-4 text-[#f73c56]" />
              </div>
              <span className="font-semibold">{project.total_units} Units</span>
            </div>
          )}

          {project.unit_configurations &&
            project.unit_configurations.length > 0 && (
              <div className="flex items-center gap-3 text-sm text-gray-700 bg-white px-3 py-2 rounded-lg shadow-sm">
                <div className="p-1.5 rounded-lg bg-red-100">
                  <Ruler className="w-4 h-4 text-[#f73c56]" />
                </div>
                <span className="font-semibold">
                  {project.unit_configurations.map((uc) => uc.type).join(", ")}{" "}
                  Available
                </span>
              </div>
            )}
        </div>

        {/* View Details Button */}
        <Link
          to={`/project/${project._id}`}
          className="mt-auto w-full text-center bg-gradient-to-r from-[#f73c56] to-[#e9334e] hover:from-[#e9334e] hover:to-[#d92d45] text-white py-3 px-4 rounded-xl transition-all duration-300 text-sm font-bold shadow-lg hover:shadow-xl border-2 border-white/20"
        >
          View Full Project →
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
