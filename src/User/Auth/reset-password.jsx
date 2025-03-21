import React, { useState } from "react";
import Header from "./component/Navbar";
import Button from "@mui/material/Button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import "../user.css";
import axios from "axios";
import Toaster from "../../Toaster";
import Loader from "../../Loader";
export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [toastProps, setToastProps] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const email = localStorage.getItem("verifyEmailOtp");
  const location = useLocation();
  const ProviderParams = location.pathname.includes("provider");
  console.log("ProviderParams", ProviderParams);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (newPassword !== password) {
      setToastProps({
        message: "Passwords do not match",
        type: "error",
        toastKey: Date.now(),
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://3.223.253.106:7777/api/auth/reset-password-with-otp",
        {
          email,
          newPassword,
        }
      );

      if (response.status === 200 || response.status === 201) {
        setToastProps({
          message: response?.data?.message,
          type: "success",
          toastKey: Date.now(),
        });
        localStorage.removeItem("verifyEmailOtp");
        setPassword("");
        setLoading(false);
        setNewPassword("");
        if (ProviderParams) {
          setTimeout(() => {
            navigate(`/provider/login`);
          }, 2000);
        } else {
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      }
      console.log(response.data);
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
                  <h2 className="text-center fw-bold fs-1">Reset Password</h2>
                  <p className="text-center mt-5 mb-4">
                    Please enter new password to reset password
                  </p>
                  <Form className="py-3">
                    <Form.Group as={Row} className="mb-3 ">
                      <Form.Label column sm="5" className="px-lg-0">
                        Enter new Password
                      </Form.Label>
                      <Col sm="7">
                        <Form.Control
                          type="password"
                          placeholder="Enter new Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3 ">
                      <Form.Label column sm="5" className="px-lg-0">
                        Confirm new password
                      </Form.Label>
                      <Col sm="7">
                        <Form.Control
                          type="password"
                          placeholder="Confirm new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </Col>
                    </Form.Group>
                  </Form>

                  <div className="d-flex justify-content-center align-items-center py-1">
                    <Button
                      variant="contained"
                      color="success"
                      className="rounded-0 custom-green bg-green-custom"
                      onClick={handleReset}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
              <span className="my-3">
                Go back to login page?{" "}
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

      <Toaster
        message={toastProps.message}
        type={toastProps.type}
        toastKey={toastProps.toastKey}
      />
    </>
  );
}
