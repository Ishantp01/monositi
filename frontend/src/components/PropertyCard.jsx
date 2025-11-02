import React from 'react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property, variant = 'default' }) => {
  const {
    _id,
    title,
    price,
    propertyType,
    address,
    photos,
    bedrooms,
    bathrooms,
    area,
    isVerified,
    isFeatured
  } = property;

  // Determine card style based on variant
  const isCompact = variant === 'compact';

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${isCompact ? 'max-w-xs' : 'w-full'}`}>
      {/* Property Image */}
      <div className="relative">
        <img
          src={photos?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={title}
          className={`w-full object-cover ${isCompact ? 'h-40' : 'h-52'}`}
          onError={(e) => {
            console.log('Image failed to load:', photos?.[0]);
            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
          onLoad={() => {
            console.log('Image loaded successfully:', photos?.[0]);
          }}
        />

        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {isVerified && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Verified</span>
          )}
          {isFeatured && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Featured</span>
          )}
        </div>
      </div>

      {/* Property Details */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className={`font-semibold text-gray-800 ${isCompact ? 'text-sm' : 'text-lg'}`}>
            {title}
          </h3>
          <p className="text-green-600 font-bold">₹{price.toLocaleString()}</p>
        </div>

        <p className="text-gray-500 text-sm mb-3">
          {address?.area}, {address?.city}
        </p>

        {/* Property Specs */}
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          {bedrooms !== undefined && (
            <span>{bedrooms} {bedrooms === 1 ? 'Bed' : 'Beds'}</span>
          )}
          {bathrooms !== undefined && (
            <span>{bathrooms} {bathrooms === 1 ? 'Bath' : 'Baths'}</span>
          )}
          {area && <span>{area} sq.ft</span>}
        </div>

        {/* Property Type Badge */}
        <div className="flex items-center justify-between">
          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
            {propertyType}
          </span>

          {/* View Details Button */}
          <Link
            to={property.sub_category === 'Rent' ? `/rent-details/${_id}` : `/buy-details/${_id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;