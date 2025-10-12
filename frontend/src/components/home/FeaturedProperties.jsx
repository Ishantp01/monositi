import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import FeaturedPropertySlider from "../sliders/FeaturedPropertySlider";

const FeaturedProperties = () => {
  const dispatch = useDispatch();
  const { featuredProperties, loading } =
    useSelector((state) => state.properties) || {};

  // Sample data for demonstration
  const sampleProperties = [
    {
      _id: "1",
      title: "Luxury Apartment with Sea View",
      price: 25000,
      address: {
        area: "Marine Drive",
        city: "Mumbai",
      },
      bedrooms: 3,
      bathrooms: 2,
      area: 1500,
      isVerified: true,
      photos: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      _id: "2",
      title: "Modern Villa with Private Pool",
      price: 45000,
      address: {
        area: "Jubilee Hills",
        city: "Hyderabad",
      },
      bedrooms: 4,
      bathrooms: 4,
      area: 3200,
      isVerified: true,
      photos: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      _id: "3",
      title: "Spacious Penthouse in City Center",
      price: 35000,
      address: {
        area: "Koramangala",
        city: "Bangalore",
      },
      bedrooms: 3,
      bathrooms: 3,
      area: 2100,
      isVerified: true,
      photos: [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      ],
    },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <FeaturedPropertySlider
          properties={
            featuredProperties?.length > 0
              ? featuredProperties
              : sampleProperties
          }
        />
      </div>
    </section>
  );
};

export default FeaturedProperties;
