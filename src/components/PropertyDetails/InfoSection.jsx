import React from 'react';

const InfoSection = () => {
  return (
    <div className="relative px-4 py-8 md:flex md:justify-between md:items-start gap-8">
      {/* Left Property Info */}
      <div className="mb-6 md:mb-0 max-w-xl">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Amrutha Platinum Towers
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          By Amrutha Rama Constructions Pvt. Ltd.
        </p>
        <p className="text-sm text-gray-500 mt-1">
          📍 Near Katanga T.V. Tower, Gorakhpur JBP.
        </p>
        <p className="text-lg md:text-xl font-semibold mt-4 text-gray-800">
          ₹78 Lac - ₹1.11 Cr
        </p>
        <p className="text-sm text-gray-700 mt-1">2,3,4 BHK Houses</p>
        <button className="mt-5 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-medium transition">
          Contact Now
        </button>
      </div>

      {/* Right Contact Form (visible on md+) */}
      <div className="block md:absolute right-0 bg-gray-100 rounded-xl shadow-md p-6 w-full max-w-sm">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 leading-snug">
          Looking for a house in <br />
        Amrutha Platinum Tower?
        </h3>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full border-b border-gray-400 bg-transparent py-2 text-sm placeholder-gray-500 focus:outline-none focus:border-red-500"
          />
          <input
            type="email"
            placeholder="E-mail"
            className="w-full border-b border-gray-400 bg-transparent py-2 text-sm placeholder-gray-500 focus:outline-none focus:border-red-500"
          />
          <input
            type="tel"
            placeholder="IND +91 Mobile Number"
            className="w-full border-b border-gray-400 bg-transparent py-2 text-sm placeholder-gray-500 focus:outline-none focus:border-red-500"
          />

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-md text-sm font-medium transition shadow-sm"
          >
            Verify NO.
          </button>
        </form>
      </div>
    </div>
  );
};

export default InfoSection;
