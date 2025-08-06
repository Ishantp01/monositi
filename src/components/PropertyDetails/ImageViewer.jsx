import React, { useState, useRef } from "react";
import ImageMagnifier from "./ImageMagnifier";
import { X } from "lucide-react";


const ImageViewer = ({ images = [], onClose }) => {
    const [activeImg, setActiveImg] = useState(images[0]);
    const thumbRef = useRef(null);

    const scrollThumbnails = (direction) => {
        const container = thumbRef.current;
        const scrollAmount = 100;
        if (container) {
            container.scrollBy({
                top: direction === "up" ? -scrollAmount : scrollAmount,
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-10">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-3 right-3 text-white/80 hover:text-red-500 text-xl z-10"
            >
                  <X className="w-6 h-6" />
            </button>
            <div className="bg-white rounded-xl w-full max-w-6xl p-4 relative shadow-lg max-h-[90vh] overflow-hidden">

                <div className="flex flex-col lg:flex-row gap-6 h-full">
                    {/* Main Image */}
                    <div className="flex-1 overflow-hidden scrollbar-hide">
                        <ImageMagnifier src={activeImg} zoom={2.5} />
                    </div>


                    {/* Thumbnail Scroller */}
                    <div className="lg:w-48 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-[22rem] lg:max-h-[500px] relative scrollbar-hide">
                        {/* Desktop Arrows */}
                        <button
                            onClick={() => scrollThumbnails("up")}
                            className="hidden lg:block absolute -top-3 left-1/2 -translate-x-1/2 text-gray-500 hover:text-black text-xl z-10"
                        >
                            ▲
                        </button>

                        <div
                            ref={thumbRef}
                            className="flex lg:flex-col gap-3 rounded-md overflow-x-auto lg:overflow-y-auto pr-1 scroll-smooth scrollbar-hide"
                        >
                            {images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    onClick={() => setActiveImg(img)}
                                    className={`cursor-pointer w-52 h-28 object-cover rounded-md border transition-all duration-200 ${activeImg === img ? "border-2 border-gray-200 scale-95" : "border-gray-300"
                                        }`}
                                />
                            ))}
                        </div>


                        {/* Desktop Arrows */}
                        <button
                            onClick={() => scrollThumbnails("down")}
                            className="hidden lg:block absolute -bottom-3 left-1/2 -translate-x-1/2 text-gray-500 hover:text-black text-xl z-10"
                        >
                            ▼
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageViewer;
