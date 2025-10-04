import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// 🔹 Slider Images (Update paths if different images are intended)
import slide1 from "../../assets/images/avatar2.jpg";
import slide2 from "../../assets/images/avatar2.jpg";
import slide3 from "../../assets/images/avatar2.jpg";

// 🔹 PNG Icons
import fridge from "../../assets/PG/icons/fridge.png";
import RO from "../../assets/PG/icons/water.png";
import warden from "../../assets/PG/icons/user.png";
import microwave from "../../assets/PG/icons/microwave.png";

const icons = [
  {
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 512"
        fill="#E34F4F"
        className="w-6 h-6 sm:w-8 sm:h-8"
      >
        <path d="M320 160C229.1 160 146.8 196 86.3 254.6C73.6 266.9 53.3 266.6 41.1 253.9C28.9 241.2 29.1 220.9 41.8 208.7C113.7 138.9 211.9 96 320 96C428.1 96 526.3 138.9 598.3 208.7C611 221 611.3 241.3 599 253.9C586.7 266.5 566.4 266.9 553.8 254.6C493.2 196 410.9 160 320 160zM272 496C272 469.5 293.5 448 320 448C346.5 448 368 469.5 368 496C368 522.5 346.5 544 320 544C293.5 544 272 522.5 272 496zM200 390.2C188.3 403.5 168.1 404.7 154.8 393C141.5 381.3 140.3 361.1 152 347.8C193 301.4 253.1 272 320 272C386.9 272 447 301.4 488 347.8C499.7 361.1 498.4 381.3 485.2 393C472 404.7 451.7 403.4 440 390.2C410.6 356.9 367.8 336 320 336C272.2 336 229.4 356.9 200 390.2z" />
      </svg>
    ),
    label: "Wifi",
  },
  {
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 512"
        fill="#E34F4F"
        className="w-6 h-6 sm:w-8 sm:h-8"
      >
        <path d="M96 128C96 92.7 124.7 64 160 64H320c35.3 0 64 28.7 64 64v224c44.2 0 80 35.8 80 80v12c0 11 9 20 20 20s20-9 20-20V316.3c-32.5-10.2-56-40.5-56-76.3V208c0-8.8 7.2-16 16-16h16v-48c0-8.8 7.2-16 16-16s16 7.2 16 16v48h32v-48c0-8.8 7.2-16 16-16s16 7.2 16 16v48h16c8.8 0 16 7.2 16 16v32c0 35.8-23.5 66.1-56 76.3V444c0 37.6-30.4 68-68 68s-68-30.4-68-68v-12c0-17.7-14.3-32-32-32H96v-16c9.3 3.3 16 12.1 16 22.6 0 13.3-10.7 24-24 24H64c-13.3 0-24-10.7-24-24 0-10.5 6.7-19.3 16-22.6V128zm82.7 125.7h39l-20.9 66.9c-2.4 7.6 3.3 15.4 11.3 15.4 2.9 0 5.6-1 7.8-2.9l94.6-82c3.1-2.7 4.9-6.6 4.9-10.7 0-7.8-6.3-14.1-14.1-14.1h-39l20.9-66.9c2.4-7.6-3.3-15.4-11.3-15.4-2.9 0-5.6 1-7.8 2.9l-94.6 82c-3.1 2.7-4.9 6.6-4.9 10.7 0 7.8 6.3 14.1 14.1 14.1z" />
      </svg>
    ),
    label: "Power Backup",
  },
  {
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 512"
        fill="#E34F4F"
        className="w-6 h-6 sm:w-8 sm:h-8"
      >
        <path d="M160 96C124.7 96 96 124.7 96 160v320c0 35.3 28.7 64 64 64h320c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H160zm128 224h48c17.7 0 32-14.3 32-32s-14.3-32-32-32h-48v64zm48 64h-48v32c0 17.7-14.3 32-32 32s-32-14.3-32-32v-184c0-22.1 17.9-40 40-40h72c53 0 96 43 96 96s-43 96-96 96z" />
      </svg>
    ),
    label: "Parking",
  },
  {
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 512"
        fill="#E34F4F"
        className="w-6 h-6 sm:w-8 sm:h-8"
      >
        <path d="M598.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L361.3 265.3l-34.7-34.7c-4.2-4.2-9.9-6.6-15.9-6.6-12.5 0-22.6 10.1-22.6 22.6v29.1l108.3 108.3h29.1c12.5 0 22.6-10.1 22.6-22.6 0-6-2.4-11.7-6.6-15.9l-34.7-34.7 192-192zM373.1 417.4l-118.5-118.5c-42.7-3.7-85.2 11.7-115.8 42.3l-8 8c-22.3 22.3-34.8 52.5-34.8 84 0 6.9 7.1 11.2 13.2 8.2l51.1-25.5c5-2.5 9.5 4.1 5.4 7.9L44.7 537.4c-4.6 4.2-7.3 10.2-7.3 16.5 0 12.2 9.9 22.1 22.1 22.1h173.3c38.8 0 75.9-15.4 103.4-42.8 30.6-30.6 45.9-73.1 42.3-115.8z" />
      </svg>
    ),
    label: "Room Cleaning Service",
  },
  {
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 512"
        fill="#E34F4F"
        className="w-6 h-6 sm:w-8 sm:h-8"
      >
        <path d="M96 160v240h448V160H96zm-64 0c0-35.3 28.7-64 64-64h448c35.3 0 64 28.7 64 64v240c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V160zm160 352h256c17.7 0 32 14.3 32 32s-14.3 32-32 32H192c-17.7 0-32-14.3-32-32s14.3-32 32-32z" />
      </svg>
    ),
    label: "TV",
  },
  {
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 512"
        fill="#E34F4F"
        className="w-6 h-6 sm:w-8 sm:h-8"
      >
        <path d="M496 32c-6.5 0-12.4 4-14.8 9.9s-1.1 12.8 3.5 17.3l64 64c6.2 6.2 16.4 6.2 22.6 0l64-64c4.6-4.5 5.9-11.4 3.5-17.3s-8.3-9.9-14.8-9.9h-16v-48c0-8.8-7.2-16-16-16s-16 7.2-16 16v48h-32v-48c0-8.8-7.2-16-16-16s-16 7.2-16 16v48h-16zM128 192c-35.3 0-64 28.7-64 64v256c0 35.3 28.7 64 64 64h384c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64H128zm96 96c26.5 0 48 21.5 48 48s-21.5 48-48 48-48-21.5-48-48 21.5-48 48-48zm144 48c0-26.5 21.5-48 48-48s48 21.5 48 48-21.5 48-48 48-48-21.5-48-48zm-176 80c-26.5 0-48 21.5-48 48v16c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32v-16c0-26.5-21.5-48-48-48h-64zm176 0c-26.5 0-48 21.5-48 48v16c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32v-16c0-26.5-21.5-48-48-48h-64z" />
      </svg>
    ),
    label: "Lift",
  },
  {
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 512"
        fill="#E34F4F"
        className="w-6 h-6 sm:w-8 sm:h-8"
      >
        <path d="M280 80c-13.3 0-24 10.7-24 24s10.7 24 24 24h56.6l22.5 48.7-95.1 71.3c-33.4-25.1-75-40-120-40h-56c-13.3 0-24 10.7-24 24s10.7 24 24 24h56c78.5 0 143.2 59.6 151.2 136h-25.4c-11.2-59.2-63.3-104-125.8-104-70.7 0-128 57.3-128 128s57.3 128 128 128c62.5 0 114.5-44.8 125.8-104h50.2c13.3 0 24-10.7 24-24v-22.5c0-45.1 25.7-85.4 65.5-107.7l12.1 26.1c-32.4 23.2-53.5 61.2-53.5 104 0 70.7 57.3 128 128 128s128-57.3 128-128-57.3-128-128-128c-10.7 0-21 1.3-30.9 3.8l-31.4-67.8H488c13.3 0 24-10.7 24-24v-48c0-13.3-10.7-24-24-24h-53.3c-6.9 0-13.7 2.2-19.2 6.4l-17.1 12.8 24.6-53.3c3.9-8.5-1.4-18.9-10.8-18.9H280zM496 344c39.8 0 72 32.2 72 72s-32.2 72-72 72-72-32.2-72-72 32.2-72 72-72zm-352 0c39.8 0 72 32.2 72 72s-32.2 72-72 72-72-32.2-72-72 32.2-72 72-72z" />
      </svg>
    ),
    label: "2-Wheeler Parking",
  },
  {
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 512"
        fill="#E34F4F"
        className="w-6 h-6 sm:w-8 sm:h-8"
      >
        <path d="M320.2 176c44.2 0 80-35.8 80-80h53.5c17 0 33.3 6.7 45.3 18.7l118.6 118.7c12.5 12.5 12.5 32.8 0 45.3l-50.7 50.7c-12.5 12.5-32.8 12.5-45.3 0l-41.4-41.4v224c0 35.3-28.7 64-64 64H224.2c-35.3 0-64-28.7-64-64v-224l-41.4 41.4c-12.5 12.5-32.8 12.5-45.3 0l-50.7-50.7c-12.5-12.5-12.5-32.8 0-45.3l118.6-118.7c12-12 28.3-18.7 45.3-18.7h53.5c0 44.2 35.8 80 80 80z" />
      </svg>
    ),
    label: "Laundry",
  },
  {
    svg: <img src={fridge} alt="Fridge" className="w-6 h-6 sm:w-8 sm:h-8" />,
    label: "Fridge",
  },
  {
    svg: (
      <img src={RO} alt="Water Cooler RO" className="w-6 h-6 sm:w-8 sm:h-8" />
    ),
    label: "Water Cooler RO",
  },
  {
    svg: <img src={warden} alt="Warden" className="w-6 h-6 sm:w-8 sm:h-8" />,
    label: "Warden",
  },
  {
    svg: (
      <img src={microwave} alt="Microwave" className="w-6 h-6 sm:w-8 sm:h-8" />
    ),
    label: "Microwave",
  },
];

const images = [slide1, slide2, slide3];
const AUTO_SLIDE_INTERVAL = 4000; // 4 seconds

const CommonAreaAndAmenities = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideIntervalRef = useRef(null);
  const sliderRef = useRef(null);

  // 🔹 Auto Slide
  const clearAndSetInterval = () => {
    if (slideIntervalRef.current) clearInterval(slideIntervalRef.current);
    slideIntervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, AUTO_SLIDE_INTERVAL);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    clearAndSetInterval();
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    clearAndSetInterval();
  };

  // 🔹 Touch Support
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    sliderRef.current.startX = touch.clientX;
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const deltaX = touch.clientX - sliderRef.current.startX;
    if (deltaX > 50) {
      prevSlide();
    } else if (deltaX < -50) {
      nextSlide();
    }
  };

  useEffect(() => {
    clearAndSetInterval();
    return () => clearInterval(slideIntervalRef.current);
  }, []);

  return (
    <section className="bg-white max-w-[90%] mx-auto py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-8 rounded-lg">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
        Common Area and Amenities
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start">
        {/* 🔹 Amenities List */}
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {icons.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full">
                {item.svg}
              </div>
              <p className="mt-2 text-sm xs:text-sm text-gray-600font-medium">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* 🔹 Image Slider */}
        <div
          className="relative w-full overflow-hidden rounded-2xl"
          ref={sliderRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          {/* Slides container */}
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              width: `${images.length * 100}%`,
              transform: `translateX(-${
                (100 / images.length) * currentIndex
              }%)`,
            }}
          >
            {images.map((img, idx) => (
              <div
                key={idx}
                className="w-full flex-shrink-0"
                style={{ width: `${100 / images.length}%` }}
              >
                <img
                  src={img}
                  alt={`Slide ${idx + 1}`}
                  className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover rounded-2xl"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute top-1/2 left-2 sm:left-3 transform -translate-y-1/2 bg-black/60 text-white p-1.5 sm:p-2 rounded-full z-10 hover:bg-black/80 transition"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute top-1/2 right-2 sm:right-3 transform -translate-y-1/2 bg-black/60 text-white p-1.5 sm:p-2 rounded-full z-10 hover:bg-black/80 transition"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CommonAreaAndAmenities;
