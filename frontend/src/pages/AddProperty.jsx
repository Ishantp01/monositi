import React, { useState } from 'react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import { propertyApi, createPropertyFormData } from '../utils/propertyApi';
import avatar from '../assets/images/avatar2.jpg';

// Property type icons
const propertyTypeIcons = {
  'Rent': '🏡',
  'Buy': '🏘️',
  'Commercial': '🏢'
};

// Form section component
const FormSection = ({ title, icon, children, description }) => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
    <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6">
      <div className="flex items-center space-x-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          {description && <p className="text-gray-200 text-sm mt-1">{description}</p>}
        </div>
      </div>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const AddProperty = () => {
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    price: '',
    tags: '',
    genderPreference: '',
    contactNumber: '',
    photos: []
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [photoPreviews, setPhotoPreviews] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const previewURLs = files.map(file => URL.createObjectURL(file));

    setFormData(prev => ({
      ...prev,
      photos: files
    }));

    setPhotoPreviews(previewURLs);
  };

  const removePhoto = (index) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index);
    const newPreviews = photoPreviews.filter((_, i) => i !== index);

    setFormData(prev => ({
      ...prev,
      photos: newPhotos
    }));

    setPhotoPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Use helper function to create FormData
      const formDataToSend = createPropertyFormData(formData);

      // Call API from helper
      const result = await propertyApi.createProperty(formDataToSend);

      if (result.success) {
        setMessage('Property added successfully! It will be reviewed by admin.');
        setFormData({
          type: '',
          name: '',
          description: '',
          address: '',
          city: '',
          state: '',
          price: '',
          tags: '',
          genderPreference: '',
          contactNumber: '',
          photos: []
        });
        setPhotoPreviews([]);
      } else {
        setMessage('Error adding property: ' + result.message);
      }
    } catch (error) {
      setMessage('Error adding property: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar avatarUrl={avatar} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg mb-4">
              <span className="text-2xl">🏠</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              List Your Property
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Join thousands of property owners and showcase your space to potential tenants
            </p>
          </div>

          {/* Success/Error Message */}
          {message && (
            <div className={`max-w-2xl mx-auto p-6 rounded-xl shadow-lg border-2 ${message.includes('successfully')
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-orange-50 border-orange-200 text-orange-800'
              }`}>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {message.includes('successfully') ? '✅' : '⚠️'}
                </span>
                <div>
                  <h3 className="font-semibold text-lg">
                    {message.includes('successfully') ? 'Property Submitted!' : 'Submission Issue'}
                  </h3>
                  <p className="text-sm mt-1">{message}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Property Type Selection */}
            <FormSection
              title="Property Type"
              icon="🏷️"
              description="Choose the category that best describes your property"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(propertyTypeIcons).map(([type, icon]) => (
                  <label key={type} className={`relative cursor-pointer`}>
                    <input
                      type="radio"
                      name="type"
                      value={type}
                      checked={formData.type === type}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`p-4 rounded-xl border-2 text-center transition-all ${formData.type === type
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-500 hover:bg-gray-50'
                      }`}>
                      <span className="text-3xl block mb-2">{icon}</span>
                      <span className="font-medium text-sm">{type}</span>
                    </div>
                  </label>
                ))}
              </div>
            </FormSection>

            {/* Basic Information */}
            <FormSection
              title="Basic Information"
              icon="📋"
              description="Tell us about your property"
            >
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Property Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., Sunrise PG for Boys"
                        className="w-full border-2 border-gray-200 rounded-xl p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                      <div className="absolute left-4 top-4 text-gray-400">🏠</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Monthly Rent (₹) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        placeholder="15000"
                        className="w-full border-2 border-gray-200 rounded-xl p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                      <div className="absolute left-4 top-4 text-gray-400">💰</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    placeholder="Describe your property, amenities, location benefits, and what makes it special..."
                    className="w-full border-2 border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  />
                </div>
              </div>
            </FormSection>

            {/* Location */}
            <FormSection
              title="Location Details"
              icon="📍"
              description="Help tenants find your property"
            >
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Full Address *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      placeholder="123 Main Street, Sector 15, Gurgaon"
                      className="w-full border-2 border-gray-200 rounded-xl p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-theme-primary transition-all"
                    />
                    <div className="absolute left-4 top-4 text-gray-400">🏢</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      City *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        placeholder="Gurgaon"
                        className="w-full border-2 border-gray-200 rounded-xl p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                      <div className="absolute left-4 top-4 text-gray-400">🏙️</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      State *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        placeholder="Haryana"
                        className="w-full border-2 border-gray-200 rounded-xl p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                      <div className="absolute left-4 top-4 text-gray-400">🗺️</div>
                    </div>
                  </div>
                </div>
              </div>
            </FormSection>

            {/* Property Details */}
            <FormSection
              title="Property Details"
              icon="⚙️"
              description="Configure your property settings"
            >
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Gender Preference *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Boys', 'Girls', 'Co-ed', 'Any'].map((option) => (
                      <label key={option} className="relative cursor-pointer">
                        <input
                          type="radio"
                          name="genderPreference"
                          value={option}
                          checked={formData.genderPreference === option}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className={`p-3 rounded-lg border-2 text-center transition-all ${formData.genderPreference === option
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-blue-500 hover:bg-gray-50'
                          }`}>
                          <span className="font-medium text-sm">{option}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Amenities & Features
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="WiFi, Furnished, Meals, Parking, AC, Security, Laundry..."
                    className="w-full border-2 border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <p className="text-sm text-gray-500">
                    Separate multiple amenities with commas
                  </p>
                </div>
              </div>
            </FormSection>

            {/* Contact & Photos */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Contact Information */}
              <FormSection
                title="Contact Information"
                icon="📞"
                description="How tenants can reach you"
              >
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Contact Number *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      required
                      placeholder="+91 9876543210"
                      className="w-full border-2 border-gray-200 rounded-xl p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    <div className="absolute left-4 top-4 text-gray-400">📱</div>
                  </div>
                </div>
              </FormSection>

              {/* Photo Upload */}
              <FormSection
                title="Property Photos"
                icon="📸"
                description="Showcase your property with great photos"
              >
                <div className="space-y-6">
                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="space-y-4">
                      <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-2xl">📷</span>
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-700 mb-2">Upload Property Photos</p>
                        <p className="text-sm text-gray-500 mb-4">Up to 5 high-quality images (JPEG, PNG)</p>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full max-w-xs mx-auto file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                  </div>

                  {/* Photo Preview */}
                  {photoPreviews.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-700">Uploaded Photos ({photoPreviews.length}/5)</h4>
                        <button
                          type="button"
                          onClick={() => {
                            setPhotoPreviews([]);
                            setFormData(prev => ({ ...prev, photos: [] }));
                          }}
                          className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                        >
                          Clear All
                        </button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {photoPreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-300 transition-colors"
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                            >
                              ×
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs text-center py-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                              Photo {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 text-center">
                        💡 Tip: First photo will be your main property image
                      </p>
                    </div>
                  )}
                </div>
              </FormSection>
            </div>

            {/* Submit Section */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to List Your Property?</h3>
                  <p className="text-gray-600">
                    Review your information and submit your property listing. We'll review it before making it live.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    className="px-8 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all"
                  >
                    💾 Save as Draft
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {loading ? (
                      <span className="flex items-center space-x-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Submitting...</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-2">
                        <span>🚀</span>
                        <span>List Property</span>
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddProperty;
