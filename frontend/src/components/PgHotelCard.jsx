import React from "react";

export default function PgHotelCard({data}) {
  return (
    <div className="w-full max-w-2xl rounded-xl border border-gray-300 bg-white overflow-hidden shadow-sm">
      {/* Image with navigation button */}
      <div className="relative h-56 z-40">
        <img
          src={data.image}
          alt={data.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
  
      </div>

      {/* Content Section */}
      <div className="p-4 flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">
            {data.title} <span className="text-gray-500 text-sm">in {data.location}</span>
          </h3>

          <div className="flex items-center gap-2 mt-2 text-sm">
            <span className="px-2 py-1 bg-gray-200 rounded-md text-gray-700">
              For Boys & Girls
            </span>
            <span className="px-2 py-1 bg-gray-200 rounded-md text-gray-700">
              All Preferred
            </span>
          </div>

          <p className="mt-2 text-gray-600 text-sm">
            Key Facilities: {data.facilities}{" "}
            <span className="text-blue-600 font-medium cursor-pointer">
              +12 More
            </span>
          </p>
        </div>

        {/* Price and Button */}
        <div className="flex flex-col items-center border-l pl-4">
          <p className="text-red-600 text-lg font-bold">{data.price}</p>
          <p className="text-gray-500 text-xs">onwards</p>
          <button className="mt-2 border border-red-600 text-red-600 px-3 py-1 rounded-full hover:bg-red-600 hover:text-white transition text-sm">
            Contact Owner
          </button>
        </div>
      </div>
    </div>
  );
}
