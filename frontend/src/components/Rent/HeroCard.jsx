import { Share2 } from "lucide-react";

export default function HeroCard({ property }) {
  const formatINR = (n) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  // Use property data if available, otherwise use default values
  const price = property ? formatINR(property.price) : "₹55,000";
  const title = property ? `${property.property_features?.units || '2'} BHK ${property.property_features?.size || '1210'} Sq-ft ${property.type} For Rent in` : "2 BHK 1210 Sq-ft Flat/Apartment For Rent in";
  const projectName = property ? property.name || "Prestige Housing" : "Prestige Housing";
  const location = property ? `${property.address}, ${property.city}` : "Jalpari Road , Jabalpur";
  const image = property ? property.property_features?.images?.[0] : null;
  return (
    <div className="border rounded-lg p-4 sm:p-6 mx-auto shadow-md bg-red-50 max-w-[90%] mb-6">
      {/* Price + Title Row */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-black">{price}</h2>
          <p className="text-gray-700 text-sm sm:text-base font-medium mt-1">
            {title}{" "}
            <span className="font-semibold text-black">{projectName}</span>
          </p>
          <p className="text-gray-500 text-sm mt-1">{location}</p>
        </div>
        {/* Share icon */}
        <button className="text-gray-600 hover:text-gray-800">
          <Share2 size={20} />
        </button>
      </div>

      {/* Images + Quick Info */}
      <div className="flex flex-col md:flex-row gap-6 mt-4">
        {/* Left Section - Images */}
        <div className="flex flex-col gap-2 flex-1">
          {image ? (
            <img
              src={image}
              alt={title}
              className="rounded-lg h-44 sm:h-56 md:h-64 w-full object-cover"
            />
          ) : (
            <div className="bg-gray-300 rounded-lg h-44 sm:h-56 md:h-64"></div>
          )}
          <div className="flex gap-2 sm:gap-3 flex-wrap">
            <div className="bg-gray-300 rounded-lg w-20 h-14 sm:w-24 sm:h-16"></div>
            <div className="bg-gray-300 rounded-lg w-20 h-14 sm:w-24 sm:h-16"></div>
            <div className="bg-gray-300 rounded-lg w-20 h-14 sm:w-24 sm:h-16 flex items-center justify-center text-xs text-gray-600">
              +10 Photos
            </div>
          </div>
        </div>

        {/* Right Section - Property Highlights */}
        <div className="flex-1">
          <div className="flex flex-wrap gap-3 bg-gray-100 rounded-md p-3 text-xs sm:text-sm text-gray-700">
            <span>{property?.bhk || "2 Beds"}</span>
            <span>{property?.furnished || "Furnished"}</span>
            <span>{property?.status || "Ready To Move"}</span>
            <span>{property?.propertyType || "Apartment"}</span>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 mt-4 text-xs sm:text-sm">
            <p>
              <span className="text-red-600 font-medium">Carpet Area</span>{" "}
              <br />
              {property?.area || "907"} {property?.unit || "sqft"} <br /> ₹{Math.round((property?.price || 55000) / (property?.area || 907))}/sqft
            </p>
            <p>
              <span className="text-red-600 font-medium">Developer</span> <br />
              <span className="underline">{property?.owner || "Prestige Estates Projects Ltd."}</span>
            </p>
            <p>
              <span className="text-red-600 font-medium">Floor</span> <br />
              {property?.floor || "15"} (Out of {property?.totalFloors || "19"} Floors)
            </p>
            <p>
              <span className="text-red-600 font-medium">Status</span> <br />
              {property?.status || "Immediately"}
            </p>
            <p>
              <span className="text-red-600 font-medium">Furnished Status</span>{" "}
              <br />
              {property?.furnished || "Fully Furnished"}
            </p>
            <p>
              <span className="text-red-600 font-medium">Facing</span> <br />
              {property?.facing || "West"}
            </p>
            <p>
              <span className="text-red-600 font-medium">
                Age of Construction
              </span>{" "}
              <br />
              {property?.age || "Less Than 5 Years"}
            </p>
          </div>
        </div>
      </div>

      {/* Divider + Action Buttons */}
      <hr className="my-6 border-gray-300" />

      <div className="flex flex-col sm:flex-row gap-3">
        <button className="bg-red-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-700 w-full sm:w-auto">
          Contact Agent
        </button>
        <button className="bg-white border border-red-600 text-red-600 px-6 py-2 rounded-full font-semibold hover:bg-red-50 w-full sm:w-auto">
          Get Phone No.
        </button>
      </div>
    </div>
  );
}
