import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import avatar from "../src/assets/images/avatar2.jpg";
import Carousel from "./components/Carousel";
import TabsWithSearch from "./components/Tabs";
import Buy from "./components/sections/Buy";
import PG from "./pages/PG";
import Commercial from "./pages/Commercial";
import Buyy from "./pages/Buy"
import { Route,  Routes } from "react-router-dom";
import AdminPanel from "./components/Admin/AdminPanel";
import Renting_Properties from "./components/Admin/Renting_Properties";
import Selling_Properties__PGHostel from "./components/Admin/Selling_Properties__PGHostel";
import Selling_Properties_Residental from "./components/Admin/Selling_Properties_Residental";
import Leaseable_Properties from "./components/Admin/Leaseable_Properties";
import PG_Hostel_Renting from "./components/Admin/PG_Hostel_Renting";
import Rent from "./pages/Rent";
import PropertyListings from "./pages/PropertyListings";
function App() {
  return (
    <>
    
     <Routes>
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/renting-properties" element={<Renting_Properties />} />
      <Route path="/property-listings" element={<PropertyListings />} />
      <Route path="/selling-residential" element={<Selling_Properties_Residental />} />
      <Route path="/pg-hostel" element={<PG_Hostel_Renting />} />
      <Route path="/leaseable" element={<Leaseable_Properties />} />
      <Route path="/selling-pg-hostel" element={<Selling_Properties__PGHostel />} />
     </Routes>


      <Navbar avatarUrl={avatar} />
      <div className="mt-8 md:mt-16">
        <Carousel interval={8000} />
      </div>
      <TabsWithSearch />
      <Buy />
      <PG />
      <Commercial/>
      <Buyy />

      <Commercial />
      <Rent />
      <Footer />
    
     
    
    </>
  );
}

export default App;
