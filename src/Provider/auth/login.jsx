import react, { useState } from "react";
import Container from "react-bootstrap/Container";
import Header from "./component/Navbar";
import Button from "@mui/material/Button";
import logo from "../../assets/logo.png";
import { Link , useNavigate } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import "../../User/user.css";
import facebook from "../assets/logo/facebook.png";
import google from "../assets/logo/iconGoogle.png";
import Loader from "../../Loader";
import Toaster from "../../Toaster";
import axios from "axios"

export default function LoginProvider() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const userType = "provider";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toastProps, setToastProps] = useState({ message: "", type: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const response = await axios.post(
        "http://44.196.64.110:7777/api/auth/login",
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
        setLoading(false)
        setTimeout(() => {
          navigate("/provider/pricing");
        }, 4000);
        localStorage.setItem("ProviderToken", response?.data?.data?.token);
        console.log(response);
      }
    } catch (error) {
      console.log(error);
      setToastProps({ message: error?.response?.data?.error, type: "error" });
      if (error?.response?.data?.message && !error?.response?.data?.error) {
        setToastProps({
          message: error?.response?.data?.message,
          type: "error",
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
            </div>
          </div>
        </div>
      )}

      <Toaster message={toastProps.message} type={toastProps.type} />
    </>
  );
}
