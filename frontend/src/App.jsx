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
import Profile from "./pages/Profile";

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
        <Route path="/verify" element={<VerifyOtp />} />
        <Route path="/details" element={<PropertyPage />} />
        <Route path="/profile" element={<Profile/>} />
        
      </Routes>
    </BrowserRouter>
  );
}
