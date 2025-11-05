import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Building2, Calendar, CheckCircle, Ruler } from "lucide-react";

const ProjectCard = ({ project }) => {
  const formatPrice = (price) => {
    if (!price) return 'Price on request';
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lac`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300 flex flex-col h-full">
      {/* Project Image */}
      <div className="relative h-56 overflow-hidden bg-gray-100">
        <img
          src={project.images?.[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'}
          alt={project.project_name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
          }}
        />
        
        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {project.monositi_verified && (
            <span className="bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1.5 rounded-full shadow-md flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Verified
            </span>
          )}
          {project.status === 'upcoming' && (
            <span className="bg-amber-600 text-white text-xs font-semibold px-2.5 py-1.5 rounded-full shadow-md">
              Upcoming
            </span>
          )}
        </div>
      </div>

      {/* Project Details */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2 flex-1">
            {project.project_name}
          </h3>
        </div>

        {(project.builder_name || project.builder?.name) && (
          <p className="text-sm text-[#f73c56] font-medium mb-3">
            by {project.builder_name || project.builder?.name}
          </p>
        )}

        {project.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        )}

        <div className="text-sm text-gray-600 flex items-start mb-4">
          <MapPin className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0 text-gray-400" />
          <span className="line-clamp-2">
            {project.location?.address && `${project.location.address}, `}
            {project.location?.city}, {project.location?.state}
          </span>
        </div>

        {/* Project Specs */}
        <div className="space-y-2 mb-4 pt-3 border-t border-gray-100">
          {project.expected_launch_date && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>Launch: {new Date(project.expected_launch_date).toLocaleDateString()}</span>
            </div>
          )}
          
          {project.total_units && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Building2 className="w-4 h-4 text-gray-400" />
              <span>{project.total_units} Units</span>
            </div>
          )}

          {project.unit_configurations && project.unit_configurations.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Ruler className="w-4 h-4 text-gray-400" />
              <span>
                {project.unit_configurations.map(uc => uc.type).join(', ')} Available
              </span>
            </div>
          )}
        </div>

        {/* Price */}
        {(project.price_range?.min || project.price_range?.max || project.starting_price) && (
          <div className="mb-4 pt-3 border-t border-gray-100">
            <p className="text-[#f73c56] font-bold text-lg">
              {project.price_range?.min 
                ? (project.price_range.max 
                    ? `${formatPrice(project.price_range.min)} - ${formatPrice(project.price_range.max)}`
                    : formatPrice(project.price_range.min))
                : project.starting_price 
                  ? formatPrice(project.starting_price)
                  : project.price_range}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {project.price_range?.min ? 'Price Range' : 'Starting Price'}
            </p>
          </div>
        )}

        {/* View Details Button */}
        <Link
          to={`/project/${project._id}`}
          className="mt-auto w-full text-center bg-[#f73c56] text-white py-2.5 px-4 rounded-lg hover:bg-[#e9334e] transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
        >
          View Project
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;

