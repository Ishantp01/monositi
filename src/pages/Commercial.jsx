import React from "react";
import CommercialCard from "../components/CommercailCard";
import Navbar from "../components/NavBar";
import avatar from "../assets/images/avatar2.jpg";
import Footer from "../components/Footer";


const commercialRentData = [
  {
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200",
    title: "Commercial Shop 6800 Sq-ft For Rent in Vijay Nagar",
    subtitle: "Provident Botanico",
    description:
      "Fully furnished office for rent in 12th Main Indiranagar, Bangalore 3000 Sq-ft with 45 workstations.",
    price: "₹3.5 Lac",
    pricePer: "₹117 per sqft",
    features: [
      { label: "Carpet Area", value: "2750 sqft" },
      { label: "Under Construction", value: "Poss. by Sept '28" },
      { label: "Cabin", value: "3" },
      { label: "Seats", value: "45" },
      { label: "Furnishing Status", value: "Ready To Move" },
      { label: "Washroom", value: "3" },
      { label: "Bathroom", value: "2" },
    ],
  },
  {
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
    title: "Retail Shop 1200 Sq-ft For Rent in MG Road",
    subtitle: "Urban Plaza",
    description:
      "Prime location retail shop on MG Road with excellent visibility and heavy footfall.",
    price: "₹1.2 Lac",
    pricePer: "₹100 per sqft",
    features: [
      { label: "Carpet Area", value: "1200 sqft" },
      { label: "Under Construction", value: "Poss. by Oct '28" },
      { label: "Cabin", value: "1" },
      { label: "Seats", value: "15" },
      { label: "Furnishing Status", value: "Semi-Furnished" },
      { label: "Washroom", value: "1" },
      { label: "Bathroom", value: "1" },
    ],
  },
  {
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200",
    title: "Showroom 3000 Sq-ft For Rent in Whitefield",
    subtitle: "Galaxy Tower",
    description:
      "Spacious showroom with premium frontage, ideal for electronics or automobile display.",
    price: "₹2.7 Lac",
    pricePer: "₹90 per sqft",
    features: [
      { label: "Carpet Area", value: "3000 sqft" },
      { label: "Under Construction", value: "Poss. by Dec '27" },
      { label: "Cabin", value: "2" },
      { label: "Seats", value: "30" },
      { label: "Furnishing Status", value: "Unfurnished" },
      { label: "Washroom", value: "2" },
      { label: "Bathroom", value: "2" },
    ],
  },
  {
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200",
    title: "Corporate Office 4500 Sq-ft For Rent in Electronic City",
    subtitle: "Tech Valley",
    description:
      "High-end office space equipped with meeting rooms and cafeteria facilities.",
    price: "₹4.5 Lac",
    pricePer: "₹100 per sqft",
    features: [
      { label: "Carpet Area", value: "4500 sqft" },
      { label: "Under Construction", value: "Poss. by May '28" },
      { label: "Cabin", value: "5" },
      { label: "Seats", value: "70" },
      { label: "Furnishing Status", value: "Fully Furnished" },
      { label: "Washroom", value: "4" },
      { label: "Bathroom", value: "3" },
    ],
  },
  {
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200",
    title: "Commercial Complex 5500 Sq-ft For Rent in JP Nagar",
    subtitle: "Vista Corporate Park",
    description:
      "Fully functional corporate hub with plug-and-play workstations.",
    price: "₹5.5 Lac",
    pricePer: "₹100 per sqft",
    features: [
      { label: "Carpet Area", value: "5500 sqft" },
      { label: "Under Construction", value: "Poss. by Jan '29" },
      { label: "Cabin", value: "6" },
      { label: "Seats", value: "85" },
      { label: "Furnishing Status", value: "Fully Furnished" },
      { label: "Washroom", value: "5" },
      { label: "Bathroom", value: "3" },
    ],
  },
  {
    image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1200",
    title: "Warehouse 8000 Sq-ft For Rent in Peenya",
    subtitle: "Industrial Hub",
    description:
      "Spacious warehouse with large loading bays and ample parking.",
    price: "₹2.8 Lac",
    pricePer: "₹35 per sqft",
    features: [
      { label: "Carpet Area", value: "8000 sqft" },
      { label: "Under Construction", value: "Poss. by Dec '28" },
      { label: "Cabin", value: "1" },
      { label: "Seats", value: "10" },
      { label: "Furnishing Status", value: "Unfurnished" },
      { label: "Washroom", value: "2" },
      { label: "Bathroom", value: "2" },
    ],
  },
  {
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200",
    title: "Office Space 2000 Sq-ft For Rent in Koramangala",
    subtitle: "Workify Hub",
    description:
      "Premium co-working space in the heart of Koramangala, with top-class amenities.",
    price: "₹1.6 Lac",
    pricePer: "₹80 per sqft",
    features: [
      { label: "Carpet Area", value: "2000 sqft" },
      { label: "Under Construction", value: "Poss. by Feb '29" },
      { label: "Cabin", value: "2" },
      { label: "Seats", value: "40" },
      { label: "Furnishing Status", value: "Semi-Furnished" },
      { label: "Washroom", value: "2" },
      { label: "Bathroom", value: "2" },
    ],
  },
  {
    image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1200",
    title: "IT Office 3200 Sq-ft For Rent in Marathahalli",
    subtitle: "Infinity Tech Park",
    description:
      "State-of-the-art IT office setup with server rooms and conference halls.",
    price: "₹2.9 Lac",
    pricePer: "₹90 per sqft",
    features: [
      { label: "Carpet Area", value: "3200 sqft" },
      { label: "Under Construction", value: "Poss. by Sept '27" },
      { label: "Cabin", value: "4" },
      { label: "Seats", value: "55" },
      { label: "Furnishing Status", value: "Ready To Move" },
      { label: "Washroom", value: "3" },
      { label: "Bathroom", value: "2" },
    ],
  },
  {
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
    title: "Commercial Showroom 4000 Sq-ft For Rent in HSR Layout",
    subtitle: "Elite Commercial",
    description:
      "High street showroom with double height ceiling and premium finishing.",
    price: "₹3.6 Lac",
    pricePer: "₹90 per sqft",
    features: [
      { label: "Carpet Area", value: "4000 sqft" },
      { label: "Under Construction", value: "Poss. by July '28" },
      { label: "Cabin", value: "3" },
      { label: "Seats", value: "35" },
      { label: "Furnishing Status", value: "Semi-Furnished" },
      { label: "Washroom", value: "3" },
      { label: "Bathroom", value: "2" },
    ],
  },
  {
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
    title: "Commercial Floor 6000 Sq-ft For Rent in Bellandur",
    subtitle: "Central Business Tower",
    description:
      "Open floor plan with flexible interiors and modern infrastructure.",
    price: "₹4.2 Lac",
    pricePer: "₹70 per sqft",
    features: [
      { label: "Carpet Area", value: "6000 sqft" },
      { label: "Under Construction", value: "Poss. by Mar '28" },
      { label: "Cabin", value: "5" },
      { label: "Seats", value: "65" },
      { label: "Furnishing Status", value: "Unfurnished" },
      { label: "Washroom", value: "4" },
      { label: "Bathroom", value: "2" },
    ],
  },
];



export default function CommercialList() {
    return (
        <>
            <Navbar bgColor="light" avatarUrl={avatar} />
            <Header />
            <div className="max-w-6xl mx-auto p-4 space-y-8 font-inter">
                {commercialRentData.map((item, index) => (
                    <>
                        <CommercialCard key={index} {...item} />
                    </>
                ))}
            </div>
            <Footer />
        </>
    );
}

const Header = () => {
    return (
        <div className="w-full bg-theme-primary h-12 mb-4 md:mb-16">
        </div>
    )
}
