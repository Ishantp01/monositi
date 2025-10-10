// import React, { useState } from "react";
// import AuthLayout from "../Authentication/AuthLayout";
// import apiRequest from "../../utils/api"; // Common API handler
// import { toast } from "react-toastify";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Handle login form submission
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const response = await apiRequest("/users/login", "POST", {
//         email,
//         password,
//       });

//       // 🔹 Handle forbidden (email not verified)
//       if (
//         response.status === 403 ||
//         response.message?.includes("Email not verified")
//       ) {
//         toast.warning("Email not verified. Please check your inbox.", {
//           position: "top-right",
//           autoClose: 4000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//         });
//         setLoading(false);
//         return;
//       }

//       if (response.success) {
//         // Save token or user details in localStorage
//         localStorage.setItem("token", response.token);
//         localStorage.setItem("role", JSON.stringify(response.user.role));
//         localStorage.setItem("user", JSON.stringify(response.user));

//         // Success notification
//         toast.success("🎉 Welcome back! Login successful!", {
//           position: "top-right",
//           autoClose: 2000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//         });

//         // Redirect after a short delay
//         setTimeout(() => {
//           const redirectUrl = localStorage.getItem("redirectAfterLogin");
//           if (redirectUrl) {
//             localStorage.removeItem("redirectAfterLogin");
//             window.location.href = redirectUrl;
//           } else {
//             window.location.href = "/";
//           }
//         }, 1500);
//       } else {
//         setError(response.message || "Invalid credentials.");
//       }
//     } catch (err) {
//       console.error("Login Error:", err);
//       // Display more specific error messages
//       if (
//         err.message.includes("Server not available") ||
//         err.message.includes("Network error")
//       ) {
//         setError("Backend server is not running. Please contact support.");
//         toast.error("Server connection error. Please try again later.", {
//           position: "top-right",
//           autoClose: 4000,
//         });
//       } else {
//         setError(err.message || "Something went wrong. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AuthLayout image="https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1600">
//       <div className="rounded-xl border border-gray-300 shadow-sm overflow-hidden">
//         <div className="p-6 sm:p-8">
//           <h1 className="text-xl uppercase font-bold text-gray-900 mb-4 text-center">
//             Login
//           </h1>

//           <form className="mt-6 space-y-6" onSubmit={handleLogin}>
//             <input
//               type="email"
//               placeholder="Enter Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full border-b border-gray-300 focus:border-gray-900 outline-none py-2 text-sm"
//             />

//             <input
//               type="password"
//               placeholder="Enter Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="w-full border-b border-gray-300 focus:border-gray-900 outline-none py-2 text-sm"
//             />

//             {error && (
//               <p className="text-red-500 text-sm text-center">{error}</p>
//             )}

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full rounded-full bg-theme-primary py-2 text-white font-medium hover:bg-red-700 transition disabled:opacity-60"
//             >
//               {loading ? "Logging in..." : "Login"}
//             </button>

//             <div className="text-right text-xs text-gray-400 cursor-pointer hover:underline">
//               Forgot Password?
//             </div>
//           </form>
//         </div>

//         <div className="bg-[#E0E0E0] p-4 md:py-8 text-center text-sm">
//           Don’t have an account?{" "}
//           <a href="/signup" className="text-theme-primary font-semibold">
//             Sign Up
//           </a>
//         </div>
//       </div>
//     </AuthLayout>
//   );
// }


"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import apiRequest from "../../utils/api";
import { X } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiRequest("/users/login", "POST", {
        email,
        password,
      });

      if (
        response.status === 403 ||
        response.message?.includes("Email not verified")
      ) {
        toast.warning("Email not verified. Please check your inbox.");
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

  return (
    <div className="flex items-center justify-center   min-h-screen bg-gray-50">
      {/* Centered Wrapper */}
      <div className="flex bg-white rounded-2xl h-80% shadow-lg overflow-hidden border border-gray-200 w-full h-full max-h-5xl max-w-4xl">
        {/* Left Section */}
        <div className="w-1/2 bg-gray-50 flex flex-col justify-center items-center p-8 border-r border-gray-200">
          <div className="flex flex-col items-center space-y-4">
            {/* Simple illustration */}
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

            {/* Text content */}
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Login / Sign up
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
          {/* Close Button */}
          <button
            onClick={() => (window.location.href = "/")}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          >
            <X className="w-5 h-5" />
          </button>

          <h1 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            Enter your details to continue
          </h1>

          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-red-500"
            />

            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-red-500"
            />

            {error && (
              <p className="text-center text-sm text-red-500">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#f73c56] hover:bg-[#e9334e] text-white font-semibold py-2 rounded-lg transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Continue"}
            </button>

            <p className="text-center text-xs text-gray-500 mt-2">
              By continuing, you agree to our{" "}
              <a
                href="#"
                className="text-[#f73c56] hover:underline font-medium"
              >
                Terms & Conditions
              </a>
            </p>
          </form>

          <div className="border-t mt-6 pt-4 text-center text-sm">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-[#f73c56] font-semibold hover:underline"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
