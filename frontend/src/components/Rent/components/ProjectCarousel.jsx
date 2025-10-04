"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";

const projects = [
  {
    name: "L&T Raintree Boulevard",
    tagline: "Hebbal",
    priceRange: "₹50,000 - 1.5 Lac",
    details: "3,4 BHK Flat | 1320-2850 sqft",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200",
      "https://images.unsplash.com/photo-1600585154154-8bbf65f1b0de?w=1200",
    ],
  },
  {
    name: "Prestige Lakeside Habitat",
    tagline: "Whitefield",
    priceRange: "₹70,000 - 2.2 Lac",
    details: "2,3,4 BHK Flat | 1200-3000 sqft",
    images: [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200",
      "https://images.unsplash.com/photo-1599423300746-b62533397364?w=1200",
    ],
  },
];

// 🔑 Helper function to generate safe className
const slugify = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const ProjectCard = ({ project, onViewDetails }) => {
  const safeId = slugify(project.name); // example: "l-t-raintree-boulevard"

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
      {/* Image Slider */}
      <div className="relative">
        <Swiper
          modules={[Navigation]}
          spaceBetween={10}
          slidesPerView={1}
          navigation={{
            nextEl: `.next-btn-${safeId}`,
            prevEl: `.prev-btn-${safeId}`,
          }}
          loop={true}
          className="h-56 w-full"
        >
          {project.images.map((img, idx) => (
            <SwiperSlide key={idx}>
              <img
                src={img}
                alt={`${project.name}-${idx}`}
                className="w-full h-56 object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        <button
          className={`prev-btn-${safeId} absolute top-1/2 left-2 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition`}
        >
          <ChevronLeft className="text-white w-5 h-5" />
        </button>
        <button
          className={`next-btn-${safeId} absolute top-1/2 right-2 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition`}
        >
          <ChevronRight className="text-white w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-xl font-bold">{project.name}</h3>
        <p className="text-gray-600">{project.tagline}</p>
        <p className="text-red-600 font-semibold">{project.priceRange}</p>
        <p className="text-gray-700">{project.details}</p>
        <button 
          onClick={onViewDetails}
          className="mt-2 w-full px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors duration-200"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

const ProjectCarousel = ({ onViewDetails }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 max-w-[95%] mx-auto">
      {projects.map((project, idx) => (
        <ProjectCard key={idx} project={project} onViewDetails={onViewDetails} />
      ))}
    </div>
  );
};

export default ProjectCarousel;
