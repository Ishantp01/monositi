import React, { useState } from "react";
import HeroBanner from "./HeroBanner";
import InfoSection from "./InfoSection";
import TabSwitcher from "./TabSwitcher";
import PropertyCard from "./PropertyCard";

// Newly imported components
import Amenities from "./Amenities";
import AboutProject from "./AboutProject";
import Highlights from "./Highlights";
import PhotoGallery from "./PhotoGallery";
import ContactForm from "./ContactForm";
import Footer from "../layout/Footer";
const PropertyPage = () => {
  const [activeTab, setActiveTab] = useState("Buy");

  return (
    <>
      {/* Top Hero Section */}
      <HeroBanner />
      <div className="max-w-7xl mx-auto">
        <InfoSection />

        {/* Tabs Section */}
        <div className="px-4">
          <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* BHK Filter Buttons */}
          <div className="flex gap-2 flex-wrap mb-4">
            <button className="px-3 py-1 text-xs rounded-full border bg-gray-200">
              All
            </button>
            <button className="px-3 py-1 text-xs rounded-full border">
              2BHK
            </button>
            <button className="px-3 py-1 text-xs rounded-full border">
              3BHK
            </button>
            <button className="px-3 py-1 text-xs rounded-full border">
              4BHK
            </button>
          </div>

          {/* Property Cards */}
          <div className="flex flex-wrap gap-4">
            <PropertyCard />
            <PropertyCard />
            <PropertyCard />
          </div>
        </div>

        {/* Newly Added Sections - From Image Continuity */}
        <Amenities />
        <AboutProject />
        <Highlights />
        <PhotoGallery />
      </div>
      <Footer />
    </>
  );
};

export default PropertyPage;
