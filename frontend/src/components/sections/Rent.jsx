import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import GradientHeading from "../common/GradientHeading";
import PropertyCard from "../PropertyCard";
import { propertyApi } from "../../utils/propertyApi";

const Rent = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRentProperties();
  }, []);

  const fetchRentProperties = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await propertyApi.searchProperties({
        sub_category: 'Rent',
        limit: 12
      });

      if (response.success) {
        setProperties(response.properties || []);
      } else {
        setError("Failed to fetch rental properties");
      }
    } catch (err) {
      console.error("Error fetching rent properties:", err);
      setError("Something went wrong while fetching properties");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f73c56] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading rental properties...</p>
        </div>
      );
    }

    if (error) {
      return <div className="text-center text-red-600 py-8">{error}</div>;
    }

    if (!properties.length) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600">No rental properties available</p>
        </div>
      );
    }

    // If 4 or fewer properties, show them in a grid
    if (properties.length <= 4) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          {properties.map((property) => (
            <PropertyCard
              key={property._id}
              property={property}
            />
          ))}
        </div>
      );
    }

    // If more than 4 properties, show carousel
    return (
      <div className="relative mx-auto max-w-[95%]">
        {/* Navigation Arrows */}
        <button className="rent-prev-btn absolute top-1/2 -left-4 sm:-left-6 z-10 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-[#f73c56] rounded-full flex items-center justify-center shadow-lg hover:bg-[#e9334e] transition-colors">
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>
        <button className="rent-next-btn absolute top-1/2 -right-4 sm:-right-6 z-10 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-[#f73c56] rounded-full flex items-center justify-center shadow-lg hover:bg-[#e9334e] transition-colors">
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation={{
            nextEl: ".rent-next-btn",
            prevEl: ".rent-prev-btn"
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true
          }}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false
          }}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className="rent-properties-swiper"
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

  return (
    <div className="py-8">
      <GradientHeading text="Properties for Rent" />

      <div className="my-8 md:my-16">
        {renderContent()}
      </div>

      {/* Show All Projects Button */}
      <div className="text-center mt-8">
        <Link
          to="/rentlist"
          className="inline-flex items-center px-8 py-3 bg-[#f73c56] text-white font-semibold rounded-lg hover:bg-[#e9334e] transition-colors shadow-md"
        >
          Show All Projects
          <ChevronRight className="w-5 h-5 ml-2" />
        </Link>
      </div>
    </div>
  );
};
export default Rent;
