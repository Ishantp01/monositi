import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PgHostelLongCard from "../components/PgHostelLongCard";
import Navbar from "../components/NavBar";
import avatar from "../assets/images/avatar2.jpg";
import Footer from "../components/Footer";


export const pgHostelData = [
  {
    id: 1,
    price: 35000,
    name: "Sunrise PG for Boys",
    title: "Monositi PG/Paying Guest",
    description: "Affordable accommodation with WiFi and meals.",
    address: "123 MG Road",
    city: "Bhopal",
    state: "Madhya Pradesh",
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
    photos: [
    "https://example.com/photo1.jpg",
    "https://example.com/photo2.jpg"
  ],
  tags: ["furnished", "wifi", "meals"],
  genderPreference: "Boys",
  contactNumber: "9876543210"
  },
  {
    id: 2,
    price: 35000,
    name: "Sunrise PG for Boys",
    title: "Monositi PG/Paying Guest",
    description: "Affordable accommodation with WiFi and meals.",
    address: "123 MG Road",
    city: "Bhopal",
    state: "Madhya Pradesh",
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
    photos: [
    "https://example.com/photo1.jpg",
    "https://example.com/photo2.jpg"
  ],
  tags: ["furnished", "wifi", "meals"],
  genderPreference: "Boys",
  contactNumber: "9876543210"
  },
  {
    id: 3,
    price: 35000,
    name: "Sunrise PG for Boys",
    title: "Monositi PG/Paying Guest",
    description: "Affordable accommodation with WiFi and meals.",
    address: "123 MG Road",
    city: "Bhopal",
    state: "Madhya Pradesh",
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
    photos: [
    "https://example.com/photo1.jpg",
    "https://example.com/photo2.jpg"
  ],
  tags: ["furnished", "wifi", "meals"],
  genderPreference: "Boys",
  contactNumber: "9876543210"
  },
];


export default function PgHostelList() {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            // If ID is provided, find the specific property
            setLoading(true);
            const foundProperty = pgHostelData.find(prop => prop.id === parseInt(id));
            
            if (foundProperty) {
                setProperty(foundProperty);
            }
            setLoading(false);
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-theme-primary"></div>
                    <p className="mt-4 text-gray-600">Loading property details...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar bgColor="light" avatarUrl={avatar} />
            <Header />
            <div className="max-w-6xl mx-auto p-4 space-y-8 font-inter">
                {property ? (
                    <PgHostelLongCard {...property} />
                ) : (
                    pgHostelData.map((item, index) => (
                        <PgHostelLongCard key={index} {...item} />
                    ))
                )}
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

