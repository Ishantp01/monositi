import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import slide1 from "../assets/images/slide1.jpg";
import slide2 from "../assets/images/slide2.jpg";
import slide3 from "../assets/images/slide3.jpg";

const images = [slide1, slide2, slide3];
const AUTO_SLIDE_INTERVAL = 4000; // 4 seconds

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideIntervalRef = useRef(null);

  const clearAndSetInterval = () => {
    if (slideIntervalRef.current) {
      clearInterval(slideIntervalRef.current);
    }
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

  useEffect(() => {
    clearAndSetInterval();
    return () => clearInterval(slideIntervalRef.current);
  }, []);

  return (
    <div className="relative w-full max-w-[95%] md:max-w-[90%] xl:max-w-[90%] mx-auto overflow-hidden rounded-2xl">
      {/* Slides container with transform animation */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          width: `${images.length * 100}%`,
          transform: `translateX(-${currentIndex * (100 / images.length)}%)`,
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
              alt={`Slide ${idx}`}
              className="w-full h-[220px] sm:h-[300px] md:h-[400px] lg:h-[400px] object-cover"
            />
          </div>
        ))}
      </div>

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-3 sm:left-6 transform -translate-y-1/2 bg-black/60 text-white p-2 sm:p-3 rounded-full z-10 hover:bg-black/80 transition"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-3 sm:right-6 transform -translate-y-1/2 bg-black/60 text-white p-2 sm:p-3 rounded-full z-10 hover:bg-black/80 transition"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default ImageCarousel;
