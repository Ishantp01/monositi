import React, { useState } from "react";
import AuthLayout from "./AuthLayout";

const ROLES = ["Buyer /Owner", "Builder"];

export default function Login() {
  const [role, setRole] = useState(ROLES[0]);

  return (
    <AuthLayout image="https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1600">
      <div className="rounded-xl border border-gray-300 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">Login</h1>

          <p className="mt-4 text-sm text-gray-700">Are You</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {ROLES.map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`px-3 py-1 rounded-full border text-sm transition font-semibold ${
                  role === r
                    ? "bg-[#339989]/20 text-black border-[#339989]"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <form className="mt-6 space-y-6">
            <input
              type="tel"
              placeholder="Enter Mobile No."
              className="w-full border-b border-gray-300 focus:border-gray-900 outline-none py-2 text-sm"
            />

            <button
              type="submit"
              className="w-full rounded-full bg-theme-primary py-2 text-white font-medium hover:bg-red-700 transition"
            >
              Next
            </button>

            <div className="text-right text-xs text-gray-400">Need Help ?</div>

            {/* Divider */}
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="h-px flex-1 bg-gray-200" />
              <span>Or login using</span>
              <span className="h-px flex-1 bg-gray-200" />
            </div>

            <button
              type="button"
              className="mx-auto flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm hover:bg-gray-50"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="google"
                className="w-4 h-4"
              />
              Google
            </button>
          </form>
        </div>

        <div className="bg-[#E0E0E0] p-4 md:py-8 text-center text-sm">
          Don’t have an account ?{" "}
          <a href="/signup" className="text-theme-primary font-semibold">
            Sign Up
          </a>
        </div>
      </div>
    </AuthLayout>
  );
}
