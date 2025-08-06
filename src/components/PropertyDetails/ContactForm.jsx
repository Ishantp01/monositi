import React from "react";

const ContactForm = () => {
  return (
    <div className="bg-gray-100 rounded-xl shadow-md p-5 w-full max-w-md mx-auto md:mx-0">
      <div className="text-2xl text-red-500 font-semibold mb-3">
        Looking for a house in <br className="md:hidden" />
        Amrutha Platinum Tower ?
      </div>
      <form className="space-y-3">
        <input
          type="text"
          placeholder="Name"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <input
          type="email"
          placeholder="E-mail"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <div className="flex gap-2">
          <select className="w-1/3 border border-gray-300 rounded px-2 py-2 text-sm focus:outline-none">
            <option value="+91">IND +91</option>
            {/* You can add more country codes here */}
          </select>
          <input
            type="tel"
            placeholder="Mobile Number"
            className="w-2/3 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm transition"
        >
          Verify NO.
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
