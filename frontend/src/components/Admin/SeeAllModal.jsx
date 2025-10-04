import React, { useState } from "react";

const SeeAllModal = ({ isOpen, onClose, data, title, color, borderColor }) => {
  const isMulti =
    typeof data === "object" && !Array.isArray(data) && data !== null;
  const [activeView, setActiveView] = useState(isMulti ? "accepted" : "single");

  if (!isOpen) return null;

  let views = [];
  if (isMulti) {
    views = [
      {
        key: "accepted",
        title: "Listed Properties For Buying",
        color: "bg-green-100",
        borderColor: "border-green-200",
        data: data?.accepted || [],
      },
      {
        key: "pending",
        title: "Listing Pending",
        color: "bg-blue-100",
        borderColor: "border-blue-200",
        data: data?.pending || [],
      },
      {
        key: "rejected",
        title: "All Rejected Listing",
        color: "bg-red-100",
        borderColor: "border-red-200",
        data: data?.rejected || [],
      },
    ];
  } else if (Array.isArray(data)) {
    views = [
      {
        key: "single",
        title: title || "Listings",
        color: color || "bg-gray-100",
        borderColor: borderColor || "border-gray-200",
        data: data,
      },
    ];
  }

  const currentView = views.find((view) => view.key === activeView) || views[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {isMulti ? "Property Listings Overview" : currentView?.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* View Tabs (only for multi) */}
        {isMulti && (
          <div className="bg-gray-100 px-6 py-3 border-b">
            <div className="flex space-x-4">
              {views.map((view) => (
                <button
                  key={view.key}
                  onClick={() => setActiveView(view.key)}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    activeView === view.key
                      ? "bg-white text-gray-800 shadow-sm"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {view.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="mb-4">
            {!isMulti && (
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {currentView?.title}
              </h3>
            )}

            <div className="space-y-3">
              {currentView?.data?.length > 0 ? (
                currentView.data.map((item, index) => (
                  <div
                    key={item.id || index}
                    className={`flex justify-between items-center ${currentView.color} px-4 py-3 rounded-lg border ${currentView.borderColor} hover:shadow-sm transition-shadow`}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-800">
                        {item.id || index + 1}. {item.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Agent's Name: {item.agent}
                      </p>
                    </div>
                    <p className="text-sm text-gray-700 font-medium">
                      {item.uploadedOn
                        ? `Uploaded on: ${item.uploadedOn}`
                        : `Review Raised on: ${item.reviewRaised}`}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">
                    No {currentView?.title.toLowerCase()} available
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeeAllModal;
