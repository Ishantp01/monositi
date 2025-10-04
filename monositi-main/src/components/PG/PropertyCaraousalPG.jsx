import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectFade } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

const properties = [
  {
    price: "₹3,100",
    title: "Monositi Gen Alpha",
    location: "In Green City, Vijay Nagar (Jabalpur)",
    occupancy: "Single, Double, Triple, Four",
    deposit: "₹6000",
    for: "Boys and Girls",
    image:
      "https://www.pickeronline.com/uploads/category/147307724857cd6000c82a1.jpg",
  },
  {
    price: "₹4,200",
    title: "Skyline Residency",
    location: "Sector 21, Noida",
    occupancy: "Single, Double, Triple",
    deposit: "₹7000",
    for: "Boys only",
    image:
      "https://1.bp.blogspot.com/-Jjl3VBOLO1M/VtgSx_u6nKI/AAAAAAAABJc/qutZTV2TrzE/s1600/plot2.jpg",
  },
  {
    price: "₹2,800",
    title: "Harmony PG",
    location: "DLF Phase 3, Gurgaon",
    occupancy: "Single, Double",
    deposit: "₹5000",
    for: "Girls only",
    image:
      "https://thumbs.dreamstime.com/z/land-plot-aerial-view-development-investment-identify-registration-symbol-vacant-area-map-property-real-estate-228356158.jpg",
  },
  {
    price: "₹3,500",
    title: "Elite Living",
    location: "MG Road, Bangalore",
    occupancy: "Double, Triple",
    deposit: "₹8000",
    for: "Boys and Girls",
    image: "https://suvidhaprojects.com/64parkavenue/images/plans/key_plan.jpg",
  },
];

function PropertyCaraousalPG() {
  return (
    <div className="bg-white relative mx-auto max-w-[90%] p-10 rounded-lg">
      <h2 className="text-xl md:text-2xl font-semibold mb-6">
        More PG by this Seller
      </h2>

      {/* Navigation Arrows */}
      <div className="absolute top-1/2 -left-[4%] sm:-left-6 z-10 -translate-y-1/2">
        <button className="prev-btn w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-full flex items-center justify-center transition-all duration-300 group hover:bg-red-700">
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white transition-transform duration-300 group-hover:scale-125" />
        </button>
      </div>

      <div className="absolute top-1/2 -right-[4%] sm:-right-6 z-10 -translate-y-1/2">
        <button className="next-btn w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-full flex items-center justify-center transition-all duration-300 group hover:bg-red-700">
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white transition-transform duration-300 group-hover:scale-125" />
        </button>
      </div>

      <Swiper
        modules={[Navigation, EffectFade]}
        spaceBetween={20}
        slidesPerView={1}
        loop={true}
        speed={600} // smooth slide animation duration (ms)
        effect="slide"
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
          <SwiperSlide key={index}>
            <div className="bg-white rounded-xl shadow-md border overflow-hidden flex flex-col">
              <div className="bg-gray-200 h-32 md:h-40 flex items-center justify-center">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-900">
                  {property.price}{" "}
                  <span className="text-sm font-normal text-gray-500">
                    Onwards
                  </span>
                </h3>
                <p className="text-sm font-medium text-gray-800 mt-1">
                  {property.title}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {property.location}
                </p>

                <div className="mt-3 text-xs text-gray-600 space-y-1">
                  <p>Occupancy: {property.occupancy}</p>
                  <p>Deposit: {property.deposit}</p>
                  <p>For: {property.for}</p>
                </div>

                <div className="mt-4">
                  <button className="w-full py-2 bg-[#E2E200] text-gray-600 font-medium rounded-full transition hover:scale-105 hover:shadow-md">
                    View Phone No.
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default PropertyCaraousalPG;
