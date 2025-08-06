// components/HeroBanner.jsx
import React, { useState } from "react";
import ImageViewer from "./ImageViewer";

const HeroBanner = () => {
  const [showViewer, setShowViewer] = useState(false);

  const images = [
    "https://i.pinimg.com/originals/2e/20/ae/2e20aecde7311e2f54402a85f594702c.jpg",
    "https://static1.mansionglobal.com/production/media/article-images/150b1342f1f1b75d9637ab52a4d6e1a0/large_india.jpg",
    "https://im.proptiger.com/1/665394/6/562816.jpeg",
    "https://www.viviun.com/i/1/l/2621/2O3DLT/1/7C65E7/1/40/na-for-sale-and-rent-in-maharastra-india.webp",
    "https://www.viviun.com/i/1/l/2621/2O3DLT/1/7C65E7/1/40/na-for-sale-and-rent-in-maharastra-india.webp",
    "https://www.viviun.com/i/1/l/2621/2O3DLT/1/7C65E7/1/40/na-for-sale-and-rent-in-maharastra-india.webp",
    "https://www.viviun.com/i/1/l/2621/2O3DLT/1/7C65E7/1/40/na-for-sale-and-rent-in-maharastra-india.webp",
    "https://www.viviun.com/i/1/l/2621/2O3DLT/1/7C65E7/1/40/na-for-sale-and-rent-in-maharastra-india.webp",
  ];

  return (
    <>
      {/* Banner */}
      <div className="w-full h-[300px] md:h-[400px] bg-black relative flex items-end justify-center">
        <img
          src={images[0]}
          alt="banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          onClick={() => setShowViewer(true)}
          className="absolute bottom-4 bg-white text-xs px-4 py-2 rounded-full shadow-md cursor-pointer"
        >
          {images.length} Photos
        </div>
      </div>

      {/* Viewer Popup */}
      {showViewer && (
        <ImageViewer images={images} onClose={() => setShowViewer(false)} />
      )}
    </>
  );
};

export default HeroBanner;
