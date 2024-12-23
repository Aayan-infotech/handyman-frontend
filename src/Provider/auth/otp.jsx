import React, { useState, useRef } from "react";
import Container from "react-bootstrap/Container";
import Header from "./component/Navbar";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { Row, Col } from "react-bootstrap";
import TextField from "@mui/material/TextField";
import "../../User/user.css";
export default function OtpProvider({ length = 4 }) {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return; // Only allow digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to the next input if available
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

  const getOtpValue = () => {
    alert(`Entered OTP: ${otp.join("")}`);
  };

  return (
    <div className="bg-welcome">
      <Header />
      <div className="container top-avatar login">
        <div className="d-flex justify-content-center align-items-center mt-4 flex-column gap-1">
        <h1 className="highlighted-text">Service Provider</h1>
        
          <div className="card shadow">
            <div className="card-body">
              <h2 className="text-center fw-bold fs-1">Reset Password</h2>
              <p className="text-center mt-5 mb-4">
                Please enter OTP to reset password
              </p>

              <Row className="justify-content-center">
                {otp.map((digit, index) => (
                  <Col key={index} xs="auto" className="otp-input">
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
                      onChange={(e) => handleChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onPaste={(e) => handlePaste(e)}
                      inputRef={(el) => (inputRefs.current[index] = el)}
                    />
                  </Col>
                ))}
              </Row>
              <div className="d-flex justify-content-center align-items-center pt-4">
                <Link
                  to="/provider/reset"
                  className="highlighted-text text-decoration-none"
                >
                  <Button
                    variant="contained"
                    color="success"
                    className="rounded-0 custom-green bg-green-custom"
                    onClick={getOtpValue}
                  >
                    Reset
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <span className="my-3">
            Go back to login page?{" "}
            <Link to="/Provider/login" className="highlighted-text text-decoration-none">
              Sign in
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
