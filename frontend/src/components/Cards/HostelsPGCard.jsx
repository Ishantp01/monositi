import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Users, Building2, CheckCircle } from "lucide-react";

const HostelsPGCard = ({ listing }) => {
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

  // Group rooms by floor
  const groupRoomsByFloor = (rooms) => {
    if (!rooms || rooms.length === 0) return {};
    return rooms.reduce((acc, room) => {
      const floor = room.floor || 'Ground';
      if (!acc[floor]) acc[floor] = [];
      acc[floor].push(room);
      return acc;
    }, {});
  };

  const roomsByFloor = groupRoomsByFloor(listing.rooms || []);
  const floors = Object.keys(roomsByFloor);

  // Calculate availability
  const getAvailabilityStatus = () => {
    if (!listing.rooms || listing.rooms.length === 0) {
      return { status: 'fullhouse', text: 'Full House', color: 'bg-red-50 text-red-700 border-red-200' };
    }
    
    const availableRooms = listing.rooms.filter(r => r.status === 'available' && r.available_beds > 0);
    if (availableRooms.length === 0) {
      return { status: 'fullhouse', text: 'Full House', color: 'bg-red-50 text-red-700 border-red-200' };
    }
    
    return { status: 'available', text: 'Available', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  };

  const availability = getAvailabilityStatus();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300 flex flex-col h-full">
      {/* Property Image */}
      <div className="relative h-56 overflow-hidden bg-gray-100">
        <img
          src={listing.images?.[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
          }}
        />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-[#f73c56] text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
            <Users className="w-4 h-4" />
            Hostel & PG
          </span>
        </div>

        {/* Verification Badge */}
        {listing.monositi_verified && (
          <div className="absolute top-3 right-3">
            <span className="bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1.5 rounded-full shadow-md flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
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

        {/* Availability Status */}
        <div className="mb-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Availability Status
            </span>
            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide border ${availability.color}`}>
              {availability.text}
            </span>
          </div>

          {/* Rooms by Floor */}
          {floors.length > 0 && (
            <div className="space-y-3">
              {floors.map((floor) => (
                <div key={floor} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <span className="text-xs font-semibold text-gray-700 uppercase">
                      {floor} Floor
                    </span>
                    <span className="text-xs text-gray-500">
                      ({roomsByFloor[floor].length} {roomsByFloor[floor].length === 1 ? 'room' : 'rooms'})
                    </span>
                  </div>
                  
                  {/* Room Boxes */}
                  <div className="flex flex-wrap gap-2">
                    {roomsByFloor[floor].slice(0, 6).map((room, index) => {
                      const totalBeds = room.total_beds || 0;
                      const availableBeds = room.available_beds || 0;
                      const filledBeds = totalBeds - availableBeds;
                      const isAvailable = room.status === 'available' && availableBeds > 0;
                      
                      return (
                        <div
                          key={index}
                          className={`p-2 rounded-md border-2 min-w-[60px] ${
                            isAvailable
                              ? 'bg-emerald-50 border-emerald-200'
                              : 'bg-red-50 border-red-200'
                          }`}
                          title={`Room ${room.room_number}: ${availableBeds}/${totalBeds} beds available`}
                        >
                          <div className="text-xs font-semibold text-center mb-1">
                            Room {room.room_number}
                          </div>
                          <div className="flex gap-0.5 justify-center">
                            {Array.from({ length: totalBeds }).map((_, bedIndex) => (
                              <div
                                key={bedIndex}
                                className={`w-3 h-3 rounded-full ${
                                  bedIndex < filledBeds
                                    ? 'bg-red-500'
                                    : 'bg-emerald-500'
                                }`}
                                title={bedIndex < filledBeds ? 'Occupied' : 'Available'}
                              />
                            ))}
                          </div>
                          <div className="text-[10px] text-center mt-1 text-gray-600">
                            {availableBeds}/{totalBeds} beds
                          </div>
                        </div>
                      );
                    })}
                    {roomsByFloor[floor].length > 6 && (
                      <div className="p-2 rounded-md bg-gray-100 border-2 border-gray-200 flex items-center justify-center min-w-[60px]">
                        <span className="text-xs font-semibold text-gray-600">
                          +{roomsByFloor[floor].length - 6}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No rooms info */}
          {floors.length === 0 && listing.rooms?.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex flex-wrap gap-2">
                {listing.rooms.slice(0, 7).map((room, index) => {
                  const totalBeds = room.total_beds || 0;
                  const availableBeds = room.available_beds || 0;
                  const filledBeds = totalBeds - availableBeds;
                  const isAvailable = room.status === 'available' && availableBeds > 0;
                  
                  return (
                    <div
                      key={index}
                      className={`p-2 rounded-md border-2 min-w-[60px] ${
                        isAvailable
                          ? 'bg-emerald-50 border-emerald-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                      title={`Room ${room.room_number}: ${availableBeds}/${totalBeds} beds available`}
                    >
                      <div className="text-xs font-semibold text-center mb-1">
                        {room.room_number}
                      </div>
                      <div className="flex gap-0.5 justify-center">
                        {Array.from({ length: totalBeds }).map((_, bedIndex) => (
                          <div
                            key={bedIndex}
                            className={`w-3 h-3 rounded-full ${
                              bedIndex < filledBeds
                                ? 'bg-red-500'
                                : 'bg-emerald-500'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-[10px] text-center mt-1 text-gray-600">
                        {availableBeds}/{totalBeds}
                      </div>
                    </div>
                  );
                })}
                {listing.rooms.length > 7 && (
                  <div className="p-2 rounded-md bg-gray-100 border-2 border-gray-200 flex items-center justify-center min-w-[60px]">
                    <span className="text-xs font-semibold text-gray-600">
                      +{listing.rooms.length - 7}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

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

export default HostelsPGCard;

