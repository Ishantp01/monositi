// components/CardCarousel.jsx
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const data = [
    {
        id: 1,
        title: 'Bivlla Phase 2 by Bhavisha Home',
        by: 'by Bhavisha Home',
        subtitle: '2,3,4 BHK House',
        price: '₹78 Lacs onwards',
        location: 'SBI Road , Vijay Nagar',
        image: 'https://keyvendors.com/blogs/wp-content/uploads/2023/06/interior-design-ideas-2-1024x602.jpg',
        profileImage: "https://tse3.mm.bing.net/th/id/OIP.V52f24J_lO5QpjVYxy71xwAAAA?pid=Api&P=0&h=180"
    },
    {
        id: 2,
        title: 'Villa Greens',
        by: 'by Bhavisha Home',
        subtitle: '3 BHK Luxury',
        price: '₹85 Lacs onwards',
        location: 'Airport Road, Indore',
        image: 'https://media.designcafe.com/wp-content/uploads/2020/09/25151904/2bhk-apartment-living-room-interior-design.jpg',
        profileImage: "https://saint313.com/wp-content/uploads/2018/04/pexels-photo-428341-1024x683.jpeg"
    },
    {
        id: 3,
        title: 'Villa Greens',
        by: 'by Bhavisha Home',
        subtitle: '3 BHK Luxury',
        price: '₹85 Lacs onwards',
        location: 'Airport Road, Indore',
        image: 'https://images.livspace-cdn.com/plain/https://d3gq2merok8n5r.cloudfront.net/abhinav/false-ceiling-homes-pilot-1660820004-eRVFP/hometour-1660820029-cuOHh/ht-in-lr-0027-1661187348-YIzhA/1-min-1661187370-ihWOH.jpg',
        profileImage: "https://tse2.mm.bing.net/th/id/OIP.qbIF3gNiqXnB_SZI2bqsugHaFw?pid=Api&P=0&h=180"
    },
    // Add more items...
];

export default function CardCarousel() {
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
                {data.map((item) => (
                    <SwiperSlide key={item.id}>
                        <Link to={"/buy-details"}>
                            <div className="rounded-xl border border-red-500 overflow-hidden shadow-md 
                  max-w-[100%] sm:max-w-full mx-auto">
                                {/* Image with taller height on large screens */}
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-48 lg:h-64 object-cover transition-all duration-300"
                                />
                                <div className="flex gap-4 p-4">
                                    <img
                                        src={item.profileImage}
                                        alt="Profile"
                                        className="w-20 h-20 object-cover rounded-md shrink-0"
                                    />

                                    <div className="flex flex-col text-sm text-gray-800 w-full">
                                        <div className="flex flex-row lg:flex-row lg:items-center justify-between">
                                            <h3 className="font-semibold text-black truncate">{item.title}</h3>
                                            <p className="text-right text-gray-700 truncate">{item.subtitle}</p>
                                        </div>

                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mt-1">
                                            <div>
                                                <div className="text-xs text-gray-500 lg:text-left">{item.by}</div>
                                                <div className="text-xs text-gray-500 lg:text-right">{item.location}</div>
                                            </div>
                                            <div className="font-bold">{item.price}</div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

