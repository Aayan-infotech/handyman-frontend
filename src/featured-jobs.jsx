import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Button from "@mui/material/Button";
import logo from "./assets/logo.png";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import { GoArrowRight } from "react-icons/go";
import logoWhite from "./assets/logo-white.png";
import { Row, Col, Form } from "react-bootstrap";
import { LuDot } from "react-icons/lu";
import Chip from "@mui/material/Chip";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaDribbble,
} from "react-icons/fa";
import axiosInstance from "./components/axiosInstance";
import noImage from "./components/assets/noprofile.png";

export default function FeaturedJobs() {
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    axiosInstance.get("/provider/getAllProviders").then((res) => {
      setProviders(res?.data?.data);
    });
  }, []);

  const filterAddressState = (address) => {
    if (!address) return address;

    // Regular expression to match city and country at the end of the address
    // This assumes the address ends with ", City, Country" or similar
    const pattern = /.*,\s*([^,]+,\s*[^,]+)$/;

    const match = address.match(pattern);
    return match ? match[1].trim() : address;
  };
  return (
    <>
      <div className="">
        <Navbar collapseOnSelect expand="lg" className="position-relative z-1">
          <Container fluid>
            <Link to="/" className="py-1">
              <img src={logo} alt="logo" />
            </Link>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto d-flex flex-column flex-lg-row gap-4 gap-lg-5">
                <Link href="#">Find Jobs</Link>
                <Link href="#">Browse Companies</Link>
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
      <div className="container jobs my-5">
        <div className="d-flex justify-content-start justify-content-lg-between align-items-lg-end flex-column flex-md-row gap-3">
          <h2 className="mb-0">
            Featured <span className="text-primary">Jobs</span>
          </h2>
        </div>
        <div className="row gy-4 mt-4">
          {providers.map((item) => (
            <div className="col-lg-4" key={item._id}>
              <Link to="/welcome" className="text-decoration-none">
                <div className="card rounded-0 h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center flex-row">
                      <img
                        src={item?.images || noImage}
                        alt="company1"
                        className="img-fluid"
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                        }}
                      />
                      {/* <span className="border-full-time">Full Time</span> */}
                    </div>
                    <b>{item?.businessName}</b>
                    <div className="d-flex justify-content-start align-items-center flex-row my-2 flex-wrap">
                      <span>{item?.contactName}</span>
                      <LuDot className="text-secondary fs-4" />
                      <span>
                        {filterAddressState(item?.address?.addressLine)}
                      </span>
                    </div>
                    <span className="text-secondary">{item?.about}</span>
                    <div className="d-flex flex-row flex-wrap gap-2">
                      {item?.businessType.map((text, index) => (
                        <Chip key={index} label={text} className="green-line" />
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <footer className="footer text-light">
        <Container>
          <Row>
            {/* Left Section: Logo and Description */}
            <Col md={4} className="mb-4">
              <img src={logoWhite} alt="logo" />
              <p className="fw-normal mt-3">
                Great platfrom for connecting service Hunters to Service
                providers in Australia
              </p>
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
                      <a href="terms" className="text-light">
                        Terms
                      </a>
                    </li>
                    {/* <li>
                      <a href="#advice" className="text-light">
                        Advice
                      </a>
                    </li> */}
                    <li>
                      <a href="privacy" className="text-light">
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
                      <a href="/contact-us" className="text-light">
                        Contact Us
                      </a>
                    </li>
                  </ul>
                </Col>
              </Row>
            </Col>

            {/* Right Section: Subscription */}
            {/* <Col md={4} className="mb-4">
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
            </Col> */}
          </Row>

          <hr />
          <Row className="mt-4">
            <Col lg={6}>
              <p className="text-start">
                2025 @ TradeHunter. All rights reserved.
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
    </>
  );
}
