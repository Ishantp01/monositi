import React from "react";
import OutlineButton from "../MoreButton";

const Header = ({ property }) => {
  const formatINR = (n) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);
  return (
    <section className="bg-white relative mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-14 py-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 w-full sm:w-auto">
          <div className="flex flex-col">
            <h2 className="text-gray-400 font-medium text-sm sm:text-base">
              Rent/Buy
            </h2>
            <p className="font-medium text-base sm:text-lg">
              {property ? formatINR(property.price) : "₹11,680"} onwards
            </p>
          </div>

          {/* Vertical line, hidden on mobile */}
          <div className="hidden sm:block w-[2px] h-[100px] sm:h-[125px] bg-black self-center"></div>

          <div className="flex flex-col">
            <h1 className="text-gray-600 text-xl sm:text-2xl">
              {property?.name || "Zolo Clayton"}
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              in {property?.city || "Hsr Layout"}
            </p>
            <p className="text-gray-600 font-medium text-sm sm:text-base mt-2 sm:mt-4">
              Occupancy Type: <span className="text-black">
                {property?.sharingOptions ? Object.keys(property.sharingOptions).join(", ") : "Double, Single"}
              </span>{" "}
              <span className="bg-gray-300 rounded-xl px-2 py-1 text-xs sm:text-sm">
                {property?.genderPreference || "For Girls and Boys"}
              </span>{" "}
              <span className="bg-gray-300 rounded-xl px-2 py-1 text-xs sm:text-sm">
                Food Charges Extra
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-col items-start sm:items-end w-full sm:w-auto">
          <h2 className="text-gray-400 text-sm sm:text-base">
            Posted By: <strong className="text-black">{property?.contactNumber || "Owner Naaz"}</strong>
          </h2>
          <div className="mt-2">
            <OutlineButton text="View Phone No." use="inside" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
