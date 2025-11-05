import React, { useState, useEffect } from "react";
import { MapPin, Loader2, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/NavBar";
import Footer from "../../components/layout/Footer";
import DynamicFilterBar from "../../components/Tabs/DynamicFilterBar";
import MonositiCard from "../../components/Cards/MonositiCard";
import { monositiApi } from "../../utils/monositiApi";
import { toast } from "react-toastify";

const MonositiList = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({});
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        fetchListings();
    }, [filters]);

    const fetchListings = async () => {
        try {
            setLoading(true);
            const response = await monositiApi.getPublicListings(filters);
            if (response.success) {
                setListings(response.data || []);
            } else {
                toast.error("Failed to load Monositi listings");
            }
        } catch (error) {
            console.error("Error fetching Monositi listings:", error);
            toast.error("Error loading listings");
        } finally {
            setLoading(false);
        }
    };

    const handleSearchResults = (results, searchParams) => {
        if (results && results.length > 0) {
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };





    const displayListings = searchResults.length > 0 ? searchResults : listings;

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 pt-20">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Monositi Listings
                        </h1>
                        <p className="text-gray-600">
                            Discover verified hostels, commercial spaces, and land plots
                        </p>
                    </div>

                    {/* Dynamic Filter Bar */}
                    <div className="mb-8">
                        <DynamicFilterBar
                            activeTab="Monositi"
                            themeColor="#f73c56"
                            onSearchResults={handleSearchResults}
                        />
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="text-center">
                                <Loader2 className="w-12 h-12 animate-spin text-[#f73c56] mx-auto mb-4" />
                                <p className="text-gray-600">Loading Monositi listings...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Results Summary */}
                            {searchResults.length > 0 && (
                                <div className="mb-6">
                                    <p className="text-gray-600">
                                        Showing {searchResults.length} search results
                                    </p>
                                </div>
                            )}

                            {/* Listings Grid */}
                            {displayListings.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {displayListings.map((listing) => (
                                        <div key={listing._id} className="flex">
                                            <MonositiCard listing={listing} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20">
                                    <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Listings Found</h3>
                                    <p className="text-gray-600">
                                        {searchResults.length === 0 && listings.length === 0
                                            ? "No listings available at the moment."
                                            : "Try adjusting your search filters to see more results."
                                        }
                                    </p>
                                </div>
                            )}

                            {/* Load More Button */}
                            {displayListings.length > 0 && searchResults.length === 0 && (
                                <div className="text-center mt-12">
                                    <button
                                        onClick={fetchListings}
                                        className="bg-[#f73c56] text-white px-8 py-3 rounded-lg hover:bg-[#e9334e] transition-colors flex items-center gap-2 mx-auto"
                                    >
                                        Refresh Listings
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MonositiList;