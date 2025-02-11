import react, { useState } from "react";
import Container from "react-bootstrap/Container";
import Header from "./component/Navbar";
import Button from "@mui/material/Button";
import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import "../user.css";
import Toaster from "../../Toaster";
import axios from "axios";
import Loader from "../../Loader";
import facebook from "../assets/logo/facebook.png";
import google from "../assets/logo/iconGoogle.png";
export default function ForgetPassword() {
  const [toastProps, setToastProps] = useState({ message: "", type: "" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://44.196.64.110:7777/api/auth/forgot-password",
        {
          email,
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
        setLoading(false);
        setTimeout(() => {
          navigate(`/forgot-password/otp?email=${email}`);
        }, 2000);
        // localStorage.setItem("hunterToken", response?.data?.data?.token);
        console.log(response);
      }
    } catch (error) {
      console.log(error);
      setLoading(false)
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
              <div className="card shadow">
                <div className="card-body">
                  <h2 className="text-center fw-bold fs-1">Forget Password</h2>
                  <p className="text-center mt-5 mb-4">
                    Please enter your registered email to reset password
                  </p>
                  <Form className="py-3">
                    <Form.Group
                      as={Row}
                      className="mb-3 "
                      controlId="formPlaintextEmail"
                    >
                      <Form.Label column sm="4">
                        Email Address
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          type="email"
                          placeholder="Email Address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </Col>
                    </Form.Group>
                  </Form>

                  <div className="d-flex justify-content-center align-items-center py-1">
                    <Button
                      variant="contained"
                      color="success"
                      className="rounded-0 custom-green bg-green-custom"
                      onClick={handleForgot}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
              <span className="my-3">
                <Link
                  to="/login"
                  className="highlighted-text text-decoration-none"
                >
                  Sign in
                </Link>
              </span>
            </div>
          </div>
        </div>
      )}

      <Toaster message={toastProps.message} type={toastProps.type} />
    </>
  );
}
