"use client";
import React, { useState } from "react";
import { X, Phone, User, Mail } from "lucide-react";
import { toast } from "react-toastify";
import apiRequest from "../../utils/api";

export default function UnifiedPhoneAuth() {
    const [step, setStep] = useState("phone"); // "phone", "otp", "profile"
    const [formData, setFormData] = useState({
        phone: "",
        otp: "",
        name: "",
        email: "",
        role: "tenant"
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isNewUser, setIsNewUser] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(""); // Clear error when user types
    };

    const formatPhoneNumber = (phone) => {
        // Ensure phone starts with +91 for India
        if (phone.startsWith("+91")) return phone;
        if (phone.startsWith("91")) return "+" + phone;
        if (phone.startsWith("0")) return "+91" + phone.slice(1);
        return "+91" + phone;
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const formattedPhone = formatPhoneNumber(formData.phone);

            const response = await apiRequest("/users/send-otp", "POST", {
                phone: formattedPhone,
            });

            if (response.success) {
                setFormData(prev => ({ ...prev, phone: formattedPhone }));
                setStep("otp");
                toast.success("OTP sent to your WhatsApp!");
            } else {
                setError(response.message || "Failed to send OTP");
                toast.error(response.message || "Failed to send OTP");
            }
        } catch (error) {
            console.error("Send OTP error:", error);
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
            const response = await apiRequest("/users/verify-otp", "POST", {
                phone: formData.phone,
                otp: formData.otp,
            });

            if (response.success) {
                // Store token and user data
                localStorage.setItem("token", response.token);
                localStorage.setItem("user", JSON.stringify(response.user));
                localStorage.setItem("role", JSON.stringify(response.user.role));

                // Check if user has complete profile
                if (!response.user.name || !response.user.email) {
                    setIsNewUser(true);
                    setStep("profile");
                    toast.success("OTP verified! Please complete your profile.");
                } else {
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
                }
            } else {
                setError(response.message || "Invalid OTP");
                toast.error(response.message || "Invalid OTP");
            }
        } catch (error) {
            console.error("Verify OTP error:", error);
            setError("Something went wrong. Please try again.");
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await apiRequest("/users/update-profile", "PUT", {
                name: formData.name,
                email: formData.email,
            });

            if (response.message) {
                toast.success("Profile completed successfully!");
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
                setError("Failed to update profile");
                toast.error("Failed to update profile");
            }
        } catch (error) {
            console.error("Update profile error:", error);
            setError("Something went wrong. Please try again.");
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        if (step === "otp") {
            setStep("phone");
            setFormData(prev => ({ ...prev, otp: "" }));
        } else if (step === "profile") {
            setStep("otp");
        }
        setError("");
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
                                {step === "phone" ? "Login / Sign Up" :
                                    step === "otp" ? "Verify OTP" : "Complete Profile"}
                            </h2>
                            <ul className="text-gray-600 text-sm space-y-1">
                                <li>✓ Zero Brokerage</li>
                                <li>✓ Thousands of new listings daily</li>
                                <li>✓ 100 Cr+ Brokerage saved monthly</li>
                                <li>✓ WhatsApp OTP verification</li>
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

                    {step === "phone" && (
                        <>
                            <h1 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                                Enter your phone number
                            </h1>

                            <form onSubmit={handleSendOtp} className="space-y-5">
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Enter your phone number"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-2 text-sm focus:outline-none focus:border-red-500"
                                    />
                                </div>

                                <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
                                    <strong>Note:</strong> We'll send a 6-digit OTP to your WhatsApp.
                                    New users will be registered automatically as tenants.
                                </div>

                                {error && <p className="text-center text-sm text-red-500">{error}</p>}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#f73c56] hover:bg-[#e9334e] text-white font-semibold py-2 rounded-lg transition disabled:opacity-60"
                                >
                                    {loading ? "Sending OTP..." : "Send OTP"}
                                </button>
                            </form>
                        </>
                    )}

                    {step === "otp" && (
                        <>
                            <h1 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                                Verify OTP
                            </h1>

                            <form onSubmit={handleVerifyOtp} className="space-y-5">
                                <p className="text-gray-600 text-sm text-center">
                                    We've sent a 6-digit OTP to your WhatsApp:{" "}
                                    <span className="font-medium text-[#f73c56]">{formData.phone}</span>
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
                                    {loading ? "Verifying..." : "Verify OTP"}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="w-full text-sm text-gray-600 hover:text-[#f73c56]"
                                >
                                    ← Change Phone Number
                                </button>
                            </form>
                        </>
                    )}

                    {step === "profile" && (
                        <>
                            <h1 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                                Complete Your Profile
                            </h1>

                            <form onSubmit={handleCompleteProfile} className="space-y-5">
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-2 text-sm focus:outline-none focus:border-red-500"
                                    />
                                </div>

                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email address"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-2 text-sm focus:outline-none focus:border-red-500"
                                    />
                                </div>

                                <div className="text-xs text-gray-600 bg-green-50 p-3 rounded-lg">
                                    <strong>Welcome!</strong> Your account has been created as a tenant.
                                    You can change your role later from your profile settings.
                                </div>

                                {error && <p className="text-center text-sm text-red-500">{error}</p>}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#f73c56] hover:bg-[#e9334e] text-white font-semibold py-2 rounded-lg transition disabled:opacity-60"
                                >
                                    {loading ? "Completing..." : "Complete Profile"}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="w-full text-sm text-gray-600 hover:text-[#f73c56]"
                                >
                                    ← Back
                                </button>
                            </form>
                        </>
                    )}

                    <p className="text-center text-xs text-gray-500 mt-6">
                        By continuing, you agree to our{" "}
                        <a href="#" className="text-[#f73c56] hover:underline font-medium">
                            Terms & Conditions
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}