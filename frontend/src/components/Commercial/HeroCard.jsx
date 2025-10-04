import { Share2 } from "lucide-react";
import { CheckCircle } from "lucide-react";

export default function HeroCard() {
  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 mx-auto shadow-lg ml-2 sm:ml-6 lg:ml-14 mb-8 max-w-full">
      {/* Price + Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-0 mb-6 sm:mb-14">
        <div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-6">
            <h2 className="text-lg sm:text-xl font-bold">₹9.99Cr</h2>
            <p className="text-gray-500 font-bold text-sm sm:text-base">
              ₹20000/sqft
            </p>
          </div>
          <p className="text-gray-500 mt-1 font-semibold text-base sm:text-lg leading-snug">
            4500 Sq-ft Commercial Office Space For Sale in{" "}
            <span className="font-semibold text-black">
              Jalpari Road , Jabalpur
            </span>
          </p>
        </div>

        <button className="self-end sm:self-auto text-gray-600 hover:text-gray-800">
          <Share2 />
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mt-4">
        <div className="flex flex-col gap-2 flex-1">
          <div className="bg-gray-300 rounded-lg h-40 sm:h-48 md:h-60"></div>
          <div className="flex gap-2 sm:gap-4 flex-wrap">
            <div className="bg-gray-300 rounded-lg w-20 h-14 sm:w-28 sm:h-16"></div>
            <div className="bg-gray-300 rounded-lg w-20 h-14 sm:w-28 sm:h-16"></div>
            <div className="bg-gray-300 rounded-lg w-20 h-14 sm:w-28 sm:h-16"></div>
            <div className="bg-gray-300 rounded-lg w-20 h-14 sm:w-28 sm:h-16 flex items-center justify-center text-xs sm:text-sm text-gray-600">
              +10 Photos
            </div>
          </div>
        </div>

        {/* Right Section - Details */}
        <div className="flex-1">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 text-xs sm:text-sm text-gray-600">
            <span className="px-3 py-1 bg-gray-100 rounded">Grade A+</span>
            <span className="px-3 py-1 bg-gray-100 rounded">Unfurnished</span>
            <span className="px-3 py-1 bg-gray-100 rounded">6 Car Parking</span>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 mt-4 text-xs sm:text-sm">
            <p className="p-2 sm:p-4">
              <span className="text-blue-500 font-medium">Super Area</span>{" "}
              <br />
              <span className="text-gray-800 font-medium">4500 sqft</span>{" "}
              <br />
              <span className="text-gray-800 font-medium">₹20000 / sqft</span>
            </p>
            <p className="p-2 sm:p-4">
              <span className="text-blue-500 font-medium">Carpet Area</span>{" "}
              <br />
              <span className="text-gray-800 font-medium">4315 sqft</span>{" "}
              <br />
              <span className="text-gray-800 font-medium">₹28,357 / sqft</span>
            </p>
            <p className="p-2 sm:p-4">
              <span className="text-blue-500 font-medium">Floor</span> <br />
              <span className="text-gray-800 font-medium">
                8 (Out of 10 Floors)
              </span>
            </p>
            <p className="p-2 sm:p-4">
              <span className="text-blue-500 font-medium">Units of Floors</span>{" "}
              <br />
              <span className="text-gray-800 font-medium">2</span>
            </p>
            <p className="p-2 sm:p-4">
              <span className="text-blue-500 font-medium">Pantry</span> <br />
              <span className="text-gray-800 font-medium">Wet pantry</span>
            </p>
            <p className="p-2 sm:p-4">
              <span className="text-blue-500 font-medium">Washroom</span> <br />
              <span className="text-gray-800 font-medium">3</span>
            </p>
            <p className="p-2 sm:p-4">
              <span className="text-blue-500 font-medium">Overlooking</span>{" "}
              <br />
              <span className="text-gray-800 font-medium">
                Garden/Park, Main Road Facing
              </span>
            </p>
            <p className="p-2 sm:p-4">
              <span className="text-blue-500 font-medium">Facing</span> <br />
              <span className="text-gray-800 font-medium">East</span>
            </p>
          </div>
        </div>
      </div>

      {/* Amenities + Divider + Buttons */}
      <div className="mt-6">
        <div className="text-sm sm:text-lg text-gray-600 flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-6">
          <p className="flex items-center gap-2 text-gray-700">
            <CheckCircle className="text-green-600 w-5 h-5" />
            Wet Pantry/Cafeteria Available
          </p>
          <p className="flex items-center gap-2 text-gray-700">
            <CheckCircle className="text-green-600 w-5 h-5" />6 Covered
            Parking(s) Available, Parking ratio 1:1000 sq ft
          </p>
        </div>

        <hr className="my-4 border-gray-300" />

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button className="bg-red-600 text-white px-4 sm:px-5 py-2 rounded-full font-semibold hover:bg-red-700 w-full sm:w-auto">
            Contact Agent
          </button>
          <button className="bg-red-200 border border-red-600 text-red-600 px-4 sm:px-5 py-2 rounded-full font-semibold hover:bg-red-50 w-full sm:w-auto">
            Get Phone No.
          </button>
        </div>
      </div>
    </div>
  );
}
