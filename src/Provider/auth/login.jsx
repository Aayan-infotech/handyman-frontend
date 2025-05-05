import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Header from "./component/Navbar";
import Button from "@mui/material/Button";
import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import "../../User/user.css";
import facebook from "../assets/logo/facebook.png";
import google from "../assets/logo/iconGoogle.png";
import Loader from "../../Loader";
import Toaster from "../../Toaster";
import axiosInstance from "../../components/axiosInstance";
import { Eye, EyeOff } from "lucide-react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../Chat/lib/firestore";

export default function LoginProvider() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const userType = "provider";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });
  const [guestLocation, setGuestLocation] = useState(null);
  const ProviderUId = localStorage.getItem("ProviderUId");
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setToastProps({
        message: "Please fill all fields",
        type: "error",
        toastKey: Date.now(),
      });
      return;
    }
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        "/auth/login",
        {
          email: email,
          password: password,
          userType: userType,
          // UID: ProviderUId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // const firebaseUser = await signInWithEmailAndPassword(
        //   auth,
        //   email,
        //   password
        // );
        // const userId = firebaseUser.user.uid;
        setEmail("");
        setPassword("");
        setLoading(false);
        setToastProps({
          message: response?.data?.message,
          type: "success",
          toastKey: Date.now(),
        });
        if (
          response?.data?.message ===
          "You are not verified, Please verify your email"
        ) {
          navigate(`/otp?email=${email}&action=login&type=provider`);
          return;
        }
        setTimeout(() => {
          navigate("/provider/upload");
        }, 2000);
        localStorage.setItem("ProviderToken", response?.data?.data?.token);
        localStorage.setItem(
          "ProviderRefreshToken",
          response?.data?.data?.user?.refreshToken
        );
        if (
          localStorage.getItem("notificationEnableProvider") === null ||
          localStorage.getItem("notificationEnableProvider") === "null" ||
          localStorage.getItem("notificationEnableProvider") === "" ||
          localStorage.getItem("notificationEnableProvider") === undefined
        ) {
          localStorage.setItem("notificationEnableProvider", true);
        }
        localStorage.setItem(
          "ProviderEmail",
          response?.data?.data?.user?.email
        );
        localStorage.setItem(
          "ProviderName",
          response?.data?.data?.user?.contactName
        );
        localStorage.setItem(
          "PlanType",
          response?.data?.data?.user?.subscriptionType
        );
        localStorage.setItem("ProviderId", response?.data?.data?.user?._id);

        localStorage.setItem("Guest", response?.data?.data?.user?.isGuestMode);
        localStorage.removeItem("hunterToken");
        localStorage.removeItem("hunterEmail");
        localStorage.removeItem("hunterName");
        localStorage.removeItem("hunterId");
        console.log(response);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setToastProps({
        message: error?.response?.data?.error,
        type: "error",
        toastKey: Date.now(),
      });
      if (error?.response?.data?.message && !error?.response?.data?.error) {
        setToastProps({
          message: error?.response?.data?.message,
          type: "error",
          toastKey: Date.now(),
        });
      }
    }
  };

  const handleGuest = () => {
    setTimeout(() => {
      // navigate("/provider/home?type=Guest");
      navigate("/provider/signup?type=Guest");
    }, 1000);
  };

  return (
    <>
      {loading === true ? (
        <Loader />
      ) : (
        <div className="bg-welcome">
          <Header />
          <div className="container login">
            <div className="d-flex justify-content-center align-items-center mt-4 flex-column gap-1">
              <h1 className="highlighted-text">Service Providers</h1>
              <div className="card shadow">
                <div className="card-body">
                  <h2 className="text-center fw-bold fs-1">LOGIN</h2>
                  <p className="text-center mt-lg-5 mb-lg-4">
                    Great You are Back
                  </p>

                  <Form className="pt-3">
                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formPlaintextEmail"
                    >
                      <Form.Label column sm="3">
                        Email
                      </Form.Label>
                      <Col sm="9">
                        <Form.Control
                          type="email"
                          placeholder="Email Address"
                          value={email}
                          onChange={(e) =>
                            setEmail(e.target.value.toLowerCase())
                          }
                        />
                      </Col>
                    </Form.Group>

                    {/* <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formPlaintextPassword"
                    >
                      <Form.Label column sm="3">
                        Password
                      </Form.Label>
                      <Col sm="7">
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </Col>
                    </Form.Group> */}

                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formPlaintextPassword"
                    >
                      <Form.Label column sm="3">
                        Password
                      </Form.Label>
                      <Col sm="9" className="position-relative">
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: "absolute",
                            right: "20px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                          }}
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </span>
                      </Col>
                    </Form.Group>
                  </Form>
                  <Link
                    to="/provider/forgetpassword"
                    className="highlighted-text text-decoration-none text-end d-flex justify-content-end pb-3"
                  >
                    Forgot Password
                  </Link>
                  <div className="d-flex justify-content-center align-items-center py-3">
                    <Button
                      variant="contained"
                      color="success"
                      className="rounded-0 custom-green bg-green-custom"
                      onClick={handleLogin}
                    >
                      Login
                    </Button>
                  </div>
                </div>
              </div>
              <span>Or sign in with</span>
              <div className="d-flex flex-row gap-3 align-items-center icons-color mt-2 mb-4">
                <div className="card shadow-lg rounded-5 border-0 d-flex align-items-center py-2 px-5 w-fit-content">
                  <Link to="/">
                    <img src={google} alt="google" className="" />
                  </Link>
                </div>
                <div className="card shadow-lg rounded-5 border-0 d-flex align-items-center  py-2 px-5 w-fit-content">
                  <Link to="/">
                    <img src={facebook} alt="facebook" />
                  </Link>
                </div>
              </div>
              <hr className="hr h-100" />
              <div className="hr mb-4">
                <Link to="/provider/signup" className="w-100 ">
                  <Button
                    variant="contained"
                    color="success"
                    className="fw-semibold custom-green-outline w-100 rounded-5 fs-5 mb-2"
                    size="small"
                  >
                    Create Account
                  </Button>
                </Link>

                <Button
                  variant="text"
                  color="success"
                  className="fw-semibold w-100 rounded-5 fs-5 mb-2"
                  size="small"
                  onClick={handleGuest}
                >
                  Continue As Guest
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toaster
        message={toastProps.message}
        type={toastProps.type}
        toastKey={toastProps.toastKey}
      />
    </>
  );
}
