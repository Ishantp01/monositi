import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Home,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

const banners = [
  {
    id: 1,
    category: "Buy",
    title: "Find Your Dream Home",
    subtitle: "Explore premium properties for sale",
    description:
      "Discover handpicked residential and commercial properties verified by our team",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000",
    link: "/buylist",
    stats: { properties: "500+", verified: "95%" },
    color: "from-emerald-600 to-teal-600",
  },
  {
    id: 2,
    category: "Rent",
    title: "Your Perfect Rental Awaits",
    subtitle: "Affordable rentals in prime locations",
    description:
      "From cozy apartments to spacious villas, find your ideal rental property",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2000",
    link: "/rentlist",
    stats: { properties: "300+", verified: "90%" },
    color: "from-blue-600 to-cyan-600",
  },
  {
    id: 3,
    category: "Buy",
    title: "Invest in Your Future",
    subtitle: "Premium properties with great ROI",
    description: "Smart investment opportunities in high-growth areas",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2000",
    link: "/buylist",
    stats: { properties: "200+", verified: "98%" },
    color: "from-purple-600 to-pink-600",
  },
  {
    id: 4,
    category: "Rent",
    title: "Flexible Living Solutions",
    subtitle: "PG, Hostels & Shared Accommodations",
    description:
      "Budget-friendly options for students and working professionals",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2000",
    link: "/rentlist",
    stats: { properties: "150+", verified: "92%" },
    color: "from-orange-600 to-red-600",
  },
  {
    id: 5,
    category: "Buy",
    title: "Luxury Living Redefined",
    subtitle: "Exclusive premium residences",
    description:
      "Experience the epitome of luxury in our handpicked collection",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000",
    link: "/buylist",
    stats: { properties: "100+", verified: "100%" },
    color: "from-indigo-600 to-purple-600",
  },
];

const BannerCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = banners.length - 1;
      if (nextIndex >= banners.length) nextIndex = 0;
      return nextIndex;
    });
  };

  // Autoplay functionality
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setDirection(1);
        setCurrentIndex((prevIndex) => {
          let nextIndex = prevIndex + 1;
          if (nextIndex >= banners.length) nextIndex = 0;
          return nextIndex;
        });
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isPaused]);

  const currentBanner = banners[currentIndex];

  return (
    <div
      className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden bg-gray-900"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute inset-0"
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <img
              src={currentBanner.image}
              alt={currentBanner.title}
              className="w-full h-full object-cover"
            />
            <div
              className={`absolute inset-0 bg-gradient-to-r ${currentBanner.color} opacity-80`}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          </div>

          {/* Content */}
          <div className="relative h-full container mx-auto max-w-7xl px-4 lg:px-6">
            <div className="flex flex-col justify-center h-full max-w-3xl">
              {/* Category Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full w-fit mb-4"
              >
                <Home className="w-4 h-4 text-white" />
                <span className="text-white font-semibold text-sm">
                  {currentBanner.category}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
              >
                {currentBanner.title}
              </motion.h1>

              {/* Subtitle */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-6"
              >
                {currentBanner.subtitle}
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-base md:text-lg text-white/80 mb-8 max-w-2xl"
              >
                {currentBanner.description}
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-6 mb-8"
              >
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-3 rounded-lg">
                  <MapPin className="w-5 h-5 text-white" />
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {currentBanner.stats.properties}
                    </div>
                    <div className="text-xs text-white/70">Properties</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-3 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {currentBanner.stats.verified}
                    </div>
                    <div className="text-xs text-white/70">Verified</div>
                  </div>
                </div>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Link
                  to={currentBanner.link}
                  className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
                >
                  Explore Properties
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button
        onClick={() => paginate(-1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 text-white group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={() => paginate(1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-white group-hover:scale-110 transition-transform" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? "w-8 bg-white"
                : "w-2 bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Auto-play indicator */}
      <div className="absolute top-4 right-4 z-20 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
        <span className="text-white text-sm font-medium">
          {currentIndex + 1} / {banners.length}
        </span>
      </div>
    </div>
  );
};

export default BannerCarousel;
