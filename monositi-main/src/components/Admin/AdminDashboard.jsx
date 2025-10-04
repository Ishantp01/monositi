import React, { useState } from "react";
import SeeAllModal from "./SeeAllModal";

// Dummy JSON data (replace with API later)
const recentlyUploaded = [
  {
    id: 1,
    title: "Shree Sai PG ,Rajeev Gandhi Chouk, Jabalpur",
    agent: "Rajeev Shingh",
    uploadedOn: "2nd July 2025",
  },
  {
    id: 2,
    title: "Office Space , Rai Ganj ,Jabalpur",
    agent: "Rajeev Shingh",
    uploadedOn: "2nd July 2025",
  },
  {
    id: 3,
    title: "Office Space , Rai Ganj ,Jabalpur",
    agent: "Rajeev Shingh",
    uploadedOn: "2nd July 2025",
  },
  {
    id: 4,
    title: "Office Space , Rai Ganj ,Jabalpur",
    agent: "Rajeev Shingh",
    uploadedOn: "2nd July 2025",
  },
];

const propertiesForReview = [
  {
    id: 1,
    title: "Shree Sai PG ,Rajeev Gandhi Chouk, Jabalpur",
    agent: "Rajeev Shingh",
    reviewRaised: "2nd July 2025",
  },
  {
    id: 2,
    title: "Office Space , Rai Ganj ,Jabalpur",
    agent: "Rajeev Shingh",
    reviewRaised: "2nd July 2025",
  },
  {
    id: 3,
    title: "Shree Sai PG ,Rajeev Gandhi Chouk, Jabalpur",
    agent: "Rajeev Shingh",
    reviewRaised: "2nd July 2025",
  },
  {
    id: 4,
    title: "Office Space , Rai Ganj ,Jabalpur",
    agent: "Rajeev Shingh",
    reviewRaised: "2nd July 2025",
  },
];
const RejectedReview = [
  {
    id: 1,
    title: "Shree Sai PG ,Rajeev Gandhi Chouk, Jabalpur",
    agent: "Rajeev Shingh",
    reviewRaised: "2nd July 2025",
  },
  {
    id: 2,
    title: "Office Space , Rai Ganj ,Jabalpur",
    agent: "Rajeev Shingh",
    reviewRaised: "2nd July 2025",
  },
  {
    id: 3,
    title: "Shree Sai PG ,Rajeev Gandhi Chouk, Jabalpur",
    agent: "Rajeev Shingh",
    reviewRaised: "2nd July 2025",
  },
  {
    id: 4,
    title: "Office Space , Rai Ganj ,Jabalpur",
    agent: "Rajeev Shingh",
    reviewRaised: "2nd July 2025",
  },
];
const listedAgents = [
  { id: 1, name: "Rajeev Singh", rating: 4.2 },
  { id: 2, name: "Rajeev Singh", rating: 4.2 },
  { id: 3, name: "Rajeev Singh", rating: 4.2 },
  { id: 4, name: "Rajeev Singh", rating: 4.2 },
  { id: 5, name: "Rajeev Singh", rating: 4.2 },
  { id: 6, name: "Rajeev Singh", rating: 4.2 },
  { id: 7, name: "Rajeev Singh", rating: 4.2 },
];

const AdminDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProps, setModalProps] = useState(null);

  const handleSeeAll = (section) => {
    let props;
    if (section === "recently") {
      props = {
        data: recentlyUploaded,
        title: "Recently Uploaded",
        color: "bg-blue-100",
        borderColor: "border-blue-200",
      };
    } else if (section === "review") {
      props = {
        data: propertiesForReview,
        title: "Properties For Review",
        color: "bg-green-100",
        borderColor: "border-green-200",
      };
    } else if (section === "rejected") {
      props = {
        data: RejectedReview,
        title: "Rejected Properties",
        color: "bg-red-100",
        borderColor: "border-red-200",
      };
    }
    setModalProps(props);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalProps(null);
  };

  return (
    <div className="bg-red-50 min-h-screen p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recently Uploaded */}
          <div className="bg-white rounded-lg shadow-sm border p-10">
            <h2 className="text-lg font-semibold mb-4">Recently Uploaded</h2>
            <div className="space-y-3">
              {recentlyUploaded.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-blue-100 px-3 py-2 rounded-md"
                >
                  <div>
                    <p className="font-medium text-sm">
                      {item.id}.{item.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      Agent's Name : {item.agent}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700">
                    Uploaded on : {item.uploadedOn}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-3 text-center">
              <button
                onClick={() => handleSeeAll("recently")}
                className="text-red-500 text-sm font-medium hover:underline"
              >
                See All →
              </button>
            </div>
          </div>

          {/* Properties For Review */}
          <div className="bg-white rounded-lg shadow-sm border p-10">
            <h2 className="text-lg font-semibold mb-4">
              Properties For Review
            </h2>
            <div className="space-y-3">
              {propertiesForReview.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-green-100 px-3 py-2 rounded-md"
                >
                  <div>
                    <p className="font-medium text-sm">
                      {item.id}.{item.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      Agent's Name : {item.agent}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700">
                    Review Raised on : {item.reviewRaised}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-3 text-center">
              <button
                onClick={() => handleSeeAll("review")}
                className="text-red-500 text-sm font-medium hover:underline"
              >
                See All →
              </button>
            </div>
          </div>

          {/* Rejected Review */}
          <div className="bg-white rounded-lg shadow-sm border p-10">
            <h2 className="text-lg font-semibold mb-4">Rejected Properties</h2>
            <div className="space-y-3">
              {RejectedReview.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-red-100 px-3 py-2 rounded-md"
                >
                  <div>
                    <p className="font-medium text-sm">
                      {item.id}.{item.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      Agent's Name : {item.agent}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700">
                    Review Raised on : {item.reviewRaised}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-3 text-center">
              <button
                onClick={() => handleSeeAll("rejected")}
                className="text-red-500 text-sm font-medium hover:underline"
              >
                See All →
              </button>
            </div>
          </div>
        </div>

        {/* Right Section (Agents) */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h2 className="text-lg font-semibold mb-4">All Listed Agents</h2>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {listedAgents.map((agent) => (
              <div
                key={agent.id}
                className="flex items-center space-x-3 bg-gray-100 p-2 rounded-md"
              >
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt={agent.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium">
                    Agent Name: {agent.name}
                  </p>
                  <p className="text-xs text-gray-600">⭐ {agent.rating}/5.0</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-center border-t pt-2">
            <button className="text-red-500 text-sm font-medium hover:underline">
              See All →
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <SeeAllModal isOpen={isModalOpen} onClose={closeModal} {...modalProps} />
    </div>
  );
};

export default AdminDashboard;
