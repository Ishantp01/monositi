"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";

// Dummy Data
const featuredPGs = [
  {
    title: "Skyline PG and Co-living PG",
    location: "Ranjhi",
    price: "₹11,000",
    facilities: "🍽️📶🛏️ +12 More",
    tags: ["For Boys & Girls", "All Preferred"],
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200",
  },
  {
    title: "BlueSky PG and Hostel",
    location: "Vijay Nagar",
    price: "₹9,500",
    facilities: "🔑🛏️🚖 +12 More",
    tags: ["For Boys & Girls", "All Preferred"],
    image:
      "https://images.unsplash.com/photo-1600585154154-8bbf65f1b0de?w=1200",
  },
];

const wifiPGs = [
  {
    title: "Skyline PG for Ladies",
    location: "Monositi Hostel, Vijay Nagar",
    price: "₹11,000",
    facilities: "🍽️📶🛏️ +12 More",
    tags: ["For Boys & Girls", "All Preferred"],
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
  },
  {
    title: "Sunrise PG for Boys",
    location: "Sunrise Hostel, Indore",
    price: "₹9,800",
    facilities: "🔑🛏️🚖 +12 More",
    tags: ["For Boys & Girls", "All Preferred"],
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200",
  },
  {
    title: "Rose PG for Girls",
    location: "Rose Residency, Bhopal",
    price: "₹12,200",
    facilities: "🥘📶🚖 +12 More",
    tags: ["For Boys & Girls", "All Preferred"],
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200",
  },
  {
    title: "Elite PG",
    location: "Elite Hostel, Mumbai",
    price: "₹10,500",
    facilities: "🍽️📶🚆 +12 More",
    tags: ["For Boys & Girls", "All Preferred"],
    image:
      "https://images.unsplash.com/photo-1600585154154-8bbf65f1b0de?w=1200",
  },
];

// Card Component
const PGCard = ({ pg, onViewDetails }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md flex flex-col">
      {/* Image */}
      <img
        src={pg.image}
        alt={pg.title}
        className="w-full h-48 object-cover"
      />
      {/* Details */}
      <div className="p-4 flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-red-600 text-lg font-bold">{pg.price}</p>
            <p className="text-gray-500 text-sm -mt-1">Onwards</p>
          </div>
        </div>
        <p className="text-gray-600 text-sm">{pg.location}</p>
        <h3 className="font-semibold text-black">{pg.title}</h3>
        <div className="flex gap-2 mt-1 flex-wrap">
          {pg.tags.map((tag, i) => (
            <span
              key={i}
              className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-600">
          Key Facilities: {pg.facilities}
        </p>
        <button 
          onClick={onViewDetails}
          className="mt-3 border border-red-600 text-red-600 rounded-full px-4 py-2 text-sm font-medium hover:bg-red-50 transition"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

// Slider Template
const PGCarousel = ({ title, pgs, onViewDetails }) => {
  return (
    <div className="relative mx-auto max-w-[95%] mb-10">
      {/* Heading */}
      <h2 className="text-2xl font-bold mb-4 text-red-700">{title}</h2>

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
        {pgs.map((pg, index) => (
          <SwiperSlide key={index}>
            <PGCard pg={pg} onViewDetails={onViewDetails} />
          </SwiperSlide>
        ))}
      </Swiper>

     
    </div>
  );
};

// Export Component with Both Sections
const PGSections = ({ onViewDetails }) => {
  return (
    <div>
      <PGCarousel title="" pgs={featuredPGs} onViewDetails={onViewDetails} />
      <PGCarousel title="PG Homes with Wi-Fi" pgs={wifiPGs} onViewDetails={onViewDetails} />
    </div>
  );
};

export default PGSections;
