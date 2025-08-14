import React, { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Button from "@mui/material/Button";
import logo from "./assets/logo.png";
import Container from "react-bootstrap/Container";
import { Link, useParams } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import { GoArrowRight } from "react-icons/go";
import logoWhite from "./assets/logo-white.png";
import { Row, Col, Form } from "react-bootstrap";
import appleIcon from "./assets/apple.png";
import playIcon from "./assets/google.png";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaDribbble,
} from "react-icons/fa";
import axiosInstance from "./components/axiosInstance";
import Loader from "./Loader";
import { useForm } from "react-hook-form"; // Importing React Hook Form
import { toast, ToastContainer } from "react-toastify"; // Importing Toastify

// You must import the CSS for Toastify to work properly
import "react-toastify/dist/ReactToastify.css";

export default function Contact() {
  const { section } = useParams();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Handle form submission
  const onSubmit = async (data) => {
    const contactUsData = {
      name: data.name,
      email: data.email,
      message: data.message,
      userType: data.userType,
    };

    setLoading(true);

    await axiosInstance
      .post("/contact/send", contactUsData)
      .then((response) => {
        setLoading(false);

        toast.success("Message sent successfully!");

        // Reset the form after successful submission
        reset();
      })
      .catch((error) => {
        console.error("There was an error sending the data:", error);
        setLoading(false); // Reset loading state

        // Show error toast
        toast.error(
          "There was an error sending your message. Please try again."
        );
      });
  };

  return (
    <>
      {loading === true ? (
        <Loader />
      ) : (
        <div className="">
          <div className="">
            <Navbar
              collapseOnSelect
              expand="lg"
              className="position-relative z-1"
            >
              <Container fluid>
                <Link to="/" className="py-1">
                  <img src={logo} alt="logo" loading="lazy" />
                </Link>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                  <Nav className="me-auto d-flex flex-column flex-lg-row gap-4 gap-lg-5">
                    <Link to="/about" style={{ fontWeight: "350" }}>
                      About Us
                    </Link>
                    <Link to="/contact-us" style={{ fontWeight: "350" }}>
                      Contact Us
                    </Link>
                  </Nav>
                  <Nav>
                    <Link to="/welcome">
                      <Button variant="contained" color="success">
                        Get Started <GoArrowRight className="fs-4 ms-1" />
                      </Button>
                    </Link>
                  </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>
          </div>

          {/* Contact Form Section */}
          <div className="container category my-5">
            <h2 className="text-center mb-4">Contact Us</h2>
            <Row className="gy-4">
              <Col md={8} className="mx-auto">
                <Form
                  onSubmit={handleSubmit(onSubmit)}
                  className="contact-form"
                >
                  <div className="d-flex flex-row gap-2 align-items-center">
                    <Form.Group controlId="name" className="mb-4  w-100">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Your Name"
                        {...register("name", { required: "Name is required" })}
                        isInvalid={!!errors.name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="userType" className="mb-4 w-100">
                      <Form.Label>User Type</Form.Label>
                      <Form.Select
                        {...register("userType", {
                          required: "User type is required",
                        })}
                        isInvalid={!!errors.userType}
                      >
                        <option value="">Select User Type</option>
                        <option value="hunter">Hunter</option>
                        <option value="provider">Provider</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.userType?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  <Form.Group controlId="email" className="mb-4">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Your Email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                          message: "Please enter a valid email address",
                        },
                      })}
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="message" className="mb-4">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="Your Message"
                      {...register("message", {
                        required: "Message is required",
                      })}
                      isInvalid={!!errors.message}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.message?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    variant="contained"
                    color="success"
                    type="submit"
                    className="w-100 py-2"
                  >
                    Send Message
                  </Button>
                </Form>
              </Col>
            </Row>
          </div>

          {/* Footer Section */}
          <footer className="footer text-light">
            <Container>
              <Row>
                {/* Left Section: Logo and Description */}
                <Col md={4} className="mb-4">
                  <img src={logoWhite} alt="logo" loading="lazy" />
                  <p className="fw-normal mt-3">
                    Great platfrom for connecting service Hunters to Service
                    providers in Australia
                  </p>
                  <div className="social-icons d-flex justify-content-start gap-4 mb-3">
                     <a href="https://www.facebook.com/tradehunters11/" className="text-light bg-dark" target="_blank" rel="noreferrer">
                      <FaFacebook size={16} />
                    </a>
                    <a href="#dribble" className="text-light">
                      <FaDribbble size={16} />
                    </a>
                    <a href="#instagram" className="text-light">
                      <FaInstagram size={16} />
                    </a>
                    <a href="#twitter" className="text-light">
                      <FaTwitter size={16} />
                    </a>
                    <a href="#linkedin" className="text-light">
                      <FaLinkedin size={16} />
                    </a>
                  </div>
                </Col>

                {/* Center Section: Links */}
                <Col md={4} className="mb-4">
                  <Row>
                    <Col>
                      <h6 className="">About</h6>
                      <ul className="list-unstyled mt-4 d-flex flex-column gap-3">
                        {/* <li>
                           <a href="#companies" className="text-light">
                             Companies
                           </a>
                         </li> */}
                        {/* <li>
                           <a href="#pricing" className="text-light">
                             Pricing
                           </a>
                         </li> */}
                        <li>
                          <Link to="/allblogs" className="text-light">
                            Blogs
                          </Link>
                        </li>
                        <li>
                          <Link to="/terms" className="text-light">
                            Terms
                          </Link>
                        </li>
                        {/* <li>
                           <a href="#advice" className="text-light">
                             Advice
                           </a>
                         </li> */}
                        <li>
                          <Link to="/privacy" className="text-light">
                            Privacy Policy
                          </Link>
                        </li>
                      </ul>
                    </Col>
                    <Col>
                      <h6>Resources</h6>
                      <ul className="list-unstyled mt-4 d-flex flex-column gap-3">
                        <li>
                          <Link to="/guide" className="text-light">
                            Guide & Updates
                          </Link>
                        </li>

                        <li>
                          <Link to="/contact-us" className="text-light">
                            Contact Us
                          </Link>
                        </li>
                      </ul>
                    </Col>
                  </Row>
                </Col>

                <Col md={4} className="mb-4">
                  <h6>Download Our app</h6>
                  <div className="d-flex flex-column">
                    <img
                      src={playIcon}
                      alt="play store icon"
                      className="rounded-4 mb-4"
                      style={{ height: "60px", width: "200px" }}
                      loading="lazy"
                    />
                    <img
                      src={appleIcon}
                      alt="apple store icon"
                      className=" rounded-4"
                      style={{ height: "60px", width: "200px" }}
                      loading="lazy"
                    />
                  </div>
                </Col>
              </Row>

              <hr />
              <Row className="mt-4">
                <Col lg={6}>
                  <p className="text-start">
                    2025 @ TradeHunters. All rights reserved.
                  </p>
                </Col>
                <Col lg={6}>
                  <p className="text-end">
                    Developed by{" "}
                    <a
                      href="https://aayaninfotech.com/"
                      target="_blank"
                      className="text-light text-decoration-none text-bold"
                    >
                      @Aayan Infotech
                    </a>
                  </p>
                </Col>
              </Row>
            </Container>
          </footer>
        </div>
      )}

      {/* Toastify Container */}
      <ToastContainer />
    </>
  );
}
