import uparrow from "../../assets/Rent/upload.png";
import downarrow from "../../assets/Rent/down-arrow.png";

export default function FilterBar() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-red-50 p-4 mx-auto max-w-[90%] rounded-lg">
      {/* Search Input */}
      <div className="flex items-center bg-white rounded-full px-3 py-2 border border-gray-200 shadow-sm w-full sm:w-auto flex-1">
        <span className="text-sm font-medium text-gray-600 mr-2">Buy</span>
        <input
          type="text"
          placeholder="Enter Locality/Project"
          className="w-full sm:w-auto outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
        />
      </div>
      {/* Flat Button */}
      <button className="w-full sm:w-auto px-4 py-2 border border-red-500 text-red-500 rounded-full text-sm hover:bg-red-100 transition">
        Flat -1
      </button>
      {/* BHK Button */}
      <button className="w-full sm:w-auto px-4 py-2 border border-red-500 text-red-500 rounded-full text-sm hover:bg-red-100 transition">
        1, 2, 3 BHK
      </button>
      <button className="w-full sm:w-auto px-4 py-2 border border-red-500 text-red-500 rounded-full text-sm hover:bg-red-100 transition">
        Posted By
      </button>{" "}
      <button className="w-full sm:w-auto px-4 py-2 border border-red-500 text-red-500 rounded-full text-sm hover:bg-red-100 transition">
        More Filters
      </button>
    </div>
  );
}
