import React, { useState, useEffect } from "react";

const defaultBanners = [
  {
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    title: "Discover Premium Properties",
    subtitle: "Your dream home awaits",
  },
  {
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    title: "Luxury Living Spaces",
    subtitle: "Experience excellence in real estate",
  },
  {
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    title: "Verified Properties",
    subtitle: "Trust and transparency guaranteed",
  },
];

const Banner = ({ image, link, title, subtitle, autoplay = true }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const banners =
    image || title || subtitle ? [{ image, title, subtitle }] : defaultBanners;

  // Autoplay functionality
  useEffect(() => {
    if (!isPaused && autoplay && banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [isPaused, autoplay, banners.length]);

  const currentBanner = banners[currentIndex];

  const bannerContent = (
    <div
      className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden shadow-2xl group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Premium gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f73c56]/90 via-[#e9334e]/80 to-purple-900/70 z-10"></div>

      {/* Image with ken burns effect */}
      <img
        src={currentBanner.image}
        alt={currentBanner.title || "Banner"}
        className="w-full h-full object-cover transition-transform duration-[8000ms] ease-out group-hover:scale-110"
        onError={(e) => {
          e.target.src = defaultBanners[0].image;
        }}
      />

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-400/20 to-transparent rounded-full blur-3xl z-10"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-400/20 to-transparent rounded-full blur-3xl z-10"></div>

      {/* Content */}
      {(currentBanner.title || currentBanner.subtitle) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 z-20">
          {currentBanner.title && (
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-center drop-shadow-2xl tracking-tight">
              {currentBanner.title}
            </h3>
          )}
          {currentBanner.subtitle && (
            <p className="text-sm md:text-base lg:text-lg text-center drop-shadow-lg font-medium text-white/95 max-w-2xl">
              {currentBanner.subtitle}
            </p>
          )}

          {/* Decorative line */}
          <div className="mt-4 w-24 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full"></div>
        </div>
      )}

      {/* Pagination dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-white shadow-lg"
                  : "w-2 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Premium border effect */}
      <div className="absolute inset-0 rounded-2xl border-2 border-white/10 pointer-events-none z-30"></div>
    </div>
  );

  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {bannerContent}
      </a>
    );
  }

  return bannerContent;
};

export default Banner;
