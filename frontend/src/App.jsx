import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/common/Login";
import UnifiedPhoneAuth from "./components/common/UnifiedPhoneAuth";
import AuthChoice from "./components/common/AuthChoice";
import VerifyOtp from "./components/Authentication/VerifyOtp";
import Home from "./pages/Home";
import BuyList from "./pages/Buy/BuyList";
import RentList from "./pages/Rent/RentList";
import CommercialList from "./pages/Commercial/CommercialList";
import BuyDetails from "./pages/Buy/BuyDetails";
import ScrollToTop from "./components/common/ScrollToTop";
import AddProperty from "./pages/Properties/AddProperty";
import MyProperties from "./pages/Properties/MyProperties";
import EditProperty from "./pages/Properties/EditProperty";
import ServiceProvider from "./pages/Services/ServiceProviderform";
import ServiceRequestPage from "./pages/Services/ServiceRequestPage";
import ServiceProviderDetail from "./pages/Services/ServiceProviderDetail";
import ServiceRequestForm from "./pages/Services/ServiceRequestForm";
import Profile from "./pages/Profile";
import PropertyTypeResults from "./pages/Properties/PropertyTypeResults";
import Services from "./pages/Services/Services";
import TenantRequestsPage from "./pages/Services/ServiceRequestListTenant";
// import ManageUsers from "./components/Admin/ManageUsers";
// import AdminMonositi from "./components/Admin/AdminMonositi";
import RentDetails from "./pages/Rent/RentDetails";
import ServiceBookingForm from "./components/Services/ServiceBookingForm";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateService from "./pages/Services/CreateService";
import MonositiList from "./pages/Monositi/MonositiList";
import MonositiDetails from "./pages/Monositi/MonositiDetails";
import AdminMonositi from "./pages/Admin/AdminMonositi";
import CreateMonositiListing from "./pages/Admin/CreateMonositiListing";
import CreateBuilderProject from "./pages/Admin/CreateBuilderProject";
import CreateBuilder from "./pages/Admin/CreateBuilder";
import EditBuilder from "./pages/Admin/EditBuilder";
import AdminBuilderDetail from "./pages/Admin/AdminBuilderDetail";
import AdminBuilders from "./pages/Admin/AdminBuilders";
import BuilderDetail from "./pages/Builders/BuilderDetail";
import BuildersList from "./pages/Builders/BuildersList";
import ProjectsList from "./pages/Builders/ProjectsList";
import ProjectDetail from "./pages/Projects/ProjectDetail";
import ForSale from "./pages/RealEstate/ForSale";
import ForRent from "./pages/RealEstate/ForRent";
import TermsConditions from "./pages/TermsConditions";

const AdminRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      navigate("/admin");
    } else {
      localStorage.setItem("redirectAfterLogin", "/admin");
      navigate("/login");
    }
  }, [navigate]);

  return null;
};

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buylist" element={<BuyList />} />
        <Route path="/rentlist" element={<RentList />} />
        <Route path="/commercial" element={<CommercialList />} />
        {/* <Route path="/login" element={<Auth />} /> */}
        <Route path="/auth" element={<UnifiedPhoneAuth />} />
        <Route path="/auth-choice" element={<AuthChoice />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/form-two" element={<ServiceBookingForm />} />

        <Route path="/verify" element={<VerifyOtp />} />
        <Route path="/commercial-details/:id" element={<CommercialList />} />

        <Route path="/buy-details/:id" element={<BuyDetails />} />

        <Route path="/rent-details/:id" element={<RentDetails />} />

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
        <Route path="/create-service" element={<CreateService />} />

        <Route path="/admin" element={<AdminDashboard />} />
        {/* <Route path="/buylist" element={<BuyList />} /> */}
        {/* Monositi Routes */}
        <Route path="/monositi" element={<MonositiList />} />
        <Route path="/monositi-details/:id" element={<MonositiDetails />} />

        {/* Admin Monositi Routes */}
        <Route path="/admin/monositi" element={<AdminMonositi />} />
        <Route
          path="/admin/monositi/create"
          element={<CreateMonositiListing />}
        />
        <Route
          path="/admin/monositi/edit/:id"
          element={<CreateMonositiListing />}
        />

        {/* Builders Routes */}
        <Route path="/admin/builders" element={<AdminBuilders />} />
        <Route path="/admin/builders/create" element={<CreateBuilder />} />
        <Route
          path="/admin/builders/create-project"
          element={<CreateBuilderProject />}
        />
        <Route path="/admin/builders/:id/edit" element={<EditBuilder />} />
        <Route path="/admin/builders/:id" element={<AdminBuilderDetail />} />
        <Route path="/builder/:id" element={<BuilderDetail />} />
        <Route path="/builders-list" element={<BuildersList />} />
        <Route path="/projects-list" element={<ProjectsList />} />
        <Route path="/project/:id" element={<ProjectDetail />} />

        {/* Real Estate Routes */}
        <Route path="/for-sale" element={<ForSale />} />
        <Route path="/for-rent" element={<ForRent />} />

        {/* Legal Pages */}
        <Route path="/terms" element={<TermsConditions />} />
      </Routes>
    </BrowserRouter>
  );
}
