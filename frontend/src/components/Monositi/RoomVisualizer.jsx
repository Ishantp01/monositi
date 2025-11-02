import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bed,
    Users,
    Wifi,
    Car,
    Coffee,
    Tv,
    Wind,
    Zap,
    Droplets,
    X,
    Info,
    CheckCircle,
    XCircle,
    Clock
} from "lucide-react";

const RoomVisualizer = ({ rooms = [], onRoomSelect, selectedRoom = null, viewMode = "grid" }) => {
    const [hoveredRoom, setHoveredRoom] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedRoomDetails, setSelectedRoomDetails] = useState(null);

    // Generate a visual layout for rooms (like a floor plan)
    const generateRoomLayout = (rooms) => {
        const maxRoomsPerFloor = 6;
        const floors = {};

        rooms.forEach(room => {
            if (!floors[room.floor]) {
                floors[room.floor] = [];
            }
            floors[room.floor].push(room);
        });

        // Sort floors and rooms
        Object.keys(floors).forEach(floor => {
            floors[floor].sort((a, b) => {
                const aNum = parseInt(a.room_number) || 0;
                const bNum = parseInt(b.room_number) || 0;
                return aNum - bNum;
            });
        });

        return floors;
    };

    const getAmenityIcon = (amenity) => {
        const amenityLower = amenity.toLowerCase();
        if (amenityLower.includes('wifi') || amenityLower.includes('internet')) {
            return <Wifi className="w-3 h-3" />;
        }
        if (amenityLower.includes('parking') || amenityLower.includes('car')) {
            return <Car className="w-3 h-3" />;
        }
        if (amenityLower.includes('ac') || amenityLower.includes('air')) {
            return <Wind className="w-3 h-3" />;
        }
        if (amenityLower.includes('tv') || amenityLower.includes('television')) {
            return <Tv className="w-3 h-3" />;
        }
        if (amenityLower.includes('coffee') || amenityLower.includes('kitchen')) {
            return <Coffee className="w-3 h-3" />;
        }
        if (amenityLower.includes('power') || amenityLower.includes('electricity')) {
            return <Zap className="w-3 h-3" />;
        }
        if (amenityLower.includes('water') || amenityLower.includes('bath')) {
            return <Droplets className="w-3 h-3" />;
        }
        return <CheckCircle className="w-3 h-3" />;
    };

    const getRoomStatusColor = (room) => {
        const availabilityRatio = room.available_beds / room.total_beds;

        if (room.status === 'full' || availabilityRatio === 0) {
            return {
                bg: 'bg-red-500',
                border: 'border-red-600',
                text: 'text-red-700',
                lightBg: 'bg-red-50',
                status: 'Full'
            };
        } else if (availabilityRatio <= 0.3) {
            return {
                bg: 'bg-orange-500',
                border: 'border-orange-600',
                text: 'text-orange-700',
                lightBg: 'bg-orange-50',
                status: 'Almost Full'
            };
        } else if (availabilityRatio <= 0.7) {
            return {
                bg: 'bg-yellow-500',
                border: 'border-yellow-600',
                text: 'text-yellow-700',
                lightBg: 'bg-yellow-50',
                status: 'Filling Up'
            };
        } else {
            return {
                bg: 'bg-green-500',
                border: 'border-green-600',
                text: 'text-green-700',
                lightBg: 'bg-green-50',
                status: 'Available'
            };
        }
    };

    const handleRoomClick = (room) => {
        setSelectedRoomDetails(room);
        setShowDetails(true);
        if (onRoomSelect) {
            onRoomSelect(room);
        }
    };

    const floors = generateRoomLayout(rooms);

    if (viewMode === "list") {
        return (
            <div className="space-y-4">
                {rooms.map((room) => {
                    const statusColor = getRoomStatusColor(room);
                    return (
                        <motion.div
                            key={room._id || `${room.floor}-${room.room_number}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${selectedRoom?._id === room._id
                                    ? `${statusColor.border} ${statusColor.lightBg}`
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                            onClick={() => handleRoomClick(room)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-12 h-12 rounded-lg ${statusColor.bg} flex items-center justify-center text-white font-bold`}>
                                        {room.room_number}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Room {room.room_number}</h3>
                                        <p className="text-sm text-gray-600">Floor {room.floor}</p>
                                        <p className="text-sm text-gray-600">
                                            {room.available_beds}/{room.total_beds} beds available
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor.lightBg} ${statusColor.text}`}>
                                        {statusColor.status}
                                    </span>
                                    {room.rent_per_bed && (
                                        <p className="text-lg font-bold text-[#f73c56] mt-1">
                                            ₹{room.rent_per_bed.toLocaleString()}/bed
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Legend */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Room Status Legend</h3>
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span className="text-sm text-gray-600">Available (70%+ beds)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                        <span className="text-sm text-gray-600">Filling Up (30-70% beds)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-orange-500 rounded"></div>
                        <span className="text-sm text-gray-600">Almost Full (1-30% beds)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span className="text-sm text-gray-600">Full (0 beds)</span>
                    </div>
                </div>
            </div>

            {/* Floor Plan View */}
            {Object.keys(floors).sort((a, b) => b - a).map((floorNumber) => (
                <motion.div
                    key={floorNumber}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 rounded-xl p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                            <Users className="w-5 h-5 mr-2 text-[#f73c56]" />
                            Floor {floorNumber}
                        </h3>
                        <div className="text-sm text-gray-600">
                            {floors[floorNumber].length} rooms
                        </div>
                    </div>

                    {/* Room Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {floors[floorNumber].map((room) => {
                            const statusColor = getRoomStatusColor(room);
                            const isSelected = selectedRoom?._id === room._id;
                            const isHovered = hoveredRoom === room._id;

                            return (
                                <motion.div
                                    key={room._id || `${room.floor}-${room.room_number}`}
                                    className="relative"
                                    onMouseEnter={() => setHoveredRoom(room._id)}
                                    onMouseLeave={() => setHoveredRoom(null)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {/* Room Card */}
                                    <div
                                        className={`
                      relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                      ${isSelected
                                                ? `${statusColor.border} ${statusColor.lightBg} shadow-lg`
                                                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                                            }
                    `}
                                        onClick={() => handleRoomClick(room)}
                                    >
                                        {/* Room Number */}
                                        <div className={`w-full h-16 rounded-lg ${statusColor.bg} flex items-center justify-center text-white font-bold text-lg mb-3`}>
                                            {room.room_number}
                                        </div>

                                        {/* Bed Visualization */}
                                        <div className="mb-3">
                                            <div className="flex flex-wrap gap-1 justify-center">
                                                {Array.from({ length: room.total_beds }).map((_, bedIndex) => (
                                                    <div
                                                        key={bedIndex}
                                                        className={`w-4 h-4 rounded-sm ${bedIndex < room.available_beds
                                                                ? 'bg-green-400'
                                                                : 'bg-gray-300'
                                                            }`}
                                                        title={`Bed ${bedIndex + 1} - ${bedIndex < room.available_beds ? 'Available' : 'Occupied'}`}
                                                    >
                                                        <Bed className="w-3 h-3 text-white" />
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-xs text-center text-gray-600 mt-1">
                                                {room.available_beds}/{room.total_beds} beds
                                            </p>
                                        </div>

                                        {/* Status Badge */}
                                        <div className={`text-center px-2 py-1 rounded-full text-xs font-medium ${statusColor.lightBg} ${statusColor.text}`}>
                                            {statusColor.status}
                                        </div>

                                        {/* Price */}
                                        {room.rent_per_bed && (
                                            <div className="text-center mt-2">
                                                <span className="text-sm font-bold text-[#f73c56]">
                                                    ₹{room.rent_per_bed.toLocaleString()}
                                                </span>
                                            </div>
                                        )}

                                        {/* Amenities Preview */}
                                        {room.amenities && room.amenities.length > 0 && (
                                            <div className="flex justify-center space-x-1 mt-2">
                                                {room.amenities.slice(0, 3).map((amenity, index) => (
                                                    <div
                                                        key={index}
                                                        className="text-gray-400"
                                                        title={amenity}
                                                    >
                                                        {getAmenityIcon(amenity)}
                                                    </div>
                                                ))}
                                                {room.amenities.length > 3 && (
                                                    <span className="text-xs text-gray-500">+{room.amenities.length - 3}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Hover Tooltip */}
                                    <AnimatePresence>
                                        {isHovered && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg min-w-48"
                                            >
                                                <div className="font-semibold">Room {room.room_number}</div>
                                                <div>Floor {room.floor}</div>
                                                <div>{room.available_beds}/{room.total_beds} beds available</div>
                                                {room.rent_per_bed && (
                                                    <div className="text-yellow-300">₹{room.rent_per_bed.toLocaleString()}/bed</div>
                                                )}
                                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            ))}

            {/* Room Details Modal */}
            <AnimatePresence>
                {showDetails && selectedRoomDetails && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowDetails(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Room {selectedRoomDetails.room_number}
                                </h2>
                                <button
                                    onClick={() => setShowDetails(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Room Status */}
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium">Status</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoomStatusColor(selectedRoomDetails).lightBg} ${getRoomStatusColor(selectedRoomDetails).text}`}>
                                        {getRoomStatusColor(selectedRoomDetails).status}
                                    </span>
                                </div>

                                {/* Bed Information */}
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <h3 className="font-medium mb-2">Bed Availability</h3>
                                    <div className="flex items-center justify-between">
                                        <span>Available Beds</span>
                                        <span className="font-bold text-green-600">
                                            {selectedRoomDetails.available_beds}/{selectedRoomDetails.total_beds}
                                        </span>
                                    </div>
                                    <div className="mt-2 flex space-x-1">
                                        {Array.from({ length: selectedRoomDetails.total_beds }).map((_, index) => (
                                            <div
                                                key={index}
                                                className={`w-8 h-8 rounded flex items-center justify-center ${index < selectedRoomDetails.available_beds
                                                        ? 'bg-green-100 text-green-600'
                                                        : 'bg-red-100 text-red-600'
                                                    }`}
                                            >
                                                <Bed className="w-4 h-4" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Floor */}
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium">Floor</span>
                                    <span>{selectedRoomDetails.floor}</span>
                                </div>

                                {/* Rent */}
                                {selectedRoomDetails.rent_per_bed && (
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="font-medium">Rent per Bed</span>
                                        <span className="font-bold text-[#f73c56]">
                                            ₹{selectedRoomDetails.rent_per_bed.toLocaleString()}
                                        </span>
                                    </div>
                                )}

                                {/* Amenities */}
                                {selectedRoomDetails.amenities && selectedRoomDetails.amenities.length > 0 && (
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <h3 className="font-medium mb-2">Amenities</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedRoomDetails.amenities.map((amenity, index) => (
                                                <span
                                                    key={index}
                                                    className="flex items-center space-x-1 px-2 py-1 bg-white rounded-full text-sm"
                                                >
                                                    {getAmenityIcon(amenity)}
                                                    <span>{amenity}</span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Images */}
                                {selectedRoomDetails.images && selectedRoomDetails.images.length > 0 && (
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <h3 className="font-medium mb-2">Room Images</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            {selectedRoomDetails.images.map((image, index) => (
                                                <img
                                                    key={index}
                                                    src={image}
                                                    alt={`Room ${selectedRoomDetails.room_number} - ${index + 1}`}
                                                    className="w-full h-20 object-cover rounded"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RoomVisualizer;