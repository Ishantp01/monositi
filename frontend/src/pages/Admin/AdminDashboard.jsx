import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/layout/NavBar";
import { toast } from "react-toastify";
import apiRequest from "../../utils/api";
import {
    Users,
    Home,
    BarChart3,
    FileText,
    Settings,
    CheckCircle,
    XCircle,
    Eye,
    EyeOff,
    Ban,
    UserCheck,
    Trash2,
    AlertTriangle,
    TrendingUp,
    Calendar,
    Activity,
    Shield,
    Clock,
    Mail,
    Phone,
    MapPin,
    DollarSign,
    Building,
    Star,
    Filter,
    Search,
    RefreshCw,
    MoreVertical,
    Edit3
} from "lucide-react";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [loading, setLoading] = useState(false);
    const [dashboardData, setDashboardData] = useState({});
    const [properties, setProperties] = useState([]);
    const [users, setUsers] = useState([]);
    const [services, setServices] = useState([]);
    const [analytics, setAnalytics] = useState({});
    const [reports, setReports] = useState([]);

    // Filters and search
    const [propertyFilter, setPropertyFilter] = useState("all");
    const [userFilter, setUserFilter] = useState("all");
    const [serviceFilter, setServiceFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // Check if user is admin
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user.role !== "admin") {
            toast.error("Access denied. Admin privileges required.");
            window.location.href = "/";
            return;
        }

        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const dashboardResponse = await apiRequest("/admin/dashboard", "GET");
            if (dashboardResponse.success) {
                setDashboardData(dashboardResponse.dashboard || {});
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const response = await apiRequest("/admin/properties", "GET");
            if (response.success) {
                setProperties(response.properties || []);
            }
        } catch (error) {
            console.error("Error fetching properties:", error);
            toast.error("Failed to fetch properties");
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await apiRequest("/admin/users", "GET");
            if (response.success) {
                setUsers(response.users || []);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const fetchServices = async () => {
        setLoading(true);
        try {
            const response = await apiRequest("/admin/services", "GET");
            if (response.success) {
                setServices(response.services || []);
            }
        } catch (error) {
            console.error("Error fetching services:", error);
            toast.error("Failed to fetch services");
        } finally {
            setLoading(false);
        }
    };

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            // Mock analytics data - replace with actual API call
            setAnalytics({
                propertyGrowth: [
                    { month: 'Jan', count: 45 },
                    { month: 'Feb', count: 52 },
                    { month: 'Mar', count: 61 },
                    { month: 'Apr', count: 58 },
                    { month: 'May', count: 67 },
                    { month: 'Jun', count: 73 }
                ],
                userGrowth: [
                    { month: 'Jan', count: 120 },
                    { month: 'Feb', count: 145 },
                    { month: 'Mar', count: 167 },
                    { month: 'Apr', count: 189 },
                    { month: 'May', count: 203 },
                    { month: 'Jun', count: 225 }
                ],
                siteStats: {
                    totalViews: 15420,
                    uniqueVisitors: 8930,
                    bounceRate: 32.5,
                    avgSessionTime: '4:32'
                }
            });
        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchReports = async () => {
        setLoading(true);
        try {
            // Mock reports data - replace with actual API call
            setReports([
                {
                    id: 1,
                    type: 'flagged',
                    title: 'Inappropriate Property Images',
                    description: 'Property ID: 12345 reported for inappropriate images',
                    status: 'pending',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    type: 'inactive',
                    title: 'Inactive Listing - No Response',
                    description: 'Property ID: 67890 has been inactive for 30+ days',
                    status: 'pending',
                    createdAt: new Date().toISOString()
                }
            ]);
        } catch (error) {
            console.error("Error fetching reports:", error);
        } finally {
            setLoading(false);
        }
    };

    // Property Management Functions
    const handleVerifyProperty = async (propertyId, status) => {
        try {
            const response = await apiRequest(`/admin/properties/${propertyId}/verify`, "PATCH", { status });
            if (response.success) {
                toast.success(`Property ${status} successfully`);
                fetchProperties();
            } else {
                toast.error(response.message || "Failed to update property");
            }
        } catch (error) {
            console.error("Error verifying property:", error);
            toast.error("Error updating property");
        }
    };

    const handleDeleteProperty = async (propertyId) => {
        if (!window.confirm("Are you sure you want to delete this property?")) return;

        try {
            const response = await apiRequest(`/admin/properties/${propertyId}`, "DELETE");
            if (response.success) {
                toast.success("Property deleted successfully");
                fetchProperties();
            } else {
                toast.error(response.message || "Failed to delete property");
            }
        } catch (error) {
            console.error("Error deleting property:", error);
            toast.error("Error deleting property");
        }
    };

    const handleToggleVisibility = async (propertyId, currentVisibility) => {
        const newVisibility = currentVisibility === "public" ? "private" : "public";

        try {
            const response = await apiRequest(`/admin/properties/${propertyId}/visibility`, "PATCH", {
                listing_visibility: newVisibility
            });
            if (response.success) {
                toast.success(`Property visibility changed to ${newVisibility}`);
                fetchProperties();
            } else {
                toast.error(response.message || "Failed to update visibility");
            }
        } catch (error) {
            console.error("Error updating visibility:", error);
            toast.error("Error updating visibility");
        }
    };

    // User Management Functions
    const handleBanUser = async (userId, currentStatus) => {
        const action = currentStatus ? "ban" : "unban";
        if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

        try {
            const response = await apiRequest(`/admin/users/${userId}/ban`, "PATCH", {
                is_active: !currentStatus
            });
            if (response.success) {
                toast.success(`User ${action}ned successfully`);
                fetchUsers();
            } else {
                toast.error(response.message || `Failed to ${action} user`);
            }
        } catch (error) {
            console.error(`Error ${action}ning user:`, error);
            toast.error(`Error ${action}ning user`);
        }
    };

    const handleVerifyUser = async (userId, status) => {
        try {
            const response = await apiRequest(`/admin/users/${userId}/verify`, "PATCH", {
                verification_status: status
            });
            if (response.success) {
                toast.success(`User ${status} successfully`);
                fetchUsers();
            } else {
                toast.error(response.message || "Failed to verify user");
            }
        } catch (error) {
            console.error("Error verifying user:", error);
            toast.error("Error verifying user");
        }
    };

    // Service Management Functions
    const handleVerifyService = async (serviceId, action) => {
        try {
            const response = await apiRequest(`/admin/services/${serviceId}/verify`, "PATCH", { action });
            if (response.success) {
                toast.success(`Service ${action}ed successfully`);
                fetchServices();
            } else {
                toast.error(response.message || "Failed to update service");
            }
        } catch (error) {
            console.error("Error verifying service:", error);
            toast.error("Error updating service");
        }
    };

    const handleRejectService = async (serviceId) => {
        if (!window.confirm("Are you sure you want to reject this service?")) return;
        await handleVerifyService(serviceId, "reject");
    };

    const handleApproveService = async (serviceId) => {
        await handleVerifyService(serviceId, "verify");
    };

    const handleSwitchToServiceProvider = async (userId) => {
        if (!window.confirm("Are you sure you want to switch this user to service provider?")) return;

        try {
            const response = await apiRequest(`/admin/users/${userId}/role`, "PATCH", {
                role: "service_provider"
            });
            if (response.success) {
                toast.success("User switched to service provider successfully");
                fetchUsers();
            } else {
                toast.error(response.message || "Failed to switch user role");
            }
        } catch (error) {
            console.error("Error switching user role:", error);
            toast.error("Error switching user role");
        }
    };

    // Load data when tab changes
    useEffect(() => {
        if (activeTab === "properties") {
            fetchProperties();
        } else if (activeTab === "users") {
            fetchUsers();
        } else if (activeTab === "services") {
            fetchServices();
        } else if (activeTab === "analytics") {
            fetchAnalytics();
        } else if (activeTab === "reports") {
            fetchReports();
        }
    }, [activeTab]);

    // Helper functions
    const getVerificationStatusIcon = (status) => {
        switch (status) {
            case 'verified':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'pending':
                return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'rejected':
                return <XCircle className="w-4 h-4 text-red-500" />;
            default:
                return <AlertTriangle className="w-4 h-4 text-gray-400" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'verified':
            case 'active':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'pending':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'rejected':
            case 'inactive':
                return 'text-red-600 bg-red-50 border-red-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    // Filter functions
    const filteredProperties = properties.filter(property => {
        const matchesFilter = propertyFilter === "all" ||
            (propertyFilter === "pending" && property.verification_status === "pending") ||
            (propertyFilter === "verified" && property.verification_status === "verified") ||
            (propertyFilter === "rejected" && property.verification_status === "rejected");

        const matchesSearch = searchTerm === "" ||
            property.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.owner_id?.name?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    const filteredUsers = users.filter(user => {
        const matchesFilter = userFilter === "all" ||
            (userFilter === "verified" && user.verification_status === "verified") ||
            (userFilter === "pending" && user.verification_status === "pending") ||
            (userFilter === "banned" && user.is_active === false);

        const matchesSearch = searchTerm === "" ||
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone?.includes(searchTerm);

        return matchesFilter && matchesSearch;
    });

    const filteredServices = services.filter(service => {
        const matchesFilter = serviceFilter === "all" ||
            (serviceFilter === "verified" && service.monositi_verified === true) ||
            (serviceFilter === "pending" && service.monositi_verified === false) ||
            (serviceFilter === "active" && service.active_status === true) ||
            (serviceFilter === "inactive" && service.active_status === false);

        const matchesSearch = searchTerm === "" ||
            service.service_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.provider?.name?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    // Loading component
    if (loading && activeTab === "dashboard") {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center space-y-4"
                >
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f73c56]"></div>
                    <p className="text-lg font-medium text-gray-700">Loading admin dashboard...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 pt-20">
                <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">

                    {/* Admin Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                    >
                        <div className="bg-gradient-to-r from-[#f73c56] to-[#e9334e] p-6 text-white">
                            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                                <div className="w-24 h-24 md:w-32 md:h-32 bg-white/20 rounded-full flex items-center justify-center">
                                    <Shield className="w-12 h-12 md:w-16 md:h-16 text-white" />
                                </div>

                                <div className="flex-1 text-center md:text-left">
                                    <h1 className="text-2xl md:text-3xl font-bold mb-2">
                                        Admin Dashboard
                                    </h1>
                                    <p className="text-white/90 text-sm md:text-base">
                                        Manage properties, users, analytics, and reports across the platform
                                    </p>
                                    <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2">
                                        <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                                            Administrator
                                        </span>
                                        <span className="px-3 py-1 bg-green-500/20 rounded-full text-xs font-medium">
                                            Full Access
                                        </span>
                                    </div>
                                </div>

                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        <span>Refresh</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Navigation Tabs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl shadow-lg border border-gray-200"
                    >
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8 px-6 overflow-x-auto">
                                <button
                                    onClick={() => setActiveTab("dashboard")}
                                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === "dashboard"
                                        ? "border-[#f73c56] text-[#f73c56]"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <BarChart3 className="w-4 h-4" />
                                        <span>Dashboard</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab("properties")}
                                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === "properties"
                                        ? "border-[#f73c56] text-[#f73c56]"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <Home className="w-4 h-4" />
                                        <span>Properties</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab("users")}
                                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === "users"
                                        ? "border-[#f73c56] text-[#f73c56]"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <Users className="w-4 h-4" />
                                        <span>Users</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab("analytics")}
                                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === "analytics"
                                        ? "border-[#f73c56] text-[#f73c56]"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <TrendingUp className="w-4 h-4" />
                                        <span>Analytics</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab("reports")}
                                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === "reports"
                                        ? "border-[#f73c56] text-[#f73c56]"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <FileText className="w-4 h-4" />
                                        <span>Reports</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab("services")}
                                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === "services"
                                        ? "border-[#f73c56] text-[#f73c56]"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <Settings className="w-4 h-4" />
                                        <span>Services</span>
                                    </div>
                                </button>
                            </nav>
                        </div>

                        <div className="p-6">
                            {/* Dashboard Tab */}
                            {activeTab === "dashboard" && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    {/* Stats Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-blue-100 text-sm">Total Users</p>
                                                    <p className="text-2xl font-bold">{dashboardData.stats?.totalUsers || 0}</p>
                                                </div>
                                                <Users className="w-8 h-8 text-blue-200" />
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-green-100 text-sm">Total Properties</p>
                                                    <p className="text-2xl font-bold">{dashboardData.stats?.totalServices || 0}</p>
                                                </div>
                                                <Home className="w-8 h-8 text-green-200" />
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-yellow-100 text-sm">Pending Requests</p>
                                                    <p className="text-2xl font-bold">{dashboardData.stats?.pendingRequests || 0}</p>
                                                </div>
                                                <Clock className="w-8 h-8 text-yellow-200" />
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-purple-100 text-sm">Total Bookings</p>
                                                    <p className="text-2xl font-bold">{dashboardData.stats?.totalBookings || 0}</p>
                                                </div>
                                                <Calendar className="w-8 h-8 text-purple-200" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recent Activities */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Recent Requests */}
                                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Provider Requests</h3>
                                            <div className="space-y-3">
                                                {dashboardData.recentActivities?.requests?.slice(0, 5).map((request) => (
                                                    <div key={request._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                            <UserCheck className="w-5 h-5 text-blue-600" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {request.user?.name || 'Unknown User'}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {request.service_category} • {new Date(request.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                                            {request.status}
                                                        </span>
                                                    </div>
                                                )) || (
                                                        <p className="text-gray-500 text-sm">No recent requests</p>
                                                    )}
                                            </div>
                                        </div>

                                        {/* Recent Bookings */}
                                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
                                            <div className="space-y-3">
                                                {dashboardData.recentActivities?.bookings?.slice(0, 5).map((booking) => (
                                                    <div key={booking._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                            <Calendar className="w-5 h-5 text-green-600" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {booking.service?.service_name || 'Service'}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {booking.customer?.name} • ₹{booking.total_amount}
                                                            </p>
                                                        </div>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                            {booking.status}
                                                        </span>
                                                    </div>
                                                )) || (
                                                        <p className="text-gray-500 text-sm">No recent bookings</p>
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Properties Tab */}
                            {activeTab === "properties" && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    {/* Filters and Search */}
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                                        <div className="flex items-center space-x-4">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                <input
                                                    type="text"
                                                    placeholder="Search properties..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                                />
                                            </div>
                                            <select
                                                value={propertyFilter}
                                                onChange={(e) => setPropertyFilter(e.target.value)}
                                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                            >
                                                <option value="all">All Properties</option>
                                                <option value="pending">Pending Verification</option>
                                                <option value="verified">Verified</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Showing {filteredProperties.length} of {properties.length} properties
                                        </div>
                                    </div>

                                    {/* Properties List */}
                                    <div className="space-y-4">
                                        {loading ? (
                                            <div className="flex justify-center py-8">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f73c56]"></div>
                                            </div>
                                        ) : filteredProperties.length === 0 ? (
                                            <div className="text-center py-8">
                                                <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-500">No properties found</p>
                                            </div>
                                        ) : (
                                            filteredProperties.map((property) => (
                                                <div key={property._id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                                                    <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
                                                        {/* Property Image */}
                                                        <div className="w-full lg:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                                                            {property.property_features?.images?.[0] ? (
                                                                <img
                                                                    src={property.property_features.images[0]}
                                                                    alt={property.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <Building className="w-8 h-8 text-gray-400" />
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Property Details */}
                                                        <div className="flex-1 space-y-2">
                                                            <div className="flex items-start justify-between">
                                                                <div>
                                                                    <h3 className="text-lg font-semibold text-gray-900">{property.name}</h3>
                                                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                                        <div className="flex items-center space-x-1">
                                                                            <MapPin className="w-4 h-4" />
                                                                            <span>{property.city}, {property.state}</span>
                                                                        </div>
                                                                        <div className="flex items-center space-x-1">
                                                                            <DollarSign className="w-4 h-4" />
                                                                            <span>₹{property.price?.toLocaleString()}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(property.verification_status)}`}>
                                                                        {property.verification_status}
                                                                    </span>
                                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${property.listing_visibility === 'public' ? 'text-green-600 bg-green-50 border-green-200' : 'text-gray-600 bg-gray-50 border-gray-200'}`}>
                                                                        {property.listing_visibility}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                                <span>Owner: {property.owner_id?.name || 'Unknown'}</span>
                                                                <span>•</span>
                                                                <span>Type: {property.type}</span>
                                                                <span>•</span>
                                                                <span>Listed: {new Date(property.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex flex-wrap gap-2">
                                                            {property.verification_status === 'pending' && (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleVerifyProperty(property._id, 'verified')}
                                                                        className="flex items-center space-x-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                                                                    >
                                                                        <CheckCircle className="w-4 h-4" />
                                                                        <span>Verify</span>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleVerifyProperty(property._id, 'rejected')}
                                                                        className="flex items-center space-x-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                                                                    >
                                                                        <XCircle className="w-4 h-4" />
                                                                        <span>Reject</span>
                                                                    </button>
                                                                </>
                                                            )}
                                                            <button
                                                                onClick={() => handleToggleVisibility(property._id, property.listing_visibility)}
                                                                className="flex items-center space-x-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                                                            >
                                                                {property.listing_visibility === 'public' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                                <span>{property.listing_visibility === 'public' ? 'Hide' : 'Show'}</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteProperty(property._id)}
                                                                className="flex items-center space-x-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                                <span>Delete</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* Users Tab */}
                            {activeTab === "users" && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    {/* Filters and Search */}
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                                        <div className="flex items-center space-x-4">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                <input
                                                    type="text"
                                                    placeholder="Search users..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                                />
                                            </div>
                                            <select
                                                value={userFilter}
                                                onChange={(e) => setUserFilter(e.target.value)}
                                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                            >
                                                <option value="all">All Users</option>
                                                <option value="verified">Verified</option>
                                                <option value="pending">Pending Verification</option>
                                                <option value="banned">Banned</option>
                                            </select>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Showing {filteredUsers.length} of {users.length} users
                                        </div>
                                    </div>

                                    {/* Users List */}
                                    <div className="space-y-4">
                                        {loading ? (
                                            <div className="flex justify-center py-8">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f73c56]"></div>
                                            </div>
                                        ) : filteredUsers.length === 0 ? (
                                            <div className="text-center py-8">
                                                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-500">No users found</p>
                                            </div>
                                        ) : (
                                            filteredUsers.map((user) => (
                                                <div key={user._id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                                                    <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
                                                        {/* User Avatar */}
                                                        <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden">
                                                            {user.profile_img ? (
                                                                <img
                                                                    src={user.profile_img}
                                                                    alt={user.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <Users className="w-8 h-8 text-gray-400" />
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* User Details */}
                                                        <div className="flex-1 space-y-2">
                                                            <div className="flex items-start justify-between">
                                                                <div>
                                                                    <h3 className="text-lg font-semibold text-gray-900">{user.name || 'Unnamed User'}</h3>
                                                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                                        {user.email && (
                                                                            <div className="flex items-center space-x-1">
                                                                                <Mail className="w-4 h-4" />
                                                                                <span>{user.email}</span>
                                                                            </div>
                                                                        )}
                                                                        <div className="flex items-center space-x-1">
                                                                            <Phone className="w-4 h-4" />
                                                                            <span>{user.phone}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.verification_status)}`}>
                                                                        {user.verification_status}
                                                                    </span>
                                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${user.is_active !== false ? 'text-green-600 bg-green-50 border-green-200' : 'text-red-600 bg-red-50 border-red-200'}`}>
                                                                        {user.is_active !== false ? 'Active' : 'Banned'}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                                <span>Role: {user.role}</span>
                                                                <span>•</span>
                                                                <span>Joined: {new Date(user.createdAt || user.registered_on).toLocaleDateString()}</span>
                                                                {user.rating > 0 && (
                                                                    <>
                                                                        <span>•</span>
                                                                        <div className="flex items-center space-x-1">
                                                                            <Star className="w-4 h-4 text-yellow-500" />
                                                                            <span>{user.rating}/5</span>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex flex-wrap gap-2">
                                                            {user.verification_status === 'pending' && (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleVerifyUser(user._id, 'verified')}
                                                                        className="flex items-center space-x-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                                                                    >
                                                                        <CheckCircle className="w-4 h-4" />
                                                                        <span>Verify</span>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleVerifyUser(user._id, 'rejected')}
                                                                        className="flex items-center space-x-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                                                                    >
                                                                        <XCircle className="w-4 h-4" />
                                                                        <span>Reject</span>
                                                                    </button>
                                                                </>
                                                            )}
                                                            {user.role === 'tenant' && (
                                                                <button
                                                                    onClick={() => handleSwitchToServiceProvider(user._id)}
                                                                    className="flex items-center space-x-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                                                                >
                                                                    <UserCheck className="w-4 h-4" />
                                                                    <span>Make Service Provider</span>
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleBanUser(user._id, user.is_active !== false)}
                                                                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors text-sm ${user.is_active !== false
                                                                    ? 'bg-red-500 text-white hover:bg-red-600'
                                                                    : 'bg-green-500 text-white hover:bg-green-600'
                                                                    }`}
                                                            >
                                                                <Ban className="w-4 h-4" />
                                                                <span>{user.is_active !== false ? 'Ban' : 'Unban'}</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* Analytics Tab */}
                            {activeTab === "analytics" && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>

                                    {/* Site Stats */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-gray-500 text-sm">Total Views</p>
                                                    <p className="text-2xl font-bold text-gray-900">{analytics.siteStats?.totalViews?.toLocaleString() || '0'}</p>
                                                </div>
                                                <Activity className="w-8 h-8 text-blue-500" />
                                            </div>
                                        </div>

                                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-gray-500 text-sm">Unique Visitors</p>
                                                    <p className="text-2xl font-bold text-gray-900">{analytics.siteStats?.uniqueVisitors?.toLocaleString() || '0'}</p>
                                                </div>
                                                <Users className="w-8 h-8 text-green-500" />
                                            </div>
                                        </div>

                                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-gray-500 text-sm">Bounce Rate</p>
                                                    <p className="text-2xl font-bold text-gray-900">{analytics.siteStats?.bounceRate || '0'}%</p>
                                                </div>
                                                <TrendingUp className="w-8 h-8 text-yellow-500" />
                                            </div>
                                        </div>

                                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-gray-500 text-sm">Avg Session</p>
                                                    <p className="text-2xl font-bold text-gray-900">{analytics.siteStats?.avgSessionTime || '0:00'}</p>
                                                </div>
                                                <Clock className="w-8 h-8 text-purple-500" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Growth Charts */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Growth</h3>
                                            <div className="space-y-3">
                                                {analytics.propertyGrowth?.map((item, index) => (
                                                    <div key={index} className="flex items-center justify-between">
                                                        <span className="text-sm text-gray-600">{item.month}</span>
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-24 bg-gray-200 rounded-full h-2">
                                                                <div
                                                                    className="bg-blue-500 h-2 rounded-full"
                                                                    style={{ width: `${(item.count / 100) * 100}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-sm font-medium text-gray-900">{item.count}</span>
                                                        </div>
                                                    </div>
                                                )) || <p className="text-gray-500">No data available</p>}
                                            </div>
                                        </div>

                                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
                                            <div className="space-y-3">
                                                {analytics.userGrowth?.map((item, index) => (
                                                    <div key={index} className="flex items-center justify-between">
                                                        <span className="text-sm text-gray-600">{item.month}</span>
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-24 bg-gray-200 rounded-full h-2">
                                                                <div
                                                                    className="bg-green-500 h-2 rounded-full"
                                                                    style={{ width: `${(item.count / 250) * 100}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-sm font-medium text-gray-900">{item.count}</span>
                                                        </div>
                                                    </div>
                                                )) || <p className="text-gray-500">No data available</p>}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Reports Tab */}
                            {activeTab === "reports" && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-2xl font-bold text-gray-900">Reports & Issues</h2>

                                    <div className="space-y-4">
                                        {loading ? (
                                            <div className="flex justify-center py-8">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f73c56]"></div>
                                            </div>
                                        ) : reports.length === 0 ? (
                                            <div className="text-center py-8">
                                                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-500">No reports found</p>
                                            </div>
                                        ) : (
                                            reports.map((report) => (
                                                <div key={report.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-start space-x-4">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${report.type === 'flagged' ? 'bg-red-100' : 'bg-yellow-100'
                                                                }`}>
                                                                {report.type === 'flagged' ? (
                                                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                                                ) : (
                                                                    <Clock className="w-5 h-5 text-yellow-600" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                                                                <p className="text-gray-600 mt-1">{report.description}</p>
                                                                <p className="text-sm text-gray-500 mt-2">
                                                                    Reported: {new Date(report.createdAt).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                                                                {report.status}
                                                            </span>
                                                            <button className="p-2 text-gray-400 hover:text-gray-600">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* Services Tab */}
                            {activeTab === "services" && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-2xl font-bold text-gray-900">Service Management</h2>

                                    {/* Filters and Search */}
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                                        <div className="flex items-center space-x-4">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                <input
                                                    type="text"
                                                    placeholder="Search services..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                                />
                                            </div>
                                            <select
                                                value={serviceFilter}
                                                onChange={(e) => setServiceFilter(e.target.value)}
                                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                            >
                                                <option value="all">All Services</option>
                                                <option value="verified">Verified</option>
                                                <option value="pending">Pending Verification</option>
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Showing {filteredServices.length} of {services.length} services
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {loading ? (
                                            <div className="flex justify-center py-8">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f73c56]"></div>
                                            </div>
                                        ) : filteredServices.length === 0 ? (
                                            <div className="text-center py-8">
                                                <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-500">No services found</p>
                                            </div>
                                        ) : (
                                            filteredServices.map((service) => (
                                                <div key={service._id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                                                    <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
                                                        {/* Service Image */}
                                                        <div className="w-full lg:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                                                            {service.images?.[0] ? (
                                                                <img
                                                                    src={service.images[0]}
                                                                    alt={service.service_name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <Settings className="w-8 h-8 text-gray-400" />
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Service Details */}
                                                        <div className="flex-1 space-y-2">
                                                            <div className="flex items-start justify-between">
                                                                <div>
                                                                    <h3 className="text-lg font-semibold text-gray-900">{service.service_name}</h3>
                                                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                                        <span>Category: {service.category}</span>
                                                                        <span>•</span>
                                                                        <span>Price: ₹{service.base_price}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${service.monositi_verified ? 'text-green-600 bg-green-50 border-green-200' : 'text-yellow-600 bg-yellow-50 border-yellow-200'}`}>
                                                                        {service.monositi_verified ? 'Verified' : 'Pending'}
                                                                    </span>
                                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${service.active_status ? 'text-green-600 bg-green-50 border-green-200' : 'text-red-600 bg-red-50 border-red-200'}`}>
                                                                        {service.active_status ? 'Active' : 'Inactive'}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                                <span>Provider: {service.provider?.name || 'Unknown'}</span>
                                                                <span>•</span>
                                                                <span>Rating: {service.ratings?.average || 0}/5</span>
                                                                <span>•</span>
                                                                <span>Created: {new Date(service.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex flex-wrap gap-2">
                                                            {!service.monositi_verified && (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleApproveService(service._id)}
                                                                        className="flex items-center space-x-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                                                                    >
                                                                        <CheckCircle className="w-4 h-4" />
                                                                        <span>Verify</span>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleRejectService(service._id)}
                                                                        className="flex items-center space-x-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                                                                    >
                                                                        <XCircle className="w-4 h-4" />
                                                                        <span>Reject</span>
                                                                    </button>
                                                                </>
                                                            )}
                                                            {service.monositi_verified && (
                                                                <button
                                                                    onClick={() => handleRejectService(service._id)}
                                                                    className="flex items-center space-x-1 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                                                                >
                                                                    <XCircle className="w-4 h-4" />
                                                                    <span>Revoke</span>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;