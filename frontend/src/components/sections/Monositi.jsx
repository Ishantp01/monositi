import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import GradientHeading from "../common/GradientHeading";
import MonositiCard from "../Cards/MonositiCard";
import HostelsPGCard from "../Cards/HostelsPGCard";
import { monositiApi } from "../../utils/monositiApi";

const Monositi = () => {
    const [activeCategory, setActiveCategory] = useState("all");
    const [listings, setListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const categories = [
        { id: "all", label: "All" },
        { id: "commercial", label: "Commercial" },
        { id: "hostel_pg", label: "Hostels & PG" },
        { id: "land_plot", label: "Land & Plot" }
    ];

    useEffect(() => {
        fetchMonositiListings();
    }, []);

    const fetchMonositiListings = async () => {
        setLoading(true);
        setError("");

        try {
            console.log("Fetching Monositi listings from API...");
            const response = await monositiApi.getPublicListings({ limit: 12 });
            console.log("Monositi API response:", response);

            if (response.success) {
                console.log("Monositi listings received:", response.data);
                setListings(response.data || []);
            } else {
                console.error("Monositi API error:", response.message);
                setError("Failed to fetch Monositi listings");
            }
        } catch (err) {
            console.error("Error fetching Monositi listings:", err);
            setError("Something went wrong while fetching listings");
        } finally {
            setLoading(false);
        }
    };

    // Filter listings by category
    useEffect(() => {
        if (activeCategory === "all") {
            setFilteredListings(listings);
        } else {
            setFilteredListings(listings.filter(listing => listing.category === activeCategory));
        }
    }, [activeCategory, listings]);



    const renderContent = () => {
        if (loading) {
            return (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f73c56] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading Monositi listings...</p>
                </div>
            );
        }

        if (error) {
            return <div className="text-center text-red-600 py-8">{error}</div>;
        }

        if (!filteredListings.length) {
            return (
                <div className="text-center py-8">
                    <div className="max-w-md mx-auto">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No {categories.find(c => c.id === activeCategory)?.label || ''} Listings Yet</h3>
                        <p className="text-gray-600 mb-4">
                            {activeCategory === "all" 
                                ? "Admin-created Monositi properties will appear here. These include hostels, PG accommodations, commercial spaces, and land plots."
                                : `No ${categories.find(c => c.id === activeCategory)?.label} listings available at the moment.`
                            }
                        </p>
                    </div>
                </div>
            );
        }

        // Use HostelsPGCard for hostel_pg category, MonositiCard for others
        const CardComponent = activeCategory === "hostel_pg" ? HostelsPGCard : MonositiCard;

        // If 4 or fewer listings, show them in a grid
        if (filteredListings.length <= 4) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                    {filteredListings.map((listing) => (
                        <div key={listing._id} className="flex">
                            <CardComponent listing={listing} />
                        </div>
                    ))}
                </div>
            );
        }

        // If more than 4 listings, show carousel
        return (
            <div className="relative mx-auto max-w-[95%]">
                {/* Navigation Arrows */}
                <button className="monositi-prev-btn absolute top-1/2 -left-4 sm:-left-6 z-10 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-[#f73c56] rounded-full flex items-center justify-center shadow-lg hover:bg-[#e9334e] transition-colors">
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </button>
                <button className="monositi-next-btn absolute top-1/2 -right-4 sm:-right-6 z-10 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-[#f73c56] rounded-full flex items-center justify-center shadow-lg hover:bg-[#e9334e] transition-colors">
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </button>

                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    navigation={{
                        nextEl: ".monositi-next-btn",
                        prevEl: ".monositi-prev-btn"
                    }}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true
                    }}
                    autoplay={{
                        delay: 5500,
                        disableOnInteraction: false
                    }}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: 4 },
                    }}
                    className="monositi-listings-swiper"
                >
                    {filteredListings.map((listing) => (
                        <SwiperSlide key={listing._id}>
                            <CardComponent listing={listing} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        );
    };

    return (
        <div className="py-8">
            <GradientHeading text="Monositi Listings" />
            
            {/* Category Tabs */}
            <div className="flex justify-center gap-4 mb-8 px-4 flex-wrap">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                            activeCategory === category.id
                                ? "bg-[#f73c56] text-white shadow-md"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        {category.label}
                    </button>
                ))}
            </div>

            <div className="my-8 md:my-16">
                {renderContent()}
            </div>

            {/* Show All Projects Button */}
            <div className="text-center mt-8">
                <Link
                    to="/monositi"
                    className="inline-flex items-center px-8 py-3 bg-[#f73c56] text-white font-semibold rounded-lg hover:bg-[#e9334e] transition-colors shadow-md"
                >
                    Show All Monositi Projects
                    <ChevronRight className="w-5 h-5 ml-2" />
                </Link>
            </div>
        </div>
    );
};

export default Monositi;