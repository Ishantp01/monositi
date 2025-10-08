import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import PropertyCard from "../Cards/PropertyCard";
import { propertyApi } from "../../utils/propertyApi"; // import the API object

const PropertyCarousel = ({ tags }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (tags) fetchProperties(tags);
  }, [tags]);

  const fetchProperties = async (tags) => {
    setLoading(true);
    setError("");

    try {
      // Use the getPropertiesByTags function which has the correct endpoint
      const data = await propertyApi.getPropertiesByTags(tags);
      console.log(data);

      if (data.success) {
        // Properties are already sorted by the API (featured first, then popular, then the rest)
        setProperties(data.properties);
      } else {
        setError(data.message || "Failed to fetch properties");
      }
    } catch (err) {
      console.error("Error in PropertyCarousel:", err);
      setError("Something went wrong while fetching properties");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading)
      return <div className="text-center py-8">Loading properties...</div>;
    if (error)
      return <div className="text-center text-red-600 py-8">{error}</div>;
    if (!properties.length)
      return (
        <div className="text-center py-8">No properties found for "{tags}"</div>
      );

    return (
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={1}
        loop
        navigation={{ nextEl: ".next-btn", prevEl: ".prev-btn" }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
      >
        {properties.map((property) => (
          <SwiperSlide key={property._id}>
            <PropertyCard data={property} link={`/details/${property._id}`} />
          </SwiperSlide>
        ))}
      </Swiper>
    );
  };

  return (
    <div className="relative mx-auto max-w-[90%]">
      {/* Navigation Arrows */}
      <button className="prev-btn absolute top-1/2 -left-[4%] sm:-left-6 z-10 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-theme-primary rounded-full flex items-center justify-center">
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </button>
      <button className="next-btn absolute top-1/2 -right-[4%] sm:-right-6 z-10 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-theme-primary rounded-full flex items-center justify-center">
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </button>

      {renderContent()}
    </div>
  );
};

export default PropertyCarousel;
