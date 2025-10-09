import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import Buy from "../sections/Buy";
import Rent from "../sections/Rent";
import Commercial from "../sections/Commercial";
import Services from "../sections/Services";
import DynamicFilterBar from "./DynamicFilterBar";

const tabOptions = ["Buy", "Rent", "Monositi", "Commercial", "Services"];

const tabContent = {
  Buy: <Buy />,
  Rent: <Rent />,
  // Monositi: <PgHotel />,
  Commercial: <Commercial />,
  Services: <Services />,
};

const tabToHash = {
  Buy: "buy",
  Rent: "rent",
  Monositi: "monositi",
  Commercial: "commercial",
  Services: "commercial",
};

const hashToTab = {
  buy: "Buy",
  rent: "Rent",
  monositi: "Monositi",
  commercial: "Commercial",
  commercial: "Service",
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
    <div className="w-full max-w-full mx-auto py-10 space-y-6 font-inter">
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
            className={`pb-1 border-b-2 ${
              activeTab === tab
                ? "text-theme-primary border-theme-primary"
                : "text-black border-transparent hover:border-gray-400"
            } transition-all`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="mx-4 lg:mx-auto">
        {/* <div className="flex items-center justify-between mx-auto max-w-xl border border-blue-400 rounded-full px-2 py-1 sm:px-4 sm:py-2 w-full overflow-hidden gap-2">
          <input
            type="text"
            placeholder={`Search ${activeTab.toLowerCase()}...`}
            className="flex-1 min-w-0 outline-none px-2 py-1 text-sm sm:text-base"
          />
          <button
            className="flex-shrink-0 flex items-center justify-center bg-theme-primary text-white rounded-full text-sm sm:text-base
                     w-9 h-9 sm:w-auto sm:h-auto sm:px-4 sm:py-1.5 transition-all duration-200"
          >
            <Search size={18} strokeWidth={2.5} />
            <span className="hidden sm:inline ml-1">Search</span>
          </button>
        </div> */}
      </div>

      {/* Dynamic Filter Bar */}
      <DynamicFilterBar activeTab={activeTab} />

      {/* Tab Content */}
      {tabContent[activeTab]}
    </div>
  );
};

export default PropertySearch;
