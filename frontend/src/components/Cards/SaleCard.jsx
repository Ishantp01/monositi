import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Home, Maximize, Bed, Bath, Car, TrendingUp, Phone, Eye, CheckCircle } from "lucide-react";

export default function SaleCard({
  image,
  title,
  subtitle,
  description,
  price, // e.g. "₹1.10 Cr"
  pricePer, // e.g. "₹9345 per sqft"
  rightCta1 = "Request Callback",
  rightCta2 = "View Details",
  builderName, // e.g. "Provident Housi..."
  since, // e.g. "2018"
  features = [], // [{label, value}, ...]
  _id, // Property ID for navigation
}) {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleViewDetails = () => {
    if (_id) {
      navigate(`/buy-details/${_id}`);
    }
  };

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
    <div className="group w-full rounded-2xl border-2 border-emerald-200 bg-white shadow-lg overflow-hidden hover:shadow-2xl hover:border-emerald-400 transition-all duration-300">
      <div className="flex flex-col lg:flex-row">
        {/* Left Image - Enhanced with Overlay */}
        <div className="lg:w-[380px] xl:w-[420px] 2xl:w-[460px] h-72 lg:h-auto relative overflow-hidden">
          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-100 via-emerald-200 to-emerald-100 animate-pulse" />
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
              <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-sm">
                <CheckCircle className="w-3.5 h-3.5" />
                {status}
              </span>
            </div>
          )}
          
          {/* Price on Image */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-2xl">
              <p className="text-2xl lg:text-3xl font-black text-emerald-600 mb-1">
                {price}
              </p>
              <p className="text-sm text-gray-600 font-semibold">{pricePer}</p>
            </div>
          </div>
        </div>

        {/* Middle content - Enhanced */}
        <div className="flex-1 p-6 lg:p-8 bg-gradient-to-br from-white to-emerald-50/30">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
            {title}
          </h2>
          <div className="flex items-center gap-2 text-gray-600 text-sm lg:text-base mb-4">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <p className="line-clamp-1">{subtitle}</p>
          </div>

          {/* Key Features Grid - Enhanced */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {superArea && (
              <div className="bg-white border border-emerald-200 rounded-lg p-3 flex items-center gap-2 shadow-sm">
                <Maximize className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-xs text-gray-600 font-medium">Area</p>
                  <p className="text-sm font-bold text-gray-900">{superArea}</p>
                </div>
              </div>
            )}
            {bedrooms && (
              <div className="bg-white border border-emerald-200 rounded-lg p-3 flex items-center gap-2 shadow-sm">
                <Bed className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-xs text-gray-600 font-medium">Beds</p>
                  <p className="text-sm font-bold text-gray-900">{bedrooms}</p>
                </div>
              </div>
            )}
            {bathrooms && (
              <div className="bg-white border border-emerald-200 rounded-lg p-3 flex items-center gap-2 shadow-sm">
                <Bath className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-xs text-gray-600 font-medium">Baths</p>
                  <p className="text-sm font-bold text-gray-900">{bathrooms}</p>
                </div>
              </div>
            )}
            {parking && (
              <div className="bg-white border border-emerald-200 rounded-lg p-3 flex items-center gap-2 shadow-sm">
                <Car className="w-5 h-5 text-emerald-600" />
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

          {/* Builder Info */}
          <div className="flex items-center gap-3 pt-4 border-t border-emerald-100">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Builder</p>
              <p className="text-sm font-bold text-gray-900">{builderName}</p>
            </div>
            <div className="ml-auto">
              <p className="text-xs text-gray-500 font-medium">Since</p>
              <p className="text-sm font-bold text-gray-900">{since}</p>
            </div>
          </div>
        </div>

        {/* Right CTA - Enhanced */}
        <aside className="lg:w-64 xl:w-72 2xl:w-80 relative flex lg:block justify-between items-center p-6 bg-gradient-to-br from-emerald-50 to-green-50 border-t lg:border-t-0 lg:border-l-2 border-emerald-200">
          <div className="space-y-3 w-full">
            <button 
              className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-emerald-600 text-emerald-600 py-3 px-4 text-sm font-bold bg-white hover:bg-emerald-50 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Phone className="w-4 h-4" />
              {rightCta1}
            </button>
            <button
              onClick={handleViewDetails}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white py-3 px-4 text-sm font-bold hover:from-emerald-700 hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Eye className="w-4 h-4" />
              {rightCta2}
            </button>

            {/* Investment Highlight */}
            <div className="mt-6 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-emerald-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <p className="text-xs font-bold text-gray-700 uppercase">Investment Value</p>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Prime location property with excellent appreciation potential
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
