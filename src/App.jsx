import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./Home";
import Welcome from "./Welcome";
import Login from "./User/Auth/login";
import SignUp from "./User/Auth/signup";
import ForgetPassword from "./User/Auth/forgetPassword";
import Otp from "./User/Auth/otp";
import ResetPassword from "./User/Auth/reset-password";
import Main from "./User/Home";
import NewJob from "./User/newjob";
import JobManagement from "./User/jobManagement";
import JobDetail from "./User/job-detail";
import ServiceProvider from "./User/Service-provider";
import ServiceProviderProfile from "./User/service-provider-profle";
import ScrollToTop from "./ScrollToTop";
import Message from "./Chat/message";
import Notification from "./User/notification";
import MyProfile from "./components/myprofile";
import ChangePassword from "./components/changePassword";
import EditProfile from "./components/editProfile";
import LoginProvider from "./Provider/auth/login";
import SignUpProvider from "./Provider/auth/signup";
import MainProvider from "./Provider/pricing";
import PricingProvider from "./Provider/pricing-detail";
import Payment from "./Provider/payment";
import PaymentDetail from "./Provider/payment-detail";
import HomeProvider from "./Provider/Home";
import JobSpecification from "./Provider/jobSpecification";
import Chat from "./Chat/chat";
import "react-toastify/dist/ReactToastify.css";
import Upload from "./Provider/auth/uploadDoc";
import JobListing from "./job-listing";
import FeaturedJobs from "./featured-jobs";
import LatestJobs from "./latest-jobs";
import Error from "./components/error";
import About from "./about";
import Contact from "./contact";
import ChangeRadius from "./components/changeRadius";
import Search from "./Search";
import ServicesProvider from "./User/services-provider";
import AdminChat from "./Chat/admin-chat";
import { getProviderUser } from "./Slices/userSlice";
import { useDispatch } from "react-redux";
const useAuth = () => {
  return !!(
    localStorage.getItem("hunterToken") || localStorage.getItem("ProviderToken")
  );
};

// Protected Route Wrapper
const ProtectedRoute = ({ element }) => {
  return useAuth() ? element : <Welcome />;
};

const UnProtectedRoute = ({ element }) => {
  return !useAuth() ? element : <Error />;
};
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<UnProtectedRoute element={<Home />} />} />
        <Route
          path="/search"
          element={<UnProtectedRoute element={<Search />} />}
        />
        <Route
          path="/welcome"
          element={<UnProtectedRoute element={<Welcome />} />}
        />

        <Route
          path="/contact-us"
          element={<UnProtectedRoute element={<Contact />} />}
        />
        <Route
          path="/login"
          element={<UnProtectedRoute element={<Login />} />}
        />
        <Route
          path="/signup"
          element={<UnProtectedRoute element={<SignUp />} />}
        />
        <Route
          path="/forgot-password"
          element={<UnProtectedRoute element={<ForgetPassword />} />}
        />
        <Route path="/otp" element={<UnProtectedRoute element={<Otp />} />} />
        <Route
          path="/reset-password"
          element={<UnProtectedRoute element={<ResetPassword />} />}
        />

        <Route path="/home" element={<ProtectedRoute element={<Main />} />} />
        <Route
          path="/job-listing"
          element={<UnProtectedRoute element={<JobListing />} />}
        />
        <Route
          path="/featured-jobs"
          element={<UnProtectedRoute element={<FeaturedJobs />} />}
        />
        <Route
          path="/latest-jobs"
          element={<UnProtectedRoute element={<LatestJobs />} />}
        />
        <Route
          path="/:section"
          element={<UnProtectedRoute element={<About />} />}
        />
        <Route
          path="/post-new-job"
          element={<ProtectedRoute element={<NewJob />} />}
        />
        <Route
          path="/job-management"
          element={<ProtectedRoute element={<JobManagement />} />}
        />
        <Route
          path="/job-detail/:id"
          element={<ProtectedRoute element={<JobDetail />} />}
        />
        <Route
          path="/service-provider"
          element={<ProtectedRoute element={<ServiceProvider />} />}
        />
        <Route
          path="/support/chat/:id"
          element={<ProtectedRoute element={<AdminChat />} />}
        />
        <Route
          path="/service-profile/:id"
          element={<ProtectedRoute element={<ServiceProviderProfile />} />}
        />
        <Route
          path="/message"
          element={<ProtectedRoute element={<Message />} />}
        />
        <Route
          path="/notification"
          element={<ProtectedRoute element={<Notification />} />}
        />
        <Route
          path="/change-radius"
          element={<ProtectedRoute element={<ChangeRadius />} />}
        />
        <Route
          path="/myprofile"
          element={<ProtectedRoute element={<MyProfile />} />}
        />
        <Route
          path="/changePassword/:id"
          element={<ProtectedRoute element={<ChangePassword />} />}
        />
        <Route
          path="/editProfile"
          element={<ProtectedRoute element={<EditProfile />} />}
        />
        <Route
          path="/services-provider"
          element={<ProtectedRoute element={<ServicesProvider />} />}
        />

        {/* provider */}
        <Route
          path="/provider/login"
          element={<UnProtectedRoute element={<LoginProvider />} />}
        />
        <Route
          path="/provider/signup"
          element={<UnProtectedRoute element={<SignUpProvider />} />}
        />
        <Route
          path="/provider/upload"
          element={<ProtectedRoute element={<Upload />} />}
        />
        <Route
          path="/provider/reset"
          element={<UnProtectedRoute element={<ResetPassword />} />}
        />
        <Route path="/provider/otp" element={<Otp />} />
        <Route
          path="/provider/job-history"
          element={<ProtectedRoute element={<JobManagement />} />}
        />
        <Route
          path="/provider/job-history/:id"
          element={<ProtectedRoute element={<JobDetail />} />}
        />
        <Route
          path="/provider/message"
          element={<ProtectedRoute element={<Message />} />}
        />
        <Route
          path="/provider/reset-password"
          element={<ProtectedRoute element={<ResetPassword />} />}
        />
        <Route
          path="/provider/changePassword/:id"
          element={<ProtectedRoute element={<ChangePassword />} />}
        />
        <Route
          path="/provider/chat/:id"
          element={<ProtectedRoute element={<Chat />} />}
        />
        <Route
          path="/provider/admin/chat/"
          element={<ProtectedRoute element={<AdminChat />} />}
        />
        <Route
          path="/provider/editProfile"
          element={<ProtectedRoute element={<EditProfile />} />}
        />
        <Route
          path="/provider/forgetpassword"
          element={<ProtectedRoute element={<ForgetPassword />} />}
        />
        <Route
          path="/provider/pricing"
          element={<ProtectedRoute element={<MainProvider />} />}
        />
        <Route
          path="/provider/pricing-detail/:id"
          element={<ProtectedRoute element={<PricingProvider />} />}
        />
        <Route
          path="/provider/payment"
          element={<ProtectedRoute element={<Payment />} />}
        />
        <Route
          path="/provider/paymentdetail/:id"
          element={<ProtectedRoute element={<PaymentDetail />} />}
        />
        <Route
          path="/provider/home"
          element={<ProtectedRoute element={<HomeProvider />} />}
        />
        <Route
          path="/provider/jobspecification/:id"
          element={<ProtectedRoute element={<JobSpecification />} />}
        />
        <Route
          path="/provider/myprofile"
          element={<ProtectedRoute element={<MyProfile />} />}
        />
        <Route
          path="/provider/edit/upload"
          element={<ProtectedRoute element={<Upload />} />}
        />
        <Route path="/error" element={<Error />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
