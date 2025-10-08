import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import PropertyCard2 from "../Cards/PropertyCard2";

const PropertySlider5 = ({ properties, id }) => {
  return (
    <div className="relative mx-auto max-w-[90%]">
      {/* Custom Navigation Arrows */}
      <div className="absolute top-1/2 -left-[4%] sm:-left-6 z-10 -translate-y-1/2">
        <button
          className={`prev-btn${id} w-10 h-10 sm:w-12 sm:h-12 bg-theme-primary rounded-full flex items-center justify-center transition-all duration-300 group`}
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white y transition-transform duration-300 group-hover:scale-125" />
        </button>
      </div>

      <div className="absolute top-1/2 -right-[4%] sm:-right-6 z-10 -translate-y-1/2">
        <button
          className={`next-btn${id} w-10 h-10 sm:w-12 sm:h-12 bg-theme-primary rounded-full flex items-center justify-center transition-all duration-300 group`}
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white transition-transform duration-300 group-hover:scale-125" />
        </button>
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={1}
        loop={true}
        navigation={{
          nextEl: `.next-btn${id}`,
          prevEl: `.prev-btn${id}`,
        }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
      >
        {properties.map((property, index) => (
          <SwiperSlide key={index}>
            {/* <PgCard data={property} /> */}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PropertySlider5;
