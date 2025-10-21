"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/layout/NavBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ServiceProviderForm = () => {
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    tags: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    profilePhoto: null,
  });

  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  // ✅ Get token directly from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePhoto") {
      setFormData({ ...formData, profilePhoto: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      await axios.post("https://monositi.onrender.com/api/services/m", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("✅ Service added successfully!", {
        position: "top-center",
        autoClose: 2500,
      });

      setFormData({
        category: "",
        description: "",
        tags: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        profilePhoto: null,
      });
    } catch (error) {
      console.error(error);
      toast.error("❌ Error adding service!", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-white mt-5">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl w-full max-w-2xl shadow-lg border-t-4 border-red-600"
        >
          <h2 className="text-3xl font-bold mb-6 text-red-600 text-center">
            Add Service
          </h2>

          {[
            { label: "Category", name: "category", type: "text" },
            { label: "Description", name: "description", type: "text" },
            { label: "Tags", name: "tags", type: "text" },
            { label: "Address", name: "address", type: "text" },
            { label: "City", name: "city", type: "text" },
            { label: "State", name: "state", type: "text" },
            { label: "Pincode", name: "pincode", type: "text" },
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
            className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-black transition"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>

      {/* ✅ Toast Container */}
      <ToastContainer />
    </>
  );
};

export default ServiceProviderForm;
