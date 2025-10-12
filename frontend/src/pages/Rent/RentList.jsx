import React from "react";
import RentCard from "../../components/Cards/RentCard";
import Navbar from "../../components/layout/NavBar";
import avatar from "../../assets/images/avatar2.jpg";
import Footer from "../../components/layout/Footer";
import DynamicFilterBar from "../../components/Tabs/DynamicFilterBar";

const rentData = [
  {
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200",
    title: "2 BHK Flat for Rent in Green Park",
    subtitle: "Urban Homes",
    description:
      "A modern 2 BHK flat with spacious interiors and proximity to shopping centers, schools, and parks.",
    price: "₹25,000",
    pricePer: "₹25 per sqft",
    ownerName: "Ramesh Kumar",
    since: "2020",
    features: [
      { label: "Carpet Area", value: "1000 sqft" },
      { label: "Availability", value: "Immediately" },
      { label: "Facing", value: "North-East" },
      { label: "Furnishing", value: "Semi-Furnished" },
      { label: "Tenant Preference", value: "Family" },
      { label: "Bathroom", value: "2" },
    ],
  },
  {
    image:
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=1200",
    title: "1 BHK Studio in City Center",
    subtitle: "BlueSky Rentals",
    description:
      "Compact and cozy 1 BHK studio with great connectivity and modern facilities, ideal for bachelors.",
    price: "₹12,000",
    pricePer: "₹30 per sqft",
    ownerName: "Neha Gupta",
    since: "2019",
    features: [
      { label: "Carpet Area", value: "400 sqft" },
      { label: "Availability", value: "From 1st Sept" },
      { label: "Facing", value: "East" },
      { label: "Furnishing", value: "Fully Furnished" },
      { label: "Tenant Preference", value: "Bachelors" },
      { label: "Bathroom", value: "1" },
    ],
  },
  {
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200",
    title: "3 BHK Apartment in Palm Residency",
    subtitle: "Palm Residency",
    description:
      "Luxury 3 BHK apartment with premium amenities including swimming pool, gym, and kids' play area.",
    price: "₹40,000",
    pricePer: "₹28 per sqft",
    ownerName: "Vikram Singh",
    since: "2018",
    features: [
      { label: "Carpet Area", value: "1450 sqft" },
      { label: "Availability", value: "Immediately" },
      { label: "Facing", value: "South-West" },
      { label: "Furnishing", value: "Non-Furnished" },
      { label: "Tenant Preference", value: "Family" },
      { label: "Bathroom", value: "3" },
    ],
  },
  {
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200",
    title: "1 RK for Rent in Shivaji Nagar",
    subtitle: "City Edge Homes",
    description:
      "Affordable 1 RK home, perfect for students and working professionals, with nearby metro access.",
    price: "₹8,500",
    pricePer: "₹32 per sqft",
    ownerName: "Rajeev Mehta",
    since: "2017",
    features: [
      { label: "Carpet Area", value: "270 sqft" },
      { label: "Availability", value: "From 15th Aug" },
      { label: "Facing", value: "West" },
      { label: "Furnishing", value: "Fully Furnished" },
      { label: "Tenant Preference", value: "Bachelors" },
      { label: "Bathroom", value: "1" },
    ],
  },
  // Add 6+ more entries with variations
];

export default function RentList() {
  return (
    <>
      <Navbar bgColor="light" avatarUrl={avatar} />
      <div className="max-w-6xl mx-auto p-4 space-y-8 font-inter">
        {/* Dynamic Filter Bar for Rent */}
        <DynamicFilterBar activeTab="Rent" />

        {rentData.map((item, index) => (
          <RentCard key={index} {...item} />
        ))}
      </div>
      <Footer />
    </>
  );
}
