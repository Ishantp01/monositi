// import React, { useState } from "react";
// import AuthLayout from "../Authentication/AuthLayout";
// import apiRequest from "../../utils/api"; // common API handler
// import { toast } from "react-toastify";

// export default function SignUp() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // 👇 New API structure (no role)
//       const response = await apiRequest("/users/register", "POST", {
//         name,
//         email,
//         password,
//       });

//       if (
//         response.success ||
//         response.message === "User registered successfully"
//       ) {
//         toast.success("🎉 Registration successful! Welcome to Monositi!", {
//           position: "top-right",
//           autoClose: 2500,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//         });

//         // redirect after short delay
//         setTimeout(() => (window.location.href = "/login"), 2000);
//       } else {
//         toast.error(`❌ ${response.message || "Signup failed!"}`, {
//           position: "top-right",
//           autoClose: 4000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//         });
//       }
//     } catch (err) {
//       console.error("Signup Error:", err);
//       toast.error("❌ Server error. Please try again later.", {
//         position: "top-right",
//         autoClose: 4000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AuthLayout image="https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1600">
//       <div className="rounded-xl border border-gray-300 shadow-sm overflow-hidden">
//         <div className="p-6 sm:p-8">
//           <h1 className="text-xl font-semibold text-gray-900 mb-4">Sign Up</h1>

//           {/* Form */}
//           <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
//             <input
//               type="text"
//               placeholder="Full Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//               className="w-full border-b border-gray-300 focus:border-gray-900 outline-none py-2 text-sm"
//             />

//             <input
//               type="email"
//               placeholder="Email Address"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full border-b border-gray-300 focus:border-gray-900 outline-none py-2 text-sm"
//             />

//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 className="w-full border-b border-gray-300 focus:border-gray-900 outline-none py-2 text-sm pr-12"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-0 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500"
//               >
//                 {showPassword ? "HIDE" : "SHOW"}
//               </button>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full rounded-full bg-theme-primary py-2 text-white font-medium hover:bg-red-700 transition disabled:opacity-60"
//             >
//               {loading ? "Creating Account..." : "Sign Up"}
//             </button>
//           </form>
//         </div>

//         <div className="bg-[#E0E0E0] p-4 md:py-8 text-center text-sm">
//           Already have an account?{" "}
//           <a href="/login" className="text-theme-primary font-semibold">
//             Login
//           </a>
//         </div>
//       </div>
//     </AuthLayout>
//   );
// }


"use client";
import { useState } from "react";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    photo: "",
    otp: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!formData.email) return alert("Please enter your email first!");
    setOtpSent(true);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (formData.otp === "1234") {
      setIsVerified(true);
      alert("✅ OTP Verified! You are signed up successfully.");
    } else {
      alert("❌ Invalid OTP. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 gap-0">

        {/* LEFT SIDE */}
        <div className="w-1/2 bg-gray-50 px-16 py-10 flex flex-col justify-center items-start">
          <img
            src="https://cdn-icons-png.flaticon.com/512/6195/6195699.png"
            alt="Signup Illustration"
            className="w-32 h-32 mb-6"
          />
          <h2 className="text-2xl font-semibold mb-2">Create Your Account</h2>
          <ul className="text-gray-600 space-y-2">
            <li>✔ Access exclusive features</li>
            <li>✔ Manage your listings easily</li>
            <li>✔ Secure and verified user access</li>
          </ul>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-1/2 px-10 py-10 flex flex-col justify-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            {otpSent ? "Verify OTP" : "Sign Up to Continue"}
          </h2>

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-5">

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                >
                  <option value="user">User</option>
                  <option value="tenant">Tenant</option>
                  <option value="serviceProvider">Service Provider</option>
                  <option value="admin">Admin</option>
                  <option value="monositi-tenant">Monositi Tenant</option>
                </select>
              </div>

             {/* Photo */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Profile Photo
  </label>
  <div className="relative">
    <input
      type="file"
      name="photo"
      onChange={(e) =>
        setFormData({ ...formData, photo: e.target.files[0] })
      }
      className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 px-4 text-gray-700 cursor-pointer transition-all duration-300
                 hover:border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
    />
    {/* Optional: display selected file name */}
    {formData.photo && (
      <p className="mt-1 text-sm text-gray-600">
        Selected file: {formData.photo.name}
      </p>
    )}
  </div>
</div>



              <button
                type="submit"
                className="w-full bg-[#f73c56] hover:bg-[#e9334e] text-white py-3 rounded-lg transition-all duration-300"
              >
                Send OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <p className="text-gray-600 text-sm text-center">
                We’ve sent an OTP to your email:{" "}
                <span className="font-medium text-[#f73c56]">{formData.email}</span>
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter OTP
                </label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Enter the 4-digit code"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none text-center tracking-widest"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#f73c56] hover:bg-[#e9334e] text-white py-3 rounded-lg transition-all duration-300"
              >
                Verify & Sign Up
              </button>

              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full text-sm text-gray-600 hover:text-[#f73c56]"
              >
                ← Edit Details
              </button>
            </form>
          )}

          <p className="text-xs text-center text-gray-500 mt-4">
            By continuing, you agree to our{" "}
            <a href="#" className="text-[#f73c56] font-medium">
              Terms & Conditions
            </a>
          </p>

          <div className="border-t mt-6 pt-4 text-center text-sm">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-[#f73c56] font-semibold hover:underline"
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
