import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import VerifyOtp from "./components/VerifyOtp";
import Home from "./pages/Home";
import SaleList from "./pages/SaleList";
import RentList from "./pages/RentList";
import CommercialList from "./pages/Commercial";
import PropertyPage from "./components/PropertyDetails/PropertyPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/salelist" element={<SaleList />} />
        <Route path="/rentlist" element={<RentList />} />
        <Route path="/commercial" element={<CommercialList />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<VerifyOtp />} />
        <Route path="/details" element={<PropertyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

