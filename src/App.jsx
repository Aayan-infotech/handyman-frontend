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

function App() {
  return (
    <>
      <BrowserRouter>
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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
