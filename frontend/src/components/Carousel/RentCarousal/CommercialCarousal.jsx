"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";

const commercialProperties = [
  {
    type: "Office Space",
    price: "₹65,000",
    location: "Civil Lines",
    status: "For Rent",
    image:
      "https://images.unsplash.com/photo-1600585154154-8bbf65f1b0de?w=1200",
  },
  {
    type: "Retail Showroom",
    price: "₹1,20,000",
    location: "Viman Nagar",
    status: "For Lease",
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200",
  },
  {
    type: "Co-working Space",
    price: "₹18,000",
    location: "Sector 62, Noida",
    status: "Available",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200",
  },
  {
    type: "Shop",
    price: "₹90,000",
    location: "Koramangala, Bangalore",
    status: "For Lease",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200",
  },
];

const CommercialCard = ({ property, onViewDetails }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md flex flex-col">
      <img
        src={property.image}
        alt={property.type}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex flex-col gap-1">
        <h3 className="text-lg font-semibold">{property.type}</h3>
        <p className="text-red-600 font-bold">{property.price}</p>
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

const CommercialCarousel = ({ onViewDetails }) => {
  return (
    <div className="relative mx-auto max-w-[95%]">
      {/* Left Arrow */}
      <div className="absolute top-1/2 -left-[4%] sm:-left-6 z-10 -translate-y-1/2">
        <button className="prev-btn-2 w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-full flex items-center justify-center shadow hover:scale-110 transition">
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>
      </div>
      {/* Right Arrow */}
      <div className="absolute top-1/2 -right-[4%] sm:-right-6 z-10 -translate-y-1/2">
        <button className="next-btn-2 w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-full flex items-center justify-center shadow hover:scale-110 transition">
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={4}   // ✅ 4 cards default
        loop={true}
        navigation={{
          nextEl: ".next-btn-2",
          prevEl: ".prev-btn-2",
        }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
      >
        {commercialProperties.map((property, index) => (
          <SwiperSlide key={index}>
            <CommercialCard property={property} onViewDetails={onViewDetails} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CommercialCarousel;
