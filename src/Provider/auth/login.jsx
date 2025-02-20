import react, { useState } from "react";
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
import axios from "axios";

export default function LoginProvider() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const userType = "provider";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toastProps, setToastProps] = useState({ message: "", type: "" });
  const [guestLocation, setGuestLocation] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://54.236.98.193:7777/api/auth/login",
        {
          email: email,
          password: password,
          userType: userType,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setToastProps({ message: response?.data?.message, type: "success" });
        setEmail("");
        setPassword("");
        setLoading(false);
        setTimeout(() => {
          navigate("/provider/upload");
        }, 4000);
        localStorage.setItem("ProviderToken", response?.data?.data?.token);
        localStorage.setItem(
          "ProviderEmail",
          response?.data?.data?.user?.email
        );
        localStorage.setItem(
          "ProviderName",
          response?.data?.data?.user?.contactName
        );
        localStorage.setItem("ProviderId", response?.data?.data?.user?._id);
        localStorage.setItem("Guest", "false");
        localStorage.removeItem("guestLocation");
        console.log(response);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setToastProps({ message: error?.response?.data?.error, type: "error" });
      if (error?.response?.data?.message && !error?.response?.data?.error) {
        setToastProps({
          message: error?.response?.data?.message,
          type: "error",
        });
      }
    }
  };

  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          setGuestLocation(newLocation);

          // Save the new location to localStorage
          localStorage.setItem("guestLocation", JSON.stringify(newLocation));
        },
        (error) => {
          setToastProps({ message: error?.message, type: "error" });
        }
      );
    } else {
      setToastProps({
        message: "Geolocation is not supported by this browser.",
        type: "error",
      });
    }
  };

  // Retrieve from localStorage
  const savedLocation = JSON.parse(localStorage.getItem("guestLocation"));
  console.log(savedLocation);

  const handleGuest = () => {
    localStorage.setItem("Guest", "true");
    getLocation();
    setTimeout(() => {
      navigate("/provider/home?type=Guest");
    }, 2000);
  };

  return (
    <>
      {loading === true ? (
        <Loader />
      ) : (
        <div className="bg-welcome">
          <Header />
          <div className="container top-avatar login">
            <div className="d-flex justify-content-center align-items-center mt-4 flex-column gap-1">
              <h1 className="highlighted-text">Service Provider</h1>
              <div className="card shadow">
                <div className="card-body">
                  <h2 className="text-center fw-bold fs-1">LOGIN</h2>
                  <p className="text-center mt-5 mb-4">Great You are Back</p>

                  <Form className="py-3">
                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formPlaintextEmail"
                    >
                      <Form.Label column sm="3">
                        Email
                      </Form.Label>
                      <Col sm="7">
                        <Form.Control
                          type="email"
                          placeholder="Email Address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group
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
                    </Form.Group>
                  </Form>
                  <Link
                    to="/provider/forgetpassword"
                    className="highlighted-text text-decoration-none text-end d-flex justify-content-end py-3"
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

      <Toaster message={toastProps.message} type={toastProps.type} />
    </>
  );
}
