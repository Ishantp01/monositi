import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PropertyCarousel() {
  const properties = [
    {
      title: "Office Space",
      price: "₹83,000",
      seats: "14 -20 Seats",
      locality: "Block 4th Tilwara",
      posted: "Jun 08, ‘25",
      owner: "Hemant Kumar",
    },
    {
      title: "Office Space",
      price: "₹83,000",
      seats: "14 -20 Seats",
      locality: "Block 4th Tilwara",
      posted: "Jun 08, ‘25",
      owner: "Hemant Kumar",
    },
    {
      title: "Office Space",
      price: "₹83,000",
      seats: "14 -20 Seats",
      locality: "Block 4th Tilwara",
      posted: "Jun 08, ‘25",
      owner: "Hemant Kumar",
    },
    {
      title: "Office Space",
      price: "₹83,000",
      seats: "14 -20 Seats",
      locality: "Block 4th Tilwara",
      posted: "Jun 08, ‘25",
      owner: "Hemant Kumar",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);

  useEffect(() => {
    const updateCards = () => {
      if (window.innerWidth < 640) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    updateCards();
    window.addEventListener("resize", updateCards);
    return () => window.removeEventListener("resize", updateCards);
  }, []);

  const nextSlide = () => {
    if (currentIndex < properties.length - cardsPerView) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white relative shadow-lg sm:p-6 mx-auto shadow-lg ml-2 sm:ml-6 lg:ml-14 ml-14 max-w-full ">
      <h2 className="text-lg font-semibold mb-4">
        Properties Available Only on Monositi
      </h2>

      {/* Carousel Container */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          style={{
            transform: `translateX(-${(currentIndex * 100) / cardsPerView}%)`,
          }}
        >
          {properties.map((p, idx) => (
            <div
              key={idx}
              className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-2"
            >
              <div className="bg-white rounded-lg shadow-md border overflow-hidden">
                {/* Image placeholder */}
                <div className="bg-gray-800 h-40 rounded-t-lg"></div>

                {/* Details */}
                <div className="p-4 text-sm">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">{p.title}</p>
                    <p className="font-semibold">{p.price}</p>
                  </div>
                  <p className="text-gray-500">{p.seats}</p>
                  <p className="text-gray-500">
                    <span className="font-medium">Locality :</span> {p.locality}
                  </p>
                  <p className="text-gray-500">
                    <span className="font-medium">Posted :</span> {p.posted}
                  </p>
                  <p className="text-gray-500">
                    <span className="font-medium">Owner :</span> {p.owner}
                  </p>
                  <button className="mt-3 px-4 py-2 border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition">
                    Contact Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows with Icons */}
      <button
        onClick={prevSlide}
        disabled={currentIndex === 0}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-red-500 w-10 h-10 flex items-center justify-center rounded-full text-white disabled:opacity-50"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={nextSlide}
        disabled={currentIndex >= properties.length - cardsPerView}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-red-500 w-10 h-10 flex items-center justify-center rounded-full text-white disabled:opacity-50"
      >
        <ChevronRight size={22} />
      </button>
    </div>
  );
}
