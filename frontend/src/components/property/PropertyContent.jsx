import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Buy from "../sections/Buy";
import Rent from "../sections/Rent";
import PG from "./sections/PG";
import Commercial from "../sections/Commercial";
import PropertyDetail from "./Buy/PropertyDetail";

const PropertyContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Buy");
  const [showPropertyDetail, setShowPropertyDetail] = useState(false);

  // Map URL paths to tab names
  const pathToTab = {
    "/": "Buy",
    "/buy": "Buy",
    "/rent": "Rent",
    "/pg": "PG/Hostel",
    "/commercial": "Commercial",
  };

  // Update active tab based on URL
  useEffect(() => {
    const currentPath = location.pathname;
    const tabFromPath = pathToTab[currentPath] || "Buy";
    setActiveTab(tabFromPath);
    setShowPropertyDetail(false);
  }, [location.pathname]);

  const handleViewDetails = () => {
    setShowPropertyDetail(true);
  };

  const handleBackToTabs = () => {
    setShowPropertyDetail(false);
  };

  const renderTabContent = () => {
    if (showPropertyDetail) {
      return <PropertyDetail onBack={handleBackToTabs} />;
    }

    switch (activeTab) {
      case "Buy":
        return <Buy onViewDetails={handleViewDetails} />;
      case "Rent":
        return <Rent onViewDetails={handleViewDetails} />;
      case "PG/Hostel":
        return <PG onViewDetails={handleViewDetails} />;
      case "Commercial":
        return <Commercial onViewDetails={handleViewDetails} />;
      default:
        return <Buy onViewDetails={handleViewDetails} />;
    }
  };

  return (
    <div className="min-h-screen">
      <div
        className={`transition-all duration-500 ease-in-out ${
          showPropertyDetail
            ? "opacity-100 transform translate-y-0"
            : "opacity-100 transform translate-y-0"
        }`}
      >
        {renderTabContent()}
      </div>
    </div>
  );
};

export default PropertyContent;
