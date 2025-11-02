import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import PropertyCard from '../PropertyCard';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const StandardPropertySlider = ({
  properties,
  title = "Properties",
  subtitle = "",
  autoplay = true,
  slidesPerView = { base: 1, sm: 2, md: 3, lg: 4 }
}) => {
  if (!properties || properties.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No properties available
      </div>
    );
  }

  return (
    <div className="py-8 max-w-7xl">
      {/* Section Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
      </div>

      {/* Swiper Slider */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={autoplay ? { delay: 5000, disableOnInteraction: false } : false}
        breakpoints={{
          640: { slidesPerView: slidesPerView.sm || 2 },
          768: { slidesPerView: slidesPerView.md || 3 },
          1024: { slidesPerView: slidesPerView.lg || 4 },
        }}
        className="property-slider"
      >
        {properties.map((property) => (
          <SwiperSlide key={property._id}>
            <PropertyCard property={property} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default StandardPropertySlider;