import React, { useState } from "react";
import AuthLayout from "./AuthLayout";
import apiRequest from "../utils/api"; // your common API handler

const ROLES = ["tenant", "landlord", "serviceProvider"];

export default function SignUp() {
  const [role, setRole] = useState(ROLES[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await apiRequest("/users/register", "POST", {
        name,
        email,
        password,
        role,
      });

      if (response.success) {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => (window.location.href = "/login"), 1500);
      } else {
        setError(response.message || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
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
          <p className="mt-2 text-lg text-gray-700">I am</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {ROLES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`px-3 py-1 rounded-full border text-sm font-semibold transition ${
                  role === r
                    ? "bg-[#339989]/20 text-black border-[#339989]"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {r}
              </button>
            ))}
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

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {success && (
              <p className="text-green-600 text-sm text-center">{success}</p>
            )}

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
