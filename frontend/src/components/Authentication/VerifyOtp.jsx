import React, { useRef, useState } from "react";
import AuthLayout from "./AuthLayout";

const OTP_LENGTH = 6;

export default function VerifyOtp() {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const inputsRef = useRef([]);

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < OTP_LENGTH - 1) {
      inputsRef.current[i + 1]?.focus();
    }
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  };

  return (
    <AuthLayout image="https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1600">
      <div className="rounded-xl border border-gray-300 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8">
          <h1 className="text-xl font-semibold text-gray-900">Verify</h1>

          <p className="mt-4 text-sm text-gray-600">
            You'll receive a 4-digit verification code on XXXXXXXXXX , if you
            are registered with us
          </p>

          {/* OTP boxes */}
          <div className="mt-6 flex justify-between gap-2">
            {otp.map((d, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                type="tel"
                maxLength={1}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-10 h-12 border-b-2 border-gray-300 text-center text-xl focus:border-gray-900 outline-none"
              />
            ))}
          </div>

          <button
            type="button"
            className="mt-6 w-full rounded-full bg-theme-primary py-2 text-white font-medium hover:bg-red-700 transition"
          >
            Continue
          </button>

          <p className="mt-2 text-xs text-gray-400">
            You will receive OTP within{" "}
            <span className="text-theme-primary">2:00 min</span>
          </p>

          <div className="mt-4 text-sm text-gray-600">
            Did not get Verification Code ? <br />
            <div className="mt-2">
              <button className="text-blue-600 hover:underline">
                Resend Code
              </button>{" "}
              |{" "}
              <button className="text-blue-600 hover:underline">
                Verify on Call
              </button>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
