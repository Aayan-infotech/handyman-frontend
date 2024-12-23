import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import Message from "./User/message";
import Notification from "./User/notification";
import MyProfile from "./User/myprofile";
import ChangePassword from "./User/Auth/changePassword";
import EditProfile from "./User/Auth/editProfile";
import LoginProvider from "./Provider/auth/login";
import SignUpProvider from "./Provider/auth/signup";
import ResetPasswordProvider from "./Provider/auth/reset-password";
import OtpProvider from "./Provider/auth/otp";
import ForgetPasswordProvider from "./Provider/auth/forgetPassword";
import ChangePasswordProvider from "./Provider/auth/changePassword";
import EditProfileProvider from "./Provider/auth/editProfile";
import MainProvider from "./Provider/pricing";
import PricingProvider from "./Provider/pricing-detail";
import MessageProvider from "./Provider/message";

function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/home" element={<Main />} />
          <Route path="/post-new-job" element={<NewJob />} />
          <Route path="/job-management" element={<JobManagement />} />
          <Route path="/job-detail/:id" element={<JobDetail />} />
          <Route path="/service-provider" element={<ServiceProvider />} />
          <Route
            path="/service-profile/:id"
            element={<ServiceProviderProfile />}
          />
          <Route path="/message" element={<Message />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="/editProfile" element={<EditProfile />} />

          {/* provider */}
          <Route path="/provider/login" element={<LoginProvider />} />
          <Route path="/provider/signup" element={<SignUpProvider />} />
          <Route path="/provider/reset" element={<ResetPasswordProvider />} />
          <Route path="/provider/otp" element={<OtpProvider />} />
          <Route
            path="/provider/changePassword"
            element={<ChangePasswordProvider />}
          />
          <Route
            path="/provider/editProfile"
            element={<EditProfileProvider />}
          />
          <Route
            path="/provider/forgetpassword"
            element={<ForgetPasswordProvider />}
          />
          <Route path="/provider/pricing" element={<MainProvider />} />
          <Route path="/provider/pricing-detail/:id" element={<PricingProvider />} />
          <Route path="/provider/message" element={<MessageProvider />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
