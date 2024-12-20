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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
