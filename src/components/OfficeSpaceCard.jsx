import React from "react";
import { Link } from "react-router-dom";


export default function OfficeSpaceCard({ property, link }) {
  return (
    <div className="w-full max-w-xs bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden">
      {/* Image */}
      <div className="h-48 w-full bg-gray-200">
        <Link to={link}>
          <img
            src={property.image}
            alt="Office Space"
            className="h-full w-full object-cover"
          />
        </Link>
      </div>

      {/* Details */}
      <div className="p-4 px-5">
        <Link to={link}>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              {property.title}
            </h2>
            <p className="text-lg font-bold text-gray-900">
              ₹{property.price.toLocaleString()}
            </p>
          </div>

          <p className="text-gray-600 text-sm mt-1">{property.seats}</p>
          <p className="text-gray-500 text-sm mt-1">
            <span className="font-medium">Locality:</span> {property.locality}
          </p>
          <p className="text-gray-500 text-sm mt-1">
            <span className="font-medium">Posted:</span> {property.posted}
          </p>
          <p className="text-gray-500 text-sm mt-1">
            <span className="font-medium">Owner:</span> {property.owner}
          </p>
        </Link>
        <div className="flex justify-center items-center">
          <Link to={link}>
            <button className="mt-4 px-3 rounded-full border border-theme-primary text-theme-primary py-1.5 text-sm font-medium hover:bg-red-50 transition">
              Contact Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
