import React, { useState } from "react";

const ServiceRequestPage = () => {
  // Dummy service providers data (simulating your backend model)
  const dummyProviders = [
    {
      _id: "1",
      category: "Plumbing",
      description: "Fix leaking taps, install pipes, and more.",
      tags: ["leak", "pipe", "bathroom"],
      photo: "https://via.placeholder.com/100",
      verified: true,
      isPremium: false,
      completedJobsCount: 25,
      ratings: [4, 5, 5, 3, 4],
    },
    {
      _id: "2",
      category: "Electrician",
      description: "Home wiring, lighting, and appliance repair.",
      tags: ["wiring", "fan", "switch"],
      photo: "https://via.placeholder.com/100",
      verified: true,
      isPremium: true,
      completedJobsCount: 40,
      ratings: [5, 5, 4, 5, 5],
    },
  ];

  // Form state
  const [selectedService, setSelectedService] = useState(null);
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedService) {
      alert("Please select a service provider");
      return;
    }

    // Mock request object (as per backend model)
    const mockRequest = {
      tenant: "dummyTenantId123",
      serviceProvider: selectedService._id,
      serviceCategory: selectedService.category,
      description,
      photosBefore: photo ? [photo.name] : [],
      status: "Requested",
    };

    console.log("📦 Mock Request Submitted:", mockRequest);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        🏠 Tenant Service Request Portal
      </h1>

      {/* SERVICE PROVIDER SELECTION */}
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-5 mb-8">
        <h2 className="text-xl font-semibold mb-4">Browse Service Providers</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {dummyProviders.map((sp) => (
            <div
              key={sp._id}
              onClick={() => setSelectedService(sp)}
              className={`cursor-pointer border rounded-lg p-4 flex items-center gap-3 hover:bg-blue-50 transition ${
                selectedService?._id === sp._id
                  ? "border-blue-500 bg-blue-100"
                  : "border-gray-300"
              }`}
            >
              <img
                src={sp.photo}
                alt={sp.category}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">{sp.category}</h3>
                <p className="text-sm text-gray-600">{sp.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  ✅ {sp.completedJobsCount} jobs done
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SERVICE REQUEST FORM */}
      {selectedService && !submitted && (
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-5"
        >
          <h2 className="text-xl font-semibold mb-4">
            Submit Service Request — {selectedService.category}
          </h2>

          <label className="block mb-2 font-medium">Job Description</label>
          <textarea
            className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-blue-500"
            rows="3"
            placeholder="Describe your issue or requirement..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>

          <label className="block mb-2 font-medium">Upload Photo (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="mb-4"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
          >
            Submit Request
          </button>
        </form>
      )}

      {/* SUCCESS MESSAGE */}
      {submitted && (
        <div className="w-full max-w-3xl bg-green-100 border border-green-400 text-green-800 p-4 rounded-md text-center">
          🎉 Your service request has been submitted successfully!
        </div>
      )}
    </div>
  );
};

export default ServiceRequestPage;
