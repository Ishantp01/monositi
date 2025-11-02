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

const Buy = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBuyProperties();
  }, []);

  const fetchBuyProperties = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await propertyApi.searchProperties({
        sub_category: 'Buy',
        limit: 12
      });

      if (response.success) {
        setProperties(response.properties || []);
      } else {
        setError("Failed to fetch properties for sale");
      }
    } catch (err) {
      console.error("Error fetching buy properties:", err);
      setError("Something went wrong while fetching properties");
    } finally {
      setLoading(false);
    }
  };

  // Transform API properties to match PropertyCard component format
  const transformProperties = (apiProperties) => {
    return apiProperties.map(property => {
      // Debug logging for images
      console.log('Property images:', property.property_features?.images);

      return {
        _id: property._id,
        title: property.name || `${property.type} Property in ${property.city}`,
        price: property.price,
        propertyType: property.type,
        address: {
          area: property.address,
          city: property.city
        },
        bedrooms: property.property_features?.units || 1,
        bathrooms: Math.ceil((property.property_features?.units || 1) / 2),
        area: property.property_features?.size || 1000,
        isVerified: property.monositi_verified,
        photos: property.property_features?.images && property.property_features.images.length > 0
          ? property.property_features.images
          : [
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
          ],
        type: property.type,
        sub_category: property.sub_category
      };
    });
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f73c56] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading properties for sale...</p>
        </div>
      );
    }

    if (error) {
      return <div className="text-center text-red-600 py-8">{error}</div>;
    }

    if (!properties.length) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600">No properties for sale available</p>
        </div>
      );
    }

    // Transform properties for PropertyCard component
    const transformedProperties = transformProperties(properties);

    // If 4 or fewer properties, show them in a grid
    if (transformedProperties.length <= 4) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          {transformedProperties.map((property) => (
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
        <button className="buy-prev-btn absolute top-1/2 -left-4 sm:-left-6 z-10 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-[#f73c56] rounded-full flex items-center justify-center shadow-lg hover:bg-[#e9334e] transition-colors">
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>
        <button className="buy-next-btn absolute top-1/2 -right-4 sm:-right-6 z-10 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-[#f73c56] rounded-full flex items-center justify-center shadow-lg hover:bg-[#e9334e] transition-colors">
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation={{
            nextEl: ".buy-next-btn",
            prevEl: ".buy-prev-btn"
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false
          }}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className="buy-properties-swiper"
        >
          {transformedProperties.map((property) => (
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
      <GradientHeading text="Properties for Sale" />

      <div className="my-8 md:my-16">
        {renderContent()}
      </div>

      {/* Show All Projects Button */}
      <div className="text-center mt-8">
        <Link
          to="/salelist"
          className="inline-flex items-center px-8 py-3 bg-[#f73c56] text-white font-semibold rounded-lg hover:bg-[#e9334e] transition-colors shadow-md"
        >
          Show All Projects
          <ChevronRight className="w-5 h-5 ml-2" />
        </Link>
      </div>
    </div>
  );
};
export default Buy;
