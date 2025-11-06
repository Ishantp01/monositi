import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Bed, Bath, Square, CheckCircle } from "lucide-react";

const UnifiedPropertyCard = ({ property, variant = "default" }) => {
  const {
    _id,
    title,
    name,
    price,
    propertyType,
    type,
    address,
    photos,
    images,
    bedrooms,
    bathrooms,
    area,
    size,
    isVerified,
    monositi_verified,
    isFeatured,
    sub_category,
    city,
    state,
  } = property;

  // Normalize property data
  const normalized = {
    id: _id,
    title: title || name || "Property",
    price: price || 0,
    type: propertyType || type || "Residential",
    address: address || (city && state ? `${city}, ${state}` : ""),
    image:
      photos?.[0] ||
      images?.[0] ||
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    bedrooms: bedrooms || 0,
    bathrooms: bathrooms || 0,
    area: area || size || 0,
    verified: isVerified || monositi_verified || false,
    featured: isFeatured || false,
    sub_category: sub_category || "Buy",
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

  const getDetailLink = () => {
    // If it's a builder project, link to project details
    if (property.isBuilderProject) {
      return `/project/${normalized.id}`;
    }
    if (normalized.sub_category === "Rent") {
      return `/rent-details/${normalized.id}`;
    } else if (normalized.sub_category === "Buy") {
      return `/buy-details/${normalized.id}`;
    }
    return `/property-details/${normalized.id}`;
  };

  // Get theme colors based on sub_category
  const getThemeColors = () => {
    if (normalized.sub_category === "Rent") {
      return {
        primary: "blue-600",
        textClass: "text-blue-600",
      };
    } else {
      return {
        primary: "[#f73c56]",
        textClass: "text-[#f73c56]",
      };
    }
  };

  const colors = getThemeColors();

  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-2xl hover:border-gray-200 transition-all duration-300 flex flex-col h-full group">
      {/* Property Image */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Premium overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 opacity-60"></div>
        
        <img
          src={normalized.image}
          alt={normalized.title}
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
          {normalized.verified && (
            <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl border border-emerald-400/30 flex items-center gap-1 backdrop-blur-sm">
              <CheckCircle className="w-3.5 h-3.5" />
              Verified
            </span>
          )}
          {normalized.featured && (
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl border border-amber-400/30">
              ⭐ Featured
            </span>
          )}
        </div>

        {/* Price badge on image */}
        <div className="absolute bottom-3 left-3 right-3 z-20">
          <div className="bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-2xl border border-white/20">
            <p className={`${colors.textClass} font-black text-xl tracking-tight`}>
              {formatPrice(normalized.price)}
            </p>
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-6 flex flex-col flex-grow bg-gradient-to-b from-white to-gray-50/30">
        {/* Type badge */}
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
            normalized.sub_category === "Rent"
              ? "bg-blue-100 text-blue-700 border border-blue-200"
              : "bg-red-100 text-[#f73c56] border border-red-200"
          }`}>
            {normalized.type}
          </span>
        </div>

        <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2 mb-3 min-h-[3rem]">
          {normalized.title}
        </h3>

        <div className="text-sm text-gray-600 flex items-start mb-4 bg-gray-50/80 px-3 py-2 rounded-lg">
          <MapPin className={`w-4 h-4 mr-2 mt-0.5 flex-shrink-0 ${colors.textClass}`} />
          <span className="line-clamp-2 font-medium">{normalized.address}</span>
        </div>

        {/* Property Specs */}
        <div className="space-y-2.5 mb-4 pt-4 border-t-2 border-gray-100">
          {normalized.bedrooms > 0 && (
            <div className="flex items-center gap-3 text-sm text-gray-700 bg-white px-3 py-2 rounded-lg shadow-sm">
              <div className={`p-1.5 rounded-lg ${
                normalized.sub_category === "Rent" ? "bg-blue-100" : "bg-red-100"
              }`}>
                <Bed className={`w-4 h-4 ${colors.textClass}`} />
              </div>
              <span className="font-semibold">{normalized.bedrooms} Bedrooms</span>
            </div>
          )}
          {normalized.bathrooms > 0 && (
            <div className="flex items-center gap-3 text-sm text-gray-700 bg-white px-3 py-2 rounded-lg shadow-sm">
              <div className={`p-1.5 rounded-lg ${
                normalized.sub_category === "Rent" ? "bg-blue-100" : "bg-red-100"
              }`}>
                <Bath className={`w-4 h-4 ${colors.textClass}`} />
              </div>
              <span className="font-semibold">{normalized.bathrooms} Bathrooms</span>
            </div>
          )}
          {normalized.area > 0 && (
            <div className="flex items-center gap-3 text-sm text-gray-700 bg-white px-3 py-2 rounded-lg shadow-sm">
              <div className={`p-1.5 rounded-lg ${
                normalized.sub_category === "Rent" ? "bg-blue-100" : "bg-red-100"
              }`}>
                <Square className={`w-4 h-4 ${colors.textClass}`} />
              </div>
              <span className="font-semibold">{normalized.area} sq.ft</span>
            </div>
          )}
        </div>

        {/* View Button */}
        <Link
          to={getDetailLink()}
          className={`mt-auto w-full text-center bg-gradient-to-r ${
            normalized.sub_category === "Rent"
              ? "from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              : "from-[#f73c56] to-[#e9334e] hover:from-[#e9334e] hover:to-[#d92d45]"
          } text-white py-3 px-4 rounded-xl transition-all duration-300 text-sm font-bold shadow-lg hover:shadow-xl border-2 border-white/20`}
        >
          View Full Details →
        </Link>
      </div>
    </div>
  );
};

export default UnifiedPropertyCard;
