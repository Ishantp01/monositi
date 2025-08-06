import React from "react";

export default function PgHotelWifiCard({data}) {
  return (
    <div className="w-80 rounded-xl border border-gray-300 bg-white overflow-hidden shadow-sm">
      <img
        src={data.image}
        alt={data.title}
        className="h-40 w-full object-cover"
      />
      <div className="p-4">
        <p className="text-red-600 text-lg font-bold">{data.price}</p>
        <p className="text-gray-500 text-sm">Onwards</p>

        <p className="mt-1 text-gray-700 text-sm">{data.location}</p>
        <h3 className="text-base font-bold text-gray-900 mt-1">{data.title}</h3>

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

        <button className="mt-4 w-full border border-red-600 text-red-600 px-4 py-2 rounded-full hover:bg-red-600 hover:text-white transition text-sm">
          Contact Owner
        </button>
      </div>
    </div>
  );
}
