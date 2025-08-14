import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import { ref, push, set, onValue, update } from "firebase/database";
import { realtimeDb } from "../../Chat/lib/firestore";
import Header from "./component/Navbar";
import Button from "@mui/material/Button";
import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import Col from "react-bootstrap/Col";
import { Eye, EyeOff } from "lucide-react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import "../user.css";
import facebook from "../assets/logo/facebook.png";
import google from "../assets/logo/iconGoogle.png";
import Toaster from "../../Toaster";
import axiosInstance from "../../components/axiosInstance";
import Loader from "../../Loader";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../Chat/lib/firestore";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const hunterUID = localStorage.getItem("hunterUId");
  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });
  const userType = "hunter";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const storeHunterInFirebase = async (userData) => {
    try {
      const hunterRef = ref(realtimeDb, `users/hunter/${userData._id}`);
      await set(hunterRef, {
        name: userData.name,
        email: userData.email,
        profileImage: userData.images || "",
      });
      console.log("Hunter data stored in Firebase successfully");
    } catch (error) {
      console.error("Error storing hunter data in Firebase:", error);
    }
  };
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
          // UID: hunterUID,
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

        // setEmail("");
        // setPassword("");
        // setLoading(false);
        setToastProps({
          message: response?.data?.message,
          type: "success",
          toastKey: Date.now(),
        });
        if (
          response?.data?.message ===
          "You are not verified, Please verify your email"
        ) {
          navigate(`/otp?email=${email}&action=login&type=hunter`);
          return;
        }
        console.log(response?.data?.data?.user);
        storeHunterInFirebase(response?.data?.data?.user);
        setTimeout(() => {
          navigate("/home");
        }, 2000);
        localStorage.setItem("hunterToken", response?.data?.data?.user.token);
        localStorage.setItem("hunterEmail", response?.data?.data?.user?.email);
        localStorage.setItem("hunterName", response?.data?.data?.user?.name);
        localStorage.setItem("hunterId", response?.data?.data?.user?._id);
        if (
          localStorage.getItem("notificationEnableHunter") === null ||
          localStorage.getItem("notificationEnableHunter") === "null" ||
          localStorage.getItem("notificationEnableHunter") === "" ||
          localStorage.getItem("notificationEnableHunter") === undefined
        ) {
          localStorage.setItem("notificationEnableProvider", true);
        }
        localStorage.setItem(
          "hunterRefreshToken",
          response?.data?.data?.user?.refreshToken
        );
        localStorage.removeItem("ProviderToken");
        localStorage.removeItem("ProviderEmail");
        localStorage.removeItem("ProviderName");
        localStorage.removeItem("ProviderId");
        localStorage.removeItem("ProviderUId");
        localStorage.removeItem("Guest");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setToastProps({
        message: error?.response?.data?.error || error.response?.data?.message,
        type: "error",
        toastKey: Date.now(),
      });
    }
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
              <h1 className="highlighted-text">Service Hunters</h1>

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
                          required
                          onKeyDown={(e) => e.key === "Enter" && handleLogin(e)}
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
                          required
                          onChange={(e) => setPassword(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleLogin(e)}
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
                    to="/forgot-password"
                    className="highlighted-text text-decoration-none text-end d-flex justify-content-end pb-3"
                  >
                    Forgot Password?
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
              {/* <span>Or sign in with</span>
              <div className="d-flex flex-row gap-3 align-items-center icons-color mt-2 mb-4">
                <div className="card shadow-lg rounded-5 border-0 d-flex align-items-center py-2 px-5 w-fit-content">
                  <Link to="/">
                    <img src={google} alt="google" className="" loading="lazy"/>
                  </Link>
                </div>
                <div className="card shadow-lg rounded-5 border-0 d-flex align-items-center  py-2 px-5 w-fit-content">
                  <Link to="/">
                    <img src={facebook} alt="facebook" loading="lazy"/>
                  </Link>
                </div>
              </div> */}
              <hr className="hr h-100" />
              <div className="hr mb-4">
                <Link to="/signup" className="w-100">
                  <Button
                    variant="contained"
                    color="success"
                    className="fw-semibold custom-green-outline w-100 rounded-5 fs-5"
                    size="small"
                  >
                    Create Account
                  </Button>
                </Link>
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
