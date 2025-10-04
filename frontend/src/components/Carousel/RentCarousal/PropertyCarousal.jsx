"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";

const properties = [
  {
    bhk: "2 BHK",
    price: "₹15,000",
    size: "1100 sqft",
    location: "Phase 1, IT Park (Jabalpur)",
    status: "Ready To Move",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
  },
  {
    bhk: "3 BHK",
    price: "₹23,000",
    size: "1500 sqft",
    location: "Viman Nagar, Pune",
    status: "Ready To Move",
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200",
  },
  {
    bhk: "4 BHK",
    price: "₹45,000",
    size: "2200 sqft",
    location: "Sector 62, Noida",
    status: "Under Construction",
    image:
      "https://images.unsplash.com/photo-1600585154154-8bbf65f1b0de?w=1200",
  },
  {
    bhk: "1 BHK",
    price: "₹10,000",
    size: "700 sqft",
    location: "Koramangala, Bangalore",
    status: "Ready To Move",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200",
  },
];

const PropertyCard = ({ property, onViewDetails }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md flex flex-col">
      <img
        src={property.image}
        alt={property.bhk}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex flex-col gap-1">
        <h3 className="text-lg font-semibold">{property.bhk}</h3>
        <p className="text-red-600 font-bold">
          {property.price}{" "}
          <span className="text-gray-600 font-normal">| {property.size}</span>
        </p>
        <p className="text-sm text-gray-500">{property.location}</p>
        <p className="text-sm text-gray-700 font-medium">{property.status}</p>
        <button
          onClick={onViewDetails}
          className="mt-3 w-full px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors duration-200"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

const PropertyCarouselViewAll = ({ onViewDetails }) => {
  return (
    <div className="relative mx-auto max-w-[95%]">
      {/* Left Arrow */}
      <div className="absolute top-1/2 -left-[4%] sm:-left-6 z-10 -translate-y-1/2">
        <button className="prev-btn-1 w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-full flex items-center justify-center shadow hover:scale-110 transition">
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>
      </div>
      {/* Right Arrow */}
      <div className="absolute top-1/2 -right-[4%] sm:-right-6 z-10 -translate-y-1/2">
        <button className="next-btn-1 w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-full flex items-center justify-center shadow hover:scale-110 transition">
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={4}   // ✅ Show 4 by default
        loop={true}
        navigation={{
          nextEl: ".next-btn-1",
          prevEl: ".prev-btn-1",
        }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 }, // ✅ Always 4 on desktop
        }}
      >
        {properties.map((property, index) => (
          <SwiperSlide key={index}>
            <PropertyCard property={property} onViewDetails={onViewDetails} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PropertyCarouselViewAll;
