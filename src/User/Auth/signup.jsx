import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./component/Navbar";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import "../user.css";
import { IoImageOutline } from "react-icons/io5";
import axios from "axios";
import Autocomplete from "react-google-autocomplete";
import Toaster from "../../Toaster";
import Loader from "../../Loader";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [toastProps, setToastProps] = useState({ message: "", type: "" });

  const navigate = useNavigate();

  const userType = "hunter";
  const radius = "50";

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phoneNo", phoneNo);
    formData.append("addressLine", address);
    formData.append("password", password);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    if (images && images.length > 0) {
      formData.append("images", images[0]);
    }
    formData.append("userType", userType);
    formData.append("radius", radius);

    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await axios.post(
        "http://44.196.64.110:7777/api/auth/signup",
        formData
      );
      if (response.status === 200 || response.status === 201) {
        setToastProps({ message: response?.data?.message, type: "success" });
        setName("");
        setEmail("");
        setPhoneNo("");
        setAddress("");
        setPassword("");
        setLatitude(null);
        setLongitude(null);
        setLoading(false);
        setImages(null);
        setTimeout(() => {
          navigate(`/otp?email=${email}`);
        }, 2000);
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

  return (
    <>
      {loading === true ? (
        <Loader />
      ) : (
        <div className="bg-signup">
          <Header />
          <div className="container top-avatar login">
            <div className="d-flex justify-content-center align-items-center mt-4 flex-column gap-1">
              <div className="card shadow mb-4">
                <div className="card-body">
                  <h2 className="text-center fw-bold fs-1">Sign Up</h2>
                  <div className="position-relative">
                    {images === null ? (
                      <>
                        <div className="mt-3 profile d-flex align-items-center justify-content-center flex-column">
                          <div className="color-profile d-flex flex-column justify-content-center align-items-center">
                            <IoImageOutline />
                            <span className="fs-6">Upload</span>
                          </div>
                        </div>
                        <Form.Control
                          className="pos-image-selector"
                          type="file"
                          multiple
                          onChange={(e) => setImages(e.target.files)}
                        />
                      </>
                    ) : (
                      <div className="mt-3 profile d-flex align-items-center justify-content-center flex-column">
                        <img
                          src={URL.createObjectURL(images[0])}
                          alt="profile"
                          className="profile-image"
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-center mt-3 mb-4">Let’s Get Started</p>
                  <Form className="py-3">
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="4">
                        Name
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          type="text"
                          placeholder="Henry"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="4">
                        Phone Number
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          type="text"
                          placeholder="Phone number"
                          value={phoneNo}
                          onChange={(e) => setPhoneNo(e.target.value)}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
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
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="4">
                        Address
                      </Form.Label>
                      <Col sm="8">
                        <Autocomplete
                          className="form-control"
                          apiKey="AIzaSyDg2wdDb3SFR1V_3DO2mNVvc01Dh6vR5Mc"
                          style={{ width: "100%" }}
                          onPlaceSelected={(place) => {
                            const formattedAddress =
                              place.formatted_address || place.name;
                            setAddress(formattedAddress);
                            setLatitude(place.geometry.location.lat());
                            setLongitude(place.geometry.location.lng());
                          }}
                          options={{
                            types: ["address"],
                          }}
                          defaultValue={address}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formPlaintextPassword"
                    >
                      <Form.Label column sm="4">
                        Password
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </Col>
                    </Form.Group>
                  </Form>
                  <span>
                    By tapping “Sign Up” you accept our{" "}
                    <Link
                      to="/forgot-password"
                      className="highlighted-text text-decoration-none"
                    >
                      terms and condition
                    </Link>
                  </span>

                  <div className="d-flex justify-content-center align-items-center py-3">
                    <Button
                      onClick={handleSignUp}
                      variant="contained"
                      color="success"
                      className="rounded-0 custom-green bg-green-custom"
                    >
                      Signup
                    </Button>
                  </div>
                  <span className="w-100 d-flex justify-content-center">
                    Go back to login page?{" "}
                    <Link
                      to="/login"
                      className="highlighted-text text-decoration-none"
                    >
                      Signin
                    </Link>
                  </span>
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
