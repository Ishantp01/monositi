import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";

import Card from "./Card";

const showrooms = [
    {
        title: "Showroom",
        price: "₹7.3 Lac",
        area: "4830 sqft",
        locality: "Block 4th Tilwara",
        facing: true,
        owner: "Hemant Kumar",
        posted: "Jun 08, '25",
        img: "https://images.unsplash.com/photo-1582582429419-b9e7e44d10e3?w=1200",
    },
    {
        title: "Retail Showroom",
        price: "₹5.8 Lac",
        area: "3500 sqft",
        locality: "Civil Lines",
        facing: true,
        owner: "Priya Sharma",
        posted: "May 15, '25",
        img: "https://images.unsplash.com/photo-1578898887932-56c10958e703?w=1200",
    },
    {
        title: "Luxury Showroom",
        price: "₹9.2 Lac",
        area: "5200 sqft",
        locality: "Napier Town",
        facing: true,
        owner: "Rohit Verma",
        posted: "Apr 20, '25",
        img: "https://images.unsplash.com/photo-1582582429419-b9e7e44d10e3?w=1200",
    },
    {
        title: "Car Showroom",
        price: "₹6.5 Lac",
        area: "4000 sqft",
        locality: "Ganjipura",
        facing: true,
        owner: "Anita Yadav",
        posted: "Mar 18, '25",
        img: "https://images.unsplash.com/photo-1597006433642-45d8db36805b?w=1200",
    },
];

const ShowroomCarousel = ({ onViewDetails }) => {
    return (
        <div className="relative max-w-[95%] mx-auto">
            <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={4}   // 👈 default 4 cards
                breakpoints={{
                    320: { slidesPerView: 1 },
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                    1280: { slidesPerView: 4 }, // 4 on big screens
                }}
                navigation={{
                    nextEl: ".showroom-next",
                    prevEl: ".showroom-prev",
                }}
                loop={true}
            >

                {showrooms.map((showroom, idx) => (
                    <SwiperSlide key={idx}>
                        <Card data={showroom} type="showroom" onViewDetails={onViewDetails} />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Arrows */}
            <button className="showroom-prev absolute top-1/2 left-[-20px] transform -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-red-600 flex items-center justify-center hover:scale-110 transition">
                <ChevronLeft className="text-white w-6 h-6" />
            </button>
            <button className="showroom-next absolute top-1/2 right-[-20px] transform -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-red-600 flex items-center justify-center hover:scale-110 transition">
                <ChevronRight className="text-white w-6 h-6" />
            </button>
        </div>
    );
};

export default ShowroomCarousel;
