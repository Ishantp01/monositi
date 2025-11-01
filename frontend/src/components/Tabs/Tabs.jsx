import React, { useEffect, useState } from "react";
import Buy from "../sections/Buy";
import Rent from "../sections/Rent";
import Services from "../sections/Services";
import DynamicFilterBar from "./DynamicFilterBar";
import Monositi from "../sections/Monositi";

const tabOptions = ["Buy", "Rent", "Monositi", "Services"];

const tabContent = {
  Buy: <Buy />,
  Rent: <Rent />,
  Monositi: <Monositi />,
  // Commercial: <Commercial />,
  Services: <Services />,
};

const tabToHash = {
  Buy: "buy",
  Rent: "rent",
  Monositi: "monositi",
  Services: "services",
};

const hashToTab = {
  buy: "Buy",
  rent: "Rent",
  monositi: "Monositi",
  services: "Services",
};

const PropertySearch = () => {
  const [activeTab, setActiveTab] = useState("Buy");

  // Set tab based on hash on mount
  useEffect(() => {
    const hash = window.location.hash.replace("#", "").toLowerCase();
    if (hashToTab[hash]) {
      setActiveTab(hashToTab[hash]);
    }
  }, []);

  // Update hash when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const hash = tabToHash[tab];
    window.history.replaceState(null, "", `#${hash}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-10 space-y-6 font-inter">
      {/* Header Text */}
      <div className="text-center text-sm sm:text-base">
        <p className="text-lg sm:text-sm font-bold">
          <span className="font-mrdafoe text-xl text-theme-primary pr-2">
            Find
          </span>{" "}
          A Place Away From{" "}
          <span className="font-mrdafoe text-xl text-theme-primary ps-2">
            Home
          </span>
        </p>
        <p className="text-lg sm:text-sm font-bold">
          <span className="font-mrdafoe text-xl text-theme-primary pr-2">
            Which
          </span>{" "}
          Feels Like{" "}
          <span className="font-mrdafoe text-xl text-theme-primary ps-2">
            Home
          </span>
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-4 text-sm sm:text-base font-medium">
        {tabOptions.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`pb-1 border-b-2 ${activeTab === tab
              ? "text-theme-primary border-theme-primary"
              : "text-black border-transparent hover:border-gray-400"
              } transition-all`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Dynamic Filter Bar */}
      <DynamicFilterBar activeTab={activeTab} />

      {/* Tab Content */}
      {tabContent[activeTab]}
    </div>
  );
};

export default PropertySearch;
