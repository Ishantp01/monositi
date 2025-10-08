import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const tabOptions = ['Buy', 'Rent', 'PG/Hostel', 'Commercial'];

const tabContent = {
  Buy: 'Find your dream property to Buy here.',
  Rent: 'Search properties available for Rent.',
  'PG/Hostel': 'Discover PGs and Hostels near your location.',
  Commercial: 'Explore Commercial properties like shops, offices.',
};

const PropertySearch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Buy');

  // Map URL paths to tab names
  const pathToTab = {
    '/': 'Buy',
    '/buy': 'Buy',
    '/rent': 'Rent',
    '/pg': 'PG/Hostel',
    '/commercial': 'Commercial'
  };

  // Update active tab based on URL
  useEffect(() => {
    const currentPath = location.pathname;
    const tabFromPath = pathToTab[currentPath] || 'Buy';
    setActiveTab(tabFromPath);
  }, [location.pathname]);

  const handleTabClick = (tab) => {
   
    
    // Update URL based on tab selection
    const tabToPath = {
      'Buy': '/buy',
      'Rent': '/rent',
      'PG/Hostel': '/pg',
      'Commercial': '/commercial'
    };
    
    const newPath = tabToPath[tab] || '/buy';
    navigate(newPath);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-10 space-y-6 font-inter">
      {/* Header Text */}
      <div className="text-center text-sm sm:text-base">
        <p className="text-lg sm:text-sm font-bold">
          <span className="font-mrdafoe text-xl text-theme-primary pr-2">Find</span>{' '}
          A Place Away From{' '}
          <span className="font-mrdafoe text-xl text-theme-primary ps-2">Home</span>
        </p>
        <p className="text-lg sm:text-sm font-bold">
          <span className="font-mrdafoe text-xl text-theme-primary pr-2">Which</span>{' '}
          Feels Like{' '}
          <span className="font-mrdafoe text-xl text-theme-primary ps-2">Home</span>
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-4 text-sm sm:text-base font-medium">
        {tabOptions.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`pb-1 border-b-2 ${activeTab === tab
              ? 'text-theme-primary border-theme-primary'
              : 'text-black border-transparent hover:border-gray-400'
              } transition-all`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between border border-blue-400 rounded-full px-2 py-1 sm:px-4 sm:py-2 w-full max-w-full overflow-hidden gap-2">
        <input
          type="text"
          placeholder={`Search ${activeTab.toLowerCase()}...`}
          className="flex-1 min-w-0 outline-none px-2 py-1 text-sm sm:text-base"
        />
        {/* Responsive button: icon-only on small screens, text + icon on sm+ */}
        <button className="flex-shrink-0 flex items-center justify-center bg-theme-primary text-white rounded-full text-sm sm:text-base
                     w-9 h-9 sm:w-auto sm:h-auto sm:px-4 sm:py-1.5 transition-all duration-200">
          <Search size={18} strokeWidth={2.5} /> {/* Bold icon */}
          <span className="hidden sm:inline ml-1">Search</span>
        </button>
      </div>



      {/* Tab Content */}
      <div className="mt-6 bg-gray-100 rounded-lg p-4 text-center shadow-sm">
        <p className="text-sm sm:text-base">{tabContent[activeTab]}</p>
      </div>
    </div>
  );
};

export default PropertySearch;
