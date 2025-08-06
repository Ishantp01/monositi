import React, { useState } from 'react';

const TabSwitcher = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex gap-2 border border-gray-300 rounded-md w-fit my-6">
      {['Buy', 'Sell'].map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-1 text-sm font-medium rounded-md ${
            activeTab === tab ? 'bg-black text-white' : 'text-black'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabSwitcher;
