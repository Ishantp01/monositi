import { Link } from "react-router-dom";
import OutlineButton from "./MoreButton";

export const PropertyCard = ({ data, link }) => {
  return (
    <div className="w-full h-full bg-white rounded-2xl overflow-hidden border border-red-500 shadow-sm hover:shadow-lg transition-all">
      {/* Image */}
      <Link to={link}>
        <img
          src={data.photos[0]}
          alt={data.name}
          className="h-40 w-full object-cover"
        />
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link to={link}>
          <p className="text-sm text-gray-600 font-medium">{data.name}</p>
          <p className="text-xs text-gray-400">{data.description}</p>

          <div className="flex items-center gap-2 font-bold my-2">
            <span>₹{data.price.toLocaleString()}</span>
            <span className="text-black">|</span>
            <span>{data.type}</span>
          </div>

          <p className="text-xs text-gray-400">
            {data.address}, {data.city}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            {data.genderPreference} • {data.status}
          </p>
        </Link>

        <div className="mt-3">
          <OutlineButton text="View Details" use="inside" link={link} />
        </div>
      </div>
    </div>
  );
};
