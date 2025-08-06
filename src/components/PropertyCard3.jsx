import React from "react";

export default function PropertyCard3({
  title = "L&T Raintree Boulevard",
  subtitle = "Herbal",
  priceRange = "₹50,000-1.5 Lac",
  bhk = "3,4 BHK Flat",
  areaRange = "1320-2850 sqft",
  image = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
}) {
  return (
    <div className="w-80 overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-sm hover:shadow-lg transition">
      {/* Image Section */}
      <img
        src={image}
        alt={title}
        className="h-44 w-full object-cover"
        loading="lazy"
      />

      {/* Content Section */}
      <div className="p-4 px-6">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-gray-400 text-sm mt-1">{subtitle}</p>

        <p className="text-xl font-bold text-black mt-3">{priceRange}</p>

        <div className="mt-1 text-gray-500 text-sm">
          {bhk} <span className="mx-2 text-gray-300">|</span> {areaRange}
        </div>

        {/* Button */}
        <div className="mt-4 flex justify-center items-center">
          <button className="w-28 rounded-full bg-theme-primary px-4 py-2 text-white font-light hover:bg-red-600 transition">
            View All
          </button>
        </div>
      </div>
    </div>
  );
}
