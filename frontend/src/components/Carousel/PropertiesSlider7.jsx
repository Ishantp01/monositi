import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import PgHotelWifiCard from "../PgHotelWifiCard";

const properties =[
  {
    price: "₹11,000",
    location: "Monositi Hostel, Vijay Nagar",
    title: "Skyline PG for Ladies",
    facilities: ["🍽️", "📶", "🚉"],
    image: "https://tse1.mm.bing.net/th/id/OIP.5jni3iEtUCLev8CTDbZaAwHaE8?pid=Api&P=0&h=180",
  },
  {
    price: "₹9,800",
    location: "Sunrise Hostel, Indore",
    title: "Sunrise PG for Boys",
    facilities: ["🍳", "📡", "🚌"],
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
  },
  {
    price: "₹12,200",
    location: "Rose Residency, Bhopal",
    title: "Rose PG for Girls",
    facilities: ["🥘", "📶", "🚖"],
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1200",
  },
  {
    price: "₹10,500",
    location: "Elite Hostel, Mumbai",
    title: "Elite PG",
    facilities: ["🍽️", "📡", "🚆"],
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200",
  },
  {
    price: "₹11,700",
    location: "UrbanNest, Pune",
    title: "UrbanNest PG for Girls",
    facilities: ["🍳", "📶", "🛏️"],
    image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=1200",
  },
];





const PropertySlider7 = ({id}) => {
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
                        <PgHotelWifiCard data={property} />
                    </SwiperSlide>
                ))}

            </Swiper>
        </div>
    );
};

export default PropertySlider7;
