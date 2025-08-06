import React from "react";

const galleryImages = [
  "https://i.pinimg.com/originals/2e/20/ae/2e20aecde7311e2f54402a85f594702c.jpg",
  "https://im.proptiger.com/1/665394/6/562816.jpeg",
  "https://static1.mansionglobal.com/production/media/article-images/150b1342f1f1b75d9637ab52a4d6e1a0/large_india.jpg",
  "https://www.omaxe.com/blog/wp-content/uploads/2022/12/15-tips-for-buying-commercial-properties-in-India.png",
  "https://www.viviun.com/i/1/l/2621/2O3DLT/1/7C65E7/1/40/na-for-sale-and-rent-in-maharastra-india.webp",
];

const PhotoGallery = () => (
  <section className="max-w-7xl mx-auto px-4 py-10">
    <h2 className="text-xl md:text-2xl font-semibold mb-4">
      Photos of Amrutha Platinum Towers
    </h2>

    {/* Horizontal Scroll */}
    <div className="relative">
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
        {galleryImages.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Property ${i + 1}`}
            className="min-w-[150px] h-[100px] sm:min-w-[200px] sm:h-[120px] rounded-md object-cover shadow-sm"
          />
        ))}
      </div>
    </div>
  </section>
);

export default PhotoGallery;
