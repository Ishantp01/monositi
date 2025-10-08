import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login";
import VerifyOtp from "./components/VerifyOtp";
import Home from "./pages/Home";
import SaleList from "./pages/SaleList";
import RentList from "./pages/RentList";
import CommercialList from "./pages/Commercial";
import PgHostelList from "./pages/PgHostelList";
import PropertyPage from "./components/PropertyDetails/PropertyPage";
import ScrollToTop from "./components/ScrollToTop";

// Admin redirect component
const AdminRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      // User is already logged in, redirect directly to properties page
      navigate("/properties/type/Rent");
    } else {
      // User is not logged in, store the intended destination and redirect to login
      localStorage.setItem("redirectAfterLogin", "/properties/type/Rent");
      navigate("/login");
    }
  }, [navigate]);

  return null;
};

import AdminPanel from "./components/Admin/AdminPanel";
import Selling_Properties_Residental from "./components/Admin/Selling_Properties_Residental";
import Renting_Properties from "./components/Admin/Renting_Properties";
import PG_Hostel_Renting from "./components/Admin/PG_Hostel_Renting";
import Selling_Properties__PGHostel from "./components/Admin/Selling_Properties__PGHostel";
import Leaseable_Properties from "./components/Admin/Leaseable_Properties";

<<<<<<< HEAD
import Rent from "./pages/Rent";
=======

>>>>>>> ecb67ce08af364a0a7cf8e725659b0733c58912b
import AddProperty from "./pages/AddProperty";
import MyProperties from "./pages/MyProperties";
import EditProperty from "./pages/EditProperty";
import ServiceProvider from "./pages/Services/ServiceProviderform";
import ServiceRequestPage from "./pages/ServiceRequestPage";
import ServiceProviderDetail from "./pages/Services/ServiceProviderDetail";
import ServiceRequestForm from "./pages/Services/ServiceRequestForm";
import Profile from "./pages/Profile";
import AdminUsers from "./pages/AdminUsers";
import PropertyTypeResults from "./pages/PropertyTypeResults";
import PG from "./pages/PG";
import SignUp from "./components/SignUp";
import Services from "./pages/Services";
import TenantRequestsPage from "./pages/ServiceRequestListTenant";
import ManageUsers from "./components/Admin/ManageUsers";
import AdminMonositi from "./components/Admin/AdminMonositi";
import RentDetails from "./pages/RentDetails";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/salelist" element={<SaleList />} />
        <Route path="/rentlist" element={<RentList />} />
        <Route path="/commercial" element={<CommercialList />} />
        <Route path="/pghostel" element={<PgHostelList />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />

        {/* admin routes */}
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/monositi" element={<AdminMonositi />} />
        <Route
          path="/properties/type/:type"
          element={<PropertyTypeResults />}
        />

        <Route path="/verify" element={<VerifyOtp />} />
        {/* <Route path="/property-details/:id" element={<Rent />} /> */}
        <Route path="/pg-details/:id" element={<PG />} />
        <Route path="/commercial-details/:id" element={<CommercialList />} />

<<<<<<< HEAD
        <Route path="/rent-details" element={<Rent />} />

=======

        <Route path="/buy-details" element={<PropertyPage />} />

        <Route path="/rent-details" element={<RentDetails />} />
        
>>>>>>> ecb67ce08af364a0a7cf8e725659b0733c58912b
        {/* Property Management Routes */}
        <Route path="/add-property" element={<AddProperty />} />
        <Route path="/my-properties" element={<MyProperties />} />
        <Route path="/edit-property/:id" element={<EditProperty />} />

        <Route path="/service-request" element={<ServiceRequestPage />} />
        <Route path="/service-form" element={<ServiceProvider />} />
        <Route path="/services" element={<Services />} />
        <Route path="/service-request-list" element={<TenantRequestsPage />} />
        <Route
          path="/service-providers/:id"
          element={<ServiceProviderDetail />}
        />
        <Route path="/service-request/new" element={<ServiceRequestForm />} />
<<<<<<< HEAD
=======
        


        
>>>>>>> ecb67ce08af364a0a7cf8e725659b0733c58912b

        <Route path="/admin" element={<AdminRedirect />} />
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
