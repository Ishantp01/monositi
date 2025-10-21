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
            property ? `${property.address}, ${property.city}, ${property.state}` : "Embassy Lake Terraces, 61A, Service Road, Subramani Nagar, Hebbal Kempapura, Hebbal, Bangalore - North, Karnataka",
          ],
          ["Landmarks", property ? property.city : "Hebbal"],
          ["Property Type", property?.type || "Residential"],
          ["Size", property?.property_features?.size ? `${property.property_features.size} sqft` : "1200 sqft"],
          ["Units", property?.property_features?.units || "2 BHK"],
          ["Verification Status", property?.verification_status === 'verified' ? "Verified" : "Pending Verification"],
          ["Monositi Verified", property?.monositi_verified ? "Yes" : "No"],
          ["Property Status", property?.status || "Active"],
          ["Listing Type", property?.listing_visibility || "Public"],
          ["Contact Number", property?.contactNumber || "Not Available"],
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

      {/* Amenities */}
      {property?.property_features?.amenities?.length > 0 && (
        <div className="mt-4">
          <p className="text-sm">
            <span className="font-semibold text-gray-900">Amenities:</span>{" "}
            <span className="text-gray-700">
              {property.property_features.amenities.join(", ")}
            </span>
          </p>
        </div>
      )}

      {/* Nearby Places */}
      {property?.property_features?.nearby_places?.length > 0 && (
        <div className="mt-4">
          <p className="text-sm">
            <span className="font-semibold text-gray-900">Nearby Places:</span>{" "}
            <span className="text-gray-700">
              {property.property_features.nearby_places.join(", ")}
            </span>
          </p>
        </div>
      )}

      {/* Button */}
      <div className="pt-6">
        <button className="bg-red-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-700 transition">
          Contact Agent
        </button>
      </div>
    </div>
  );
}
