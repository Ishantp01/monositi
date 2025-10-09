import React from "react";

const PropertyCard = () => {
  return (
    <div className="border border-red-500 rounded-lg p-3 w-full md:max-w-xs text-sm">
      <div className="w-full h-32 bg-black mb-2 rounded-md"></div>
      <p className="font-semibold">₹89 Lac | 1000 sqft</p>
      <p className="text-xs text-gray-500">2BHK / 600 Sq.ft</p>
      <p className="text-xs text-gray-500">Ready to Move</p>
      <p className="text-xs text-gray-500 mb-2">IT Park, Jabalpur</p>
      <button className="text-xs border border-red-600 px-3 py-1 rounded-full text-red-600 hover:bg-red-600 hover:text-white transition">
        Contact Builder
      </button>
    </div>
  );
};

export default PropertyCard;
