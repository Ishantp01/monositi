import React from "react";

const AmenitiesSection = ({ title, items }) => {
  return (
    <div className="mb-8 bg-white rounded-lg p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full">
              {typeof item.icon === "string" ? (
                <img
                  src={item.icon}
                  alt={item.label || "Amenity"}
                  className="w-6 h-6 sm:w-8 sm:h-8"
                />
              ) : (
                item.icon
              )}
            </div>
            <span className="text-xs xs:text-sm text-gray-600 font-medium">
              {item.label || "N/A"}
            </span>
            {item.status && (
              <span
                className={`text-xs font-medium ${
                  item.status === "yes"
                    ? "text-green-500"
                    : item.status === "no"
                    ? "text-red-500"
                    : "text-gray-400"
                }`}
                aria-label={
                  item.status === "yes"
                    ? "Available"
                    : item.status === "no"
                    ? "Not Available"
                    : ""
                }
              >
                {item.status === "yes" ? "✔" : item.status === "no" ? "✖" : ""}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AmenitiesSection;
