import React from "react";
import Header from "../../components/PropertyLisT/Header";
import PropertyCard from "../../components/Cards/PropertyCard";
import "../components/PropertyLisT/PropertyListings.css"; // Optional: Add CSS file for styling

// Sample data (replace with API call in a real MERN app)
const properties = [
  {
    id: 1,
    title: "3 BHK Flat for sale in LIC Tower, Vijay Nagar",
    builder: "Provident Botanico",
    superArea: "1465 sqft",
    construction: "Under Construction",
    possession: "Poss. by Sept 28",
    transaction: "New Property",
    furnishing: "Non-Furnished",
    bedrooms: 3,
    bathrooms: 3,
    price: "₹1.10 Cr",
    pricePerSqft: "₹9345 per sqft",
    description:
      "Imagine waking up to the gentle rustling of leaves, the melodious song of birds, and the fresh scent of the great outdoors. Living within nature isn't just a dream; it's a reality waiting for you to explore. Presenting Provident Botanico where the five elements of nature seamlessly merge within a single property.",
    builderInfo: "Builder: Provident Housing... Since 2018",
    image: "https://via.placeholder.com/300x200/000000?text=Property+Image",
  },
  {
    id: 2,
    title: "3 BHK Flat for sale in LIC Tower, Vijay Nagar",
    builder: "Provident Botanico",
    superArea: "1480 sqft",
    construction: "Under Construction",
    possession: "Poss. by Sept 28",
    transaction: "New Property",
    furnishing: "Non-Furnished",
    bedrooms: 3,
    bathrooms: 3,
    price: "₹1.10 Cr",
    pricePerSqft: "₹9345 per sqft",
    description:
      "Imagine waking up to the gentle rustling of leaves, the melodious song of birds, and the fresh scent of the great outdoors. Living within nature isn't just a dream; it's a reality waiting for you to explore. Presenting Provident Botanico where the five elements of nature seamlessly merge within a single property.",
    builderInfo: "Builder: Provident Housing... Since 2018",
    image: "https://via.placeholder.com/300x200/000000?text=Property+Image",
  },
  {
    id: 3,
    title: "3 BHK Flat for sale in LIC Tower, Vijay Nagar",
    builder: "Provident Botanico",
    superArea: "1495 sqft",
    construction: "Under Construction",
    possession: "Poss. by Sept 28",
    transaction: "New Property",
    furnishing: "Non-Furnished",
    bedrooms: 3,
    bathrooms: 3,
    price: "₹1.10 Cr",
    pricePerSqft: "₹9345 per sqft",
    description:
      "Imagine waking up to the gentle rustling of leaves, the melodious song of birds, and the fresh scent of the great outdoors. Living within nature isn't just a dream; it's a reality waiting for you to explore. Presenting Provident Botanico where the five elements of nature seamlessly merge within a single property.",
    builderInfo: "Builder: Provident Housing... Since 2018",
    image: "https://via.placeholder.com/300x200/000000?text=Property+Image",
  },
];

const PropertyListings = () => {
  return (
    <div className="property-listings">
      <Header />
      <main className="main-content">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </main>
    </div>
  );
};

export default PropertyListings;
