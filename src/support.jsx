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
import LoggedHeader from "./components/loggedNavbar"; // Imported LoggedNavbar
import axiosInstance from "./components/axiosInstance";
import Loader from "./Loader";
import { useForm } from "react-hook-form"; // Importing React Hook Form
import { toast, ToastContainer } from "react-toastify"; // Importing Toastify
import "react-toastify/dist/ReactToastify.css";

export default function Support() {
  const { section } = useParams();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Check if Hunter Token exists
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("hunterToken");
    if (token) {
      setIsLoggedIn(true); // If the token exists, set the logged-in state to true
    } else {
      setIsLoggedIn(false); // Otherwise, set it to false
    }
  }, []);

  // Handle form submission
  const onSubmit = (data) => {
    const contactUsData = {
      name: data.name,
      email: data.email,
      message: data.message,
    };

    setLoading(true);

    axiosInstance
      .post("/contact/send", contactUsData)
      .then((response) => {
        setLoading(false);
        toast.success("Message sent successfully!");
        reset();
      })
      .catch((error) => {
        setLoading(false);
        toast.error("There was an error sending your message.");
      });
  };

  return (
    <>
      {loading === true ? (
        <Loader />
      ) : (
        <div className="support-page">
          {/* Conditional Rendering of Navbar */}
          {isLoggedIn ? (
            <LoggedHeader /> // Display the logged navbar if logged in
          ) : (
            <Navbar
              collapseOnSelect
              expand="lg"
              className="position-relative z-1"
            >
              <Container fluid>
                <Link to="/" className="py-1">
                  <img src={logo} alt="logo" loading="lazy"/>
                </Link>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse
                  id="responsive-navbar-nav"
                  className="px-3 pt-2 p-lg-0"
                >
                  <Nav className="me-auto d-flex flex-column flex-lg-row gap-2 gap-lg-5 ">
                    <Link to="/about" style={{ fontWeight: "350" }}>
                      About Us
                    </Link>
                    <Link to="/contact-us" style={{ fontWeight: "350" }}>
                      Contact Us
                    </Link>
                     <Link to="/guide" style={{ fontWeight: "350" }}>
                                   Contact & Updates
                                  </Link>
                  </Nav>

                  <Nav className="mb-4">
                    <Link to="/welcome">
                      <Button variant="contained" color="success">
                        Get Started <GoArrowRight className="fs-4 ms-1" />
                      </Button>
                    </Link>
                  </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>
          )}

          {/* Contact Form Section */}
          <section className="contact-section my-5 py-5 container-fluid">
            <h2 className="section-title text-center mb-4">Follow Us</h2>
            <Row className="gy-4">
              <Col md={8} className="mx-auto">
                <Form
                  onSubmit={handleSubmit(onSubmit)}
                  className="contact-form"
                >
                  <Form.Group controlId="name" className="mb-4">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Your Name"
                      {...register("name", { required: "Name is required" })}
                      isInvalid={!!errors.name}
                      className="form-control-custom"
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
                          value:
                            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                          message: "Please enter a valid email address",
                        },
                      })}
                      isInvalid={!!errors.email}
                      className="form-control-custom"
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
                      className="form-control-custom"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.message?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    variant="contained"
                    color="success"
                    type="submit"
                    className="w-100 py-2 send-btn"
                  >
                    Send Message
                  </Button>
                </Form>
              </Col>
            </Row>
          </section>
        </div>
      )}

      {/* Toastify Container */}
      <ToastContainer />
    </>
  );
}
