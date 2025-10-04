import React from "react";
import Header from "../components/PG/Header";
import HeroReuse from "../components/PG/HeroReuse";
import Cards from "../components/PG/Cards";
import AmenitiesContainer from "../components/PG/AmenitiesContainer";
import CommonAreaAndAmenities from "../components/PG/CommonAreaAndAmenities";
import PropertyCaraousalPG from "../components/PG/PropertyCaraousalPG";

function PG() {
  return (
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
  );
}

export default PG;
