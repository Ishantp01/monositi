import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, MapPin, Phone, Mail, Calendar, Home, Ruler, Users, Bed, Wifi, Car, ChevronLeft, Grid, List } from "lucide-react";
import Navbar from "../../components/layout/NavBar";
import Footer from "../../components/layout/Footer";
import RoomVisualizer from "../../components/Monositi/RoomVisualizer";
import { monositiApi } from "../../utils/monositiApi";
import { toast } from "react-toastify";

const MonositiDetails = () => {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [similarListings, setSimilarListings] = useState([]);
    const [contactForm, setContactForm] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });
    const [roomViewMode, setRoomViewMode] = useState("grid");
    const [selectedRoom, setSelectedRoom] = useState(null);

    useEffect(() => {
        if (id) {
            fetchListingDetails();
            fetchSimilarListings();
        }
    }, [id]);

    const fetchListingDetails = async () => {
        try {
            setLoading(true);
            const response = await monositiApi.getPublicListingById(id);
            if (response.success) {
                setListing(response.data);
            } else {
                toast.error("Listing not found");
            }
        } catch (error) {
            console.error("Error fetching listing details:", error);
            toast.error("Error loading listing details");
        } finally {
            setLoading(false);
        }
    };

    const fetchSimilarListings = async () => {
        try {
            const response = await monositiApi.getPublicListings({ limit: 4 });
            if (response.success) {
                // Filter out current listing and limit to 4
                const filtered = response.data
                    .filter(l => l._id !== id)
                    .slice(0, 4);
                setSimilarListings(filtered);
            }
        } catch (error) {
            console.error("Error fetching similar listings:", error);
        }
    };

    const handleContactSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the contact form data to your backend
        toast.success("Inquiry sent successfully! We'll get back to you soon.");
        setContactForm({ name: "", email: "", phone: "", message: "" });
    };

    const formatPrice = (price) => {
        if (price >= 10000000) {
            return `₹${(price / 10000000).toFixed(2)} Cr`;
        } else if (price >= 100000) {
            return `₹${(price / 100000).toFixed(2)} Lac`;
        } else {
            return `₹${price.toLocaleString()}`;
        }
    };

    const getCategoryLabel = (category) => {
        switch (category) {
            case 'hostel_pg':
                return 'Hostel/PG';
            case 'commercial':
                return 'Commercial Space';
            case 'land_plot':
                return 'Land Plot';
            default:
                return category;
        }
    };

    const getAmenityIcon = (amenity) => {
        const amenityLower = amenity.toLowerCase();
        if (amenityLower.includes('wifi') || amenityLower.includes('internet')) {
            return <Wifi className="w-4 h-4" />;
        }
        if (amenityLower.includes('parking') || amenityLower.includes('car')) {
            return <Car className="w-4 h-4" />;
        }
        if (amenityLower.includes('bed') || amenityLower.includes('room')) {
            return <Bed className="w-4 h-4" />;
        }
        return <Home className="w-4 h-4" />;
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-[#f73c56] mx-auto mb-4" />
                        <p className="text-gray-600">Loading listing details...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (!listing) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Listing Not Found</h2>
                        <p className="text-gray-600 mb-4">The listing you're looking for doesn't exist or has been removed.</p>
                        <Link
                            to="/monositi"
                            className="inline-flex items-center px-6 py-3 bg-[#f73c56] text-white rounded-lg hover:bg-[#e9334e] transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 mr-2" />
                            Back to Listings
                        </Link>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 pt-20">
                <div className="container mx-auto px-4 py-8">
                    {/* Back Button */}
                    <div className="mb-6">
                        <Link
                            to="/monositi"
                            className="inline-flex items-center text-[#f73c56] hover:text-[#e9334e] transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 mr-1" />
                            Back to Listings
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Property Images */}
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="aspect-video bg-gray-200">
                                    {listing.images?.[0] ? (
                                        <img
                                            src={listing.images[0]}
                                            alt={listing.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Home className="w-16 h-16 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                {/* Image Gallery */}
                                {listing.images?.length > 1 && (
                                    <div className="p-4">
                                        <div className="grid grid-cols-4 gap-2">
                                            {listing.images.slice(1, 5).map((image, index) => (
                                                <div key={index} className="aspect-square bg-gray-200 rounded overflow-hidden">
                                                    <img
                                                        src={image}
                                                        alt={`Listing ${index + 2}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Property Details */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h1 className="text-3xl font-bold text-gray-900">
                                            {listing.title}
                                        </h1>
                                        {listing.monositi_verified && (
                                            <span className="bg-green-500 text-white text-sm px-2 py-1 rounded-full">
                                                ✓ Verified
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center text-gray-600 mb-4">
                                        <MapPin className="w-5 h-5 mr-2" />
                                        <span>
                                            {listing.location?.address && `${listing.location.address}, `}
                                            {listing.location?.city}, {listing.location?.state}
                                            {listing.location?.pincode && ` - ${listing.location.pincode}`}
                                        </span>
                                    </div>
                                    <div className="text-3xl font-bold text-[#f73c56]">
                                        {formatPrice(listing.price)}
                                    </div>
                                    <div className="text-gray-600 mt-1">
                                        {getCategoryLabel(listing.category)}
                                    </div>
                                </div>

                                {/* Property Features */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <Home className="w-6 h-6 mx-auto mb-2 text-[#f73c56]" />
                                        <div className="font-semibold">{getCategoryLabel(listing.category)}</div>
                                        <div className="text-sm text-gray-600">Type</div>
                                    </div>
                                    {listing.area && (
                                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                                            <Ruler className="w-6 h-6 mx-auto mb-2 text-[#f73c56]" />
                                            <div className="font-semibold">{listing.area}</div>
                                            <div className="text-sm text-gray-600">Area</div>
                                        </div>
                                    )}
                                    {listing.rooms?.length > 0 && (
                                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                                            <Users className="w-6 h-6 mx-auto mb-2 text-[#f73c56]" />
                                            <div className="font-semibold">{listing.rooms.length}</div>
                                            <div className="text-sm text-gray-600">Rooms</div>
                                        </div>
                                    )}
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <Calendar className="w-6 h-6 mx-auto mb-2 text-[#f73c56]" />
                                        <div className={`font-semibold ${listing.status === 'available' ? 'text-green-600' :
                                            listing.status === 'fullhouse' ? 'text-red-600' : 'text-yellow-600'
                                            }`}>
                                            {listing.status === 'fullhouse' ? 'Full House' : listing.status}
                                        </div>
                                        <div className="text-sm text-gray-600">Status</div>
                                    </div>
                                </div>

                                {/* Description */}
                                {listing.description && (
                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold mb-3">Description</h3>
                                        <p className="text-gray-700 leading-relaxed">{listing.description}</p>
                                    </div>
                                )}

                                {/* Rooms (for hostel_pg) */}
                                {listing.category === 'hostel_pg' && listing.rooms?.length > 0 && (
                                    <div className="mb-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-xl font-semibold">Room Availability</h3>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => setRoomViewMode("grid")}
                                                    className={`p-2 rounded-lg transition-colors ${roomViewMode === "grid"
                                                        ? "bg-[#f73c56] text-white"
                                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                        }`}
                                                    title="Grid View"
                                                >
                                                    <Grid className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setRoomViewMode("list")}
                                                    className={`p-2 rounded-lg transition-colors ${roomViewMode === "list"
                                                        ? "bg-[#f73c56] text-white"
                                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                        }`}
                                                    title="List View"
                                                >
                                                    <List className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <RoomVisualizer
                                            rooms={listing.rooms}
                                            viewMode={roomViewMode}
                                            selectedRoom={selectedRoom}
                                            onRoomSelect={setSelectedRoom}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            {/* Contact Form */}
                            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                                <form onSubmit={handleContactSubmit} className="space-y-4">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Your Name"
                                            value={contactForm.name}
                                            onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="email"
                                            placeholder="Your Email"
                                            value={contactForm.email}
                                            onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="tel"
                                            placeholder="Your Phone"
                                            value={contactForm.phone}
                                            onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <textarea
                                            placeholder="Your Message"
                                            rows="4"
                                            value={contactForm.message}
                                            onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                            required
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-[#f73c56] text-white py-2 px-4 rounded-lg hover:bg-[#e9334e] transition-colors"
                                    >
                                        Send Inquiry
                                    </button>
                                </form>
                            </div>

                            {/* Listing Stats */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-xl font-semibold mb-4">Listing Details</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Listing ID</span>
                                        <span className="font-semibold">{listing._id.slice(-8).toUpperCase()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Category</span>
                                        <span className="font-semibold">{getCategoryLabel(listing.category)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Status</span>
                                        <span className={`font-semibold ${listing.status === 'available' ? 'text-green-600' :
                                            listing.status === 'fullhouse' ? 'text-red-600' : 'text-yellow-600'
                                            }`}>
                                            {listing.status === 'fullhouse' ? 'Full House' : listing.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Verified</span>
                                        <span className={`font-semibold ${listing.monositi_verified ? 'text-green-600' : 'text-yellow-600'
                                            }`}>
                                            {listing.monositi_verified ? 'Yes' : 'Pending'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Listed On</span>
                                        <span className="font-semibold">
                                            {new Date(listing.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Similar Listings */}
                    {similarListings.length > 0 && (
                        <div className="mt-16">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8">Similar Listings</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {similarListings.map((similarListing) => (
                                    <Link
                                        key={similarListing._id}
                                        to={`/monositi-details/${similarListing._id}`}
                                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        <div className="aspect-video bg-gray-200">
                                            {similarListing.images?.[0] ? (
                                                <img
                                                    src={similarListing.images[0]}
                                                    alt={similarListing.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Home className="w-8 h-8 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                                {similarListing.title}
                                            </h3>
                                            <div className="text-[#f73c56] font-bold mb-2">
                                                {formatPrice(similarListing.price)}
                                            </div>
                                            <div className="text-sm text-gray-600 flex items-center">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                {similarListing.location?.city}, {similarListing.location?.state}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MonositiDetails;