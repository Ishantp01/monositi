import React from "react";
import { Link } from "react-router-dom";

export default function PropertyCard2({ data, area = true }) {
  const formatINR = (n) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

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
  
  const propertyLink = getPropertyLink(data);

  return (
    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xs xl:max-w-sm mx-auto overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300">
      <Link to={propertyLink}>
        <img
          src={data.image}
          alt={data.bhk}
          className="h-44 w-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </Link>

      <div className="p-4">
        <Link to={propertyLink}>
          <div className="text-base font-semibold text-gray-900 hover:text-theme-primary transition-colors">
            {data.bhk}
          </div>
        </Link>

        <div className="mt-1 flex flex-wrap items-center gap-3">
          <span className="text-lg font-extrabold text-black">
            {formatINR(data.price)}
          </span>
          {
            area ? (
              <>
                <span aria-hidden className="h-4 w-px bg-slate-900" />

                <span className="text-lg font-extrabold text-black">
                  {data?.area}
                  <span className="ml-1 font-bold">{data?.unit}</span>
                </span>
              </>
            ) : null
          }

        </div>

        <div className="mt-3 text-gray-400">{data.location}</div>
        <div className="mt-3 text-gray-400">{data.status}</div>
        
        {/* Additional property details for dynamic content */}
        {data.title && (
          <div className="mt-2 text-sm text-gray-600 font-medium">
            {data.title}
          </div>
        )}
        
        {data.propertyType && (
          <div className="mt-1 text-xs text-gray-500">
            {data.propertyType}
          </div>
        )}
      </div>
    </div>
  );
}
