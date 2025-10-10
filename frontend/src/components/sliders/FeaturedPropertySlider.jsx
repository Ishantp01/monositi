import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { Link } from "react-router-dom";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const FeaturedPropertySlider = ({ properties }) => {
  if (!properties || properties.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        className="h-[500px] w-full"
      >
        {properties.map((property) => (
          <SwiperSlide key={property._id}>
            <div className="relative h-full w-full">
              {/* Property Image */}
              <img
                src={
                  property.photos?.[0] ||
                  "https://via.placeholder.com/1200x500?text=No+Image"
                }
                alt={property.title}
                className="w-full h-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="max-w-3xl mx-auto">
                  {property.isVerified && (
                    <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full mb-4 inline-block">
                      Monositi Verified
                    </span>
                  )}

                  <h2 className="text-3xl font-bold mb-2">{property.title}</h2>

                  <p className="text-lg mb-3">
                    {property.address?.area}, {property.address?.city}
                  </p>

                  <div className="flex items-center gap-6 mb-6">
                    <div className="flex items-center">
                      <span className="text-xl font-bold">
                        ₹{property.price.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex gap-4 text-sm">
                      {property.bedrooms !== undefined && (
                        <span>
                          {property.bedrooms}{" "}
                          {property.bedrooms === 1 ? "Bedroom" : "Bedrooms"}
                        </span>
                      )}
                      {property.bathrooms !== undefined && (
                        <span>
                          {property.bathrooms}{" "}
                          {property.bathrooms === 1 ? "Bathroom" : "Bathrooms"}
                        </span>
                      )}
                      {property.area && <span>{property.area} sq.ft</span>}
                    </div>
                  </div>

                  <Link
                    to={`/properties/${property._id}`}
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-300"
                  >
                    View Property
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FeaturedPropertySlider;
