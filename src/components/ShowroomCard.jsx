import React from "react";

export default function ShowroomCard({ property }) {
  return (
    <div className="w-full max-w-xs bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden">
      {/* Image */}
      <div className="h-48 w-full bg-gray-200">
        <img
          src={property.image}
          alt="Showroom"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            {property.title}
          </h2>
          <p className="text-lg font-bold text-gray-900">{property.price}</p>
        </div>

        <p className="text-gray-600 text-sm mt-1">{property.area}</p>
        <p className="text-gray-500 text-sm mt-1">
          <span className="font-medium">Locality:</span> {property.locality}
        </p>
        {property.mainRoadFacing && (
          <p className="text-green-600 text-sm mt-1">✔ Main Road Facing</p>
        )}
        <p className="text-gray-500 text-sm mt-1">
          <span className="font-medium">Owner:</span> {property.owner}
        </p>
        <p className="text-gray-500 text-sm mt-1">
          <span className="font-medium">Posted:</span> {property.posted}
        </p>

        <div className="flex justify-center items-center">

        <button className="mt-4 px-3 rounded-full border border-theme-primary text-theme-primary py-1.5 text-sm font-medium hover:bg-red-50 transition">
          Contact Now
        </button>
        </div>
      </div>
    </div>
  );
}
