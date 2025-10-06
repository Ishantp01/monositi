'use client';

import React, { useEffect, useState } from 'react';
import propertyApi, { formatPropertyForForm, createPropertyFormData } from '../../utils/propertyApi';

const AdminMonositi = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editedListing, setEditedListing] = useState({});
  const [newListing, setNewListing] = useState({});

  // Fetch all Monositi listings
  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await propertyApi.getAllMonositiListings();
      // Ensure listings is an array, handling potential API response variations
      const listingsData = res.data?.listings || res.data || [];
      setListings(Array.isArray(listingsData) ? listingsData : []);
    } catch (err) {
      console.error('Error fetching listings:', err);
      setListings([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // View Listing
  const handleView = (listing) => {
    setSelectedListing(listing);
    setIsViewModalOpen(true);
  };

  // Edit Listing
  const handleEdit = (listing) => {
    setEditedListing(formatPropertyForForm(listing));
    setSelectedListing(listing);
    setIsEditModalOpen(true);
  };

  // Delete Listing
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      await propertyApi.deleteMonositiListing(id);
      fetchListings();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // Update Listing
  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = createPropertyFormData(editedListing);
    try {
      await propertyApi.updateMonositiListing(selectedListing._id, formData);
      setIsEditModalOpen(false);
      fetchListings();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  // Create new Listing
  const handleCreate = async (e) => {
    e.preventDefault();
    const formData = createPropertyFormData(newListing);
    try {
      const res = await propertyApi.createMonositiListing(formData);
      // Handle different possible response structures
      const newListingData = res.data?.listing || res.data || res.listing;
      if (newListingData) {
        setListings([newListingData, ...listings]); // Prepend new listing
      }
      setIsCreateModalOpen(false);
      setNewListing({});
    } catch (err) {
      console.error('Creation failed:', err);
    }
  };

  // Form change handlers
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedListing({ ...editedListing, [name]: value });
  };
  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewListing({ ...newListing, [name]: value });
  };

  // Table row render
  const renderTableRow = (listing) => (
    <tr key={listing._id} className="border-b hover:bg-gray-100 transition">
      <td className="px-6 py-4">{listing.title}</td>
      <td className="px-6 py-4">{listing.city}</td>
      <td className="px-6 py-4">₹{listing.price}</td>
      <td className="px-6 py-4">{listing.genderPreference}</td>
      <td className="px-6 py-4 space-x-3">
        <button className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition" onClick={() => handleView(listing)}>View</button>
        <button className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition" onClick={() => handleEdit(listing)}>Edit</button>
        <button className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition" onClick={() => handleDelete(listing._id)}>Delete</button>
      </td>
    </tr>
  );

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Monositi Admin Dashboard</h1>

      <button
        className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition mb-6"
        onClick={() => setIsCreateModalOpen(true)}
      >
        + Create New Listing
      </button>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
        </div>
      ) : listings.length === 0 ? (
        <p className="text-gray-600 text-center">No listings available.</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="w-full border-collapse bg-white rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="px-6 py-3 text-left font-medium">Title</th>
                <th className="px-6 py-3 text-left font-medium">City</th>
                <th className="px-6 py-3 text-left font-medium">Price</th>
                <th className="px-6 py-3 text-left font-medium">Gender</th>
                <th className="px-6 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>{listings.map(renderTableRow)}</tbody>
          </table>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-11/12 md:w-2/3 max-h-[90vh] overflow-y-auto shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{selectedListing.title}</h2>
            <p className="text-gray-700 mb-2"><strong>Description:</strong> {selectedListing.description}</p>
            <p className="text-gray-700 mb-2"><strong>Category:</strong> {selectedListing.category}</p>
            <p className="text-gray-700 mb-2"><strong>Address:</strong> {selectedListing.address}, {selectedListing.city}, {selectedListing.state}</p>
            <p className="text-gray-700 mb-2"><strong>Price:</strong> ₹{selectedListing.price}</p>
            <p className="text-gray-700 mb-2"><strong>Gender:</strong> {selectedListing.genderPreference}</p>
            <p className="text-gray-700 mb-2"><strong>Contact:</strong> {selectedListing.contactNumber}</p>
            <p className="text-gray-700 mb-4"><strong>Facilities:</strong> {selectedListing.facilities?.join(', ') || 'None'}</p>
            <div className="my-4 flex gap-3 flex-wrap">
              {selectedListing.photos?.length > 0 ? (
                selectedListing.photos.map((photo, i) => (
                  <img key={i} src={photo} alt="listing" className="w-40 h-40 object-cover rounded-lg shadow" />
                ))
              ) : (
                <p className="text-gray-600">No photos available.</p>
              )}
            </div>
            <button
              className="bg-gray-600 text-white px-5 py-2 rounded-lg hover:bg-gray-700 transition"
              onClick={() => setIsViewModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <form className="bg-white p-8 rounded-lg w-11/12 md:w-2/3 max-h-[90vh] overflow-y-auto shadow-xl" onSubmit={handleUpdate}>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Listing</h2>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Title</label>
              <input
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="text"
                name="title"
                value={editedListing.title || ''}
                onChange={handleEditChange}
                placeholder="Title"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Description</label>
              <textarea
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                name="description"
                value={editedListing.description || ''}
                onChange={handleEditChange}
                placeholder="Description"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Category</label>
              <select
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                name="category"
                value={editedListing.category || ''}
                onChange={handleEditChange}
              >
                <option value="">Select Category</option>
                <option value="PG">PG</option>
                <option value="Hostel">Hostel</option>
                <option value="Flat">Flat</option>
                <option value="Shared Room">Shared Room</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Address</label>
              <input
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="text"
                name="address"
                value={editedListing.address || ''}
                onChange={handleEditChange}
                placeholder="Address"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">City</label>
              <input
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="text"
                name="city"
                value={editedListing.city || ''}
                onChange={handleEditChange}
                placeholder="City"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">State</label>
              <input
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="text"
                name="state"
                value={editedListing.state || ''}
                onChange={handleEditChange}
                placeholder="State"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Price</label>
              <input
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="number"
                name="price"
                value={editedListing.price || ''}
                onChange={handleEditChange}
                placeholder="Price"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Gender Preference</label>
              <select
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                name="genderPreference"
                value={editedListing.genderPreference || 'Any'}
                onChange={handleEditChange}
              >
                <option value="Any">Any</option>
                <option value="Boys">Boys</option>
                <option value="Girls">Girls</option>
                <option value="Co-ed">Co-ed</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Contact Number</label>
              <input
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="text"
                name="contactNumber"
                value={editedListing.contactNumber || ''}
                onChange={handleEditChange}
                placeholder="Contact Number"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Photos</label>
              <input
                type="file"
                multiple
                onChange={(e) => setEditedListing({ ...editedListing, photos: Array.from(e.target.files) })}
                className="w-full"
              />
            </div>

            <div className="flex gap-3">
              <button type="submit" className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition">
                Update
              </button>
              <button
                type="button"
                className="bg-gray-600 text-white px-5 py-2 rounded-lg hover:bg-gray-700 transition"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <form className="bg-white p-8 rounded-lg w-11/12 md:w-2/3 max-h-[90vh] overflow-y-auto shadow-xl" onSubmit={handleCreate}>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create New Listing</h2>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Title</label>
              <input
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="text"
                name="title"
                value={newListing.title || ''}
                onChange={handleNewChange}
                placeholder="Title"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Description</label>
              <textarea
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                name="description"
                value={newListing.description || ''}
                onChange={handleNewChange}
                placeholder="Description"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Category</label>
              <select
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                name="category"
                value={newListing.category || ''}
                onChange={handleNewChange}
              >
                <option value="">Select Category</option>
                <option value="PG">PG</option>
                <option value="Hostel">Hostel</option>
                <option value="Flat">Flat</option>
                <option value="Shared Room">Shared Room</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Address</label>
              <input
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="text"
                name="address"
                value={newListing.address || ''}
                onChange={handleNewChange}
                placeholder="Address"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">City</label>
              <input
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="text"
                name="city"
                value={newListing.city || ''}
                onChange={handleNewChange}
                placeholder="City"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">State</label>
              <input
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="text"
                name="state"
                value={newListing.state || ''}
                onChange={handleNewChange}
                placeholder="State"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Price</label>
              <input
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="number"
                name="price"
                value={newListing.price || ''}
                onChange={handleNewChange}
                placeholder="Price"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Gender Preference</label>
              <select
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                name="genderPreference"
                value={newListing.genderPreference || 'Any'}
                onChange={handleNewChange}
              >
                <option value="Any">Any</option>
                <option value="Boys">Boys</option>
                <option value="Girls">Girls</option>
                <option value="Co-ed">Co-ed</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Contact Number</label>
              <input
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="text"
                name="contactNumber"
                value={newListing.contactNumber || ''}
                onChange={handleNewChange}
                placeholder="Contact Number"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Photos</label>
              <input
                type="file"
                multiple
                onChange={(e) => setNewListing({ ...newListing, photos: Array.from(e.target.files) })}
                className="w-full"
              />
            </div>

            <div className="flex gap-3">
              <button type="submit" className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition">
                Create
              </button>
              <button
                type="button"
                className="bg-gray-600 text-white px-5 py-2 rounded-lg hover:bg-gray-700 transition"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminMonositi;