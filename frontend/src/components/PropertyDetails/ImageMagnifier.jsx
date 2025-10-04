import React, { useState, useEffect } from "react";

const ImageMagnifier = ({ src, zoom = 2 }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [backgroundPos, setBackgroundPos] = useState("center");

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setBackgroundPos(`${x}% ${y}%`);
  };

  return (
    <div className="w-full h-[400px] lg:h-[500px] overflow-hidden rounded-lg border">
      {isMobile ? (
        // Mobile View: Normal Image (with pinch zoom possible via browser)
        <img
          src={src}
          alt="Zoomable"
          className="w-full h-full object-cover rounded-lg"
        />
      ) : (
        // Desktop View: Zoom on hover
        <div
          onMouseMove={handleMouseMove}
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: `${zoom * 100}%`,
            backgroundPosition: backgroundPos,
            backgroundRepeat: "no-repeat",
          }}
          className="w-full h-full cursor-zoom-in"
        ></div>
      )}
    </div>
  );
};

export default ImageMagnifier;
