export default function MoreDetailsSec() {
  return (
    <div className="bg-red-50 rounded-lg p-4 sm:p-6 mx-auto shadow-md mb-8 max-w-[90%] border border-red-100">
      {/* Title */}
      <h2 className="text-lg font-semibold mb-4">More Details</h2>

      {/* Details List */}
      <div className="space-y-2 text-sm">
        {[
          ["Rental Value", "₹2.3 Lac | ₹20,000"],
          ["Security Deposit", "₹10.0 Lac"],
          [
            "Address",
            "Embassy Lake Terraces, 61A, Service Road, Subramani Nagar, Hebbal Kempapura, Hebbal, Bangalore - North, Karnataka",
          ],
          ["Landmarks", "Hebbal"],
          ["Furnishing", "Semi-Furnished"],
          ["Flooring", "Marbonite"],
          ["Overlooking", "Garden/Park, Pool"],
          ["Age of Construction", "New Construction"],
          ["Additional Rooms", "Puja Room, Study, Servant Room"],
          ["Water Availability", "24 Hours Available"],
          ["Status of Electricity", "No/Rare Powercut"],
          ["Floors allowed for construction", "15"],
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
            Excellent flat with a nice interior and good vibes.
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
