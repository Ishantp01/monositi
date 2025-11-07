import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Home, Maximize, Bed, Bath, Car, Calendar, MessageCircle, Eye, CheckCircle } from "lucide-react";

export default function RentCard({
  image,
  title,
  subtitle,
  description,
  price, // "₹25,000"
  pricePer, // "₹25 per sqft"
  rightCta1 = "Enquire Now",
  rightCta2 = "View Details",
  ownerName, // "Satpal Singh"
  since, // "2018"
  features = [],
  _id, // Property ID for navigation
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Parse features to get key specs
  const getFeatureValue = (label) => {
    const feature = features.find(f => f.label.toLowerCase().includes(label.toLowerCase()));
    return feature ? feature.value : null;
  };

  const superArea = getFeatureValue("area") || getFeatureValue("super");
  const bedrooms = getFeatureValue("bed") || getFeatureValue("bhk");
  const bathrooms = getFeatureValue("bath");
  const parking = getFeatureValue("park");
  const status = getFeatureValue("status");

  return (
    <Link to={_id ? `/rent-details/${_id}` : "/rent-details"}>
      <div className="group w-full rounded-2xl border-2 border-blue-200 bg-white shadow-lg overflow-hidden hover:shadow-2xl hover:border-blue-400 transition-all duration-300">
        <div className="flex flex-col lg:flex-row">
          {/* Left Image - Enhanced with Blue Theme */}
          <div className="lg:w-[380px] xl:w-[420px] 2xl:w-[460px] h-72 lg:h-auto relative overflow-hidden">
            {/* Loading Skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 animate-pulse" />
            )}
            
            <img
              src={image}
              alt={title}
              loading="lazy"
              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            
            {/* Status Badge */}
            {status && (
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-sm">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {status}
                </span>
              </div>
            )}
            
            {/* Price on Image */}
            <div className="absolute bottom-4 left-4 right-4 z-10">
              <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-2xl">
                <p className="text-2xl lg:text-3xl font-black text-blue-600 mb-1">
                  {price}
                </p>
                <p className="text-sm text-gray-600 font-semibold">{pricePer}/month</p>
              </div>
            </div>
          </div>

          {/* Middle content - Enhanced with Blue Theme */}
          <div className="flex-1 p-6 lg:p-8 bg-gradient-to-br from-white to-blue-50/30">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {title}
            </h2>
            <div className="flex items-center gap-2 text-gray-600 text-sm lg:text-base mb-4">
              <MapPin className="w-4 h-4 text-blue-600" />
              <p className="line-clamp-1">{subtitle}</p>
            </div>

            {/* Key Features Grid - Enhanced */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {superArea && (
                <div className="bg-white border border-blue-200 rounded-lg p-3 flex items-center gap-2 shadow-sm">
                  <Maximize className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Area</p>
                    <p className="text-sm font-bold text-gray-900">{superArea}</p>
                  </div>
                </div>
              )}
              {bedrooms && (
                <div className="bg-white border border-blue-200 rounded-lg p-3 flex items-center gap-2 shadow-sm">
                  <Bed className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Beds</p>
                    <p className="text-sm font-bold text-gray-900">{bedrooms}</p>
                  </div>
                </div>
              )}
              {bathrooms && (
                <div className="bg-white border border-blue-200 rounded-lg p-3 flex items-center gap-2 shadow-sm">
                  <Bath className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Baths</p>
                    <p className="text-sm font-bold text-gray-900">{bathrooms}</p>
                  </div>
                </div>
              )}
              {parking && (
                <div className="bg-white border border-blue-200 rounded-lg p-3 flex items-center gap-2 shadow-sm">
                  <Car className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Parking</p>
                    <p className="text-sm font-bold text-gray-900">{parking}</p>
                  </div>
                </div>
              )}
            </div>

            <p className="text-sm lg:text-base text-gray-700 leading-relaxed line-clamp-3 mb-4">
              {description}
            </p>

            {/* Owner Info */}
            <div className="flex items-center gap-3 pt-4 border-t border-blue-100">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Owner</p>
                <p className="text-sm font-bold text-gray-900">{ownerName}</p>
              </div>
              <div className="ml-auto">
                <p className="text-xs text-gray-500 font-medium">Since</p>
                <p className="text-sm font-bold text-gray-900">{since}</p>
              </div>
            </div>
          </div>

          {/* Right CTA - Enhanced with Blue Theme */}
          <aside className="lg:w-64 xl:w-72 2xl:w-80 relative flex lg:block justify-between items-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-t lg:border-t-0 lg:border-l-2 border-blue-200">
            <div className="space-y-3 w-full">
              <button 
                className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-blue-600 text-blue-600 py-3 px-4 text-sm font-bold bg-white hover:bg-blue-50 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <MessageCircle className="w-4 h-4" />
                {rightCta1}
              </button>
              <button
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-4 text-sm font-bold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Eye className="w-4 h-4" />
                {rightCta2}
              </button>

              {/* Rental Highlight */}
              <div className="mt-6 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-blue-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <p className="text-xs font-bold text-gray-700 uppercase">Flexible Lease</p>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Well-maintained property with immediate possession available
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Link>
  );
}
