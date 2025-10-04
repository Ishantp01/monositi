import React from "react";
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




function Rent() {
  return (
    <>
      <Navbar avatarUrl={avatar} />
      <section>
        <div className="bg-red-50">
          <FilterBar />
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
            {/* HeroCard wider */}
            <div className="lg:col-span-3 ">
              <HeroCard />
              <MoreDetailsSec />
              <AboutProject />
              <Amenities />
            </div>

            {/* Sidebar smaller */}
            <div className="flex flex-col gap-4">
              <div className="scale-90">
                <ContactOwner />
              </div>
              <div className="scale-90">
                <FlatOff />
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
