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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300 flex flex-col h-full">
      {/* Property Image */}
      <div className="relative h-56 overflow-hidden bg-gray-100">
        <img
          src={normalized.image}
          alt={normalized.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
          }}
        />

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {normalized.verified && (
            <span className="bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1.5 rounded-full shadow-md flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Verified
            </span>
          )}
          {normalized.featured && (
            <span className="bg-[#f73c56] text-white text-xs font-semibold px-2.5 py-1.5 rounded-full shadow-md">
              Featured
            </span>
          )}
        </div>

        {/* Sub-category Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`text-xs font-semibold px-3 py-1.5 rounded-full shadow-md ${
              normalized.sub_category === "Rent"
                ? "bg-blue-600 text-white"
                : normalized.sub_category === "Buy"
                ? "bg-[#f73c56] text-white"
                : "bg-gray-700 text-white"
            }`}
          >
            {normalized.sub_category || "Buy"}
          </span>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2 mb-2 min-h-[3rem]">
          {normalized.title}
        </h3>

        <div className="text-sm text-gray-600 flex items-start mb-3">
          <MapPin className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0 text-gray-400" />
          <span className="line-clamp-2">{normalized.address}</span>
        </div>

        {/* Property Specs */}
        <div className="flex items-center gap-4 text-sm text-gray-700 mb-4 pt-3 border-t border-gray-100">
          {normalized.bedrooms > 0 && (
            <span className="flex items-center gap-1.5 font-medium">
              <Bed className="w-4 h-4 text-gray-400" />
              {normalized.bedrooms} {normalized.bedrooms === 1 ? "Bed" : "Beds"}
            </span>
          )}
          {normalized.bathrooms > 0 && (
            <span className="flex items-center gap-1.5 font-medium">
              <Bath className="w-4 h-4 text-gray-400" />
              {normalized.bathrooms}{" "}
              {normalized.bathrooms === 1 ? "Bath" : "Baths"}
            </span>
          )}
          {normalized.area > 0 && (
            <span className="flex items-center gap-1.5 font-medium">
              <Square className="w-4 h-4 text-gray-400" />
              {normalized.area} sq.ft
            </span>
          )}
        </div>

        {/* Price and View Button */}
        <div className="mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[#f73c56] font-bold text-lg">
              {formatPrice(normalized.price)}
            </p>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {normalized.type}
            </span>
          </div>
          <Link
            to={getDetailLink()}
            className="block w-full text-center bg-[#f73c56] text-white py-2.5 px-4 rounded-lg hover:bg-[#e9334e] transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnifiedPropertyCard;
