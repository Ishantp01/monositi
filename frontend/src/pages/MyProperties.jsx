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
      const result = await propertyApi.getMyProperties();
      
      if (result.success) {
        setProperties(result.properties);
      } else {
        setMessage('Error fetching properties: ' + result.message);
      }
    } catch (error) {
      setMessage('Error fetching properties: ' + error.message);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-theme-primary"></div>
          <p className="mt-4 text-gray-600">Loading your properties...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar avatarUrl={avatar} />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Properties</h1>
            <p className="text-gray-600">Manage your property listings</p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.includes('successfully') 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-600">
              {properties.length} property{properties.length !== 1 ? 'ies' : ''} found
            </div>
            <a
              href="/add-property"
              className="bg-theme-primary text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Add New Property
            </a>
          </div>

          {properties.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-600 mb-4">Start by adding your first property listing.</p>
              <a
                href="/add-property"
                className="bg-theme-primary text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Add Your First Property
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
};

export default MyProperties;
