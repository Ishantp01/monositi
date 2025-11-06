import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import GradientHeading from "../common/GradientHeading";
import BuilderCard from "../Cards/BuilderCard";
import { buildersApi } from "../../utils/buildersApi";

const Builders = () => {
  const [builders, setBuilders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBuilders();
  }, []);

  const fetchBuilders = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await buildersApi.getPublicBuilders({
        limit: 12,
      });

      if (response.success) {
        setBuilders(response.data || []);
      }
    } catch (err) {
      console.error("Error fetching builders:", err);
      setError("Something went wrong while fetching builders");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f73c56] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading builders...</p>
        </div>
      );
    }

    if (error) {
      return <div className="text-center text-red-600 py-8">{error}</div>;
    }

    if (!builders.length) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600">No verified builders available</p>
        </div>
      );
    }

    if (builders.length <= 4) {
      return (
        <div className="container mx-auto max-w-7xl px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {builders.map((builder) => (
              <div key={builder._id} className="flex">
                <BuilderCard builder={builder} />
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto max-w-7xl px-4 lg:px-6">
        <div className="relative">
          <button className="builders-prev-btn absolute top-1/2 -left-4 sm:-left-6 z-10 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-[#f73c56] rounded-full flex items-center justify-center shadow-lg hover:bg-[#e9334e] transition-colors">
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
          <button className="builders-next-btn absolute top-1/2 -right-4 sm:-right-6 z-10 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-[#f73c56] rounded-full flex items-center justify-center shadow-lg hover:bg-[#e9334e] transition-colors">
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            loop={true}
            navigation={{
              nextEl: ".builders-next-btn",
              prevEl: ".builders-prev-btn",
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            className="builders-swiper"
          >
            {builders.map((builder) => (
              <SwiperSlide key={builder._id}>
                <BuilderCard builder={builder} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    );
  };

  return (
    <div className="py-8">
      <div className="container mx-auto max-w-7xl px-4 lg:px-6">
        <GradientHeading text="Verified Builders" />
      </div>

      <div className="my-8 md:my-16">{renderContent()}</div>

      {/* Show All Buttons */}
      <div className="container mx-auto max-w-7xl px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Link
            to="/builders-list"
            className="inline-flex items-center justify-center px-8 py-3 bg-[#f73c56] text-white font-semibold rounded-lg hover:bg-[#e9334e] transition-colors shadow-md"
          >
            <Building2 className="w-5 h-5 mr-2" />
            View All Builders
            <ChevronRight className="w-5 h-5 ml-2" />
          </Link>
          <Link
            to="/projects-list"
            className="inline-flex items-center justify-center px-8 py-3 bg-white text-[#f73c56] border-2 border-[#f73c56] font-semibold rounded-lg hover:bg-[#f73c56] hover:text-white transition-colors shadow-md"
          >
            <Building2 className="w-5 h-5 mr-2" />
            View All Projects
            <ChevronRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Builders;
