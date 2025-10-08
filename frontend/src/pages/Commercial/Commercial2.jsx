import React from "react";
import Navbar from "../../components/layout/NavBar";
import Footer from "../../components/layout/Footer";
import HeroCard from "../../components/Commercial/HeroCard";
import FilterBar from "../../components/Commercial/FilterBar";
import ContactOwner from "../../components/Commercial/ContactOwner";
import FlatOff from "../../components/Commercial/FlatOff";
import MoreDetailsSec from "../../components/Commercial/MoreDetail";
import PropertyCarousel from "../../components/Commercial/Propertycarousel";
import avatar from "../assets/images/avatar2.jpg";
// import PropertyCarousel from '../components/Carousel/PropertiesSlider'

const Commercial = () => {
  return (
    <>
      <Navbar avatarUrl={avatar} />
      <div className="bg-red-50">
        <FilterBar
          searchPlaceholder="Search by City"
          categories={["Apartment", "Villa", "Land"]}
          themeColor="blue"
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
          {/* HeroCard wider */}
          <div className="lg:col-span-3 ">
            <HeroCard />
            <MoreDetailsSec />
            <PropertyCarousel />
          </div>

          {/* Sidebar smaller */}
          <div className="flex flex-col gap-4">
            <div className="scale-90">
              <ContactOwner
                title="Contact Agent"
                phone="+91 9876543210"
                buttonText="Call Now"
                bgColor="bg-gray-50"
                borderColor="border-blue-500"
                buttonColor="bg-blue-600 hover:bg-blue-700"
              />
            </div>
            <div className="scale-90">
              <FlatOff
                heading="Mega Discount"
                description="Limited time offer on flats"
                strips={5}
                stripText="Special deal"
                themeColor="green"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Commercial;
