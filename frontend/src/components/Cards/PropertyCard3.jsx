import React from "react";
import { Link } from "react-router-dom";

export default function PropertyCard3({
  data,
  title = "L&T Raintree Boulevard",
  subtitle = "Herbal",
  priceRange = "₹50,000-1.5 Lac",
  bhk = "3,4 BHK Flat",
  areaRange = "1320-2850 sqft",
  image = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
  link = "/"
}) {
  // Use data prop if available, otherwise fall back to individual props
  const propertyData = data || {
    title,
    subtitle,
    priceRange,
    bhk,
    areaRange,
    image,
    link
  };

  // Create dynamic link based on property ID and type
  const getPropertyLink = (property) => {
    if (property.type === "Office Space" || property.type === "Commercial") {
      return `/commercial-details/${property.id}`;
    } else if (property.propertyType === "PG" || property.propertyType === "Hostel") {
      return `/pg-details/${property.id}`;
    } else {
      return `/property-details/${property.id}`;
    }
  };
  
  const propertyLink = data?.id ? getPropertyLink(data) : link;

  const formatINR = (price) => {
    if (typeof price === 'number') {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(price);
    }
    return price;
  };

  return (
    <div className="w-80 mx-auto overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Image Section */}
      <Link to={propertyLink}>
        <img
          src={propertyData.image}
          alt={propertyData.title}
          className="h-44 w-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </Link>

      {/* Content Section */}
      <div className="p-4 px-6">
        <Link to={propertyLink}>
          <h2 className="text-lg font-semibold text-gray-900 hover:text-theme-primary transition-colors">
            {propertyData.title}
          </h2>
          <p className="text-gray-400 text-sm mt-1">{propertyData.subtitle || propertyData.location}</p>

          <p className="text-xl font-bold text-black mt-3">
            {propertyData.priceRange || formatINR(propertyData.price)}
          </p>

          <div className="mt-1 text-gray-500 text-sm">
            {propertyData.bhk} <span className="mx-2 text-gray-300">|</span> {propertyData.areaRange || `${propertyData.area} ${propertyData.unit || 'sqft'}`}
          </div>
          
          {/* Additional property details for dynamic content */}
          {propertyData.type && (
            <div className="mt-2 text-xs text-gray-500">
              {propertyData.type}
            </div>
          )}
          
          {propertyData.status && (
            <div className="mt-1 text-xs text-green-600 font-medium">
              {propertyData.status}
            </div>
          )}
        </Link>
        
        {/* Button */}
        <div className="mt-4 flex justify-center items-center">
          <Link to={propertyLink}>
            <button className="w-28 rounded-full bg-theme-primary px-4 py-2 text-white font-light hover:bg-red-600 transition-all duration-300 hover:scale-105">
              View All
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
