import React from "react";
import Navbar from '../components/NavBar'
import Footer from '../components/Footer'
import Header from "../components/PG/Header";
import HeroReuse from "../components/PG/HeroReuse";
import Cards from "../components/PG/Cards";
import AmenitiesContainer from "../components/PG/AmenitiesContainer";
import CommonAreaAndAmenities from "../components/PG/CommonAreaAndAmenities";
import PropertyCaraousalPG from "../components/PG/PropertyCaraousalPG";
import avatar from '../assets/images/avatar2.jpg'

function PG() {
  return (
    <>
      <Navbar avatarUrl={avatar} />
      <div className="bg-[#FFF4F4]">
        <Header />
        <br />
        <HeroReuse />
        <br />
        <Cards />
        <br />
        <CommonAreaAndAmenities />
        <AmenitiesContainer />
        <PropertyCaraousalPG />
      </div>
      <Footer />
    </>
  );
}

export default PG;
