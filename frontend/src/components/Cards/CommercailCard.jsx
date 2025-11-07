import React from "react";
import FeaturesBox from "./FeatureBox";

export default function CommercialCard({
    image,
    title,
    subtitle,
    description,
    price,        // "₹25,000"
    pricePer,     // "₹25 per sqft"
    rightCta1 = "Get Phone No.",
    rightCta2 = "View All",
    ownerName,    // "Satpal Singh"
    since,        // "2018"
    features = [],
}) {
    return (
        <div className="w-full rounded-xl border border-brand-blue shadow-card overflow-hidden hover:shadow-xl transition-shadow">
            <div className="flex flex-col lg:flex-row">
                {/* Left Image */}
                <div className="lg:w-[350px] xl:w-[400px] 2xl:w-[450px] h-60 lg:h-auto shrink-0 px-4 lg:ps-8 lg:pe-4 py-5">
                    <img src={image} alt={title} className="w-full h-full object-cover rounded-lg" />
                </div>

                {/* Middle content */}
                <div className="flex-1 p-4 sm:py-6 sm:px-4 lg:p-8">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-dark">
                        {title}
                    </h2>
                    <p className="text-brand-gray text-sm lg:text-base mt-1">{subtitle}</p>

                    <FeaturesBox items={features} />

                    <p className="mt-4 text-xs lg:text-sm text-gray-700 leading-tight font-semibold">{description}</p>
                </div>

                {/* Right price/cta */}
                <aside className="lg:w-56 xl:w-64 2xl:w-72 relative flex lg:block justify-between items-center p-4 sm:p-6 bg-brand-blueLight border-t lg:border-t-0 border-brand-blue">
                    <div className="space-y-2 w-full lg:w-auto">
                        <button className="w-full rounded-full border border-brand-red text-brand-red py-2.5 text-sm font-medium bg-white hover:bg-gray-50 transition">
                            {rightCta1}
                        </button>
                        <button className="w-full rounded-full bg-brand-red text-white py-2.5 text-sm font-medium hover:bg-red-700 transition">
                            {rightCta2}
                        </button>

                        <div className="mt-4 text-center">
                            <p className="text-xl lg:text-2xl font-bold text-brand-dark">{price}</p>
                            <p className="text-sm text-gray-500">{pricePer}</p>
                        </div>
                        <div className="text-center w-fit mx-auto underline underline-offset-2 text-sm">Security Deposit</div>

                        <div className="mt-6 text-xs flex justify-center items-center text-gray-600 text-start lg:absolute bottom-0 left-0 right-0 lg:py-8 px-4 w-full">
                            <span className="w-full inline-block h-px mb-2 bg-slate-800"></span>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
