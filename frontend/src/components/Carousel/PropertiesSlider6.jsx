// components/PropertySlider6.jsx
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PgHotelCard from "../PgHotelCard";

const properties = [
  {
    title: "Skyline PG and Co-living PG",
    location: "Ranjhi",
    price: "₹11,000",
    facilities: ["🍽️", "📶", "🚉"],
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200",
  },
  {
    title: "BlueSky PG and Hostel",
    location: "Vijay Nagar",
    price: "₹9,500",
    facilities: ["🍳", "🚖", "🛏️"],
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1200",
  },
  {
    title: "Elite Co-living Space",
    location: "Indira Nagar",
    price: "₹12,500",
    facilities: ["🍴", "📶", "🚆"],
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
  },
  {
    title: "UrbanNest PG",
    location: "Gandhi Chowk",
    price: "₹10,200",
    facilities: ["🍳", "🚌", "📡"],
    image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=1200",
  },
  {
    title: "GreenWood Co-living",
    location: "Kolar Road",
    price: "₹11,800",
    facilities: ["🥘", "🚉", "📡"],
    image: "https://www.fodors.com/wp-content/uploads/2020/11/06_HotelEntireFloorRent__The121Hotel_6.-Straight-on-Front-copy.jpg",
  },
];



export default function PropertySlider6() {
    return (
        <div className="relative mx-auto max-w-[90%]">
            {/* Custom Navigation Arrows */}
            <div className="absolute top-1/2 -left-[4%] sm:-left-6 z-10 -translate-y-1/2">
                <button
                    className="swiper-button-prev-custom w-10 h-10 sm:w-12 sm:h-12 bg-theme-primary rounded-full flex items-center justify-center transition-all duration-300 group"
                >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white y transition-transform duration-300 group-hover:scale-125" />
                </button>
            </div>

            <div className="absolute top-1/2 -right-[4%] sm:-right-6 z-10 -translate-y-1/2">
                <button
                    className="swiper-button-next-custom w-10 h-10 sm:w-12 sm:h-12 bg-theme-primary rounded-full flex items-center justify-center transition-all duration-300 group"
                >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white transition-transform duration-300 group-hover:scale-125" />
                </button>
            </div>



            <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                loop={true}
                navigation={{
                    nextEl: '.swiper-button-next-custom',
                    prevEl: '.swiper-button-prev-custom',
                }}
                breakpoints={{
                    0: {
                        slidesPerView: 1,
                    },
                    768: {
                        slidesPerView: 2,
                    },
                }}
            >
                {properties.map((item) => (
                    <SwiperSlide key={item.id}>
                        <PgHotelCard data={item} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

