import React, { useState } from "react";
import AuthLayout from "./AuthLayout";
import apiRequest from "../utils/api"; // your common API handler
import { toast } from 'react-toastify';

const ROLES = ["tenant", "landlord", "serviceProvider"];

export default function SignUp() {
  const [role, setRole] = useState(ROLES[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiRequest("/users/register", "POST", {
        name,
        email,
        password,
        role,
      });

      if (response.success) {
        toast.success("🎉 Registration successful! Welcome to monositi!", {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        setTimeout(() => (window.location.href = "/login"), 2000);
      } else {
        toast.error(`❌ ${response.message || "Something went wrong."}`, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Server error. Please try again later.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout image="https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1600">
      <div className="rounded-xl border border-gray-300 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">Sign Up</h1>

          {/* Role Selector */}
          <div className="space-y-3">
            <p className="text-lg font-semibold text-gray-700">I am a</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-center">
              {ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`px-6 py-3 rounded-xl border-2 text-sm font-semibold transition-all whitespace-nowrap ${
                    role === r
                      ? "bg-blue-50 text-blue-700 border-blue-500 shadow-md"
                      : "border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border-b border-gray-300 focus:border-gray-900 outline-none py-2 text-sm"
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border-b border-gray-300 focus:border-gray-900 outline-none py-2 text-sm"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border-b border-gray-300 focus:border-gray-900 outline-none py-2 text-sm pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-theme-primary py-2 text-white font-medium hover:bg-red-700 transition disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
        </div>

        <div className="bg-[#E0E0E0] p-4 md:py-8 text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-theme-primary font-semibold">
            Login
          </a>
        </div>
      </div>
    </AuthLayout>
  );
}
