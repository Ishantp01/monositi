"use client";

import { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaCamera, FaUserAlt, FaUsers } from "react-icons/fa";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "tenant",
    photo: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const BASE_API = "http://localhost:5000/api";

  const handleChange = (e) => {
    if (e.target.name === "photo") {
      setFormData({ ...formData, photo: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("role", formData.role);
      if (formData.photo) data.append("photo", formData.photo);

      const res = await fetch(`${BASE_API}/auth/signup`, {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        setMessage("Signup successful!");
        setMessageType("success");
        console.log("Signup Response:", result);
        // Redirect to login or dashboard
        setFormData({ name: "", email: "", password: "", role: "tenant", photo: null });
      } else {
        setMessage(result.message || "Signup failed!");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Something went wrong!");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white py-12 px-4">
      <div className="bg-white p-8 rounded-2xl w-full max-w-xl shadow-xl border border-gray-200">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-red-600 text-white rounded-full p-4 mb-4 shadow-lg">
            <FaUserAlt size={28} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 text-center">
            Create Account
          </h2>
          <p className="text-sm text-gray-600 mt-2">Join us today</p>
        </div>

        {message && (
          <div
            className={`text-center text-sm p-3 rounded-lg mb-4 ${
              messageType === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <div className="relative flex items-center border-2 border-gray-300 rounded-lg p-3 focus-within:border-red-500 transition-colors">
              <FaUser className="text-gray-400 mr-3" size={18} />
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className="outline-none flex-1 text-gray-900 placeholder-gray-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative flex items-center border-2 border-gray-300 rounded-lg p-3 focus-within:border-red-500 transition-colors">
              <FaEnvelope className="text-gray-400 mr-3" size={18} />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="outline-none flex-1 text-gray-900 placeholder-gray-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative flex items-center border-2 border-gray-300 rounded-lg p-3 focus-within:border-red-500 transition-colors">
              <FaLock className="text-gray-400 mr-3" size={18} />
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="outline-none flex-1 text-gray-900 placeholder-gray-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
            <div className="relative border-2 border-gray-300 rounded-lg p-3 focus-within:border-red-500 transition-colors cursor-pointer hover:border-red-400">
              <input
                type="file"
                name="photo"
                id="photo"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
              <label htmlFor="photo" className="flex items-center w-full">
                <FaCamera className="text-gray-400 mr-3" size={18} />
                <span className="text-sm text-gray-600">
                  {formData.photo ? formData.photo.name : "Choose a profile photo"}
                </span>
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">Upload a clear photo of yourself (optional)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <div className="relative border-2 border-gray-300 rounded-lg p-3 focus-within:border-red-500 transition-colors">
              <FaUsers className="text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" size={18} />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="outline-none flex-1 pl-10 pr-4 py-2 text-gray-900 bg-transparent appearance-none"
              >
                <option value="tenant">Tenant</option>
                <option value="landlord">Landlord</option>
                <option value="serviceProvider">Service Provider</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 shadow-md ${
              loading
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 hover:shadow-lg active:bg-red-800"
            } text-white`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing up...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-red-600 hover:underline font-medium">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}