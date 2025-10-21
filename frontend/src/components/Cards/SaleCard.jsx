import React from "react";
import { useNavigate } from "react-router-dom";
import FeaturesBox from "../Features/FeatureBox";

export default function SaleCard({
  image,
  title,
  subtitle,
  description,
  price, // e.g. "₹1.10 Cr"
  pricePer, // e.g. "₹9345 per sqft"
  rightCta1 = "Request Callback",
  rightCta2 = "View Details",
  builderName, // e.g. "Provident Housi..."
  since, // e.g. "2018"
  features = [], // [{label, value}, ...]
  _id, // Property ID for navigation
}) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    if (_id) {
      navigate(`/buy-details/${_id}`);
    }
  };
  return (
    <div className="w-full rounded-xl border border-brand-border shadow-card overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Left Image */}
        <div className="md:w-80 h-60 md:h-auto shrink-0 px-4 md:px-8 py-4">
          <img
            src={image}
            alt={title}
            className="w-full h-full rounded-lg object-cover "
          />
        </div>

        {/* Middle content */}
        <div className="flex-1 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-brand-dark">
            {title}
          </h2>
          <p className="text-brand-gray text-sm mt-1">{subtitle}</p>

          <FeaturesBox items={features} />

          <p className="mt-4 text-xs text-gray-700 leading-tight font-semibold">
            {description}
          </p>
        </div>

        {/* Right price/cta */}
        <aside className="md:w-52 relative flex md:block justify-between items-center p-4 sm:p-6 bg-brand-greenLight border-t md:border-t-0 md:border-l border-brand-border">
          <div className="space-y-2 w-full md:w-auto">
            <button className="w-full rounded-full border border-brand-red text-brand-red py-2 text-sm font-medium hover:bg-white transition">
              {rightCta1}
            </button>
            <button
              onClick={handleViewDetails}
              className="w-full rounded-full bg-brand-red text-white py-2 text-sm font-medium hover:bg-red-700 transition"
            >
              {rightCta2}
            </button>

            <div className="mt-4 mx-auto text-center">
              <p className="text-xl font-bold text-brand-dark">{price}</p>
              <p className="text-sm text-gray-500">{pricePer}</p>
            </div>

            <div className="mt-6 text-xs text-gray-600 text-start md:absolute bottom-0 md:py-8">
              <span className="w-full inline-block h-px md:scale-110 mb-2 bg-slate-800"></span>
              <p className="font-medium">
                <span className="font-semibold">Builder :</span> {builderName}
              </p>
              <p>
                <span className="font-medium">Since :</span> {since}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
