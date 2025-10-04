import React from "react";
import { Link } from "react-router-dom";

const PgHostelLongCard = ({
  id,
  price = 0,
  title = "",
  location = "",
  type = "Coed",
  near = "",
  description = "",
  sharingOptions = {},
  image = "",
}) => {
  // Create dynamic link based on property ID
  const propertyLink = `/pg-details/${id}`;
  return (
    <Link to={propertyLink} className="block">
      <div className="bg-[#FEFAB9]/30 border border-yellow-300 rounded-xl p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 w-full font-inter relative hover:shadow-lg transition-shadow duration-300">
        {/* Type Tag */}
        <span className="absolute bg-[#FFFDD5] px-2 py-1 rounded-full top-2 right-3 text-yellow-600 font-medium text-sm">
          {type}
        </span>

        {/* Image Box */}
        <div className="w-full md:w-1/3 min-h-[200px] bg-white border rounded-md flex-shrink-0 overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover rounded-md"
            />
          ) : null}
        </div>

        {/* Content */}
        <div className="flex flex-col w-full md:w-2/3">
        {/* Price + Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <div className="text-red-600 text-lg font-bold">
            ₹{price.toLocaleString()}
            <span className="text-gray-500 font-normal text-sm"> Onwards</span>
          </div>
        </div>

        <h2 className="text-lg font-semibold mt-1">
          {title}
          <span className="text-gray-500 font-normal text-sm"> in {location}</span>
        </h2>

        {/* Price Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 mt-3 border-t border-b border-gray-300 text-sm divide-x divide-gray-300 text-center">
          <div className="py-2">
            <p>Single Room</p>
            <p className="text-gray-600">₹{sharingOptions?.single || "-"}</p>
          </div>
          <div className="py-2">
            <p>Twin Sharing</p>
            <p className="text-gray-600">₹{sharingOptions?.twin || "-"}</p>
          </div>
          <div className="py-2">
            <p>Triple Sharing</p>
            <p className="text-gray-600">₹{sharingOptions?.triple || "-"}</p>
          </div>
          <div className="py-2">
            <p>Four Sharing</p>
            <p className="text-gray-600">₹{sharingOptions?.four || "-"}</p>
          </div>
        </div>

        {/* Nearby & Description */}
        <div className="mt-3 text-sm text-gray-700 space-y-3">
          {near && (
            <p className="flex items-center font-medium text-gray-700">
              <span className="mr-1">📍</span> {near}
            </p>
          )}
          <p>
            {description}{" "}
            <span className="underline font-medium cursor-pointer">
              Read More
            </span>
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="mt-14 flex gap-4 flex-wrap">
          <button className="px-3 md:px-6 py-2 border bg-white/90 border-red-500 text-red-600 rounded-full text-sm hover:bg-red-50">
            View Phone No.
          </button>
          <button className="px-3 md:px-6 py-2 border border-red-500 text-red-600 rounded-full text-sm hover:bg-red-50">
            Contact Owner
          </button>
        </div>
      </div>
    </div>
    </Link>
  );
};

export default PgHostelLongCard;
