import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, Check, X, Users, Home, Ruler, MapPin, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/NavBar";
import Footer from "../../components/layout/Footer";
import { monositiApi } from "../../utils/monositiApi";
import { toast } from "react-toastify";

const AdminMonositi = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({});
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchListings();
    }, [filters]);

    const fetchListings = async () => {
        try {
            setLoading(true);
            const response = await monositiApi.getAllListings(filters);
            if (response.success) {
                setListings(response.data || []);
            } else {
                toast.error("Failed to load listings");
            }
        } catch (error) {
            console.error("Error fetching listings:", error);
            toast.error("Error loading listings");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyListing = async (id, verified) => {
        try {
            const response = await monositiApi.verifyListing(id, verified);
            if (response.success) {
                toast.success(`Listing ${verified ? 'verified' : 'unverified'} successfully`);
                fetchListings(); // Refresh the list
            } else {
                toast.error("Failed to update verification status");
            }
        } catch (error) {
            console.error("Error updating verification:", error);
            toast.error("Error updating verification");
        }
    };

    const handleDeleteListing = async (id) => {
        if (window.confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
            try {
                const response = await monositiApi.deleteListing(id);
                if (response.success) {
                    toast.success("Listing deleted successfully");
                    fetchListings(); // Refresh the list
                } else {
                    toast.error("Failed to delete listing");
                }
            } catch (error) {
                console.error("Error deleting listing:", error);
                toast.error("Error deleting listing");
            }
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const clearFilters = () => {
        setFilters({});
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'hostel_pg':
                return <Users className="w-4 h-4" />;
            case 'commercial':
                return <Home className="w-4 h-4" />;
            case 'land_plot':
                return <Ruler className="w-4 h-4" />;
            default:
                return <Home className="w-4 h-4" />;
        }
    };

    const getCategoryLabel = (category) => {
        switch (category) {
            case 'hostel_pg':
                return 'Hostel/PG';
            case 'commercial':
                return 'Commercial';
            case 'land_plot':
                return 'Land Plot';
            default:
                return category;
        }
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

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 pt-20">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Monositi Management
                            </h1>
                            <p className="text-gray-600">
                                Manage hostels, commercial spaces, and land plots
                            </p>
                        </div>
                        <Link
                            to="/admin/monositi/create"
                            className="bg-[#f73c56] text-white px-6 py-3 rounded-lg hover:bg-[#e9334e] transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Create Listing
                        </Link>
                    </div>

                    {/* Filters */}
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-4 items-center">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-[#f73c56] transition-colors"
                            >
                                <Filter className="w-4 h-4" />
                                Filters
                            </button>

                            <select
                                value={filters.category || ''}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                            >
                                <option value="">All Categories</option>
                                <option value="commercial">Commercial</option>
                                <option value="hostel_pg">Hostel/PG</option>
                                <option value="land_plot">Land Plot</option>
                            </select>

                            <select
                                value={filters.status || ''}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                            >
                                <option value="">All Status</option>
                                <option value="available">Available</option>
                                <option value="booked">Booked</option>
                                <option value="fullhouse">Full House</option>
                            </select>

                            <select
                                value={filters.verified || ''}
                                onChange={(e) => handleFilterChange('verified', e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                            >
                                <option value="">All Verification</option>
                                <option value="true">Verified</option>
                                <option value="false">Unverified</option>
                            </select>

                            {Object.keys(filters).length > 0 && (
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>

                        {/* Extended Filters */}
                        {showFilters && (
                            <div className="mt-4 p-4 bg-white rounded-lg border">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter city name"
                                            value={filters.city || ''}
                                            onChange={(e) => handleFilterChange('city', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Listings Table */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Listing
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Location
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Verified
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center">
                                                <div className="flex justify-center items-center">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f73c56]"></div>
                                                    <span className="ml-2 text-gray-600">Loading listings...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : listings.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                                No listings found
                                            </td>
                                        </tr>
                                    ) : (
                                        listings.map((listing) => (
                                            <tr key={listing._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-12 w-12">
                                                            <img
                                                                className="h-12 w-12 rounded-lg object-cover"
                                                                src={listing.images?.[0] || 'https://via.placeholder.com/48x48?text=No+Image'}
                                                                alt={listing.title}
                                                            />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900 line-clamp-1">
                                                                {listing.title}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                ID: {listing._id.slice(-8).toUpperCase()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        {getCategoryIcon(listing.category)}
                                                        <span className="text-sm text-gray-900">
                                                            {getCategoryLabel(listing.category)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 flex items-center gap-1">
                                                        <MapPin className="w-4 h-4" />
                                                        {listing.location?.city}, {listing.location?.state}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {formatPrice(listing.price)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${listing.status === 'available'
                                                            ? 'bg-green-100 text-green-800'
                                                            : listing.status === 'fullhouse'
                                                                ? 'bg-red-100 text-red-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {listing.status === 'fullhouse' ? 'Full House' : listing.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${listing.monositi_verified
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {listing.monositi_verified ? 'Verified' : 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <Link
                                                            to={`/monositi-details/${listing._id}`}
                                                            className="text-blue-600 hover:text-blue-900"
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Link>
                                                        <Link
                                                            to={`/admin/monositi/edit/${listing._id}`}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                            title="Edit Listing"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleVerifyListing(listing._id, !listing.monositi_verified)}
                                                            className={`${listing.monositi_verified
                                                                    ? 'text-yellow-600 hover:text-yellow-900'
                                                                    : 'text-green-600 hover:text-green-900'
                                                                }`}
                                                            title={listing.monositi_verified ? 'Unverify' : 'Verify'}
                                                        >
                                                            {listing.monositi_verified ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteListing(listing._id)}
                                                            className="text-red-600 hover:text-red-900"
                                                            title="Delete Listing"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Home className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Listings</p>
                                    <p className="text-2xl font-semibold text-gray-900">{listings.length}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Check className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Verified</p>
                                    <p className="text-2xl font-semibold text-gray-900">
                                        {listings.filter(l => l.monositi_verified).length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <Users className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Hostel/PG</p>
                                    <p className="text-2xl font-semibold text-gray-900">
                                        {listings.filter(l => l.category === 'hostel_pg').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Ruler className="w-6 h-6 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Commercial</p>
                                    <p className="text-2xl font-semibold text-gray-900">
                                        {listings.filter(l => l.category === 'commercial').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AdminMonositi;