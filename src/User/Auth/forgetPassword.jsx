import React, { useState } from "react";
import Header from "./component/Navbar";
import Button from "@mui/material/Button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import "../user.css";
import Toaster from "../../Toaster";
import axiosInstance from "../../components/axiosInstance";
import Loader from "../../Loader";

export default function ForgetPassword() {
  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const ProviderParams = location.pathname.includes("provider");
  console.log("ProviderParams", ProviderParams);
  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        "/auth/forgot-password",
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
        localStorage.setItem("forgetEmail", email);
        setToastProps({
          message: response?.data?.message,
          type: "success",
          toastKey: Date.now(),
        });
        setEmail("");
        setLoading(false);
        if (ProviderParams) {
          setTimeout(() => {
            navigate(`/provider/otp?email=${email}&type=provider`);
          }, 2000);
        } else {
          setTimeout(() => {
            navigate(`/otp?email=${email}`);
          }, 2000);
        }

        // localStorage.setItem("hunterToken", response?.data?.data?.token);
        console.log(response);
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
          <div className="container top-avatar login">
            <div className="d-flex justify-content-center align-items-center mt-4 flex-column gap-1">
              {ProviderParams ? (
                <h1 className="highlighted-text">Service Provider</h1>
              ) : null}
              <div className="card shadow">
                <div className="card-body">
                  <h2 className="text-center fw-bold fs-1">Forgot Password</h2>
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
