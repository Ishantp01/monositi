import React from "react";

const Banner = ({ image, link, title, subtitle }) => {
  const defaultImage = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";

  const bannerContent = (
    <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden bg-gradient-to-r from-[#f73c56] to-[#e9334e]">
      <img
        src={image || defaultImage}
        alt={title || "Banner"}
        className="w-full h-full object-cover opacity-80"
        onError={(e) => {
          e.target.src = defaultImage;
        }}
      />
      {(title || subtitle) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-30 text-white px-4">
          {title && <h3 className="text-xl md:text-2xl font-bold mb-2 text-center">{title}</h3>}
          {subtitle && <p className="text-sm md:text-base text-center">{subtitle}</p>}
        </div>
      )}
    </div>
  );

  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className="block">
        {bannerContent}
      </a>
    );
  }

  return bannerContent;
};

export default Banner;

