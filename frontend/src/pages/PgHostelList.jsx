import React from "react";
import PgHostelLongCard from "../components/PgHostelLongCard";
import Navbar from "../components/NavBar";
import avatar from "../assets/images/avatar2.jpg";
import Footer from "../components/Footer";


const pgHostelData = [
  {
    id: 1,
    price: 35000,
    title: "Monositi PG/Paying Guest",
    location: "Vijay Nagar",
    sharingOptions: {
      single: 35000,
      twin: 24000,
      triple: 17000,
      four: 24000,
    },
    near: "Near Shri Ram College",
    description:
      "Move into Zolo Eastfield, a professionally managed PG near Kalyan Nagar located in a safe",
    type: "Coed",
    image: "", // Optional image URL
  },
  {
    id: 2,
    price: 22000,
    title: "UrbanStay PG",
    location: "Koramangala",
    sharingOptions: {
      single: 22000,
      twin: 16000,
      triple: 12000,
      four: 10000,
    },
    near: "Near Forum Mall",
    description:
      "UrbanStay PG is situated in the heart of Koramangala, with easy access to cafés and transport.",
    type: "Boys",
    image: "",
  },
  {
    id: 3,
    price: 28000,
    title: "ComfortNest PG",
    location: "Indiranagar",
    sharingOptions: {
      single: 28000,
      twin: 19000,
      triple: 15000,
      four: 13000,
    },
    near: "Near Metro Station",
    description:
      "ComfortNest is ideal for working professionals looking for peaceful co-living near Indiranagar.",
    type: "Girls",
    image: "",
  },
];


export default function PgHostelList() {
    return (
        <>
            <Navbar bgColor="light" avatarUrl={avatar} />
            <Header />
            <div className="max-w-6xl mx-auto p-4 space-y-8 font-inter">
                {pgHostelData.map((item, index) => (
                        <PgHostelLongCard key={index} {...item} />                        
                ))}
            </div>
            <Footer />
        </>
    );
}

const Header = () => {
    return (
        <div className="w-full bg-theme-primary h-auto py-3 md:py-4 mb-8 md:mb-20  font-inter">
            <div className="max-w-6xl mx-auto flex items-center justify-start gap-3 px-3 md:px-6 overflow-x-auto scrollbar-hide">
                {/* Buy + Input */}
                <div className="flex-shrink-0 flex items-center bg-white rounded-full px-2 py-2 shadow-sm">
                    <button className="text-xs md:text-sm font-medium px-2 border-r border-gray-300 whitespace-nowrap">
                        Buy
                    </button>
                    <input
                        type="text"
                        placeholder="Enter Locality, Project"
                        className="outline-none px-2 text-xs md:text-sm text-gray-500 bg-transparent placeholder-gray-400 w-[120px] sm:w-[160px] md:w-[200px]"
                    />
                </div>

                {/* Buttons */}
                {/* {["Covered Area", "Flat +1", "BHK", "More Filters"].map((label, idx) => (
                    <button
                        key={idx}
                        className="flex-shrink-0 bg-white text-black text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-sm whitespace-nowrap"
                    >
                        {label}
                    </button>
                ))} */}
            </div>
        </div>
    );
};

