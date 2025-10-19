import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/layout/NavBar";
import Footer from "../../components/layout/Footer";
import { propertyApi } from "../../utils/propertyApi";
import { toast } from "react-toastify";
import { Loader2, MapPin, Phone, Mail, Calendar, Home, Ruler, Users } from "lucide-react";

const BuyDetails = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [similarProperties, setSimilarProperties] = useState([]);

    useEffect(() => {
        if (id) {
            fetchPropertyDetails();
            fetchSimilarProperties();
        }
    }, [id]);

    const fetchPropertyDetails = async () => {
        try {
            setLoading(true);
            const response = await propertyApi.getPropertyById(id);

            if (response.success) {
                setProperty(response.property);
            } else {
                toast.error("Property not found");
            }
        } catch (error) {
            console.error("Error fetching property details:", error);
            toast.error("Error loading property details");
        } finally {
            setLoading(false);
        }
    };

    const fetchSimilarProperties = async () => {
        try {
            const response = await propertyApi.searchProperties({
                sub_category: 'Buy',
                limit: 4
            });

            if (response.success) {
                // Filter out current property and limit to 4
                const filtered = response.properties
                    .filter(p => p._id !== id)
                    .slice(0, 4);
                setSimilarProperties(filtered);
            }
        } catch (error) {
            console.error("Error fetching similar properties:", error);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-[#f73c56] mx-auto mb-4" />
                        <p className="text-gray-600">Loading property details...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (!property) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
                        <p className="text-gray-600">The property you're looking for doesn't exist or has been removed.</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const formatPrice = (price) => {
        if (price >= 10000000) {
            return `₹${(price / 10000000).toFixed(2)} Cr`;
        } else if (price >= 100000) {
            return `₹${(price / 100000).toFixed(2)} Lac`;
        } else {
            return `₹${price.toLocaleString()}`;
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 pt-20">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Property Images */}
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="aspect-video bg-gray-200">
                                    {property.property_features?.images?.[0] ? (
                                        <img
                                            src={property.property_features.images[0]}
                                            alt={property.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Home className="w-16 h-16 text-gray-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Image Gallery */}
                                {property.property_features?.images?.length > 1 && (
                                    <div className="p-4">
                                        <div className="grid grid-cols-4 gap-2">
                                            {property.property_features.images.slice(1, 5).map((image, index) => (
                                                <div key={index} className="aspect-square bg-gray-200 rounded overflow-hidden">
                                                    <img
                                                        src={image}
                                                        alt={`Property ${index + 2}`}
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
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                        {property.name || `${property.type} Property in ${property.city}`}
                                    </h1>
                                    <div className="flex items-center text-gray-600 mb-4">
                                        <MapPin className="w-5 h-5 mr-2" />
                                        <span>{property.address}, {property.city}, {property.state} - {property.pincode}</span>
                                    </div>
                                    <div className="text-3xl font-bold text-[#f73c56]">
                                        {formatPrice(property.price)}
                                    </div>
                                    {property.property_features?.size && (
                                        <div className="text-gray-600 mt-1">
                                            ₹{Math.round(property.price / property.property_features.size)} per sqft
                                        </div>
                                    )}
                                </div>

                                {/* Property Features */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <Ruler className="w-6 h-6 mx-auto mb-2 text-[#f73c56]" />
                                        <div className="font-semibold">{property.property_features?.size || 'N/A'}</div>
                                        <div className="text-sm text-gray-600">Sq Ft</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <Users className="w-6 h-6 mx-auto mb-2 text-[#f73c56]" />
                                        <div className="font-semibold">{property.property_features?.units || 'N/A'}</div>
                                        <div className="text-sm text-gray-600">Units</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <Home className="w-6 h-6 mx-auto mb-2 text-[#f73c56]" />
                                        <div className="font-semibold capitalize">{property.type}</div>
                                        <div className="text-sm text-gray-600">Type</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <Calendar className="w-6 h-6 mx-auto mb-2 text-[#f73c56]" />
                                        <div className="font-semibold">
                                            {property.verification_status === 'verified' ? 'Verified' : 'Pending'}
                                        </div>
                                        <div className="text-sm text-gray-600">Status</div>
                                    </div>
                                </div>

                                {/* Description */}
                                {property.description && (
                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold mb-3">Description</h3>
                                        <p className="text-gray-700 leading-relaxed">{property.description}</p>
                                    </div>
                                )}

                                {/* Amenities */}
                                {property.property_features?.amenities?.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold mb-3">Amenities</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                            {property.property_features.amenities.map((amenity, index) => (
                                                <div key={index} className="flex items-center text-gray-700">
                                                    <div className="w-2 h-2 bg-[#f73c56] rounded-full mr-2"></div>
                                                    {amenity}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Nearby Places */}
                                {property.property_features?.nearby_places?.length > 0 && (
                                    <div>
                                        <h3 className="text-xl font-semibold mb-3">Nearby Places</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                            {property.property_features.nearby_places.map((place, index) => (
                                                <div key={index} className="flex items-center text-gray-700">
                                                    <MapPin className="w-4 h-4 mr-2 text-[#f73c56]" />
                                                    {place}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            {/* Contact Form */}
                            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                                <h3 className="text-xl font-semibold mb-4">Contact Owner</h3>

                                {/* Owner Info */}
                                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="font-semibold text-gray-900">
                                        {property.owner_id?.name || "Property Owner"}
                                    </div>
                                    {property.contactNumber && (
                                        <div className="flex items-center text-gray-600 mt-2">
                                            <Phone className="w-4 h-4 mr-2" />
                                            <span>{property.contactNumber}</span>
                                        </div>
                                    )}
                                    {property.owner_id?.email && (
                                        <div className="flex items-center text-gray-600 mt-1">
                                            <Mail className="w-4 h-4 mr-2" />
                                            <span>{property.owner_id.email}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Contact Form */}
                                <form className="space-y-4">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Your Name"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="email"
                                            placeholder="Your Email"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="tel"
                                            placeholder="Your Phone"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <textarea
                                            placeholder="Your Message"
                                            rows="4"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-[#f73c56] text-white py-2 px-4 rounded-lg hover:bg-[#e9334e] transition-colors"
                                    >
                                        Send Message
                                    </button>
                                </form>
                            </div>

                            {/* Property Stats */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-xl font-semibold mb-4">Property Details</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Property ID</span>
                                        <span className="font-semibold">{property._id.slice(-8).toUpperCase()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Type</span>
                                        <span className="font-semibold capitalize">{property.type}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Category</span>
                                        <span className="font-semibold">{property.sub_category}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Status</span>
                                        <span className={`font-semibold ${property.verification_status === 'verified' ? 'text-green-600' : 'text-yellow-600'
                                            }`}>
                                            {property.verification_status === 'verified' ? 'Verified' : 'Pending'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Listed On</span>
                                        <span className="font-semibold">
                                            {new Date(property.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Similar Properties */}
                    {similarProperties.length > 0 && (
                        <div className="mt-16">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8">Similar Properties for Sale</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {similarProperties.map((similarProperty) => (
                                    <div key={similarProperty._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                        <div className="aspect-video bg-gray-200">
                                            {similarProperty.property_features?.images?.[0] ? (
                                                <img
                                                    src={similarProperty.property_features.images[0]}
                                                    alt={similarProperty.name}
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
                                                {similarProperty.name || `${similarProperty.type} Property`}
                                            </h3>
                                            <div className="text-[#f73c56] font-bold mb-2">
                                                {formatPrice(similarProperty.price)}
                                            </div>
                                            <div className="text-sm text-gray-600 flex items-center">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                {similarProperty.city}, {similarProperty.state}
                                            </div>
                                        </div>
                                    </div>
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

export default BuyDetails;