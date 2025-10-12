import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import PropertyCard3 from "../Cards/PropertyCard3";

export const properties = [
  {
    id: 1,
    type: "Residential Plot",
    bhk: "2BHK / 600 Sq.ft.",
    area: 1000,
    price: 89,
    location: "IT Park, Jabalpur",
    image:
      "https://www.pickeronline.com/uploads/category/147307724857cd6000c82a1.jpg",
    title: "Premium Residential Plot",
    description:
      "Prime location residential plot with excellent connectivity and future development potential.",
    amenities: [
      "Road Access",
      "Water Supply",
      "Electricity Connection",
      "Security",
    ],
    owner: "Vikram Patel",
    contact: "+91-9876543216",
    propertyType: "Plot",
    furnished: "Land",
    age: "New",
    floor: "Ground",
    totalFloors: "1",
    facing: "North",
    waterSupply: "Available",
    powerBackup: "No",
  },
  {
    id: 2,
    type: "Apartment",
    bhk: "3BHK / 1200 Sq.ft.",
    area: 1200,
    price: 102,
    location: "Near Railway Station, Pune",
    image: "https://suvidhaprojects.com/64parkavenue/images/plans/key_plan.jpg",
    title: "Modern 3BHK Apartment",
    description:
      "Well-designed 3BHK apartment with modern amenities, close to railway station for easy commute.",
    amenities: ["Parking", "Security", "Gym", "Garden", "Club House"],
    owner: "Anita Desai",
    contact: "+91-9876543217",
    propertyType: "Apartment",
    furnished: "Semi-Furnished",
    age: "5 years",
    floor: "4th Floor",
    totalFloors: "10",
    facing: "East",
    waterSupply: "24x7",
    powerBackup: "Yes",
  },
  {
    id: 3,
    type: "Villa",
    bhk: "4BHK / 1800 Sq.ft.",
    area: 1800,
    price: 240,
    location: "Sector 21, Noida",
    image:
      "https://www.sameeraestates.com/sameera117/assets/img/residential-plots-land-for-sale-in-chennai.jpg",
    title: "Luxury 4BHK Villa",
    description:
      "Spacious 4BHK villa with private garden, premium finishes, and luxury amenities in Noida.",
    amenities: [
      "Private Garden",
      "Parking",
      "Security",
      "Gym",
      "Swimming Pool",
      "Club House",
    ],
    owner: "Ravi Khanna",
    contact: "+91-9876543218",
    propertyType: "Villa",
    furnished: "Fully Furnished",
    age: "2 years",
    floor: "Ground Floor",
    totalFloors: "3",
    facing: "South",
    waterSupply: "24x7",
    powerBackup: "Yes",
  },
  {
    id: 4,
    type: "Office Space",
    bhk: "Open Plan / 1500 Sq.ft.",
    area: 1500,
    price: 150,
    location: "MG Road, Bangalore",
    image:
      "https://1.bp.blogspot.com/-Jjl3VBOLO1M/VtgSx_u6nKI/AAAAAAAABJc/qutZTV2TrzE/s1600/plot2.jpg",
    title: "Premium Office Space",
    description:
      "Modern office space in prime business district with excellent connectivity and professional environment.",
    amenities: ["Parking", "Security", "WiFi", "Conference Room", "Cafeteria"],
    owner: "Deepak Agarwal",
    contact: "+91-9876543219",
    propertyType: "Commercial",
    furnished: "Fully Furnished",
    age: "3 years",
    floor: "8th Floor",
    totalFloors: "15",
    facing: "West",
    waterSupply: "24x7",
    powerBackup: "Yes",
  },
  {
    id: 5,
    type: "Studio Apartment",
    bhk: "1RK / 400 Sq.ft.",
    area: 400,
    price: 45,
    location: "DLF Phase 3, Gurgaon",
    image:
      "https://thumbs.dreamstime.com/z/land-plot-aerial-view-development-investment-identify-registration-symbol-vacant-area-map-property-real-estate-228356158.jpg",
    title: "Compact Studio Apartment",
    description:
      "Efficiently designed studio apartment perfect for working professionals in Gurgaon's business hub.",
    amenities: ["Parking", "Security", "WiFi", "Housekeeping"],
    owner: "Sunita Verma",
    contact: "+91-9876543220",
    propertyType: "Studio",
    furnished: "Fully Furnished",
    age: "1 year",
    floor: "6th Floor",
    totalFloors: "12",
    facing: "North",
    waterSupply: "24x7",
    powerBackup: "Yes",
  },
  {
    id: 6,
    type: "Penthouse",
    bhk: "5BHK / 3000 Sq.ft.",
    area: 3000,
    price: 350,
    location: "Marine Drive, Mumbai",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200",
    title: "Luxury Penthouse with Sea View",
    description:
      "Exclusive penthouse with panoramic sea view, premium location in Mumbai's most prestigious area.",
    amenities: [
      "Sea View",
      "Terrace",
      "Parking",
      "Security",
      "Gym",
      "Swimming Pool",
      "Club House",
    ],
    owner: "Arjun Malhotra",
    contact: "+91-9876543221",
    propertyType: "Penthouse",
    furnished: "Unfurnished",
    age: "New",
    floor: "Top Floor",
    totalFloors: "25",
    facing: "West",
    waterSupply: "24x7",
    powerBackup: "Yes",
  },
];

const PropertySlider4 = ({ link }) => {
  return (
    <div className="relative mx-auto max-w-[90%]">
      {/* Custom Navigation Arrows */}
      <div className="absolute top-1/2 -left-[4%] sm:-left-6 z-10 -translate-y-1/2">
        <button className="prev-btn w-10 h-10 sm:w-12 sm:h-12 bg-theme-primary rounded-full flex items-center justify-center transition-all duration-300 group">
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white y transition-transform duration-300 group-hover:scale-125" />
        </button>
      </div>

      <div className="absolute top-1/2 -right-[4%] sm:-right-6 z-10 -translate-y-1/2">
        <button className="next-btn w-10 h-10 sm:w-12 sm:h-12 bg-theme-primary rounded-full flex items-center justify-center transition-all duration-300 group">
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
        }}
      >
        {properties.map((property, index) => (
          <SwiperSlide key={property.id || index}>
            <PropertyCard3 data={property} link={link} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PropertySlider4;
