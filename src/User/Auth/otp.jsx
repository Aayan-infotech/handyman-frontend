import React, { useState, useRef, useEffect } from "react";
import Header from "./component/Navbar";
import Button from "@mui/material/Button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import TextField from "@mui/material/TextField";
import "../user.css";
import Loader from "../../Loader";
import Toaster from "../../Toaster";
import axiosInstance from "../../components/axiosInstance";
import axios from "axios";
export default function Otp({ length = 6 }) {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });
  const [otpValue, setOtpValue] = useState("");
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email");
  const Provider = searchParams.get("type");
  const ProviderParams = location.pathname.includes("provider");
  const forgetValidation = localStorage.getItem("forgetEmail");

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault(); // Prevent default behavior of clearing the input
      const newOtp = [...otp];
      newOtp[index] = ""; // Clear the current index value
      setOtp(newOtp);

      // Move focus to the previous input if available
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, length);
    const newOtp = pasteData
      .split("")
      .map((char, i) => (/[0-9]/.test(char) ? char : otp[i]));
    setOtp(newOtp);
    // Autofocus the last filled input
    const lastIndex = Math.min(pasteData.length, length) - 1;
    if (inputRefs.current[lastIndex]) {
      inputRefs.current[lastIndex].focus();
    }
  };
  useEffect(() => {
    setOtpValue(otp.join(""));
  }, [otp]);

  const handleOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://54.147.249.209:7777/api/auth/verify-email",
        {
          email,
          verificationOTP: otpValue,
          userType: Provider || "hunter",
        }
      );
      if (response.status === 200 || response.status === 201) {
        setToastProps({
          message: response?.data?.message,
          type: "success",
          toastKey: Date.now(),
        });

        setOtp(Array(length).fill(""));
        if (ProviderParams) {
          localStorage.setItem("verifyEmailOtp", email);
          setLoading(false);
          setTimeout(() => {
            navigate(`/provider/login`);
          }, 2000);
        } else {
          localStorage.setItem("verifyEmailOtp", email);
          setLoading(false);
          setTimeout(() => {
            navigate(`/login`);
          }, 2000);
        }
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

  const handleForgetOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://54.147.249.209:7777/api/auth/verify-otp",
        {
          email,
          verificationOTP: otpValue,
        }
      );
      if (response.status === 200 || response.status === 201) {
        setToastProps({
          message: response?.data?.message,
          type: "success",
          toastKey: Date.now(),
        });
        setLoading(false);
        setOtp(Array(length).fill(""));

        localStorage.setItem("verifyEmailOtp", email);
        if (ProviderParams) {
          localStorage.removeItem("forgetEmail");
          setTimeout(() => {
            navigate(`/provider/reset-password`);
          }, 2000);
        } else {
          localStorage.removeItem("forgetEmail");
          setTimeout(() => {
            navigate(`/reset-password`);
          }, 2000);
        }
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

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://54.147.249.209:7777/api/auth/resendOtp",
        {
          email,
          userType: ProviderParams ? "provider" : "hunter",
        }
      );
      if (response.status === 200 || response.status === 201) {
        setToastProps({
          message: response?.data?.message,
          type: "success",
          toastKey: Date.now(),
        });
        setLoading(false);
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
                  <h2 className="text-center fw-bold fs-1">Verify OTP</h2>
                  <p className="text-center mt-5 mb-4">
                    Please enter OTP to verify your account
                  </p>

                  <Row className="justify-content-center">
                    {Array.isArray(otp) &&
                      otp.map((digit, index) => (
                        <Col key={index} xs="2" className="otp-input">
                          <TextField
                            variant="outlined"
                            className="rounded-0"
                            inputProps={{
                              maxLength: 1,
                              style: {
                                textAlign: "center",
                                fontSize: "1rem",
                                width: "2rem",
                                borderRadius: "10px",
                                border: "0",
                              },
                            }}
                            value={digit}
                            onChange={(e) =>
                              handleChange(e.target.value, index)
                            }
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onPaste={(e) => handlePaste(e)}
                            inputRef={(el) => (inputRefs.current[index] = el)}
                          />
                        </Col>
                      ))}
                  </Row>

                  <div className="d-flex justify-content-center flex-column align-items-center pt-4 gap-4">
                    <Button
                      variant="contained"
                      color="success"
                      className="rounded-0 custom-green bg-green-custom"
                      onClick={forgetValidation ? handleForgetOtp : handleOtp}
                    >
                      {forgetValidation ? "Reset" : "Verify"}
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      className="rounded-0 custom-green-outline bg-green-custom"
                      style={{ maxWidth: "180px" }}
                      onClick={() => handleResendOtp()}
                    >
                      Resend OTP
                    </Button>
                    <p className="text-secondary pt-2 text-center">
                      Please check your spam folder if you don't receive OTP
                    </p>
                  </div>
                </div>
              </div>
              <span className="my-3">
                Go back to login page?{" "}
                <Link
                  to={ProviderParams === true ? "/provider/login" : "/login"}
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
