import React, { useState, useEffect } from 'react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import { propertyApi } from '../utils/propertyApi';
import avatar from '../assets/images/avatar2.jpg';

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const fetchMyProperties = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setMessage("User not logged in");
        setLoading(false);
        return;
      }

      const result = await propertyApi.getPropertyByLandlord();

      if (result.success) {
        setProperties(result.properties);
      } else {
        setMessage("Error fetching properties: " + result.message);
      }
    } catch (error) {
      setMessage("Error fetching properties: " + error.message);
    } finally {
      setLoading(false);
    }
};

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      const result = await propertyApi.deleteProperty(propertyId);

      if (result.success) {
        setMessage('Property deleted successfully');
        fetchMyProperties(); // Refresh the list
      } else {
        setMessage('Error deleting property: ' + result.message);
      }
    } catch (error) {
      setMessage('Error deleting property: ' + error.message);
    }
};

  const getStatusBadge = (status) => {
    const statusColors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Verified': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Suspended': 'bg-gray-100 text-gray-800'
  };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-lg font-medium text-gray-700">Loading your properties...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar avatarUrl={avatar} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg mb-4">
              <span className="text-2xl">🏠</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-800">My Properties</h1>
            <p className="text-gray-600 text-lg">Manage your property listings</p>
          </div>

          {/* Success/Error Message */}
          {message && (
            <div className={`max-w-2xl mx-auto p-4 rounded-lg border ${
              message.includes('successfully')
                ? 'bg-green-50 text-green-800 border-green-200'
                : 'bg-orange-50 text-orange-800 border-orange-200'
            }`}>
              <div className="flex items-center space-x-2">
                <span className="text-lg">
                  {message.includes('successfully') ? '✅' : '⚠️'}
                </span>
                <span className="font-medium">{message}</span>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-800">{properties.length}</span> propert{properties.length !== 1 ? 'ies' : 'y'} listed
              </div>
              <a
                href="/add-property"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                <span>➕</span>
                <span>Add New Property</span>
              </a>
            </div>
          </div>

          {properties.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
              <div className="text-gray-300 mb-6">
                <div className="mx-auto w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl">🏠</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">No Properties Listed Yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start building your property portfolio by adding your first listing. It's quick and easy!
              </p>
              <a
                href="/add-property"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                <span>🚀</span>
                <span>Add Your First Property</span>
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <div key={property._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Property Image */}
                  <div className="h-48 bg-gray-200 relative">
                    {property.photos && property.photos.length > 0 ? (
                      <img
                        src={property.photos[0]}
                        alt={property.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      {getStatusBadge(property.status)}
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{property.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{property.address}, {property.city}</p>
                    <p className="text-theme-primary font-bold text-lg mb-3">₹{property.price.toLocaleString()}</p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {property.tags && property.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                      {property.tags && property.tags.length > 3 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          +{property.tags.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.location.href = `/edit-property/${property._id}`}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProperty(property._id)}
                        className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
export default MyProperties;