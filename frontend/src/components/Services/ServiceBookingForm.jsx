import React, { useState } from "react";
import { X, Calendar, MapPin, DollarSign, FileText, Camera } from "lucide-react";
import { toast } from "react-toastify";
import { serviceApi } from "../../utils/serviceApi";

const ServiceBookingForm = ({ isOpen, onClose, serviceProvider }) => {
    const [formData, setFormData] = useState({
        scheduled_for: "",
        total_amount: "",
        notes: "",
        service_address: {
            street: "",
            city: "",
            state: "",
            zipCode: ""
        }
    });
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Check if user is logged in
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error("Please login to book a service");
                setLoading(false);
                return;
            }

            // Create FormData object
            const bookingFormData = new FormData();

            // Add service provider ID
            bookingFormData.append('service_id', serviceProvider._id);

            // Add form fields
            bookingFormData.append('scheduled_for', formData.scheduled_for);
            bookingFormData.append('total_amount', formData.total_amount);
            bookingFormData.append('notes', formData.notes);

            // Add address as JSON string
            bookingFormData.append('service_address', JSON.stringify(formData.service_address));

            // Add images
            images.forEach((image, index) => {
                bookingFormData.append('images_before', image);
            });

            const response = await serviceApi.createServiceBooking(bookingFormData);

            if (response.success) {
                toast.success("Service booking created successfully!");
                onClose();
                // Reset form
                setFormData({
                    scheduled_for: "",
                    total_amount: "",
                    notes: "",
                    service_address: {
                        street: "",
                        city: "",
                        state: "",
                        zipCode: ""
                    }
                });
                setImages([]);
            } else {
                toast.error(response.message || "Failed to create booking");
            }
        } catch (error) {
            console.error("Booking error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Book Service</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {serviceProvider?.name} - {serviceProvider?.category}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Service Date */}
                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                            <Calendar className="w-4 h-4 mr-2" />
                            Service Date & Time
                        </label>
                        <input
                            type="datetime-local"
                            name="scheduled_for"
                            value={formData.scheduled_for}
                            onChange={handleInputChange}
                            required
                            min={new Date().toISOString().slice(0, 16)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
                        />
                    </div>

                    {/* Service Address */}
                    <div className="space-y-4">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                            <MapPin className="w-4 h-4 mr-2" />
                            Service Address
                        </label>
                        <div className="grid grid-cols-1 gap-3">
                            <input
                                type="text"
                                name="service_address.street"
                                placeholder="Street Address"
                                value={formData.service_address.street}
                                onChange={handleInputChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    name="service_address.city"
                                    placeholder="City"
                                    value={formData.service_address.city}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
                                />
                                <input
                                    type="text"
                                    name="service_address.state"
                                    placeholder="State"
                                    value={formData.service_address.state}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
                                />
                            </div>
                            <input
                                type="text"
                                name="service_address.zipCode"
                                placeholder="ZIP Code"
                                value={formData.service_address.zipCode}
                                onChange={handleInputChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
                            />
                        </div>
                    </div>

                    {/* Total Amount */}
                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                            <DollarSign className="w-4 h-4 mr-2" />
                            Estimated Amount (₹)
                        </label>
                        <input
                            type="number"
                            name="total_amount"
                            placeholder="Enter estimated amount"
                            value={formData.total_amount}
                            onChange={handleInputChange}
                            required
                            min="0"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
                        />
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                            <FileText className="w-4 h-4 mr-2" />
                            Service Description / Notes
                        </label>
                        <textarea
                            name="notes"
                            placeholder="Describe the service you need..."
                            value={formData.notes}
                            onChange={handleInputChange}
                            required
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 resize-none"
                        />
                    </div>

                    {/* Images */}
                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                            <Camera className="w-4 h-4 mr-2" />
                            Photos (Optional)
                        </label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
                        />
                        {images.length > 0 && (
                            <p className="text-sm text-gray-600">
                                {images.length} image(s) selected
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-[#f73c56] hover:bg-[#e9334e] text-white py-2 rounded-lg transition-colors disabled:opacity-60"
                        >
                            {loading ? "Booking..." : "Book Service"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServiceBookingForm;