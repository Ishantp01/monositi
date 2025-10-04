import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from '../components/NavBar'
import Footer from '../components/Footer'
import Header from "../components/PG/Header";
import HeroReuse from "../components/PG/HeroReuse";
import Cards from "../components/PG/Cards";
import AmenitiesContainer from "../components/PG/AmenitiesContainer";
import CommonAreaAndAmenities from "../components/PG/CommonAreaAndAmenities";
import PropertyCaraousalPG from "../components/PG/PropertyCaraousalPG";
import avatar from '../assets/images/avatar2.jpg'

// Import property data from sliders
import { properties as slider3Properties } from '../components/Carousel/PropertiesSlider3';
import { properties as slider4Properties } from '../components/Carousel/PropertiesSlider4';

function PG() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      // If ID is provided, find the specific property
      setLoading(true);
      const allProperties = [...slider3Properties, ...slider4Properties];
      const foundProperty = allProperties.find(prop => prop.id === parseInt(id));
      
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
      <Navbar avatarUrl={avatar} />
      <div className="bg-[#FFF4F4]">
        <Header property={property} />
        <br />
        <HeroReuse property={property} />
        <br />
        <Cards property={property} />                                     
        <br />
        <CommonAreaAndAmenities property={property} />
        <AmenitiesContainer property={property} />
        <PropertyCaraousalPG property={property} />
      </div>
      <Footer />
    </>
  );
}

export default PG;
