import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/Signup";
import Login from "./pages/Login";
import VerifyOtp from "./components/VerifyOtp";
import Home from "./pages/Home";
import SaleList from "./pages/SaleList";
import RentList from "./pages/RentList";
import CommercialList from "./pages/Commercial";
import PgHostelList from "./pages/PgHostelList";
import PropertyPage from "./components/PropertyDetails/PropertyPage";
import ScrollToTop from "./components/ScrollToTop";



import AdminPanel from "./components/Admin/AdminPanel";
import Selling_Properties_Residental from "./components/Admin/Selling_Properties_Residental";
import Renting_Properties from "./components/Admin/Renting_Properties";
import PG_Hostel_Renting from "./components/Admin/PG_Hostel_Renting";
import Selling_Properties__PGHostel from "./components/Admin/Selling_Properties__PGHostel";
import Leaseable_Properties from "./components/Admin/Leaseable_Properties";


import Rent from "./pages/Rent"

import Profile from "./pages/Profile";
import PG from "./pages/PG";
import ServiceRequestPage from "./pages/ServiceRequestPage";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/salelist" element={<SaleList />} />
        <Route path="/rentlist" element={<RentList />} />
        <Route path="/commercial" element={<CommercialList />} />
        <Route path="/pghostel" element={<PgHostelList />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        
        <Route path="/verify" element={<VerifyOtp />} />
        <Route path="/details" element={<PropertyPage />} />
        <Route path="/property-details/:id" element={<Rent />} />
        <Route path="/pg-details/:id" element={<PG />} />
        <Route path="/commercial-details/:id" element={<CommercialList />} />

        <Route path="/rent-details" element={<Rent />} />
        <Route path="/service-request" element={<ServiceRequestPage />} />
        

        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/renting-properties" element={<Renting_Properties />} />
        <Route
          path="/selling-residential"
          element={<Selling_Properties_Residental />}
        />
        <Route path="/pg-hostel" element={<PG_Hostel_Renting />} />
        <Route path="/leaseable" element={<Leaseable_Properties />} />
        <Route
          path="/selling-pg-hostel"
          element={<Selling_Properties__PGHostel />}
        />
      </Routes>
    </BrowserRouter>
  );
}