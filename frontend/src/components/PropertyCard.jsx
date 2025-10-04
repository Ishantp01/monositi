import OutlineButton from "./MoreButton";

export const PropertyCard = ({ data }) => {
  return (
    <div className="w-full h-full bg-white rounded-2xl overflow-hidden border border-red-500 shadow-sm hover:shadow-lg transition-all">
      {/* Image */}
      <img src={data.image} alt="property" className="h-40 w-full object-cover" />

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-gray-600">Residential plot</p>
        <p className="text-xs text-gray-400">2BHK / 600 Sq.ft.</p>

        <div className="flex items-center gap-2 font-bold my-2">
          <span>₹89 Lac</span>
          <span className="text-black">|</span>
          <span>1000 sqft</span>
        </div>

        <p className="text-xs text-gray-400">IT Park, Jabalpur</p>
        <OutlineButton text="View Details" use="inside" />
      </div>
    </div>
  );
};
