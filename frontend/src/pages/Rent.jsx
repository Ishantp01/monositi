import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from '../components/NavBar'
import Footer from '../components/Footer'
import HeroCard from "../components/Rent/HeroCard";
import { FilterBar } from "../components/Rent/FilterBar";
import ContactOwner from "../components/Rent/ContactOwner";
import FlatOff from "../components/Rent/FlatOff";
import MoreDetailsSec from "../components/Rent/MoreDetail";
import PropertyCarousel from "../components/Commercial/Propertycarousel";
import { AboutProject } from "../components/Rent/AboutProject";
import Amenities from "../components/Rent/Amenities";
import avatar from '../assets/images/avatar2.jpg'

// Import property data from sliders
import { properties as slider3Properties } from '../components/Carousel/PropertiesSlider3';
import { properties as slider4Properties } from '../components/Carousel/PropertiesSlider4';

function Rent() {
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
      <section>
        <div className="bg-red-50">
          <FilterBar />
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
            {/* HeroCard wider */}
            <div className="lg:col-span-3 ">
              <HeroCard property={property} />
              <MoreDetailsSec property={property} />
              <AboutProject property={property} />
              <Amenities property={property} />
            </div>

            {/* Sidebar smaller */}
            <div className="flex flex-col gap-4">
              <div className="scale-90">
                <ContactOwner property={property} />
              </div>
              <div className="scale-90">
                <FlatOff property={property} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Rent;
