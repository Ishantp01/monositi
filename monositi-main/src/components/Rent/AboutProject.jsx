import React from "react";
import projectImg from "../../assets/images/avatar.jpg";

const svgIcons = {
  star: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 576 512"
      fill="#E34F4F"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
    </svg>
  ),
};

export const AboutProject = ({
  projectName = "Embassy Lake Terraces",
  developer = "Embassy Developments Limited",
  priceRange = "₹6.64 Cr - ₹17.41 Cr",
  pricePerSqft = "₹13,143 - ₹25,154",
  configuration = "3, 4, 5 BHK Flats",
  towersAndUnits = "9 Towers, 467 Units",
  rating = 5,
  reviews = 14,
  imageSrc = projectImg,
  bhkOptions = ["3 BHK", "4 BHK", "5 BHK"],
  themeColor = "#E34F4F",
}) => {
  return (
    <div
      className="bg-red-50 rounded-lg p-4 sm:p-6 mx-auto shadow-md mb-8 max-w-[90%] border"
      //   style={{ borderColor: themeColor }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        {/* Left Side */}
        <div className="flex flex-col xs:flex-row gap-4 w-full sm:w-auto">
          <img
            src={imageSrc}
            alt={projectName}
            className="w-20 h-20 object-cover rounded-md"
          />

          <div className="flex flex-col">
            <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                {projectName}
              </h2>
              <div className="hidden xs:block w-px h-6 bg-gray-300"></div>
              <p className="text-base font-semibold text-gray-800">
                {priceRange}
              </p>
            </div>

            <p className="text-sm text-gray-600 mt-1">{developer}</p>

            {/* Ratings */}
            <div className="flex items-center mt-2">
              {svgIcons.star}
              <span className="ml-1 text-sm font-medium">{rating}</span>
              <span className="ml-2 text-sm text-gray-500">
                ({reviews} Reviews)
              </span>
            </div>

            {/* Extra Info */}
            <div className="mt-3 flex flex-wrap gap-4 xs:gap-6 text-sm text-gray-700">
              <p>
                <span className="font-medium">Price per sqft:</span>{" "}
                {pricePerSqft}
              </p>
              <p>
                <span className="font-medium">Configuration:</span>{" "}
                {configuration}
              </p>
              <p>
                <span className="font-medium">Tower & Unit:</span>{" "}
                {towersAndUnits}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col items-start sm:items-end w-full sm:w-auto">
          <a
            className="text-sm font-medium underline"
            href="#"
            style={{ color: themeColor }}
            aria-label="Explore project details"
          >
            Explore Project
          </a>

          <p className="text-sm font-medium text-gray-800 mt-2">
            Check Market Price of
          </p>
          <div className="flex flex-wrap gap-2 mt-2 w-full">
            {bhkOptions.map((type) => (
              <button
                key={type}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 flex-1"
                aria-label={`Check market price for ${type}`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 mt-4 w-full">
            {["Download Brochure", "Follow Project", "Compare Project"].map(
              (action) => (
                <button
                  key={action}
                  className="py-2 px-4 border rounded-full text-sm font-medium w-full"
                  style={{ borderColor: themeColor, color: themeColor }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = `${themeColor}33`)
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                  aria-label={action}
                >
                  {action}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
