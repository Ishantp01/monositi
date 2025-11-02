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
import { monositiApi } from "../../utils/monositiApi";

const Monositi = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

        if (!listings.length) {
            return (
                <div className="text-center py-8">
                    <div className="max-w-md mx-auto">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Monositi Listings Yet</h3>
                        <p className="text-gray-600 mb-4">
                            Admin-created Monositi properties will appear here. These include hostels, PG accommodations, commercial spaces, and land plots.
                        </p>
                        <p className="text-sm text-gray-500">
                            Contact an admin to create Monositi listings.
                        </p>
                    </div>
                </div>
            );
        }

        // If 4 or fewer listings, show them in a grid
        if (listings.length <= 4) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                    {listings.map((listing) => (
                        <MonositiCard key={listing._id} listing={listing} />
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
                    {listings.map((listing) => (
                        <SwiperSlide key={listing._id}>
                            <MonositiCard listing={listing} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        );
    };

    return (
        <div className="py-8">
            <GradientHeading text="Monositi Listings" />

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