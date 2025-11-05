import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Upload, X, Plus, Trash2, MapPin, ChevronLeft } from "lucide-react";
import Navbar from "../../components/layout/NavBar";
import Footer from "../../components/layout/Footer";
import LocationPicker from "../../components/Monositi/LocationPicker";
import RoomVisualizer from "../../components/Monositi/RoomVisualizer";
import { monositiApi } from "../../utils/monositiApi";
import { toast } from "react-toastify";

const CreateMonositiListing = () => {
    const { id } = useParams(); // For editing existing listing
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        coordinates: { lng: "", lat: "" },
        area: "",
        price: "",
    });

    const [images, setImages] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingListing, setLoadingListing] = useState(false);

    useEffect(() => {
        if (isEditing) {
            fetchListingDetails();
        }
    }, [id, isEditing]);

    const fetchListingDetails = async () => {
        try {
            setLoadingListing(true);
            const response = await monositiApi.getListingById(id);
            if (response.success) {
                const listing = response.data;
                setFormData({
                    title: listing.title || "",
                    description: listing.description || "",
                    category: listing.category || "",
                    address: listing.location?.address || "",
                    city: listing.location?.city || "",
                    state: listing.location?.state || "",
                    pincode: listing.location?.pincode || "",
                    coordinates: {
                        lng: listing.location?.coordinates?.coordinates?.[0] || "",
                        lat: listing.location?.coordinates?.coordinates?.[1] || "",
                    },
                    area: listing.area || "",
                    price: listing.price || "",
                });
                setRooms(listing.rooms || []);
            } else {
                toast.error("Failed to load listing details");
                navigate("/admin/monositi");
            }
        } catch (error) {
            console.error("Error fetching listing:", error);
            toast.error("Error loading listing");
            navigate("/admin/monositi");
        } finally {
            setLoadingListing(false);
        }
    };

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
        if (images.length + files.length > 10) {
            toast.error("Maximum 10 images allowed");
            return;
        }
        setImages(prev => [...prev, ...files]);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const addRoom = () => {
        setRooms(prev => [...prev, {
            floor: "",
            room_number: "",
            total_beds: "",
            available_beds: "",
            rent_per_bed: "",
            amenities: [],
            images: []
        }]);
    };

    const updateRoom = (index, field, value) => {
        setRooms(prev => prev.map((room, i) =>
            i === index ? { ...room, [field]: value } : room
        ));
    };

    const removeRoom = (index) => {
        setRooms(prev => prev.filter((_, i) => i !== index));
    };

    const handleAmenityChange = (roomIndex, amenityValue) => {
        const amenities = amenityValue.split(',').map(a => a.trim()).filter(a => a);
        updateRoom(roomIndex, 'amenities', amenities);
    };

    const handleLocationSelect = (locationData) => {
        if (locationData.coordinates) {
            setFormData(prev => ({
                ...prev,
                coordinates: {
                    lng: locationData.coordinates.lng,
                    lat: locationData.coordinates.lat
                }
            }));
        }

        if (locationData.address) {
            setFormData(prev => ({
                ...prev,
                address: locationData.address
            }));
        }

        if (locationData.addressComponents) {
            setFormData(prev => ({
                ...prev,
                city: locationData.addressComponents.city || prev.city,
                state: locationData.addressComponents.state || prev.state,
                pincode: locationData.addressComponents.pincode || prev.pincode
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.title || !formData.category || !formData.city || !formData.price) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (formData.category === 'hostel_pg' && rooms.length === 0) {
            toast.error("Please add at least one room for hostel/PG listings");
            return;
        }

        try {
            setLoading(true);

            // Prepare form data
            const submitData = new FormData();

            // Basic listing data
            submitData.append('title', formData.title);
            submitData.append('description', formData.description);
            submitData.append('category', formData.category);
            submitData.append('address', formData.address);
            submitData.append('city', formData.city);
            submitData.append('state', formData.state);
            submitData.append('pincode', formData.pincode);
            submitData.append('price', formData.price);

            if (formData.area) {
                submitData.append('area', formData.area);
            }

            // Coordinates
            if (formData.coordinates.lng && formData.coordinates.lat) {
                submitData.append('coordinates', JSON.stringify({
                    lng: parseFloat(formData.coordinates.lng),
                    lat: parseFloat(formData.coordinates.lat)
                }));
            }

            // Images
            images.forEach((image, index) => {
                submitData.append('images', image);
            });

            let response;
            if (isEditing) {
                response = await monositiApi.updateListing(id, submitData);
            } else {
                response = await monositiApi.createListing(submitData);
            }

            if (response.success) {
                const listingId = response.data._id;

                // Add rooms for hostel_pg category
                if (formData.category === 'hostel_pg' && rooms.length > 0) {
                    for (const room of rooms) {
                        if (room.floor && room.room_number && room.total_beds) {
                            const roomData = new FormData();
                            roomData.append('floor', room.floor);
                            roomData.append('room_number', room.room_number);
                            roomData.append('total_beds', room.total_beds);
                            roomData.append('available_beds', room.available_beds || room.total_beds);

                            if (room.rent_per_bed) {
                                roomData.append('rent_per_bed', room.rent_per_bed);
                            }

                            if (room.amenities.length > 0) {
                                roomData.append('amenities', JSON.stringify(room.amenities));
                            }

                            await monositiApi.addRoom(listingId, roomData);
                        }
                    }
                }

                toast.success(`Listing ${isEditing ? 'updated' : 'created'} successfully`);
                navigate("/admin/monositi");
            } else {
                toast.error(response.message || `Failed to ${isEditing ? 'update' : 'create'} listing`);
            }
        } catch (error) {
            console.error("Error submitting listing:", error);
            toast.error(`Error ${isEditing ? 'updating' : 'creating'} listing`);
        } finally {
            setLoading(false);
        }
    };

    if (loadingListing) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f73c56] mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading listing details...</p>
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
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex items-center gap-4 mb-4">
                                <button
                                    onClick={() => navigate("/admin/monositi")}
                                    className="flex items-center text-[#f73c56] hover:text-[#e9334e] transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5 mr-1" />
                                    Back to Listings
                                </button>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {isEditing ? 'Edit Monositi Listing' : 'Create Monositi Listing'}
                            </h1>
                            <p className="text-gray-600">
                                {isEditing ? 'Update listing details' : 'Add a new hostel, commercial space, or land plot'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Basic Information */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Title *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                            placeholder="e.g., Green Valley Hostel"
                                            required
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows="4"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                            placeholder="Describe the property..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category *
                                        </label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            <option value="commercial">Commercial Space</option>
                                            <option value="hostel_pg">Hostel & PG</option>
                                            <option value="land_plot">Land & Plot</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Price *
                                        </label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                            placeholder="Enter price"
                                            required
                                        />
                                    </div>

                                    {(formData.category === 'commercial' || formData.category === 'land_plot') && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Area
                                            </label>
                                            <input
                                                type="text"
                                                name="area"
                                                value={formData.area}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                                placeholder="e.g., 1500 sq ft"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Location Information */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <LocationPicker
                                    onLocationSelect={handleLocationSelect}
                                    initialCoordinates={formData.coordinates.lat && formData.coordinates.lng ? formData.coordinates : null}
                                    initialAddress={formData.address}
                                />

                                {/* Additional Location Fields */}
                                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                            placeholder="Enter city"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            State
                                        </label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                            placeholder="Enter state"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Pincode
                                        </label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                            placeholder="Enter pincode"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Images */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold mb-4">Images</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Upload Images (Max 10)
                                        </label>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                        />
                                    </div>

                                    {images.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {images.map((image, index) => (
                                                <div key={index} className="relative">
                                                    <img
                                                        src={URL.createObjectURL(image)}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-24 object-cover rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Rooms (for hostel_pg only) */}
                            {formData.category === 'hostel_pg' && (
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-semibold">Rooms</h2>
                                        <button
                                            type="button"
                                            onClick={addRoom}
                                            className="flex items-center gap-2 px-4 py-2 bg-[#f73c56] text-white rounded-lg hover:bg-[#e9334e] transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add Room
                                        </button>
                                    </div>

                                    {rooms.length === 0 ? (
                                        <p className="text-gray-500 text-center py-8">No rooms added yet. Click "Add Room" to get started.</p>
                                    ) : (
                                        <div className="space-y-6">
                                            {rooms.map((room, index) => (
                                                <div key={index} className="border rounded-lg p-4">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <h3 className="font-semibold">Room {index + 1}</h3>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeRoom(index)}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Floor *
                                                            </label>
                                                            <input
                                                                type="number"
                                                                value={room.floor}
                                                                onChange={(e) => updateRoom(index, 'floor', e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                                                placeholder="Floor number"
                                                                required
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Room Number *
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={room.room_number}
                                                                onChange={(e) => updateRoom(index, 'room_number', e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                                                placeholder="e.g., 101"
                                                                required
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Total Beds *
                                                            </label>
                                                            <input
                                                                type="number"
                                                                value={room.total_beds}
                                                                onChange={(e) => updateRoom(index, 'total_beds', e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                                                placeholder="Number of beds"
                                                                required
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Available Beds
                                                            </label>
                                                            <input
                                                                type="number"
                                                                value={room.available_beds}
                                                                onChange={(e) => updateRoom(index, 'available_beds', e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                                                placeholder="Available beds"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Rent per Bed
                                                            </label>
                                                            <input
                                                                type="number"
                                                                value={room.rent_per_bed}
                                                                onChange={(e) => updateRoom(index, 'rent_per_bed', e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                                                placeholder="Rent amount"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Amenities
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={room.amenities.join(', ')}
                                                                onChange={(e) => handleAmenityChange(index, e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f73c56] focus:border-transparent"
                                                                placeholder="AC, WiFi, Attached Bath (comma separated)"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Room Preview */}
                            {formData.category === 'hostel_pg' && rooms.length > 0 && (
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h2 className="text-xl font-semibold mb-4">Room Layout Preview</h2>
                                    <RoomVisualizer
                                        rooms={rooms.map((room, index) => ({
                                            ...room,
                                            _id: `temp-${index}`,
                                            status: room.available_beds === 0 ? 'full' : 'available'
                                        }))}
                                        viewMode="grid"
                                    />
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate("/admin/monositi")}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-3 bg-[#f73c56] text-white rounded-lg hover:bg-[#e9334e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Saving...' : (isEditing ? 'Update Listing' : 'Create Listing')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CreateMonositiListing;