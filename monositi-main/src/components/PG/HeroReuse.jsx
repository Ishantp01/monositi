import React from "react";
import OutlineButton from "../MoreButton";

function HeroReuse() {
  return (
    <section className="bg-[#FFFFFF] relative mx-auto max-w-[90%] py-6 p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Images */}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <div className="h-60 bg-gray-300 rounded-lg flex items-center justify-center">
              Main Image
            </div>
          </div>
          <div className="h-28 bg-gray-300 rounded-lg"></div>
          <div className="h-28 bg-gray-300 rounded-lg"></div>
          <div className="h-28 bg-gray-300 rounded-lg flex items-center justify-center">
            +10 Photos
          </div>
        </div>

        {/* Right Content */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <h1 className="text-black text-2xl font-semibold mb-2">
              Zolo Clayton, Hsr Layout, Bangalore
            </h1>

            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.993 13.4542C14.3663 13.4542 13.7812 13.6622 13.3633 14.0784L7.38844 10.6245C7.43027 10.4163 7.47211 10.2497 7.47211 10.0417C7.47211 9.83355 7.43027 9.66695 7.38844 9.45891L13.2801 6.0468C13.7395 6.46293 14.3246 6.71246 14.993 6.71246C16.3718 6.71246 17.5 5.58879 17.5 4.21559C17.5 2.84246 16.3718 1.71875 14.993 1.71875C13.6143 1.71875 12.4861 2.84246 12.4861 4.21562C12.4861 4.42371 12.5277 4.59035 12.5697 4.7984L6.67828 8.21051C6.21863 7.79434 5.63371 7.54484 4.96516 7.54484C3.58641 7.54484 2.5 8.66852 2.5 10.0417C2.5 11.4149 3.62801 12.5386 5.00695 12.5386C5.67551 12.5386 6.26043 12.289 6.72008 11.8729L12.6533 15.3268C12.6113 15.493 12.5697 15.6597 12.5697 15.8677C12.5697 17.1995 13.6559 18.2813 14.993 18.2813C16.3301 18.2813 17.4163 17.1995 17.4163 15.8677C17.4163 14.5359 16.3302 13.4542 14.993 13.4542Z"
                fill="black"
              />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">
            Move into Zolo Clayton, A professionally managed PG in HSR Layout.
            Located in a safe neighbourhood, this unisex PG offers various
            modern amenities for your comfort, Such as TV, Power Backup, Wi-Fi,
            etc. This PG has Single and Double Occupancy types. This PG is near
            major Commercial and Educational hubs. Please contact the seller to
            book this fast selling high in demand PG stay.
          </p>

          {/* Info Grid */}
          <div className="divide-y divide-gray-300 border-t border-b mb-6">
            <div className="grid grid-cols-4 gap-4 py-2 text-sm">
              <div>
                <p className="text-[#C3B900] font-medium">Deposit Amount</p>
                <p className="text-black">₹11,680</p>
              </div>
              <div>
                <p className="text-[#C3B900] font-medium">Maintenance</p>
                <p className="text-black">-</p>
              </div>
              <div>
                <p className="text-[#C3B900] font-medium">Notice Period</p>
                <p className="text-black">1 Month</p>
              </div>
              <div>
                <p className="text-[#C3B900] font-medium">
                  Electricity Charges
                </p>
                <p className="text-black">-</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 py-2 text-sm">
              <div>
                <p className="text-[#C3B900] font-medium">Food Availability</p>
                <p className="text-gray-400">None</p>
              </div>
              <div>
                <p className="text-[#C3B900] font-medium">AC Room</p>
                <p className="text-gray-400">Not Available</p>
              </div>
              <div>
                <p className="text-[#C3B900] font-medium">Parking</p>
                <p className="text-black">Available</p>
              </div>
              <div>
                <p className="text-[#C3B900] font-medium">Power Backup</p>
                <p className="text-black">Available</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 py-2 text-sm">
              <div>
                <p className="text-[#C3B900] font-medium">Availability For</p>
                <p className="text-gray-400">Girls & Boys</p>
              </div>
              <div>
                <p className="text-[#C3B900] font-medium">Preferred tenants</p>
                <p className="text-black">All</p>
              </div>
              <div>
                <p className="text-[#C3B900] font-medium">Numbers of Beds</p>
                <p className="text-black">50 Beds</p>
              </div>
              <div>
                <p className="text-[#C3B900] font-medium">Operating Since</p>
                <p className="text-gray-400">2023</p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button className="px-6 py-2 border-2 border-[#E2E200] text-black rounded-full">
              View Phone No.
            </button>
            <button className="px-6 py-2 bg-[#E2E200] text-black rounded-full">
              Contact Owner
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroReuse;
