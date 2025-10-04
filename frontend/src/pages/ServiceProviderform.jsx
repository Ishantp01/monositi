'use client';
import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/NavBar';

const ServiceProviderForm = () => {
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    tags: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    profilePhoto: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePhoto') {
      setFormData({ ...formData, profilePhoto: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      const response = await axios.post(
        'http://localhost:5000/api/services/m',
        data,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      setMessage('Service added successfully!');
      setFormData({
        category: '',
        description: '',
        tags: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        profilePhoto: null,
      });
    } catch (error) {
      console.error(error);
      setMessage('Error adding service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen flex items-center justify-center bg-white mt-5">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl w-full max-w-2xl shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-red-600 text-center">
          Add Service
        </h2>

        {[
          { label: 'Category', name: 'category', type: 'text' },
          { label: 'Description', name: 'description', type: 'text' },
          { label: 'Tags', name: 'tags', type: 'text' },
          { label: 'Address', name: 'address', type: 'text' },
          { label: 'City', name: 'city', type: 'text' },
          { label: 'State', name: 'state', type: 'text' },
          { label: 'Pincode', name: 'pincode', type: 'text' },
        ].map((field) => (
          <div className="mb-4" key={field.name}>
            <label className="block text-black font-semibold mb-2">
              {field.label}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
              required
            />
          </div>
        ))}

        <div className="mb-4">
          <label className="block text-black font-semibold mb-2">
            Profile Photo
          </label>
          <input
            type="file"
            name="profilePhoto"
            accept="image/*"
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>

        {message && (
          <p className="mt-4 text-center text-black font-semibold">{message}</p>
        )}
      </form>
    </div>
    </>
  );
};

export default ServiceProviderForm;
