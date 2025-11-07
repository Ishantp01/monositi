import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import GradientHeading from "../common/GradientHeading";
import UnifiedPropertyCard from "../Cards/UnifiedPropertyCard";
import ProjectCard from "../Cards/ProjectCard";
import { propertyApi } from "../../utils/propertyApi";
import { buildersApi } from "../../utils/buildersApi";
import Banner from "../common/Banner";

const RealEstate = () => {
  const [activeCategory, setActiveCategory] = useState("Buy");
  const [buyProperties, setBuyProperties] = useState([]);
  const [rentProperties, setRentProperties] = useState([]);
  const [builderProjects, setBuilderProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = ["Buy", "Rent"];

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    setError("");

    try {
      // Fetch Buy properties
      const buyResponse = await propertyApi.searchProperties({
        sub_category: "Buy",
        limit: 12,
      });

      // Fetch Rent properties
      const rentResponse = await propertyApi.searchProperties({
        sub_category: "Rent",
        limit: 12,
      });

      // Fetch Builder Projects (verified projects created by admin)
      const projectsResponse = await buildersApi.getPublicProjects({
        limit: 12,
      });

      if (buyResponse.success) {
        setBuyProperties(buyResponse.properties || []);
      }
      if (rentResponse.success) {
        setRentProperties(rentResponse.properties || []);
      }
      if (projectsResponse.success) {
        setBuilderProjects(projectsResponse.data || []);
      }
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError("Something went wrong while fetching properties");
    } finally {
      setLoading(false);
    }
  };

  // Transform API properties to match UnifiedPropertyCard format
  const transformProperties = (apiProperties) => {
    return apiProperties.map((property) => ({
      _id: property._id,
      name: property.name,
      title: property.name || `${property.type} Property in ${property.city}`,
      price: property.price,
      propertyType: property.type,
      type: property.type,
      address: property.address,
      city: property.city,
      state: property.state,
      photos: property.property_features?.images || [],
      images: property.property_features?.images || [],
      bedrooms: property.property_features?.units || 0,
      bathrooms: Math.ceil((property.property_features?.units || 1) / 2),
      area: property.property_features?.size || 0,
      size: property.property_features?.size || 0,
      isVerified: property.verification_status === "verified",
      monositi_verified: property.verification_status === "verified",
      isFeatured: property.isFeatured || false,
      sub_category: property.sub_category || "Buy",
      isBuilderProject: false,
    }));
  };

  const getPropertiesForCategory = () => {
    switch (activeCategory) {
      case "Buy":
        // Combine regular buy properties with builder projects
        const buyProps = transformProperties(buyProperties);
        const buyProjects = builderProjects.map((project) => ({
          _id: project._id,
          name: project.project_name,
          title: project.project_name,
          price: project.price_range?.min || project.price_range?.max || 0,
          propertyType: project.project_type,
          type: project.project_type,
          address: project.location?.address || "",
          city: project.location?.city || "",
          state: project.location?.state || "",
          photos: project.images || [],
          images: project.images || [],
          bedrooms: 0,
          bathrooms: 0,
          area: 0,
          size: 0,
          isVerified: project.monositi_verified || false,
          monositi_verified: project.monositi_verified || false,
          isFeatured: false,
          sub_category: "Buy",
          isBuilderProject: true,
          builder_name: project.builder?.name || project.builder_name,
        }));
        return [...buyProps, ...buyProjects];
      case "Rent":
        return transformProperties(rentProperties);
      default:
        return [];
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f73c56] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading properties...</p>
        </div>
      );
    }

    if (error) {
      return <div className="text-center text-red-600 py-8">{error}</div>;
    }

    const properties = getPropertiesForCategory();

    if (!properties.length) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600">
            No properties available for {activeCategory.toLowerCase()}
          </p>
        </div>
      );
    }

    // If 4 or fewer properties, show them in a grid
    if (properties.length <= 4) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          {properties.map((property) => (
            <div key={property._id} className="flex">
              <UnifiedPropertyCard property={property} />
            </div>
          ))}
        </div>
      );
    }

    // If more than 4 properties, show carousel
    return (
      <div className="relative mx-auto max-w-[95%]">
        <button
          className={`${activeCategory.toLowerCase()}-prev-btn absolute top-1/2 -left-4 sm:-left-6 z-10 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-[#f73c56] rounded-full flex items-center justify-center shadow-lg hover:bg-[#e9334e] transition-colors`}
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>
        <button
          className={`${activeCategory.toLowerCase()}-next-btn absolute top-1/2 -right-4 sm:-right-6 z-10 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-[#f73c56] rounded-full flex items-center justify-center shadow-lg hover:bg-[#e9334e] transition-colors`}
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          loop={true}
          navigation={{
            nextEl: `.${activeCategory.toLowerCase()}-next-btn`,
            prevEl: `.${activeCategory.toLowerCase()}-prev-btn`,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className={`${activeCategory.toLowerCase()}-properties-swiper`}
        >
          {properties.map((property) => (
            <SwiperSlide key={property._id}>
              <UnifiedPropertyCard property={property} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  };

  return (
    <div className="py-8">
      {/* Category Tabs */}
      <div className="flex justify-center gap-4 mb-8 px-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
              activeCategory === category
                ? "bg-[#f73c56] text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <GradientHeading text={`Properties for ${activeCategory}`} />

      {/* Banner after heading */}
      <div className="my-6 px-4">
        <Banner />
      </div>

      <div className="my-8 md:my-16">{renderContent()}</div>

      {/* Show All Button */}
      <div className="text-center mt-8">
        <Link
          to={activeCategory === "Rent" ? "/rentlist" : "/buylist"}
          className="inline-flex items-center px-8 py-3 bg-[#f73c56] text-white font-semibold rounded-lg hover:bg-[#e9334e] transition-colors shadow-md"
        >
          Show All {activeCategory} Properties
          <ChevronRight className="w-5 h-5 ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default RealEstate;
