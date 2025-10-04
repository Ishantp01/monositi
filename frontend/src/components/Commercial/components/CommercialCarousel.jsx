"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";

const commercials = [
  {
    title: "Office Place On Lease",
    image:
      "https://images.unsplash.com/photo-1600585154154-8bbf65f1b0de?w=1200",
  },
  {
    title: "Shop & Showroom On Lease",
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200",
  },
  {
    title: "Co-working Space",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200",
  },
  {
    title: "Plot On Lease",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200",
  },
];

// ✅ Card Component
const CommercialCard = ({ commercial, onViewDetails }) => {
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-md">
      {/* Background Image */}
      <img
        src={commercial.image}
        alt={commercial.title}
        className="w-full h-60 object-cover"
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-4">
        <h3 className="text-white font-semibold text-lg">{commercial.title}</h3>
        <button 
          onClick={onViewDetails}
          className="text-white underline text-sm mt-1 hover:text-red-300 transition-colors duration-200"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

// ✅ Carousel Component
const CommercialCarousel = ({ onViewDetails }) => {
  return (
    <div className="relative mx-auto max-w-[95%]">
      {/* Heading */}


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
          1280: { slidesPerView: 4 },
        }}
      >
        {commercials.map((commercial, index) => (
          <SwiperSlide key={index}>
            <CommercialCard commercial={commercial} onViewDetails={onViewDetails} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CommercialCarousel;
