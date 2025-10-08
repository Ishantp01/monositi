import React from "react";
import SaleCard from "../components/Cards/SaleCard";
import Navbar from "../components/layout/NavBar";
import avatar from "../assets/images/avatar2.jpg";
import Footer from "../components/layout/Footer";
import { MapPinned } from "lucide-react";

const saleData = [
  {
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
    title: "3 BHK Flat for sale in LIC Tower , Vijay Nagar",
    subtitle: "Provident Botanico",
    description:
      "Imagine waking up to the gentle rustling of leaves, the melodious songs of birds, and the fresh scent of the great outdoors. Living within nature isn’t just a dream; it’s a reality waiting for you to explore. Presenting Provident Botanico where the five elements of nature seamlessly merge within a single property.",
    price: "₹1.10 Cr",
    pricePer: "₹9345 per sqft",
    builderName: "Provident Housi....",
    since: "2018",
    features: [
      { label: "Super Area", value: "1480 sqft" },
      { label: "Under Construction", value: "Poss. by Sept '28" },
      { label: "Transaction", value: "New Property" },
      { label: "Furnishing", value: "Non-Furnished" },
      { label: "Bedrooms", value: "3" },
      { label: "Bathroom", value: "3" },
    ],
  },
  {
    image:
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=1200",
    title: "2 BHK Apartment in Green Valley, Indore",
    subtitle: "Sunshine Apartments",
    description:
      "A cozy and modern apartment surrounded by greenery, designed for peaceful living and comfort with modern amenities.",
    price: "₹85 Lac",
    pricePer: "₹7800 per sqft",
    builderName: "Sunshine Group",
    since: "2019",
    features: [
      { label: "Super Area", value: "1100 sqft" },
      { label: "Status", value: "Ready to Move" },
      { label: "Transaction", value: "Resale" },
      { label: "Furnishing", value: "Semi-Furnished" },
      { label: "Bedrooms", value: "2" },
      { label: "Bathroom", value: "2" },
    ],
  },
  {
    image:
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1200",
    title: "4 BHK Luxury Villa in Palm Enclave",
    subtitle: "Elite Builders",
    description:
      "An ultra-luxury villa with premium architecture and world-class interior designs. Ideal for modern families.",
    price: "₹2.25 Cr",
    pricePer: "₹10,500 per sqft",
    builderName: "Elite Builders",
    since: "2016",
    features: [
      { label: "Super Area", value: "2100 sqft" },
      { label: "Status", value: "Ready to Move" },
      { label: "Transaction", value: "New Property" },
      { label: "Furnishing", value: "Fully Furnished" },
      { label: "Bedrooms", value: "4" },
      { label: "Bathroom", value: "4" },
    ],
  },
  {
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
    title: "3 BHK Flat for sale in LIC Tower , Vijay Nagar",
    subtitle: "Provident Botanico",
    description:
      "Imagine waking up to the gentle rustling of leaves, the melodious songs of birds, and the fresh scent of the great outdoors. Living within nature isn’t just a dream; it’s a reality waiting for you to explore. Presenting Provident Botanico where the five elements of nature seamlessly merge within a single property.",
    price: "₹1.10 Cr",
    pricePer: "₹9345 per sqft",
    builderName: "Provident Housi....",
    since: "2018",
    features: [
      { label: "Super Area", value: "1480 sqft" },
      { label: "Under Construction", value: "Poss. by Sept '28" },
      { label: "Transaction", value: "New Property" },
      { label: "Furnishing", value: "Non-Furnished" },
      { label: "Bedrooms", value: "3" },
      { label: "Bathroom", value: "3" },
    ],
  },
  {
    image:
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=1200",
    title: "2 BHK Apartment in Green Valley, Indore",
    subtitle: "Sunshine Apartments",
    description:
      "A cozy and modern apartment surrounded by greenery, designed for peaceful living and comfort with modern amenities.",
    price: "₹85 Lac",
    pricePer: "₹7800 per sqft",
    builderName: "Sunshine Group",
    since: "2019",
    features: [
      { label: "Super Area", value: "1100 sqft" },
      { label: "Status", value: "Ready to Move" },
      { label: "Transaction", value: "Resale" },
      { label: "Furnishing", value: "Semi-Furnished" },
      { label: "Bedrooms", value: "2" },
      { label: "Bathroom", value: "2" },
    ],
  },
  {
    image:
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1200",
    title: "4 BHK Luxury Villa in Palm Enclave",
    subtitle: "Elite Builders",
    description:
      "An ultra-luxury villa with premium architecture and world-class interior designs. Ideal for modern families.",
    price: "₹2.25 Cr",
    pricePer: "₹10,500 per sqft",
    builderName: "Elite Builders",
    since: "2016",
    features: [
      { label: "Super Area", value: "2100 sqft" },
      { label: "Status", value: "Ready to Move" },
      { label: "Transaction", value: "New Property" },
      { label: "Furnishing", value: "Fully Furnished" },
      { label: "Bedrooms", value: "4" },
      { label: "Bathroom", value: "4" },
    ],
  },
  {
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
    title: "3 BHK Flat for sale in LIC Tower , Vijay Nagar",
    subtitle: "Provident Botanico",
    description:
      "Imagine waking up to the gentle rustling of leaves, the melodious songs of birds, and the fresh scent of the great outdoors. Living within nature isn’t just a dream; it’s a reality waiting for you to explore. Presenting Provident Botanico where the five elements of nature seamlessly merge within a single property.",
    price: "₹1.10 Cr",
    pricePer: "₹9345 per sqft",
    builderName: "Provident Housi....",
    since: "2018",
    features: [
      { label: "Super Area", value: "1480 sqft" },
      { label: "Under Construction", value: "Poss. by Sept '28" },
      { label: "Transaction", value: "New Property" },
      { label: "Furnishing", value: "Non-Furnished" },
      { label: "Bedrooms", value: "3" },
      { label: "Bathroom", value: "3" },
    ],
  },
  {
    image:
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=1200",
    title: "2 BHK Apartment in Green Valley, Indore",
    subtitle: "Sunshine Apartments",
    description:
      "A cozy and modern apartment surrounded by greenery, designed for peaceful living and comfort with modern amenities.",
    price: "₹85 Lac",
    pricePer: "₹7800 per sqft",
    builderName: "Sunshine Group",
    since: "2019",
    features: [
      { label: "Super Area", value: "1100 sqft" },
      { label: "Status", value: "Ready to Move" },
      { label: "Transaction", value: "Resale" },
      { label: "Furnishing", value: "Semi-Furnished" },
      { label: "Bedrooms", value: "2" },
      { label: "Bathroom", value: "2" },
    ],
  },
  {
    image:
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1200",
    title: "4 BHK Luxury Villa in Palm Enclave",
    subtitle: "Elite Builders",
    description:
      "An ultra-luxury villa with premium architecture and world-class interior designs. Ideal for modern families.",
    price: "₹2.25 Cr",
    pricePer: "₹10,500 per sqft",
    builderName: "Elite Builders",
    since: "2016",
    features: [
      { label: "Super Area", value: "2100 sqft" },
      { label: "Status", value: "Ready to Move" },
      { label: "Transaction", value: "New Property" },
      { label: "Furnishing", value: "Fully Furnished" },
      { label: "Bedrooms", value: "4" },
      { label: "Bathroom", value: "4" },
    ],
  },
];

export default function SaleList() {
  return (
    <>
      <Navbar bgColor="light" avatarUrl={avatar} />
      <Header />
      <div className="max-w-6xl mx-auto p-4 space-y-8 font-inter">
        {saleData.map((item, index) => (
          <div key={`card${index}`}>
            <SaleCard {...item} />
            {index == 5 ? (
              <div className="bg-red-200 rounded-lg flex justify-between mt-8 items-center h-28 px-8">
                <h1 className="md:text-3xl font-mono">
                  Post Your Property For Free Here
                </h1>
                <button
                  className={`bg-theme-secondary text-black transition-colors duration-500 hover:bg-white flex items-center justify-center rounded-full p-2 w-10 h-10 lg:w-auto lg:h-auto lg:px-6 lg:py-2 `}
                >
                  {/* Show Icon on mobile + tablet, text only on lg+ */}
                  <MapPinned className="block lg:hidden" size={18} />
                  <span className="hidden lg:block text-sm lg:text-base">
                    Post Property
                  </span>
                </button>
              </div>
            ) : null}
          </div>
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
        {["Covered Area", "Flat +1", "BHK", "More Filters"].map(
          (label, idx) => (
            <button
              key={idx}
              className="flex-shrink-0 bg-white text-black text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-sm whitespace-nowrap"
            >
              {label}
            </button>
          )
        )}
      </div>
    </div>
  );
};
