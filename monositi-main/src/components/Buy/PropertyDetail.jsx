

import React, { useState } from "react";
import {
    Home,
    TreeDeciduous,
    Dumbbell,
    Bike,
    Zap,
    Waves,
    ArrowUpDown,
    Shield,
    Car,
    Package,
    Users,
    TreePine,
    MapPinned,ChevronRight  
} from "lucide-react";

const properties = [
    {
        id: 1,
        type: "Buy",
        bhk: "2BHK",
        price: "₹89 Lac",
        size: "1000 sqft",
        location: "IT Park, Jabalpur",
        status: "Ready to Move",
    },
    {
        id: 2,
        type: "Buy",
        bhk: "3BHK",
        price: "₹1.02 Cr",
        size: "1400 sqft",
        location: "Katanga, Jabalpur",
        status: "Ready to Move",
    },
    {
        id: 3,
        type: "Buy",
        bhk: "4BHK",
        price: "₹1.11 Cr",
        size: "1800 sqft",
        location: "Madan Mahal, Jabalpur",
        status: "Under Construction",
    },
    {
        id: 4,
        type: "Sell",
        bhk: "2BHK",
        price: "₹78 Lac",
        size: "950 sqft",
        location: "Napier Town, Jabalpur",
        status: "Resale",
    },
];

const PropertyDetail = () => {
    const [activeTab, setActiveTab] = useState("Buy");
    const [filter, setFilter] = useState("All");

    const filteredProperties = properties.filter((p) => {
        if (p.type !== activeTab) return false;
        if (filter === "All") return true;
        return p.bhk === filter;
    });

    const amenities = [
        { name: "Club House", icon: Home },
        { name: "Jogging and Strolling Track", icon: TreeDeciduous },
        { name: "Outdoor Tennis Courts", icon: Dumbbell },
        { name: "Cycling & Jogging Track", icon: Bike },
        { name: "Power Back Up", icon: Zap },
        { name: "Swimming Pool", icon: Waves },
        { name: "Lift", icon: ArrowUpDown },
        { name: "Security", icon: Shield },
        { name: "Park", icon: TreePine },
        { name: "Reserved Parking", icon: Car },
        { name: "Service/Goods Lift", icon: Package },
        { name: "Visitor Parking", icon: Users },
    ];

    return (
        <div className="min-h-screen bg-pink-50 flex flex-col items-center px-4 sm:px-6 lg:px-8 py-8">
            {/* Main Container */}
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Header */}
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                            Amrutha Platinum Towers
                        </h1>
                        <p className="text-sm text-gray-600 font-semibold">
                            By Amrutha Rama Constructions Pvt. Ltd.
                        </p>
                       <p className="text-sm text-gray-500 flex items-center gap-1 font-semibold">
  <MapPinned className="w-4 h-4 text-gray-600" />
  Near Katanga T.V. Tower, Gorakhpur JBP.
</p>

                    </div>

                    {/* Price & Button */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <p className="text-lg sm:text-xl font-bold text-gray-900">
                                ₹78 Lac - ₹1.11 Cr
                            </p>
                            <p className="text-gray-600 text-sm">2,3,4 BHK Houses</p>
                        </div>
                        <button className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-5 py-2 rounded-md font-semibold w-full sm:w-auto">
                            Contact Now
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center border-b overflow-x-auto">
                        <button
                            onClick={() => setActiveTab("Buy")}
                            className={`px-6 py-2 whitespace-nowrap font-semibold border-t border-l border-r ${activeTab === "Buy"
                                    ? "bg-white border-gray-400"
                                    : "border-transparent text-gray-500"
                                }`}
                        >
                            Buy
                        </button>
                        <button
                            onClick={() => setActiveTab("Sell")}
                            className={`px-6 py-2 whitespace-nowrap font-semibold ${activeTab === "Sell"
                                    ? "bg-white border-t border-r border-l border-gray-400"
                                    : "border-transparent text-gray-500"
                                }`}
                        >
                            Sell
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap items-center justify-between bg-gray-200 px-4 py-2 rounded-md gap-3">
                        <div className="flex flex-wrap gap-2 text-sm font-medium">
                            {["All", "2BHK", "3BHK", "4BHK"].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-3 py-1 rounded-md ${filter === f ? "bg-white shadow" : ""
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                       <button className="p-1">
  <ChevronRight className="w-6 h-6 text-gray-800 font-bold" />
</button>

                    </div>

                    {/* Cards */}
                    {filteredProperties.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProperties.map((p) => (
                                <div
                                    key={p.id}
                                    className="border rounded-md overflow-hidden shadow-sm bg-white"
                                >
                                    <div className="h-28 bg-black"></div>
                                    <div className="p-4 space-y-2">
                                        <p className="font-bold text-gray-900">
                                            {p.price} | {p.size}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {p.bhk} <br />
                                            {p.status}
                                        </p>
                                        <p className="text-xs text-gray-500">{p.location}</p>
                                        <button className="mt-3 w-full border border-red-500 text-red-500 px-3 py-2 rounded-md font-medium hover:bg-red-50">
                                            Contact Builder
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 mt-4">No properties found.</p>
                    )}
                </div>

                {/* Right Section - Form */}
                <div className="bg-white shadow-md rounded-lg p-6 sm:p-8 h-fit">
                    <h2 className="text-base sm:text-lg font-semibold mb-4">
                        Looking for a house in Amrutha Platinum Tower ?
                    </h2>
                    <form className="space-y-3">
                        <input
                            type="text"
                            placeholder="Name"
                            className="w-full border-b p-2 focus:outline-none text-sm"
                        />
                        <input
                            type="email"
                            placeholder="E-mail"
                            className="w-full border-b p-2 focus:outline-none text-sm"
                        />
                        <div className="flex gap-2">
                            <span className="border-b p-2 text-sm">IND +91</span>
                            <input
                                type="tel"
                                placeholder="Mobile Number"
                                className="flex-1 border-b p-2 focus:outline-none text-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-semibold"
                        >
                            Verify No.
                        </button>
                    </form>
                </div>
            </div>

            <div className="w-full max-w-6xl space-y-12 mt-10">
                {/* Amenities */}
                <section>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                        Amenities Amrutha Platinum Towers
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 bg-white p-4 sm:p-6 rounded-lg shadow">
                        {amenities.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={i}
                                    className="flex flex-col items-center justify-center border rounded-lg p-3 sm:p-4 text-center hover:shadow-md transition"
                                >
                                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
                                    <p className="text-xs sm:text-sm font-medium text-gray-700 mt-2">
                                        {item.name}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                    <div className="text-center mt-6">
                        <button className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 rounded-full font-semibold">
                            Contact Builder
                        </button>
                    </div>
                </section>

                {/* About Section */}
                <section className="max-w-4xl">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                        About Amrutha Platinum Towers
                    </h2>
                    <p className="text-gray-700 text-sm leading-relaxed mb-8">
                        Amrutha Platinum rises the skyline of Whitefield, one of Bangalore’s
                        most coveted neighborhood. From its elegant contemporary design to
                        its state-of-the-art lifestyle amenities, Amrutha Platinum promises
                        to make urban homes a reality. With a vision, Amrutha Platinum you
                        can expect the luxury and exclusivity of one of Bangalore’s premium
                        addresses. A home in Amrutha Platinum makes you part of Bangalore’s
                        elite future. Here’s your chance to live at an exclusive landmark.
                    </p>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-10 mb-10">
                        <div className="bg-white border rounded-lg p-3 sm:p-4 text-center">
                            <p className="text-xs sm:text-sm text-gray-500">Project Size</p>
                            <p className="font-semibold text-sm sm:text-base">2 Acre</p>
                        </div>
                        <div className="bg-white border rounded-lg p-3 sm:p-4 text-center">
                            <p className="text-xs sm:text-sm text-gray-500">Launch Date</p>
                            <p className="font-semibold text-sm sm:text-base">Aug 2022</p>
                        </div>
                        <div className="bg-white border rounded-lg p-3 sm:p-4 text-center">
                            <p className="text-xs sm:text-sm text-gray-500">Total Units</p>
                            <p className="font-semibold text-sm sm:text-base">308</p>
                        </div>
                        <div className="bg-white border rounded-lg p-3 sm:p-4 text-center">
                            <p className="text-xs sm:text-sm text-gray-500">Total Towers</p>
                            <p className="font-semibold text-sm sm:text-base">2</p>
                        </div>
                        <div className="bg-white border rounded-lg p-3 sm:p-4 text-center col-span-2 sm:col-span-1">
                            <p className="text-xs sm:text-sm text-gray-500">BHK</p>
                            <p className="font-semibold text-sm sm:text-base">2,3,4BHK</p>
                        </div>
                    </div>

                    {/* Highlights */}
                    <h3 className="text-base sm:text-lg font-semibold mb-3">Highlights</h3>
                    <ul className="list-decimal list-inside text-gray-700 text-sm space-y-1">
                        <li>Best of Everything, Luxury Residential Apartments</li>
                        <li>Ensure your privacy, ample storage spaces</li>
                        <li>No Common Walls</li>
                        <li>Ready to Move in</li>
                        <li>Located in the heart of Whitefield</li>
                        <li>Spread over 2.29 acres with 45% of open spaces</li>
                    </ul>
                </section>

                {/* Photos */}
                <section>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                        Photos of Amrutha Platinum Towers
                    </h2>
                    <div className="flex items-center gap-4 overflow-x-auto pb-2">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="w-32 h-20 sm:w-40 sm:h-28 bg-red-800 rounded-lg flex-shrink-0"
                            ></div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PropertyDetail;
