import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Users, Home, Ruler } from "lucide-react";

const MonositiCard = ({ listing }) => {
    const getCategoryIcon = (category) => {
        switch (category) {
            case 'hostel_pg':
                return <Users className="w-5 h-5" />;
            case 'commercial':
                return <Home className="w-5 h-5" />;
            case 'land_plot':
                return <Ruler className="w-5 h-5" />;
            default:
                return <Home className="w-5 h-5" />;
        }
    };

    const getCategoryLabel = (category) => {
        switch (category) {
            case 'hostel_pg':
                return 'Hostel/PG';
            case 'commercial':
                return 'Commercial';
            case 'land_plot':
                return 'Land Plot';
            default:
                return category;
        }
    };

    const formatPrice = (price) => {
        if (price >= 10000000) {
            return `₹${(price / 10000000).toFixed(2)} Cr`;
        } else if (price >= 100000) {
            return `₹${(price / 100000).toFixed(2)} Lac`;
        } else {
            return `₹${price.toLocaleString()}`;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Property Image */}
            <div className="relative">
                <img
                    src={listing.images?.[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'}
                    alt={listing.title}
                    className="w-full h-52 object-cover"
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
                    }}
                />
                {/* Category Badge */}
                <div className="absolute top-2 left-2">
                    <span className="bg-[#f73c56] text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        {getCategoryIcon(listing.category)}
                        {getCategoryLabel(listing.category)}
                    </span>
                </div>
                {/* Verification Badge */}
                {listing.monositi_verified && (
                    <div className="absolute top-2 right-2">
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            ✓ Verified
                        </span>
                    </div>
                )}
            </div>

            {/* Property Details */}
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800 text-lg line-clamp-2">
                        {listing.title}
                    </h3>
                    <p className="text-[#f73c56] font-bold">
                        {formatPrice(listing.price)}
                    </p>
                </div>

                {listing.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {listing.description}
                    </p>
                )}

                <div className="text-sm text-gray-600 flex items-center mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    {listing.location?.address && `${listing.location.address}, `}
                    {listing.location?.city}, {listing.location?.state}
                </div>

                {/* Property Specs */}
                <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                    <div className="flex gap-4">
                        {listing.area && (
                            <span className="flex items-center gap-1">
                                <Ruler className="w-4 h-4" />
                                {listing.area}
                            </span>
                        )}
                        {listing.rooms?.length > 0 && (
                            <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {listing.rooms.length} Rooms
                            </span>
                        )}
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${listing.status === 'available'
                            ? 'bg-green-100 text-green-800'
                            : listing.status === 'fullhouse'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {listing.status === 'fullhouse' ? 'Full House' : listing.status}
                    </span>
                </div>

                {/* Rooms Status (for hostel_pg) */}
                {listing.category === 'hostel_pg' && listing.rooms?.length > 0 && (
                    <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-2">Room Availability:</p>
                        <div className="flex flex-wrap gap-1">
                            {listing.rooms.slice(0, 6).map((room, index) => (
                                <div
                                    key={index}
                                    className={`w-6 h-6 rounded text-xs flex items-center justify-center font-medium ${room.status === 'available'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}
                                    title={`Room ${room.room_number}: ${room.available_beds}/${room.total_beds} beds available`}
                                >
                                    {room.room_number}
                                </div>
                            ))}
                            {listing.rooms.length > 6 && (
                                <div className="w-6 h-6 rounded bg-gray-100 text-gray-600 text-xs flex items-center justify-center">
                                    +{listing.rooms.length - 6}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* View Details Button */}
                <Link
                    to={`/monositi-details/${listing._id}`}
                    className="block w-full text-center bg-[#f73c56] text-white py-2 px-4 rounded-lg hover:bg-[#e9334e] transition-colors text-sm font-medium"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default MonositiCard;