import React, { useState } from "react";
import AuthLayout from "./AuthLayout";


const ROLES = ["Buyer /Owner", "Tenant", "Builder"];

export default function SignUp() {
    const [role, setRole] = useState(ROLES[0]);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <AuthLayout image="https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1600">
                <div className="rounded-xl border border-gray-300 shadow-sm overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <h1 className="text-xl font-semibold text-gray-900">Sign Up</h1>

                        {/* Role selector */}
                        <p className="mt-4 text-sm text-gray-700">I Am</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {ROLES.map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setRole(r)}
                                    className={`px-3 py-1 rounded-full border text-sm font-semibold transition ${role === r
                                        ? "bg-[#339989]/20 text-black border-[#339989]"
                                        : "border-gray-300 text-gray-700 hover:bg-gray-100"
                                        }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>

                        {/* Form */}
                        <form className="mt-6 space-y-5">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    className="w-full border-b border-gray-300 focus:border-gray-900 outline-none py-2 text-sm"
                                />
                            </div>

                            <div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full border-b border-gray-300 focus:border-gray-900 outline-none py-2 text-sm"
                                />
                            </div>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
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

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    defaultValue="IND +91"
                                    readOnly
                                    className="w-24 border-b border-gray-300 bg-transparent outline-none py-2 text-sm"
                                />
                                <input
                                    type="tel"
                                    placeholder="Mobile Number"
                                    className="flex-1 border-b border-gray-300 focus:border-gray-900 outline-none py-2 text-sm"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full rounded-full bg-theme-primary py-2 text-white font-medium hover:bg-red-700 transition"
                            >
                                Sign Up
                            </button>
                        </form>
                    </div>

                    <div className="bg-[#E0E0E0] p-4 md:py-8 text-center text-sm">
                        Already Have Account?{" "}
                        <a href="/login" className="text-theme-primary font-semibold">
                            Login
                        </a>
                    </div>
                </div>
            </AuthLayout>
        </>
    );
}
