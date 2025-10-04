import React from "react";
import OutlineButton from "../MoreButton";
import { Check } from "lucide-react";
import check from "../../assets/PG/green-tick.png";

const Cards = () => {
  const rooms = [
    {
      title: "Single Room In Monositi PG",
      rent: "₹21,786",
      dimension: "-",
      available: 16,
      amenities: ["Washroom/Toilet", "Cupboard", "Mattress", "Geyser", "Meal"],
    },
    {
      title: "Sharing Room In Monositi PG",
      rent: "₹11,567",
      dimension: "-",
      available: 16,
      amenities: ["Washroom/Toilet", "Cupboard", "Mattress", "Geyser", "Meal"],
    },
    {
      title: "Single Room In Monositi PG",
      rent: "₹21,786",
      dimension: "-",
      available: 16,
      amenities: ["Washroom/Toilet", "Cupboard", "Mattress", "Geyser", "Meal"],
    },
  ];

  return (
    <section className="bg-[#FFFFFF] relative mx-auto max-w-[90%] py-6 p-8">
      <h2 className="text-xl font-semibold mb-6">
        Occupancy Options in Zolo Clayton
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {rooms.map((room, i) => (
          <div
            key={i}
            className="border rounded-xl shadow-sm p-6 flex flex-col justify-between"
          >
            <div className="h-40 bg-gray-300 rounded-lg mb-4"></div>

            <h3 className="font-semibold text-lg mb-2">{room.title}</h3>

            <div className="flex justify-between text-gray-600 mb-2">
              <span>Rent</span>
              <span className="font-medium text-black">{room.rent}</span>
            </div>

            <div className="flex justify-between text-gray-600 mb-2">
              <span>Room Dimension</span>
              <span>-</span>
            </div>

            <div className="flex justify-between text-gray-600 mb-4">
              <span>Rooms Available</span>
              <span className="text-black font-medium">{room.available}</span>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Amenities</h4>
              <div className="grid grid-cols-2 gap-2 text-gray-600">
                {room.amenities.map((item, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <svg
                      className="fill-[#41EA55]"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.9967 9.04214L16.1717 8.1937C16.1389 8.1562 16.0873 8.13745 16.0404 8.13745C15.9889 8.13745 15.942 8.1562 15.9092 8.1937L10.1904 13.9546L8.10918 11.8734C8.07168 11.8359 8.0248 11.8171 7.97793 11.8171C7.93105 11.8171 7.88418 11.8359 7.84668 11.8734L7.0123 12.7078C6.9373 12.7828 6.9373 12.9 7.0123 12.975L9.6373 15.6C9.80605 15.7687 10.0123 15.8671 10.1857 15.8671C10.4342 15.8671 10.6498 15.6843 10.7295 15.6093H10.7342L17.0014 9.30933C17.067 9.22964 17.067 9.11245 16.9967 9.04214Z"
                        fill="black"
                      />
                      <path
                        d="M12 3.5625C14.2547 3.5625 16.3734 4.43906 17.9672 6.03281C19.5609 7.62656 20.4375 9.74531 20.4375 12C20.4375 14.2547 19.5609 16.3734 17.9672 17.9672C16.3734 19.5609 14.2547 20.4375 12 20.4375C9.74531 20.4375 7.62656 19.5609 6.03281 17.9672C4.43906 16.3734 3.5625 14.2547 3.5625 12C3.5625 9.74531 4.43906 7.62656 6.03281 6.03281C7.62656 4.43906 9.74531 3.5625 12 3.5625ZM12 2.25C6.61406 2.25 2.25 6.61406 2.25 12C2.25 17.3859 6.61406 21.75 12 21.75C17.3859 21.75 21.75 17.3859 21.75 12C21.75 6.61406 17.3859 2.25 12 2.25Z"
                        fill="black"
                      />
                    </svg>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Button */}
            <button className="px-6 py-2 bg-[#E2E200] text-[#282713] rounded-full">
              View Phone No.
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Cards;
