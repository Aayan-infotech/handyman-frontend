import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Header from "./component/Navbar";
import Button from "@mui/material/Button";
import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import "../user.css";
import facebook from "../assets/logo/facebook.png";
import google from "../assets/logo/iconGoogle.png";
import Toaster from "../../Toaster";
import axios from "axios";
import Loader from "../../Loader";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../Chat/lib/firestore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toastProps, setToastProps] = useState({ message: "", type: "", toastKey: 0 });
  const userType = "hunter";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();

    if(!email || !password){
      setToastProps({ message: "Please fill all fields", type: "error" , toastKey: Date.now() });
      return;
    }
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
        await signInWithEmailAndPassword(auth, email, password);
        setEmail("");
        setPassword("");
        setLoading(false);
        setToastProps({ message: response?.data?.message, type: "success" , toastKey: Date.now()});
        setTimeout(() => {
          navigate("/home");
        }, 2000);
        localStorage.setItem("hunterToken", response?.data?.data?.user.token);
        localStorage.setItem("hunterEmail", response?.data?.data?.user?.email);
        localStorage.setItem("hunterName", response?.data?.data?.user?.name);
        localStorage.setItem("hunterId", response?.data?.data?.user?._id);
        localStorage.removeItem("ProviderToken");
        localStorage.removeItem(
          "ProviderEmail"
        );
        localStorage.removeItem(
          "ProviderName"
        
        );
        localStorage.removeItem("ProviderId");
        localStorage.removeItem("ProviderUId");
        localStorage.removeItem("Guest");
        console.log(response);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setToastProps({ message: error?.response?.data?.error, type: "error" , toastKey: Date.now() });
      if (error?.response?.data?.message && !error?.response?.data?.error) {
        setToastProps({
          message: error?.response?.data?.message,
          type: "error",
          toastKey: Date.now()
        });
      }
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
              <div className="card shadow">
                <div className="card-body">
                  <h2 className="text-center fw-bold fs-1">LOGIN</h2>
                  <p className="text-center mt-lg-5 mb-lg-4">Great You are Back</p>
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
                    to="/forgot-password"
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

     <Toaster message={toastProps.message} type={toastProps.type} toastKey={toastProps.toastKey} />
    </>
  );
}
