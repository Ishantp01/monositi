"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";

const hostels = [
  {
    title: "Student Friendly PG’s",
    image:
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1200",
  },
  {
    title: "PG For Girls",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
  },
  {
    title: "PG For Boys",
    image:
      "https://images.unsplash.com/photo-1600585154154-8bbf65f1b0de?w=1200",
  },
  {
    title: "Hostel For Girls",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200",
  },
];

const HostelCard = ({ hostel, onViewDetails }) => {
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-md">
      {/* Background Image */}
      <img
        src={hostel.image}
        alt={hostel.title}
        className="w-full h-60 object-cover"
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-4">
        <h3 className="text-white font-semibold text-lg">{hostel.title}</h3>
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

const HostelCarousel = ({ onViewDetails }) => {
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
        {hostels.map((hostel, index) => (
          <SwiperSlide key={index}>
            <HostelCard hostel={hostel} onViewDetails={onViewDetails} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HostelCarousel;
