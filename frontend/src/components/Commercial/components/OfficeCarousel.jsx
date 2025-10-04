import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";

import Card from "./Card";

const officeSpaces = [
    {
        title: "Office Space",
        price: "₹83,000",
        seats: "14-20 Seats",
        locality: "Block 4th Tilwara",
        posted: "Jun 08, '25",
        owner: "Hemant Kumar",
        img: "https://images.unsplash.com/photo-1587613864521-9ef8d7e0d1f0?w=1200",
    },
    {
        title: "Corporate Office",
        price: "₹65,000",
        seats: "10-15 Seats",
        locality: "Civil Lines",
        posted: "May 15, '25",
        owner: "Priya Sharma",
        img: "https://images.unsplash.com/photo-1600585154154-8bbf65f1b0de?w=1200",
    },
    {
        title: "Startup Office",
        price: "₹50,000",
        seats: "8-12 Seats",
        locality: "Napier Town",
        posted: "Apr 20, '25",
        owner: "Rohit Verma",
        img: "https://images.unsplash.com/photo-1599423300746-b62533397364?w=1200",
    },
    {
        title: "Shared Office",
        price: "₹42,000",
        seats: "6-10 Seats",
        locality: "Ganjipura",
        posted: "Mar 18, '25",
        owner: "Anita Yadav",
        img: "https://images.unsplash.com/photo-1560448075-bb485b067938?w=1200",
    },
];

const OfficeCarousel = ({ onViewDetails }) => {
    return (
        <div className="relative max-w-[95%] mx-auto">
            <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={4}  
                breakpoints={{
                    320: { slidesPerView: 1 },
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                    1280: { slidesPerView: 4 }, // 4 on big screens
                }}
                navigation={{
                    nextEl: ".office-next",
                    prevEl: ".office-prev",
                }}
                loop={true}
            >

                {officeSpaces.map((office, idx) => (
                    <SwiperSlide key={idx}>
                        <Card data={office} type="office" onViewDetails={onViewDetails} />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Arrows */}
            <button className="office-prev absolute top-1/2 left-[-20px] transform -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-red-600 flex items-center justify-center hover:scale-110 transition">
                <ChevronLeft className="text-white w-6 h-6" />
            </button>
            <button className="office-next absolute top-1/2 right-[-20px] transform -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-red-600 flex items-center justify-center hover:scale-110 transition">
                <ChevronRight className="text-white w-6 h-6" />
            </button>
        </div>
    );
};

export default OfficeCarousel;
