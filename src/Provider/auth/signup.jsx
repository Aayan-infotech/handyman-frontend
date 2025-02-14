// SignUpProvider Component
import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Header from "./component/Navbar";
import Button from "@mui/material/Button";
import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import "../../User/user.css";
import { axiosInstance } from "../../axiosInstance";
import { IoImageOutline } from "react-icons/io5";
import axios from "axios";
import Toaster from "../../Toaster";
import Autocomplete from "react-google-autocomplete";
import Loader from "../../Loader";

export default function SignUpProvider() {
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [images, setImages] = useState(null);
  const [toastProps, setToastProps] = useState({ message: "", type: "" });
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !businessName ||
      !email ||
      !phoneNo ||
      !address ||
      !password ||
      !businessType ||
      !registrationNumber ||
      !serviceType
    ) {
      setToastProps({
        message: "Please fill all required fields",
        type: "error",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("businessName", businessName);
    formData.append("email", email);
    formData.append("phoneNo", phoneNo);
    formData.append("addressLine", address);
    formData.append("password", password);
    formData.append("businessType", businessType);
    formData.append("serviceType", serviceType);
    formData.append("ABN_Number", registrationNumber);
    formData.append("userType", "provider");
    formData.append("radius", "50");
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);

    if (images && images.length > 0) {
      formData.append("images", images[0]);
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://44.196.64.110:7777/api/auth/signup",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setToastProps({ message: response?.data?.message, type: "success" });
        setName("");
        setBusinessName("");
        setEmail("");
        setPhoneNo("");
        setAddress("");
        setPassword("");
        setLatitude(null);
        setLongitude(null);
        setImages(null);
        setLoading(false);
        setTimeout(() => {
          navigate(`/otp?email=${email}&type=provider`);
        }, 2000);
      }
    } catch (error) {
      setToastProps({
        message: "Sign up failed. Try again later.",
        type: "error",
      });
      console.log(error);
    } finally {
      setLoading(false);
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
              <h1 className="highlighted-text">Service Provider</h1>
              <div className="card shadow mb-4">
                <div className="card-body">
                  <h2 className="text-center fw-bold fs-1">Sign Up</h2>
                  <p className="text-center mt-4 mb-4">Let’s Get Started</p>
                  {images === null ? (
                    <>
                      <div className="position-relative">
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
                      </div>
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
                  <Form className="py-3">
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="5">
                        Name
                      </Form.Label>
                      <Col sm="7">
                        <Form.Control
                          type="text"
                          placeholder="Henry"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="5">
                        Business Industry
                      </Form.Label>
                      <Col sm="7">
                        <Form.Select
                          value={businessType}
                          onChange={(e) => setBusinessType(e.target.value)}
                          aria-label="Default select example"
                        >
                          <option>Industry</option>
                          <option value="One">One</option>
                          <option value="Two">Two</option>
                          <option value="Three">Three</option>
                        </Form.Select>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="5">
                        Service Industry
                      </Form.Label>
                      <Col sm="7">
                        <Form.Select
                          value={serviceType}
                          onChange={(e) => setServiceType(e.target.value)}
                          aria-label="Default select example"
                        >
                          <option>Industry</option>
                          <option value="Four">Four</option>
                          <option value="Five">Five</option>
                          <option value="Six">Six</option>
                        </Form.Select>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="5">
                        Business name
                      </Form.Label>
                      <Col sm="7">
                        <Form.Control
                          type="text"
                          placeholder="Business name"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="5">
                        Email Address
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

                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="5">
                        Phone Number
                      </Form.Label>
                      <Col sm="7">
                        <Form.Control
                          type="text"
                          placeholder="Phone number"
                          value={phoneNo}
                          onChange={(e) => setPhoneNo(e.target.value)}
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="5">
                        Address
                      </Form.Label>
                      <Col sm="7">
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

                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="5">
                        Registration number
                      </Form.Label>
                      <Col sm="7">
                        <Form.Control
                          type="text"
                          placeholder="Registration number"
                          value={registrationNumber}
                          onChange={(e) =>
                            setRegistrationNumber(e.target.value)
                          }
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="5">
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

                    <span>
                      By tapping “Sign Up” you accept our{" "}
                      <Link
                        to="/Provider/forgot-password"
                        className="highlighted-text text-decoration-none"
                      >
                        terms and conditions
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
                        to="/Provider/login"
                        className="highlighted-text text-decoration-none"
                      >
                        Signin
                      </Link>
                    </span>
                  </Form>
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
