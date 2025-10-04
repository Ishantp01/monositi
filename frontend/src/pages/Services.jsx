'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/NavBar';
import { Loader2, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'react-toastify';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all assigned & completed requests
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token'); // assuming token stored in localStorage
        const response = await axios.get("http://localhost:5000/api/services/services/requests/provider",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setServices(response.data.data);
        } else {
          toast.error('Failed to fetch services.');
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        toast.error('Something went wrong while fetching services.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          My Service Requests
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-theme-primary animate-spin" />
          </div>
        ) : services.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No service requests found.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((req) => (
              <div
                key={req._id}
                className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-2xl transition-all"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {req.category || 'Service Request'}
                </h2>

                <p className="text-gray-600 mb-3">
                  {req.description || 'No description provided.'}
                </p>

                <div className="flex justify-between items-center mt-4">
                  <span
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                      req.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {req.status === 'completed' ? (
                      <>
                        <CheckCircle className="w-4 h-4" /> Completed
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4" /> In Progress
                      </>
                    )}
                  </span>

                  <span className="text-gray-500 text-sm">
                    📅 {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Services;
