import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import PropertyCard2 from "../PropertyCard2";

const properties = [
  {
    bhk: "2 BHK",
    unit: "sqft",
    price: 15000,
    area: 1100,
    location: "Phase 1, IT Park (Jabalpur)",
    status: "Ready To Move",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
  },
  {
    bhk: "3 BHK",
    unit: "sqft",
    price: 23000,
    area: 1500,
    location: "Viman Nagar, Pune",
    status: "Ready To Move",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200",
  },
  {
    bhk: "4 BHK",
    unit: "sqft",
    price: 45000,
    area: 2200,
    location: "Sector 62, Noida",
    status: "Under Construction",
    image: "https://tse2.mm.bing.net/th/id/OIP.c8mIcRwCTc2QInTU9Js1sAHaE8?pid=Api&P=0&h=180",
  },
  {
    bhk: "1 BHK",
    unit: "sqft",
    price: 10000,
    area: 700,
    location: "Koramangala, Bangalore",
    status: "Ready To Move",
    image: "https://images.unsplash.com/photo-1599423300746-b62533397364?q=80&w=1200",
  },
  {
    bhk: "Studio",
    unit: "sqft",
    price: 8000,
    area: 400,
    location: "DLF Phase 3, Gurgaon",
    status: "Fully Furnished",
    image: "https://tse2.mm.bing.net/th/id/OIP.TNU3iP7XboCUsSRrbjAXtQHaE6?pid=Api&P=0&h=180",
  },
];


const PropertySlider3 = ({id,area}) => {
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
                }} >
                {properties.map((property, index) => (
                    <SwiperSlide key={index}>
                        <PropertyCard2 data={property} area={area} />
                    </SwiperSlide>
                ))}

            </Swiper>
        </div>
    );
};

export default PropertySlider3;
