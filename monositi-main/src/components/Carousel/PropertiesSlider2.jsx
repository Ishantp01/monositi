import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";

// Sample Dummy Data
const propertyData = [
  {
    name: "Nandi Meraki",
    builder: "Nandi Housing Pvt Ltd",
    location: "Rampur Road, Jabalpur",
    bhk: "1,2,3,4 BHK Flats",
    price: "₹79.5 Lac",
    image: "https://i.pinimg.com/originals/2e/20/ae/2e20aecde7311e2f54402a85f594702c.jpg",
  },
  {
    name: "Skyline Vista",
    builder: "Skyline Developers",
    location: "MG Road, Indore",
    bhk: "2,3 BHK Apartments",
    price: "₹62.3 Lac",
    image: "https://static1.mansionglobal.com/production/media/article-images/150b1342f1f1b75d9637ab52a4d6e1a0/large_india.jpg",
  },
  {
    name: "Palm Residency",
    builder: "Palm Infra",
    location: "Bawadiya Kalan, Bhopal",
    bhk: "1,2 BHK Flats",
    price: "₹45.2 Lac",
    image: "https://im.proptiger.com/1/665394/6/562816.jpeg",
  },
  {
    name: "Eco Greens",
    builder: "Eco Builders",
    location: "Saket Nagar, Bhopal",
    bhk: "2,3 BHK",
    price: "₹59.9 Lac",
    image: "https://www.omaxe.com/blog/wp-content/uploads/2022/12/15-tips-for-buying-commercial-properties-in-India.png",
  },
  {
    name: "Lakeview Heights",
    builder: "Dream Estates",
    location: "Upper Lake, Bhopal",
    bhk: "3,4 BHK Flats",
    price: "₹89.0 Lac",
    image: "https://www.viviun.com/i/1/l/2621/2O3DLT/1/7C65E7/1/40/na-for-sale-and-rent-in-maharastra-india.webp",
  },
  {
    name: "Sunshine Enclave",
    builder: "Bright Homes",
    location: "Hoshangabad Road, Bhopal",
    bhk: "1,2,3 BHK",
    price: "₹55.0 Lac",
    image: "https://i.pinimg.com/originals/3c/04/67/3c0467d888e7aa5e63e93bb16749679b.jpg",
  },
  {
    name: "Nandi Meraki",
    builder: "Nandi Housing Pvt Ltd",
    location: "Rampur Road, Jabalpur",
    bhk: "1,2,3,4 BHK Flats",
    price: "₹79.5 Lac",
    image: "https://i.pinimg.com/originals/2e/20/ae/2e20aecde7311e2f54402a85f594702c.jpg",
  },
  {
    name: "Skyline Vista",
    builder: "Skyline Developers",
    location: "MG Road, Indore",
    bhk: "2,3 BHK Apartments",
    price: "₹62.3 Lac",
    image: "https://static1.mansionglobal.com/production/media/article-images/150b1342f1f1b75d9637ab52a4d6e1a0/large_india.jpg",
  },
];

// Property Card Component
const PropertyCard = ({ property }) => (
  <div className="py-4 w-full">
    <div
      key={property.id}
      className="flex flex-col md:flex-row border border-red-500 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 w-full max-w-6xl mx-auto"
    >
      <img
        src={property.image}
        alt={property.name}
        className="w-full md:w-2/5 h-52 sm:h-60 md:h-72 lg:h-80 xl:h-[22rem] object-cover"
      />
      <div className="p-4 md:p-6 w-full md:w-3/5 flex flex-col justify-center gap-1 md:gap-2">
        <h3 className="font-semibold text-base sm:text-lg md:text-xl text-gray-800">
          {property.name}
        </h3>
        <p className="text-sm sm:text-base text-gray-500">{property.location}</p>
        <p className="text-sm sm:text-base text-gray-500">{property.bhk}</p>
        <p className="text-sm sm:text-base text-gray-700">{property.types}</p>
        <p className="text-sm sm:text-base font-semibold text-gray-800 mt-2">
          {property.price}
          <span className="text-gray-400 font-normal"> Onwards</span>
        </p>
      </div>
    </div>
  </div>
);



// Main Slider Component
const PropertySlider2 = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="mx-auto max-w-[90%] py-10 relative">
      {/* Custom Arrows */}
      <div className="absolute -left-6 top-1/2 z-10 -translate-y-1/2">
        <button
          ref={prevRef}
          className="prev-slide w-10 h-10 sm:w-12 sm:h-12 bg-theme-primary rounded-full flex items-center justify-center transition-all duration-300 group"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white transition-transform duration-300 group-hover:scale-125" />
        </button>
      </div>

      <div className="absolute -right-6 top-1/2 z-10 -translate-y-1/2">
        <button
          ref={nextRef}
          className="next-slide w-10 h-10 sm:w-12 sm:h-12 bg-theme-primary rounded-full flex items-center justify-center transition-all duration-300 group"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white transition-transform duration-300 group-hover:scale-125" />
        </button>
      </div>

      {/* Swiper */}
      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        loop={true}
        grid={{ rows: 2, fill: "row" }}
        breakpoints={{
          768: {
            slidesPerView: 2,
            slidesPerGroup: 2,
            grid: { rows: 2 },
          },
          1024: {
            slidesPerView: 2,
            slidesPerGroup: 2,
            grid: { rows: 2 },
          },
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        modules={[Grid, Navigation]}
        className="mySwiper"
      >
        {propertyData.map((property, index) => (
          <SwiperSlide key={index}>
            <PropertyCard property={property} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PropertySlider2;
