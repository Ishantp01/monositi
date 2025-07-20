import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import { PropertyCard } from "../PropertyCard"; // Swap this if you want a different card

const properties = [
    {
        type: "Residential Plot",
        bhk: "2BHK / 600 Sq.ft.",
        area: 1000,
        price: 89,
        location: "IT Park, Jabalpur",
        image: 'https://www.pickeronline.com/uploads/category/147307724857cd6000c82a1.jpg'
    },
    {
        type: "Apartment",
        bhk: "3BHK / 1200 Sq.ft.",
        area: 1200,
        price: 102,
        location: "Near Railway Station, Pune",
        image: 'https://suvidhaprojects.com/64parkavenue/images/plans/key_plan.jpg'

    },
    {
        type: "Villa",
        bhk: "4BHK / 1800 Sq.ft.",
        area: 1800,
        price: 240,
        location: "Sector 21, Noida",
        image: 'https://www.sameeraestates.com/sameera117/assets/img/residential-plots-land-for-sale-in-chennai.jpg'
    },
    {
        type: "Office Space",
        bhk: "Open Plan / 1500 Sq.ft.",
        area: 1500,
        price: 150,
        location: "MG Road, Bangalore",
        image: 'https://1.bp.blogspot.com/-Jjl3VBOLO1M/VtgSx_u6nKI/AAAAAAAABJc/qutZTV2TrzE/s1600/plot2.jpg'
    },
    {
        type: "Studio Apartment",
        bhk: "1RK / 400 Sq.ft.",
        area: 400,
        price: 45,
        location: "DLF Phase 3, Gurgaon",
        image: 'https://thumbs.dreamstime.com/z/land-plot-aerial-view-development-investment-identify-registration-symbol-vacant-area-map-property-real-estate-228356158.jpg'
    },
];;


const PropertyCarousel = () => {
    return (
        <div className="relative mx-auto max-w-[90%]">
            {/* Custom Navigation Arrows */}
            <div className="absolute top-1/2 -left-[4%] sm:-left-6 z-10 -translate-y-1/2">
                <button
                    className="prev-btn w-10 h-10 sm:w-12 sm:h-12 bg-theme-primary rounded-full flex items-center justify-center transition-all duration-300 group"
                >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white y transition-transform duration-300 group-hover:scale-125" />
                </button>
            </div>

            <div className="absolute top-1/2 -right-[4%] sm:-right-6 z-10 -translate-y-1/2">
                <button
                    className="next-btn w-10 h-10 sm:w-12 sm:h-12 bg-theme-primary rounded-full flex items-center justify-center transition-all duration-300 group"
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
                    nextEl: ".next-btn",
                    prevEl: ".prev-btn",
                }}
                breakpoints={{
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                }} >
                {properties.map((property, index) => (
                    <SwiperSlide key={index}>
                        <PropertyCard data={property} />
                    </SwiperSlide>
                ))}

            </Swiper>
        </div>
    );
};

export default PropertyCarousel;
