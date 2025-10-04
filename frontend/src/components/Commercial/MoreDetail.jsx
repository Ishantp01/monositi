export default function MoreDetailsSec() {
  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 mx-auto shadow-lg ml-2 sm:ml-6 lg:ml-14 mb-8 max-w-full mb-8">
      {/* Title */}
      <h2 className="text-lg font-semibold border-b pb-2">More Details</h2>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12 text-sm mt-2">
        {[
          ["Price", "₹9 Cr"],
          ["Booking Amount", "₹50.0 Lac"],
          [
            "Facilities",
            "Power Back Up, Lift, Reserved Parking, Security, Water Storage, Service/Goods Lift, Visitor Parking, Intercom Facility, Internet/Wi-Fi Connectivity, RO Water System, Cafeteria/Food Court, CCTV Camera, Fire Sprinklers, Wheelchair Accessibility",
          ],
          [
            "Address",
            "MG Road Close to Metro Station, Mahatma Gandhi Road, Bangalore - Central, Karnataka",
          ],
          ["Lifts", "3"],
          ["Water Availability", "24 Hours Available"],
          ["Pre Leased Property", "No"],
          ["Authority Approval", "Bruhat Bengaluru Mahanagara Palike"],
          ["Landmarks", "Close to MG Road Metro station Bangalore Central"],
          ["Transaction Type", "Resale"],
          ["Plot Area", "30,000 Sq-ft"],
          ["Car Parking", "6 Covered Car Parking"],
          ["Construction Status", "Ready to Move"],
          [
            "Ideal For",
            "Call Center/BPO, Coaching Center, Private Consulting, Doctor Clinic, Pathology, Private Office, Studio/Production house, Health Care, Corporate Office Setup, ... (etc)",
          ],
          ["Status of Electricity", "No/ Rare Powercut"],
          ["Type of Ownership", "Freehold"],
          [
            "Description",
            "Commercial Office Space for sale at MG Road Bangalore Central Multistoried Commercial Complex, 4315 Sq.ft Un Furnished with 6 Reserved Car parking...",
          ],
        ].map(([label, value], i) => (
          <div
            key={i}
            className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-1"
          >
            <p className="text-gray-500">{label}</p>
            <p className="font-medium">{value}</p>
          </div>
        ))}
      </div>

      {/* Button */}
      <div className="pt-4">
        <button className="bg-red-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-700 w-40">
          Contact Agent
        </button>
      </div>
    </div>
  );
}
