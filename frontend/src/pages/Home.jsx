import React, { useState, useEffect } from "react";
import Navbar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import Carousel from "../components/Carousel/Carousel";
import StandardPropertySlider from "../components/sliders/StandardPropertySlider";

import PropertySearch from "../components/Tabs/Tabs";
import { propertyApi } from "../utils/propertyApi";
import { toast } from "react-toastify";

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [buyProperties, setBuyProperties] = useState([]);
  const [rentProperties, setRentProperties] = useState([]);
  const [commercialProperties, setCommercialProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);

      // Fetch all properties
      const allPropertiesResponse = await propertyApi.getAllProperties({ limit: 20 });

      // Fetch Buy properties
      const buyResponse = await propertyApi.searchProperties({ sub_category: 'Buy', limit: 10 });

      // Fetch Rent properties  
      const rentResponse = await propertyApi.searchProperties({ sub_category: 'Rent', limit: 10 });

      // Fetch Commercial properties
      const commercialResponse = await propertyApi.searchProperties({ type: 'commercial', limit: 10 });

      if (allPropertiesResponse.success) {
        setProperties(allPropertiesResponse.properties || []);
      }

      if (buyResponse.success) {
        setBuyProperties(buyResponse.properties || []);
      }

      if (rentResponse.success) {
        setRentProperties(rentResponse.properties || []);
      }

      if (commercialResponse.success) {
        setCommercialProperties(commercialResponse.properties || []);
      }

    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  // Transform API properties to match slider component format
  const transformProperties = (apiProperties) => {
    return apiProperties.map(property => ({
      _id: property._id,
      title: property.name || `${property.type} Property in ${property.city}`,
      price: property.price,
      address: {
        area: property.address,
        city: property.city
      },
      bedrooms: property.property_features?.units || 1,
      bathrooms: Math.ceil((property.property_features?.units || 1) / 2),
      area: property.property_features?.size || 1000,
      isVerified: property.monositi_verified,
      photos: property.property_features?.images || [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
      ],
      type: property.type,
      sub_category: property.sub_category
    }));
  };
  return (
    <>
      <Navbar />
      <div className="relative">
        <div className="mt-14 md:mt-24">
          <Carousel interval={8000} />
        </div>
        {/* <HeroSearchBar /> */}
        <PropertySearch />


        {/* Buy Properties */}
        {/* <div className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <StandardPropertySlider
              properties={transformProperties(buyProperties)}
              title="Properties for Sale"
              subtitle="Discover your dream home from our verified listings"
              loading={loading}
              viewAllLink="/salelist"
            />
          </div>
        </div> */}

        {/* Rent Properties */}
        {/* <div className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <StandardPropertySlider
              properties={transformProperties(rentProperties)}
              title="Properties for Rent"
              subtitle="Find the perfect rental property for your needs"
              loading={loading}
              viewAllLink="/rentlist"
            />
          </div>
        </div> */}

        {/* Commercial Properties */}
        {/* <div className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <StandardPropertySlider
              properties={transformProperties(commercialProperties)}
              title="Commercial Properties"
              subtitle="Explore commercial spaces for your business"
              loading={loading}
              viewAllLink="/commercial"
            />
          </div>
        </div> */}



        <Footer />
      </div>
    </>
  );
};

export default Home;
