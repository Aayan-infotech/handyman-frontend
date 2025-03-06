


import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Button from "@mui/material/Button";
import logo from "./assets/logo.png";
import Container from "react-bootstrap/Container";
import { Link, useParams } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import { GoArrowRight } from "react-icons/go";
import logoWhite from "./assets/logo-white.png";
import { Row, Col, Form } from "react-bootstrap";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaDribbble,
} from "react-icons/fa";
import axios from "axios";
import Loader from "./Loader";
import { useForm } from "react-hook-form"; // Importing React Hook Form

export default function Contact() {
  const { section } = useParams();
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(false);

  // React Hook Form setup
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Handle form submission
  const onSubmit = (data) => {

    const contactUsData ={
      name:data.name,
      email:data.email,
      message:data.message
    }
    console.log(data);  // For debugging: logs form data before submitting

    setLoading(true);  // Set loading to true while waiting for the API response

    axios
      .post("http://54.236.98.193:7777/api/contact/send", contactUsData)  // Sending form data to the API
      .then((response) => {
        console.log("Response from API:", response.data);
        setLoading(false);  // Reset loading state
        // Optionally, show success message to the user
      })
      .catch((error) => {
        console.error("There was an error sending the data:", error);
        setLoading(false);  // Reset loading state
        // Optionally, show error message to the user
      });
  };

  return (
    <>
      {loading === true ? (
        <Loader />
      ) : (
        <div className="">
          <div className="">
            <Navbar collapseOnSelect expand="lg" className="position-relative z-1">
              <Container fluid>
                <Link to="/" className="py-1">
                  <img src={logo} alt="logo" />
                </Link>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto d-flex flex-column flex-lg-row gap-4 gap-lg-5">
                  <Link href="#" style={{ fontWeight: '350' }}>About Us</Link>
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
                <Form onSubmit={handleSubmit(onSubmit)} className="contact-form">
                  <Form.Group controlId="name" className="mb-4">
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

                  <Form.Group controlId="email" className="mb-4">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Your Email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
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
                      {...register("message", { required: "Message is required" })}
                      isInvalid={!!errors.message}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.message?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button variant="contained" color="success" type="submit" className="w-100 py-2">
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
                <Col md={4} className="mb-4">
                  <img src={logoWhite} alt="logo" />
                  <p className="fw-normal mt-3">
                    Great platform for job seekers passionate about startups.
                    Find your dream job easier.
                  </p>
                </Col>

                <Col md={4} className="mb-4">
                  <Row>
                    <Col>
                      <h6 className="">About</h6>
                      <ul className="list-unstyled mt-4 d-flex flex-column gap-3">
                        <li>
                          <a href="#companies" className="text-light">
                            Companies
                          </a>
                        </li>
                        <li>
                          <a href="#pricing" className="text-light">
                            Pricing
                          </a>
                        </li>
                        <li>
                          <a href="#terms" className="text-light">
                            Terms
                          </a>
                        </li>
                        <li>
                          <a href="#advice" className="text-light">
                            Advice
                          </a>
                        </li>
                        <li>
                          <a href="#privacy" className="text-light">
                            Privacy Policy
                          </a>
                        </li>
                      </ul>
                    </Col>
                    <Col>
                      <h6>Resources</h6>
                      <ul className="list-unstyled mt-4 d-flex flex-column gap-3">
                        <li>
                          <a href="#help-docs" className="text-light">
                            Help Docs
                          </a>
                        </li>
                        <li>
                          <a href="#guide" className="text-light">
                            Guide
                          </a>
                        </li>
                        <li>
                          <a href="#updates" className="text-light">
                            Updates
                          </a>
                        </li>
                        <li>
                          <a href="#contact" className="text-light">
                            Contact Us
                          </a>
                        </li>
                      </ul>
                    </Col>
                  </Row>
                </Col>

                <Col md={4} className="mb-4">
                  <h6>Get job notifications</h6>
                  <p className="my-3">
                    The latest job news, articles, sent to your inbox weekly.
                  </p>
                  <Form>
                    <Form.Group className="d-flex">
                      <Form.Control
                        type="email"
                        placeholder="Email Address "
                        className="me-2 rounded-0"
                      />
                      <Button
                        variant="contained"
                        color="success"
                        className="custom-green px-5 py-2 rounded-0 bg-green-custom"
                      >
                        Subscribe
                      </Button>
                    </Form.Group>
                  </Form>
                </Col>
              </Row>

              <hr />
              <Row className="mt-4">
                <Col lg={6}>
                  <p className="text-start">
                    2024 @ Cloud Connect. All rights reserved.
                  </p>
                </Col>
                <Col lg={6}>
                  <div className="social-icons d-flex justify-content-center justify-content-lg-end gap-4 mb-3">
                    <a href="#facebook" className="text-light bg-dark">
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
              </Row>
            </Container>
          </footer>
        </div>
      )}
    </>
  );
}
