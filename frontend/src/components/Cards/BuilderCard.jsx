import React from "react";
import { Link } from "react-router-dom";
import { Building2, CheckCircle, Star, Calendar } from "lucide-react";

const BuilderCard = ({ builder }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300 flex flex-col h-full">
      {/* Builder Logo/Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {builder.logo ? (
          <img
            src={builder.logo}
            alt={builder.name}
            className="w-full h-full object-contain p-4 bg-white"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#f73c56] to-[#e9334e] ${builder.logo ? 'hidden' : ''}`}>
          <Building2 className="w-16 h-16 text-white" />
        </div>
        
        {/* Verified Badge */}
        {builder.verified && (
          <div className="absolute top-3 right-3">
            <span className="bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1.5 rounded-full shadow-md flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Verified
            </span>
          </div>
        )}
      </div>

      {/* Builder Details */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
          {builder.name}
        </h3>

        {builder.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
            {builder.description}
          </p>
        )}

        {/* Builder Info */}
        <div className="space-y-2 mb-4 pt-3 border-t border-gray-100">
          {builder.founded_year && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>Founded: {builder.founded_year}</span>
            </div>
          )}
          
          {builder.total_projects_completed !== undefined && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Building2 className="w-4 h-4 text-gray-400" />
              <span>{builder.total_projects_completed} Projects Completed</span>
            </div>
          )}

          {builder.contact_info?.address && (
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <span className="line-clamp-2">{builder.contact_info.address}</span>
            </div>
          )}
        </div>

        {/* Certifications */}
        {builder.certifications && builder.certifications.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
              Certifications
            </p>
            <div className="flex flex-wrap gap-2">
              {builder.certifications.slice(0, 3).map((cert, index) => (
                <span
                  key={index}
                  className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md border border-blue-200"
                >
                  {cert}
                </span>
              ))}
              {builder.certifications.length > 3 && (
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">
                  +{builder.certifications.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* View Details Button */}
        <Link
          to={`/builder/${builder._id}`}
          className="mt-auto w-full text-center bg-[#f73c56] text-white py-2.5 px-4 rounded-lg hover:bg-[#e9334e] transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
        >
          View Builder
        </Link>
      </div>
    </div>
  );
};

export default BuilderCard;

