import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import PropertyCard2 from "../Cards/PropertyCard2";

export const properties = [
  {
    id: 1,
    bhk: "2 BHK",
    unit: "sqft",
    price: 15000,
    area: 1100,
    location: "Phase 1, IT Park (Jabalpur)",
    status: "Ready To Move",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
    title: "Modern 2BHK Apartment",
    description:
      "Spacious 2BHK apartment with modern amenities, located in the heart of IT Park. Perfect for young professionals.",
    amenities: ["Parking", "Security", "Gym", "Swimming Pool"],
    owner: "Rajesh Kumar",
    contact: "+91-9876543210",
    propertyType: "Apartment",
    furnished: "Semi-Furnished",
    age: "2 years",
    floor: "3rd Floor",
    totalFloors: "8",
    facing: "East",
    waterSupply: "24x7",
    powerBackup: "Yes",
  },
  {
    id: 2,
    bhk: "3 BHK",
    unit: "sqft",
    price: 23000,
    area: 1500,
    location: "Viman Nagar, Pune",
    status: "Ready To Move",
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200",
    title: "Luxury 3BHK Villa",
    description:
      "Premium 3BHK villa with garden view, modern kitchen, and premium location in Viman Nagar.",
    amenities: ["Garden", "Parking", "Security", "Gym", "Club House"],
    owner: "Priya Sharma",
    contact: "+91-9876543211",
    propertyType: "Villa",
    furnished: "Fully Furnished",
    age: "1 year",
    floor: "Ground Floor",
    totalFloors: "2",
    facing: "North",
    waterSupply: "24x7",
    powerBackup: "Yes",
  },
  {
    id: 3,
    bhk: "4 BHK",
    unit: "sqft",
    price: 45000,
    area: 2200,
    location: "Sector 62, Noida",
    status: "Under Construction",
    image:
      "https://tse2.mm.bing.net/th/id/OIP.c8mIcRwCTc2QInTU9Js1sAHaE8?pid=Api&P=0&h=180",
    title: "Premium 4BHK Penthouse",
    description:
      "Exclusive 4BHK penthouse with panoramic city view, premium finishes, and luxury amenities.",
    amenities: [
      "Terrace",
      "Parking",
      "Security",
      "Gym",
      "Swimming Pool",
      "Club House",
    ],
    owner: "Amit Singh",
    contact: "+91-9876543212",
    propertyType: "Penthouse",
    furnished: "Unfurnished",
    age: "Under Construction",
    floor: "Top Floor",
    totalFloors: "15",
    facing: "South",
    waterSupply: "24x7",
    powerBackup: "Yes",
  },
  {
    id: 4,
    bhk: "1 BHK",
    unit: "sqft",
    price: 10000,
    area: 700,
    location: "Koramangala, Bangalore",
    status: "Ready To Move",
    image:
      "https://images.unsplash.com/photo-1599423300746-b62533397364?q=80&w=1200",
    title: "Cozy 1BHK Studio",
    description:
      "Compact and well-designed 1BHK studio perfect for singles or couples, located in tech hub Koramangala.",
    amenities: ["Parking", "Security", "WiFi"],
    owner: "Suresh Reddy",
    contact: "+91-9876543213",
    propertyType: "Studio",
    furnished: "Fully Furnished",
    age: "3 years",
    floor: "5th Floor",
    totalFloors: "6",
    facing: "West",
    waterSupply: "24x7",
    powerBackup: "No",
  },
  {
    id: 5,
    bhk: "Studio",
    unit: "sqft",
    price: 8000,
    area: 400,
    location: "DLF Phase 3, Gurgaon",
    status: "Fully Furnished",
    image:
      "https://tse2.mm.bing.net/th/id/OIP.TNU3iP7XboCUsSRrbjAXtQHaE6?pid=Api&P=0&h=180",
    title: "Executive Studio Apartment",
    description:
      "Fully furnished executive studio with all modern amenities, ideal for working professionals.",
    amenities: ["Parking", "Security", "WiFi", "Housekeeping"],
    owner: "Neha Gupta",
    contact: "+91-9876543214",
    propertyType: "Studio",
    furnished: "Fully Furnished",
    age: "1 year",
    floor: "2nd Floor",
    totalFloors: "4",
    facing: "East",
    waterSupply: "24x7",
    powerBackup: "Yes",
  },
  {
    id: 6,
    bhk: "3 BHK",
    unit: "sqft",
    price: 28000,
    area: 1800,
    location: "Bandra West, Mumbai",
    status: "Ready To Move",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200",
    title: "Sea View 3BHK Apartment",
    description:
      "Stunning 3BHK apartment with sea view, premium location in Bandra West, Mumbai.",
    amenities: [
      "Sea View",
      "Parking",
      "Security",
      "Gym",
      "Swimming Pool",
      "Club House",
    ],
    owner: "Rohit Mehta",
    contact: "+91-9876543215",
    propertyType: "Apartment",
    furnished: "Semi-Furnished",
    age: "4 years",
    floor: "12th Floor",
    totalFloors: "20",
    facing: "West",
    waterSupply: "24x7",
    powerBackup: "Yes",
  },
];

const PropertySlider3 = ({ id, area }) => {
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
        }}
      >
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
