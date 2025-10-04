import React from "react";
import { Building, Car, Phone, Wind, Utensils, Package } from "lucide-react";

const amenities = [
  { name: "Club House", icon: Building },
  { name: "Service/Goods Lift", icon: Package },
  { name: "Air Conditioned", icon: Wind },
  { name: "Visitor Parking", icon: Car },
  { name: "Intercom Facility", icon: Phone },
  { name: "Banquet Hall", icon: Utensils },
];

const Amenities = () => {
  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 mx-auto shadow-md mb-8 max-w-[90%] border border-red-100">
      <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
        Amenities
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-sm text-gray-700">
        {amenities.map((amenity, index) => {
          const Icon = amenity.icon;
          return (
            <div key={index} className="flex items-center gap-2">
              <Icon className="w-5 h-5 text-red-500" />
              <span>{amenity.name}</span>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between mt-4 text-sm">
        <button className="text-red-600 font-medium hover:underline">
          View all Amenities (67)
        </button>
        <button className="text-gray-800 font-medium hover:underline">
          Download Brochure
        </button>
      </div>
    </div>
  );
};

export default Amenities;
