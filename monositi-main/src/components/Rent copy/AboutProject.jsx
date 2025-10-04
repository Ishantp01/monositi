import React from "react";
import { Star } from "lucide-react";

const AboutProject = () => {
  return (
    <div className="bg-[#fff5f5] border rounded-xl shadow-sm p-6 md:p-8">
      <div className="flex justify-between items-start">
        {/* Left Side */}
        <div className="flex flex-col">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">
            Embassy Lake Terraces
          </h2>
          <p className="text-sm text-gray-600">
            by Embassy Developments Limited
          </p>

          {/* Ratings */}
          <div className="flex items-center mt-2">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="ml-1 text-sm font-medium">5</span>
            <span className="ml-2 text-sm text-gray-500">(14 Reviews)</span>
          </div>

          {/* Price */}
          <p className="mt-3 text-base font-semibold text-gray-800">
            Price: <span className="text-black">₹ 6.64 Cr - ₹ 17.41 Cr</span>
          </p>

          {/* Extra Info */}
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-700">
            <p>
              <span className="font-medium">Price per sqft:</span> ₹ 13,143 - ₹
              25,154
            </p>
            <p>
              <span className="font-medium">Configuration:</span> 3, 4, 5 BHK
              Flats
            </p>
            <p>
              <span className="font-medium">Tower & Unit:</span> 9 Towers, 467
              Units
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col items-end">
          <p className="text-sm font-medium text-gray-800">
            Check Market Price of
          </p>
          <div className="flex gap-2 mt-2">
            {["3 BHK", "4 BHK", "5 BHK"].map((type) => (
              <button
                key={type}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                {type}
              </button>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-4">
            <button className="px-4 py-2 border border-red-600 text-red-600 rounded-full text-sm font-medium hover:bg-red-50">
              Download Brochure
            </button>
            <button className="px-4 py-2 border border-red-600 text-red-600 rounded-full text-sm font-medium hover:bg-red-50">
              Follow Project
            </button>
            <button className="px-4 py-2 border border-red-600 text-red-600 rounded-full text-sm font-medium hover:bg-red-50">
              Compare Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutProject;
