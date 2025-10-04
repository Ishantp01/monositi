"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";

const properties = [
  {
    title: "L&T Raintree Boulevard",
    subtitle: "Herbal",
    price: "₹50,000-1.5 Lac",
    details: "3,4 BHK Flat | 1320-2850 sqft",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
  },
  {
    title: "L&T Raintree Boulevard",
    subtitle: "Herbal",
    price: "₹50,000-1.5 Lac",
    details: "3,4 BHK Flat | 1320-2850 sqft",
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200",
  },
  {
    title: "L&T Raintree Boulevard",
    subtitle: "Herbal",
    price: "₹50,000-1.5 Lac",
    details: "3,4 BHK Flat | 1320-2850 sqft",
    image:
      "https://images.unsplash.com/photo-1600585154154-8bbf65f1b0de?w=1200",
  },
  {
    title: "L&T Raintree Boulevard",
    subtitle: "Herbal",
    price: "₹50,000-1.5 Lac",
    details: "3,4 BHK Flat | 1320-2850 sqft",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200",
  },
];

const PropertyCard = ({ property, onViewDetails }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md flex flex-col">
      {/* Image */}
      <img
        src={property.image}
        alt={property.title}
        className="w-full h-56 object-cover"
      />
      {/* Content */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-semibold">{property.title}</h3>
        <p className="text-sm text-gray-500">{property.subtitle}</p>
        <p className="text-xl font-bold text-black">{property.price}</p>
        <p className="text-sm text-gray-600">{property.details}</p>
        <button 
          onClick={onViewDetails}
          className="mt-3 bg-red-600 text-white rounded-full px-5 py-2 font-medium hover:bg-red-700 transition"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

const PropertyCarousel = ({ onViewDetails }) => {
  return (
    <div className="relative mx-auto max-w-[95%]">
      <h2 className="text-2xl font-bold mb-4 text-red-700">
        Exclusive Owner Properties
      </h2>

      {/* Left Arrow */}
      <div className="absolute top-1/2 -left-[4%] sm:-left-6 z-10 -translate-y-1/2">
        <button className="prev-btn w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-full flex items-center justify-center shadow hover:scale-110 transition">
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>
      </div>

      {/* Right Arrow */}
      <div className="absolute top-1/2 -right-[4%] sm:-right-6 z-10 -translate-y-1/2">
        <button className="next-btn w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-full flex items-center justify-center shadow hover:scale-110 transition">
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>
      </div>

      {/* Swiper */}
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={1}
        loop={true}
        navigation={{
          nextEl: ".next-btn",
          prevEl: ".prev-btn",
        }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
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

export default PropertyCarousel;
