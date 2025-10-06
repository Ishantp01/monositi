import React, { useState } from "react";
import AuthLayout from "./AuthLayout";
import apiRequest from "../utils/api"; // Common API handler
import { toast } from "react-toastify";

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

      // 🔹 Handle forbidden (email not verified)
      if (response.status === 403 || response.message?.includes("Email not verified")) {
        toast.warning("⚠️ Email not verified. Please check your inbox.", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setLoading(false);
        return;
      }

      if (response.success) {
        // Save token or user details in localStorage
        localStorage.setItem("token", response.token);
        localStorage.setItem("role", JSON.stringify(response.user.role));
        localStorage.setItem("user", JSON.stringify(response.user));

        // Success notification
        toast.success("🎉 Welcome back! Login successful!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Redirect after a short delay
        setTimeout(() => {
          const redirectUrl = localStorage.getItem("redirectAfterLogin");
          if (redirectUrl) {
            localStorage.removeItem("redirectAfterLogin");
            window.location.href = redirectUrl;
          } else {
            window.location.href = "/";
          }
        }, 1500);
      } else {
        setError(response.message || "Invalid credentials.");
      }
    } catch (err) {
      console.error("Login Error:", err);
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
