import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Users, Building2, Landmark, CheckCircle, Bed, Maximize } from "lucide-react";

const MonositiCard = ({ listing }) => {
  const getCategoryIcon = (category) => {
    switch (category) {
      case "hostel_pg":
        return <Users className="w-3.5 h-3.5" />;
      case "commercial":
        return <Building2 className="w-3.5 h-3.5" />;
      case "land_plot":
        return <Landmark className="w-3.5 h-3.5" />;
      default:
        return <Building2 className="w-3.5 h-3.5" />;
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case "hostel_pg":
        return "Hostel & PG";
      case "commercial":
        return "Commercial";
      case "land_plot":
        return "Land & Plot";
      default:
        return category;
    }
  };

  // Get category-specific colors
  const getCategoryColors = (category) => {
    switch (category) {
      case "hostel_pg":
        return {
          badge: "bg-emerald-600",
          textClass: "text-emerald-600",
        };
      case "commercial":
        return {
          badge: "bg-blue-600",
          textClass: "text-blue-600",
        };
      case "land_plot":
        return {
          badge: "bg-purple-600",
          textClass: "text-purple-600",
        };
      default:
        return {
          badge: "bg-gray-600",
          textClass: "text-gray-600",
        };
    }
  };

  const colors = getCategoryColors(listing.category);

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
      {/* Property Image */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Premium overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 opacity-60"></div>
        
        <img
          src={
            listing.images?.[0] ||
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
          }
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
          }}
        />

        {/* Luxury corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-transparent rounded-bl-full z-10"></div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3 z-20">
          <span
            className={`${colors.badge} text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl border border-white/30 backdrop-blur-sm`}
          >
            {getCategoryIcon(listing.category)}
            {getCategoryLabel(listing.category)}
          </span>
        </div>

        {/* Verification Badge */}
        {listing.monositi_verified && (
          <div className="absolute top-3 right-3 z-20">
            <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl border border-emerald-400/30 flex items-center gap-1 backdrop-blur-sm">
              <CheckCircle className="w-3.5 h-3.5" />
              Verified
            </span>
          </div>
        )}

        {/* Price badge on image */}
        <div className="absolute bottom-3 left-3 right-3 z-20">
          <div className="bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-2xl border border-white/20">
            <p className="text-[#f73c56] font-black text-xl tracking-tight">
              {formatPrice(listing.price)}
            </p>
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-6 flex flex-col flex-grow bg-gradient-to-b from-white to-gray-50/30">
        <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2 mb-3">
          {listing.title}
        </h3>

        {listing.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {listing.description}
          </p>
        )}

        <div className="text-sm text-gray-600 flex items-start mb-4 bg-gray-50/80 px-3 py-2 rounded-lg">
          <MapPin className={`w-4 h-4 mr-2 mt-0.5 flex-shrink-0 ${colors.textClass}`} />
          <span className="line-clamp-2 font-medium">
            {listing.location?.address && `${listing.location.address}, `}
            {listing.location?.city}, {listing.location?.state}
          </span>
        </div>

        {/* Property Specs */}
        <div className="space-y-2.5 mb-4 pt-4 border-t-2 border-gray-100">
          {listing.area && (
            <div className="flex items-center gap-3 text-sm text-gray-700 bg-white px-3 py-2 rounded-lg shadow-sm">
              <div className={`p-1.5 rounded-lg ${
                listing.category === "hostel_pg" ? "bg-emerald-100" : 
                listing.category === "commercial" ? "bg-blue-100" : "bg-purple-100"
              }`}>
                <Maximize className={`w-4 h-4 ${colors.textClass}`} />
              </div>
              <span className="font-semibold">Area: {listing.area}</span>
            </div>
          )}
          {listing.rooms?.length > 0 && (
            <div className="flex items-center gap-3 text-sm text-gray-700 bg-white px-3 py-2 rounded-lg shadow-sm">
              <div className={`p-1.5 rounded-lg ${
                listing.category === "hostel_pg" ? "bg-emerald-100" : 
                listing.category === "commercial" ? "bg-blue-100" : "bg-purple-100"
              }`}>
                <Bed className={`w-4 h-4 ${colors.textClass}`} />
              </div>
              <span className="font-semibold">{listing.rooms.length} Rooms</span>
            </div>
          )}
          {listing.status && (
            <div className="flex items-center gap-2 text-sm">
              <span
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-md border-2 ${
                  listing.status === "available"
                    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                    : listing.status === "fullhouse"
                    ? "bg-red-100 text-red-700 border-red-200"
                    : "bg-amber-100 text-amber-700 border-amber-200"
                }`}
              >
                {listing.status === "fullhouse"
                  ? "🏠 Full House"
                  : listing.status === "available"
                  ? "✓ Available"
                  : listing.status}
              </span>
            </div>
          )}
        </div>

        {/* Rooms Status (for hostel_pg) */}
        {listing.category === "hostel_pg" && listing.rooms?.length > 0 && (
          <div className="mb-4 pt-4 border-t-2 border-gray-100">
            <p className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
              <Bed className="w-4 h-4" />
              Room Availability
            </p>
            <div className="flex flex-wrap gap-2">
              {listing.rooms.slice(0, 6).map((room, index) => (
                <span
                  key={index}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-md border-2 ${
                    room.status === "available"
                      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                      : "bg-red-100 text-red-700 border-red-200"
                  }`}
                  title={`Room ${room.room_number}: ${room.available_beds}/${room.total_beds} beds`}
                >
                  #{room.room_number}
                </span>
              ))}
              {listing.rooms.length > 6 && (
                <span className="px-3 py-1.5 rounded-lg bg-gray-200 text-gray-700 text-xs font-bold shadow-md border-2 border-gray-300">
                  +{listing.rooms.length - 6} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* View Details Button */}
        <Link
          to={`/monositi-details/${listing._id}`}
          className={`mt-auto w-full text-center bg-gradient-to-r ${
            listing.category === "hostel_pg"
              ? "from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
              : listing.category === "commercial"
              ? "from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              : "from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
          } text-white py-3 px-4 rounded-xl transition-all duration-300 text-sm font-bold shadow-lg hover:shadow-xl border-2 border-white/20`}
        >
          View Full Details →
        </Link>
      </div>
    </div>
  );
};

export default MonositiCard;
