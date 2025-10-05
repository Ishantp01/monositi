import React, { useState } from "react";
import AuthLayout from "./AuthLayout";
import apiRequest from "../utils/api"; // Common API handler

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiRequest("/users/login", "POST", {
        email,
        password,
      });

      if (response.success) {
        // Save token or user details in localStorage (if returned)
        localStorage.setItem("token", response.token);
        localStorage.setItem("role", JSON.stringify(response.user.role));
        localStorage.setItem("user", JSON.stringify(response.user));

        console.log(response);

        alert("Login successful!");
        // redirect to dashboard or home
        window.location.href = "/";
      } else {
        setError(response.message || "Invalid credentials.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout image="https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1600">
      <div className="rounded-xl border border-gray-300 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8">
          <h1 className="text-xl uppercase font-bold text-gray-900 mb-4 text-center">
            Login
          </h1>

          <form className="mt-6 space-y-6" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border-b border-gray-300 focus:border-gray-900 outline-none py-2 text-sm"
            />

            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border-b border-gray-300 focus:border-gray-900 outline-none py-2 text-sm"
            />

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-theme-primary py-2 text-white font-medium hover:bg-red-700 transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="text-right text-xs text-gray-400 cursor-pointer hover:underline">
              Forgot Password?
            </div>
          </form>
        </div>

        <div className="bg-[#E0E0E0] p-4 md:py-8 text-center text-sm">
          Don’t have an account?{" "}
          <a href="/signup" className="text-theme-primary font-semibold">
            Sign Up
          </a>
        </div>
      </div>
    </AuthLayout>
  );
}
