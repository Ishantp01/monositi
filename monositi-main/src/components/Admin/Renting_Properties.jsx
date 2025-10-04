import React, { useState } from "react";
import AdminNavbar from "./AdminNavbar";
import SeeAllModal from "./SeeAllModal";

const data = {
  accepted: [
    {
      id: 1,
      title: "Shree Sai PG ,Rajeev Gandhi Chouk, Jabalpur",
      agent: "Rajeev Singh",
      uploadedOn: "2nd July 2025",
    },
    {
      id: 2,
      title: "Shree Sai PG ,Rajeev Gandhi Chouk, Jabalpur",
      agent: "Rajeev Singh",
      uploadedOn: "2nd July 2025",
    },
    {
      id: 3,
      title: "Shree Sai PG ,Rajeev Gandhi Chouk, Jabalpur",
      agent: "Rajeev Singh",
      uploadedOn: "2nd July 2025",
    },
    {
      id: 4,
      title: "Shree Sai PG ,Rajeev Gandhi Chouk, Jabalpur",
      agent: "Rajeev Singh",
      uploadedOn: "2nd July 2025",
    },
  ],
  pending: [
    {
      id: 1,
      title: "Shree Sai PG ,Rajeev Gandhi Chouk, Jabalpur",
      agent: "Rajeev Shingh",
      uploadedOn: "2nd July 2025",
    },
    {
      id: 2,
      title: "Shree Sai PG ,Rajeev Gandhi Chouk, Jabalpur",
      agent: "Rajeev Shingh",
      uploadedOn: "2nd July 2025",
    },
    {
      id: 3,
      title: "Shree Sai PG ,Rajeev Gandhi Chouk, Jabalpur",
      agent: "Rajeev Shingh",
      uploadedOn: "2nd July 2025",
    },
    {
      id: 4,
      title: "Shree Sai PG ,Rajeev Gandhi Chouk, Jabalpur",
      agent: "Rajeev Shingh",
      uploadedOn: "2nd July 2025",
    },
  ],
  rejected: [
    {
      id: 1,
      title: "Shrei PG ,Rajeev Gandhi Chouk, Jabalpur",
      agent: "Rajeev Shingh",
      uploadedOn: "2nd July 2025",
    },
    {
      id: 2,
      title: "Shree Sai PG ,Rajeev Gandhi Chouk, Jabalpur",
      agent: "Rajeev Shingh",
      uploadedOn: "22nd July 2025",
    },
    {
      id: 3,
      title: "Shree Sai PG ,Rajeev Gandhi Chouk, Jabalpur",
      agent: "Rajeev Shingh",
      uploadedOn: "22nd July 2025",
    },
    {
      id: 4,
      title: "Shree Sai PG ,Rajeev Gandhi Chouk, Jabalpur",
      agent: "Rajeev Shingh",
      uploadedOn: "22nd July 2025",
    },
  ],
};

const Renting_Properties = () => {
  const [activeTab, setActiveTab] = useState("accepted");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProps, setModalProps] = useState(null);

  const handleSeeAll = () => {
    let singleTitle, singleColor, singleBorderColor;
    if (activeTab === "accepted") {
      singleTitle = "Listed Properties For Buying";
      singleColor = "bg-green-100";
      singleBorderColor = "border-green-200";
    } else if (activeTab === "pending") {
      singleTitle = "All Listing Pending";
      singleColor = "bg-blue-100";
      singleBorderColor = "border-blue-200";
    } else {
      singleTitle = "All Listing Rejected";
      singleColor = "bg-red-100";
      singleBorderColor = "border-red-200";
    }
    setModalProps({
      data: data[activeTab],
      title: singleTitle,
      color: singleColor,
      borderColor: singleBorderColor,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalProps(null);
  };

  const tabConfig = [
    {
      key: "accepted",
      label: "Listing Requests Accepted →",
      color: "bg-green-500",
    },
    {
      key: "pending",
      label: "Listing Requests Pending →",
      color: "bg-blue-500",
    },
    {
      key: "rejected",
      label: "Listing Requests Rejected →",
      color: "bg-red-500",
    },
  ];

  return (
    <>
      <AdminNavbar />
      <div className="bg-red-50 min-h-screen p-4 md:p-8">
        {/* Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {tabConfig.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`text-white font-medium py-3 rounded-md shadow-md transition text-center 
                ${tab.color} ${
                activeTab === tab.key
                  ? "scale-105 ring-2 ring-offset-2 ring-gray-200"
                  : ""
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Listing Section */}
        <div className="bg-white rounded-lg shadow-sm border p-10">
          <h2 className="text-lg font-semibold mb-4">
            {activeTab === "accepted"
              ? "Listed Properties For Buying"
              : activeTab === "pending"
              ? "All Listing Pending"
              : "All Listing Rejected"}
          </h2>

          <div className="space-y-3">
            {data[activeTab].length > 0 ? (
              data[activeTab].map((item) => (
                <div
                  key={item.id}
                  className={`flex flex-col md:flex-row justify-between items-start md:items-center px-3 py-2 rounded-md 
                    ${
                      activeTab === "accepted"
                        ? "bg-green-100"
                        : activeTab === "pending"
                        ? "bg-blue-100"
                        : "bg-red-100"
                    }`}
                >
                  <div>
                    <p className="font-medium text-sm">
                      {item.id}. {item.title}
                    </p>
                    <p className="text-xs text-gray-600">
                      Agent's Name : {item.agent}
                    </p>
                  </div>
                  <p className="text-xs text-gray-700 mt-1 md:mt-0">
                    Uploaded on : {item.uploadedOn}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 text-sm">
                No {activeTab} listings available
              </p>
            )}
          </div>

          <div className="mt-3 text-center border-t pt-2">
            <button
              onClick={handleSeeAll}
              className="text-red-500 text-sm font-medium hover:underline"
            >
              See All →
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <SeeAllModal isOpen={isModalOpen} onClose={closeModal} {...modalProps} />
    </>
  );
};

export default Renting_Properties;
