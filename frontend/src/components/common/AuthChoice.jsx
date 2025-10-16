"use client";
import React from "react";
import { Phone, Mail, ArrowRight } from "lucide-react";

export default function AuthChoice() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border border-gray-200">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Monositi</h1>
                    <p className="text-gray-600">Choose your preferred login method</p>
                </div>

                <div className="space-y-4">
                    {/* Phone-based Auth (Recommended) */}
                    <div
                        onClick={() => window.location.href = "/auth"}
                        className="border-2 border-[#f73c56] rounded-lg p-6 cursor-pointer hover:bg-red-50 transition-colors group"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-[#f73c56] rounded-full flex items-center justify-center">
                                    <Phone className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">Phone Number</h3>
                                    <p className="text-sm text-gray-600">WhatsApp OTP verification</p>
                                    <div className="flex items-center mt-1">
                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                            Recommended
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#f73c56] transition-colors" />
                        </div>
                    </div>

                    {/* Email-based Auth (Legacy) */}
                    <div
                        onClick={() => window.location.href = "/login"}
                        className="border border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors group"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center">
                                    <Mail className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">Email Address</h3>
                                    <p className="text-sm text-gray-600">Traditional email login</p>
                                    <div className="flex items-center mt-1">
                                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                            Legacy
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-500 transition-colors" />
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-500">
                        By continuing, you agree to our{" "}
                        <a href="#" className="text-[#f73c56] hover:underline">
                            Terms & Conditions
                        </a>
                    </p>
                </div>

                <div className="mt-6 bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Why Phone Number?</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Faster WhatsApp OTP delivery</li>
                        <li>• No email verification needed</li>
                        <li>• One-step login/signup process</li>
                        <li>• Mobile-friendly experience</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}