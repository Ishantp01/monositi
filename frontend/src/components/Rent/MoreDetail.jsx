export default function MoreDetailsSec({ property }) {
  const formatINR = (n) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);
  return (
    <div className="bg-red-50 rounded-lg p-4 sm:p-6 mx-auto shadow-md mb-8 max-w-[90%] border border-red-100">
      {/* Title */}
      <h2 className="text-lg font-semibold mb-4">More Details</h2>

      {/* Details List */}
      <div className="space-y-2 text-sm">
        {[
          ["Rental Value", property ? `${formatINR(property.price)} | ${formatINR(property.price)}` : "₹2.3 Lac | ₹20,000"],
          ["Security Deposit", property ? formatINR(property.price * 2) : "₹10.0 Lac"],
          [
            "Address",
            property ? property.location : "Embassy Lake Terraces, 61A, Service Road, Subramani Nagar, Hebbal Kempapura, Hebbal, Bangalore - North, Karnataka",
          ],
          ["Landmarks", property ? property.location.split(',')[0] : "Hebbal"],
          ["Furnishing", property?.furnished || "Semi-Furnished"],
          ["Flooring", "Marbonite"],
          ["Overlooking", "Garden/Park, Pool"],
          ["Age of Construction", property?.age || "New Construction"],
          ["Additional Rooms", "Puja Room, Study, Servant Room"],
          ["Water Availability", property?.waterSupply || "24 Hours Available"],
          ["Status of Electricity", property?.powerBackup === "Yes" ? "No/Rare Powercut" : "Regular Powercut"],
          ["Floors allowed for construction", property?.totalFloors || "15"],
          ["Lift", "3"],
        ].map(([label, value], i) => (
          <div key={i} className="flex">
            <p className="text-gray-600 font-medium w-48">{label}:</p>
            <p className="text-gray-800">{value}</p>
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="mt-6">
        <p className="text-sm">
          <span className="font-semibold text-gray-900">Description:</span>{" "}
          <span className="text-gray-700">
            {property?.description || "Excellent flat with a nice interior and good vibes."}
          </span>
        </p>
      </div>

      {/* Button */}
      <div className="pt-6">
        <button className="bg-red-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-700 transition">
          Contact Agent
        </button>
      </div>
    </div>
  );
}
