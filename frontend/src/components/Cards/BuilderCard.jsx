import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Building2, CheckCircle, Calendar, MapPin, TrendingUp, Award } from "lucide-react";

const BuilderCard = ({ builder }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-2xl hover:border-gray-200 transition-all duration-300 flex flex-col h-full group">
      {/* Builder Logo/Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
        )}
        
        {builder.logo && !imageError ? (
          <img
            src={builder.logo}
            alt={builder.name}
            loading="lazy"
            className={`w-full h-full object-contain p-8 bg-gradient-to-br from-white to-gray-50 transition-all duration-500 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#f73c56] via-purple-600 to-indigo-600">
            <Building2 className="w-24 h-24 text-white opacity-95 drop-shadow-2xl" />
          </div>
        )}
        
        {/* Luxury corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-transparent rounded-bl-full z-10"></div>
        
        {/* Premium gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Verified Badge */}
        {builder.verified && (
          <div className="absolute top-3 right-3 z-20">
            <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl border border-emerald-400/30 flex items-center gap-1.5 backdrop-blur-sm">
              <CheckCircle className="w-3.5 h-3.5" />
              Verified
            </span>
          </div>
        )}
      </div>

      {/* Builder Details */}
      <div className="p-6 flex flex-col flex-grow bg-gradient-to-b from-white to-gray-50/30">
        <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2">
          {builder.name}
        </h3>

        {builder.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {builder.description}
          </p>
        )}

        {/* Stats Grid with enhanced styling */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {builder.founded_year && (
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-blue-200 rounded-xl p-3 shadow-md">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-blue-600 rounded-lg">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-xs text-blue-600 font-bold uppercase tracking-wide">Founded</p>
              <p className="text-lg font-black text-blue-900">{builder.founded_year}</p>
            </div>
          )}
          
          {builder.total_projects_completed !== undefined && (
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-2 border-emerald-200 rounded-xl p-3 shadow-md">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-emerald-600 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-xs text-emerald-600 font-bold uppercase tracking-wide">Projects</p>
              <p className="text-lg font-black text-emerald-900">{builder.total_projects_completed}</p>
            </div>
          )}
        </div>

        {builder.contact_info?.address && (
          <div className="flex items-start gap-2 text-sm text-gray-600 mb-4 bg-gray-50/80 p-3 rounded-lg border border-gray-200">
            <MapPin className="w-4 h-4 text-[#f73c56] mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2 font-medium">{builder.contact_info.address}</span>
          </div>
        )}

        {/* Certifications with enhanced styling */}
        {builder.certifications && builder.certifications.length > 0 && (
          <div className="mb-4 pt-4 border-t-2 border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-amber-100 rounded-lg">
                <Award className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                Certifications
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {builder.certifications.slice(0, 2).map((cert, index) => (
                <span
                  key={index}
                  className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 text-xs px-3 py-1.5 rounded-full border-2 border-amber-300 font-bold shadow-md"
                >
                  {cert}
                </span>
              ))}
              {builder.certifications.length > 2 && (
                <span className="bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-full font-bold border-2 border-gray-300 shadow-md">
                  +{builder.certifications.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        {/* View Details Button with enhanced gradient */}
        <Link
          to={`/builder/${builder._id}`}
          className="mt-auto w-full text-center bg-gradient-to-r from-[#f73c56] to-[#e9334e] hover:from-[#e9334e] hover:to-[#d92d45] text-white py-3 px-4 rounded-xl transition-all duration-300 text-sm font-bold shadow-lg hover:shadow-xl border-2 border-white/20"
        >
          View Builder Profile →
        </Link>
      </div>
    </div>
  );
};

export default BuilderCard;

