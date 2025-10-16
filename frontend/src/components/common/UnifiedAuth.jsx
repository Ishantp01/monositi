"use client";
import React, { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import apiRequest from "../../utils/api";

export default function UnifiedAuth() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        photo: "",
        otp: "",
    });
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(""); // Clear error when user types
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await apiRequest("/users/login", "POST", {
                email: formData.email,
                password: formData.password,
            });

            if (response.status === 403 || response.message?.includes("Email not verified")) {
                setError("Please verify your email before logging in.");
                toast.warning("Email not verified. Please verify your email first.");
                setLoading(false);
                return;
            }

            if (response.success) {
                localStorage.setItem("token", response.token);
                localStorage.setItem("role", JSON.stringify(response.user.role));
                localStorage.setItem("user", JSON.stringify(response.user));

                toast.success("🎉 Welcome back! Login successful!");

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
            toast.error("Server error. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await apiRequest("/users/register", "POST", {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                photo: formData.photo,
            });

            if (response.success) {
                setOtpSent(true);
                toast.success("Registration successful! Please check your email for OTP.");
            } else {
                setError(response.message || "Registration failed");
                toast.error(response.message || "Registration failed");
            }
        } catch (error) {
            console.error("Registration error:", error);
            setError("Something went wrong. Please try again.");
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await apiRequest("/users/verify-email", "POST", {
                email: formData.email,
                otp: formData.otp,
            });

            if (response.success) {
                toast.success("Email verified successfully! You can now login.");
                setOtpSent(false);
                setIsLogin(true);
                setFormData(prev => ({ ...prev, otp: "" }));
            } else {
                setError(response.message || "OTP verification failed");
                toast.error(response.message || "OTP verification failed");
            }
        } catch (error) {
            console.error("OTP verification error:", error);
            setError("Something went wrong. Please try again.");
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            password: "",
            photo: "",
            otp: "",
        });
        setError("");
        setOtpSent(false);
    };

    const switchMode = () => {
        setIsLogin(!isLogin);
        resetForm();
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="flex bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 w-full h-full max-h-5xl max-w-4xl">

                {/* Left Section */}
                <div className="w-1/2 bg-gray-50 flex flex-col justify-center items-center p-8 border-r border-gray-200">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-10 h-10 text-gray-600"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75V21h15V9.75"
                                />
                            </svg>
                        </div>

                        <div className="text-center">
                            <h2 className="text-lg font-semibold text-gray-800 mb-2">
                                {isLogin ? "Welcome Back" : "Join Monositi"}
                            </h2>
                            <ul className="text-gray-600 text-sm space-y-1">
                                <li>✓ Zero Brokerage</li>
                                <li>✓ Thousands of new listings daily</li>
                                <li>✓ 100 Cr+ Brokerage saved monthly</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="w-1/2 relative flex flex-col justify-center p-10">
                    <button
                        onClick={() => (window.location.href = "/")}
                        className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <h1 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                        {otpSent ? "Verify Your Email" : isLogin ? "Login to Continue" : "Create Your Account"}
                    </h1>

                    {otpSent ? (
                        // OTP Verification Form
                        <form onSubmit={handleVerifyOtp} className="space-y-5">
                            <p className="text-gray-600 text-sm text-center">
                                We've sent an OTP to your email:{" "}
                                <span className="font-medium text-[#f73c56]">{formData.email}</span>
                            </p>

                            <input
                                type="text"
                                name="otp"
                                placeholder="Enter 6-digit OTP"
                                value={formData.otp}
                                onChange={handleInputChange}
                                required
                                maxLength={6}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-red-500 text-center tracking-widest"
                            />

                            {error && <p className="text-center text-sm text-red-500">{error}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#f73c56] hover:bg-[#e9334e] text-white font-semibold py-2 rounded-lg transition disabled:opacity-60"
                            >
                                {loading ? "Verifying..." : "Verify Email"}
                            </button>

                            <button
                                type="button"
                                onClick={() => setOtpSent(false)}
                                className="w-full text-sm text-gray-600 hover:text-[#f73c56]"
                            >
                                ← Back to Registration
                            </button>
                        </form>
                    ) : isLogin ? (
                        // Login Form
                        <form onSubmit={handleLogin} className="space-y-5">
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter Email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-red-500"
                            />

                            <input
                                type="password"
                                name="password"
                                placeholder="Enter Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-red-500"
                            />

                            {error && <p className="text-center text-sm text-red-500">{error}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#f73c56] hover:bg-[#e9334e] text-white font-semibold py-2 rounded-lg transition disabled:opacity-60"
                            >
                                {loading ? "Logging in..." : "Continue"}
                            </button>
                        </form>
                    ) : (
                        // Registration Form
                        <form onSubmit={handleRegister} className="space-y-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-red-500"
                            />

                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-red-500"
                            />

                            <input
                                type="password"
                                name="password"
                                placeholder="Password (min 6 characters)"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                minLength={6}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-red-500"
                            />

                            <input
                                type="url"
                                name="photo"
                                placeholder="Profile Photo URL (Optional)"
                                value={formData.photo}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-red-500"
                            />

                            <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
                                <strong>Note:</strong> Your account will be created as a tenant by default.
                            </div>

                            {error && <p className="text-center text-sm text-red-500">{error}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#f73c56] hover:bg-[#e9334e] text-white font-semibold py-2 rounded-lg transition disabled:opacity-60"
                            >
                                {loading ? "Creating Account..." : "Create Account"}
                            </button>
                        </form>
                    )}

                    {!otpSent && (
                        <>
                            <p className="text-center text-xs text-gray-500 mt-4">
                                By continuing, you agree to our{" "}
                                <a href="#" className="text-[#f73c56] hover:underline font-medium">
                                    Terms & Conditions
                                </a>
                            </p>

                            <div className="border-t mt-6 pt-4 text-center text-sm">
                                {isLogin ? "Don't have an account? " : "Already have an account? "}
                                <button
                                    onClick={switchMode}
                                    className="text-[#f73c56] font-semibold hover:underline"
                                >
                                    {isLogin ? "Sign Up" : "Login"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}