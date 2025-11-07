import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Calendar,
    Clock,
    MapPin,
    Phone,
    Mail,
    User,
    CheckCircle,
    XCircle,
    AlertCircle,
    Eye,
    MessageSquare,
    Star,
    TrendingUp,
    DollarSign
} from "lucide-react";
import Navbar from "../../components/layout/NavBar";
import Footer from "../../components/layout/Footer";
import { serviceApi } from "../../utils/serviceApi";
import { toast } from "react-toastify";

const ServiceProviderDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all, pending, accepted, completed, cancelled
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        accepted: 0,
        completed: 0,
        cancelled: 0,
        totalEarnings: 0
    });

    useEffect(() => {
        fetchProviderBookings();
    }, []);

    const fetchProviderBookings = async () => {
        try {
            setLoading(true);
            const response = await serviceApi.getProviderBookings();
            if (response.success) {
                setBookings(response.data || []);
                calculateStats(response.data || []);
            } else {
                toast.error("Failed to load bookings");
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
            toast.error("Error loading bookings");
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (bookingsData) => {
        const stats = {
            total: bookingsData.length,
            pending: bookingsData.filter(b => b.status === 'pending').length,
            accepted: bookingsData.filter(b => b.status === 'accepted').length,
            completed: bookingsData.filter(b => b.status === 'completed').length,
            cancelled: bookingsData.filter(b => b.status === 'cancelled').length,
            totalEarnings: bookingsData
                .filter(b => b.status === 'completed')
                .reduce((sum, b) => sum + (b.service?.price || 0), 0)
        };
        setStats(stats);
    };

    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            const response = await serviceApi.updateBookingStatus(bookingId, newStatus);
            if (response.success) {
                toast.success(`Booking ${newStatus} successfully`);
                fetchProviderBookings(); // Refresh data
            } else {
                toast.error(response.message || "Failed to update booking");
            }
        } catch (error) {
            console.error("Error updating booking:", error);
            toast.error("Error updating booking");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'accepted':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <AlertCircle className="w-4 h-4" />;
            case 'accepted':
                return <Clock className="w-4 h-4" />;
            case 'completed':
                return <CheckCircle className="w-4 h-4" />;
            case 'cancelled':
                return <XCircle className="w-4 h-4" />;
            default:
                return <AlertCircle className="w-4 h-4" />;
        }
    };

    const filteredBookings = bookings.filter(booking => {
        if (filter === "all") return true;
        return booking.status === filter;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(price);
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f73c56] mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading your bookings...</p>
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
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Service Provider Dashboard
                        </h1>
                        <p className="text-gray-600">
                            Manage your service bookings and track your performance
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-6 rounded-lg shadow-md"
                        >
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <TrendingUp className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                                    <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white p-6 rounded-lg shadow-md"
                        >
                            <div className="flex items-center">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Pending</p>
                                    <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white p-6 rounded-lg shadow-md"
                        >
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Clock className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Accepted</p>
                                    <p className="text-2xl font-semibold text-gray-900">{stats.accepted}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white p-6 rounded-lg shadow-md"
                        >
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Completed</p>
                                    <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white p-6 rounded-lg shadow-md"
                        >
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <DollarSign className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                                    <p className="text-2xl font-semibold text-gray-900">
                                        {formatPrice(stats.totalEarnings)}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                            {['all', 'pending', 'accepted', 'completed', 'cancelled'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === status
                                            ? 'bg-[#f73c56] text-white'
                                            : 'bg-white text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                    {status !== 'all' && (
                                        <span className="ml-2 px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs">
                                            {stats[status]}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bookings List */}
                    <div className="space-y-4">
                        {filteredBookings.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    No {filter === 'all' ? '' : filter} bookings found
                                </h3>
                                <p className="text-gray-600">
                                    {filter === 'all'
                                        ? "You haven't received any service bookings yet."
                                        : `No ${filter} bookings at the moment.`
                                    }
                                </p>
                            </div>
                        ) : (
                            filteredBookings.map((booking) => (
                                <motion.div
                                    key={booking._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                        {/* Booking Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                        {booking.service?.title || 'Service Booking'}
                                                    </h3>
                                                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                        <span className="flex items-center">
                                                            <Calendar className="w-4 h-4 mr-1" />
                                                            {formatDate(booking.createdAt)}
                                                        </span>
                                                        <span className="flex items-center">
                                                            <DollarSign className="w-4 h-4 mr-1" />
                                                            {formatPrice(booking.service?.price || 0)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(booking.status)}`}>
                                                    {getStatusIcon(booking.status)}
                                                    <span className="ml-1">{booking.status}</span>
                                                </span>
                                            </div>

                                            {/* Customer Info */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <h4 className="font-medium text-gray-900 mb-2">Customer Details</h4>
                                                    <div className="space-y-1 text-sm text-gray-600">
                                                        <div className="flex items-center">
                                                            <User className="w-4 h-4 mr-2" />
                                                            {booking.customerName || 'N/A'}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Phone className="w-4 h-4 mr-2" />
                                                            {booking.customerPhone || 'N/A'}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Mail className="w-4 h-4 mr-2" />
                                                            {booking.customerEmail || 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>

                                                {booking.location && (
                                                    <div>
                                                        <h4 className="font-medium text-gray-900 mb-2">Service Location</h4>
                                                        <div className="flex items-start text-sm text-gray-600">
                                                            <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                                                            <span>{booking.location}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Service Details */}
                                            {booking.message && (
                                                <div className="mb-4">
                                                    <h4 className="font-medium text-gray-900 mb-2">Customer Message</h4>
                                                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                                        {booking.message}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col space-y-2 lg:ml-6 mt-4 lg:mt-0">
                                            {booking.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(booking._id, 'accepted')}
                                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                                    >
                                                        Decline
                                                    </button>
                                                </>
                                            )}

                                            {booking.status === 'accepted' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(booking._id, 'completed')}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                                >
                                                    Mark Complete
                                                </button>
                                            )}

                                            <button
                                                onClick={() => window.open(`tel:${booking.customerPhone}`, '_self')}
                                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium flex items-center justify-center"
                                            >
                                                <Phone className="w-4 h-4 mr-1" />
                                                Call
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ServiceProviderDashboard;