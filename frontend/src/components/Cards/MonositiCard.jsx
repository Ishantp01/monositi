import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Users, Building2, Landmark } from "lucide-react";

const MonositiCard = ({ listing }) => {
  const getCategoryIcon = (category) => {
    switch (category) {
      case "hostel_pg":
        return <Users className="w-4 h-4" />;
      case "commercial":
        return <Building2 className="w-4 h-4" />;
      case "land_plot":
        return <Landmark className="w-4 h-4" />;
      default:
        return <Building2 className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case "hostel_pg":
        return "Hostel & PG";
      case "commercial":
        return "Commercial Space";
      case "land_plot":
        return "Land & Plot";
      default:
        return category;
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300 flex flex-col h-full">
      {/* Property Image */}
      <div className="relative h-56 overflow-hidden bg-gray-100">
        <img
          src={
            listing.images?.[0] ||
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
          }
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
          }}
        />
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-[#f73c56] text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
            {getCategoryIcon(listing.category)}
            {getCategoryLabel(listing.category)}
          </span>
        </div>
        {/* Verification Badge */}
        {listing.monositi_verified && (
          <div className="absolute top-3 right-3">
            <span className="bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1.5 rounded-full shadow-md flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Verified
            </span>
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3 gap-2">
          <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2 flex-1 min-h-[3rem]">
            {listing.title}
          </h3>
          <p className="text-[#f73c56] font-bold text-lg whitespace-nowrap ml-2">
            {formatPrice(listing.price)}
          </p>
        </div>

        {listing.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
            {listing.description}
          </p>
        )}

        <div className="text-sm text-gray-600 flex items-start mb-4">
          <MapPin className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0 text-gray-400" />
          <span className="line-clamp-2">
            {listing.location?.address && `${listing.location.address}, `}
            {listing.location?.city}, {listing.location?.state}
          </span>
        </div>

        {/* Property Specs */}
        <div className="flex justify-between items-center text-sm mb-4 pt-3 border-t border-gray-100">
          <div className="flex gap-4 text-gray-700">
            {listing.area && (
              <span className="flex items-center gap-1.5 font-medium">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
                {listing.area}
              </span>
            )}
            {listing.rooms?.length > 0 && (
              <span className="flex items-center gap-1.5 font-medium">
                <Users className="w-4 h-4 text-gray-400" />
                {listing.rooms.length} Rooms
              </span>
            )}
          </div>
          <span
            className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide ${
              listing.status === "available"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : listing.status === "fullhouse"
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}
          >
            {listing.status === "fullhouse"
              ? "Full House"
              : listing.status || "Available"}
          </span>
        </div>

        {/* Rooms Status (for hostel_pg) */}
        {listing.category === "hostel_pg" && listing.rooms?.length > 0 && (
          <div className="mb-4 pt-3 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
              Room Availability
            </p>
            <div className="flex flex-wrap gap-1.5">
              {listing.rooms.slice(0, 6).map((room, index) => (
                <div
                  key={index}
                  className={`w-7 h-7 rounded-md text-xs flex items-center justify-center font-semibold transition-all ${
                    room.status === "available"
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                      : "bg-red-100 text-red-700 border border-red-200"
                  }`}
                  title={`Room ${room.room_number}: ${room.available_beds}/${room.total_beds} beds available`}
                >
                  {room.room_number}
                </div>
              ))}
              {listing.rooms.length > 6 && (
                <div className="w-7 h-7 rounded-md bg-gray-100 text-gray-600 text-xs flex items-center justify-center font-semibold border border-gray-200">
                  +{listing.rooms.length - 6}
                </div>
              )}
            </div>
          </div>
        )}

        {/* View Details Button */}
        <Link
          to={`/monositi-details/${listing._id}`}
          className="mt-auto w-full text-center bg-[#f73c56] text-white py-2.5 px-4 rounded-lg hover:bg-[#e9334e] transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default MonositiCard;
