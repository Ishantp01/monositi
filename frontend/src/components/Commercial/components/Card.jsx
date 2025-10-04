"use client";

import React from "react";

const Card = ({ data, type, onViewDetails }) => (
  <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
    <img src={data.img} alt={data.title} className="w-full h-48 object-cover" />
    <div className="p-4 flex flex-col gap-1">
      {/* Title and Price */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{data.title}</h3>
        <p className="text-lg font-bold text-black">{data.price}</p>
      </div>

      {/* Office Info */}
      {type === "office" ? (
        <>
          <p>{data.seats}</p>
          <p className="text-gray-600">
            <span className="font-medium">Locality:</span> {data.locality}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Posted:</span> {data.posted}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Owner:</span> {data.owner}
          </p>
        </>
      ) : (
        <>
          <p>{data.area}</p>
          <p className="text-gray-600">
            <span className="font-medium">Locality:</span> {data.locality}
          </p>
          {data.facing && (
            <p className="text-green-600 font-medium">✔ Main Road Facing</p>
          )}
          <p className="text-gray-600">
            <span className="font-medium">Owner:</span> {data.owner}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Posted:</span> {data.posted}
          </p>
        </>
      )}

      {/* Button */}
      <button 
        onClick={onViewDetails}
        className="mt-2 w-full px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors duration-200"
      >
        View Details
      </button>
    </div>
  </div>
);

export default Card;
