
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { MdMessage, MdOutlineSupportAgent } from "react-icons/md";
import { BiCoinStack } from "react-icons/bi";
import { Row, Col } from 'react-bootstrap';

import { PiBag } from "react-icons/pi";
import Button from "@mui/material/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logo from "./assets/logo.png";
import { GoArrowRight } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import { FaFacebook, FaDribbble, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa'; // Add social icons

import logoWhite from './assets/logo-white.png'
function Search() {
  // Dummy data for job listings
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const dummyJobs = [
    {
      id: 1,
      title: "Software Developer",
      createdAt: "2025-03-01T00:00:00Z",
      estimatedBudget: 5000,
      jobLocation: {
        jobAddressLine: "123 Tech Street, Silicon Valley",
      },
    },
    {
      id: 2,
      title: "Product Manager",
      createdAt: "2025-02-15T00:00:00Z",
      estimatedBudget: 7000,
      jobLocation: {
        jobAddressLine: "456 Startup Avenue, San Francisco",
      },
    },
  ];

  const filteredJobs = dummyJobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClick = () => {
    navigate('/welcome'); // Navigate to /login route
  };

  return (
    <>
      <Navbar collapseOnSelect expand="lg" className="position-relative z-1">
        <Container fluid>
          <Link to="/" className="py-1">
            <img src={logo} alt="logo" />
          </Link>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto d-flex flex-column flex-lg-row gap-4 gap-lg-5">
              <Link to="#" style={{ fontWeight: "350" }}>About Us</Link>
              <Link to="/contact-us" style={{ fontWeight: "350" }}>Contact Us</Link>
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

      <div className="message">
        <Link to="/message">
          <MdMessage />
        </Link>
      </div>

      <div className="bg-second py-3">
        <div className="container top-section-main">
          <div className="row mt-4 gy-4 management">
            {filteredJobs.length === 0 ? (
              <div className="d-flex justify-content-center">
                <h4>No job requests found.</h4>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div className="col-lg-12" key={job.id}>
                  <div className="card border-0 rounded-3 px-4">
                    <div className="card-body">
                      <div className="row gy-4 gx-1 align-items-center">
                        <div className="col-lg-3">
                          <div className="d-flex flex-row gap-3 align-items-center">
                            <div className="d-flex flex-column align-items-start gap-1">
                              <h3 className="mb-0">{job.title}</h3>
                              <h6>{new Date(job.createdAt).toDateString()}</h6>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-7">
                          <div className="d-flex flex-column flex-lg-row gap-2 gap-lg-4 align-items-center">
                            <div className="d-flex flex-row gap-2 align-items-center">
                              <BiCoinStack />
                              <h5 className="mb-0">${job.estimatedBudget}</h5>
                            </div>
                            <div className="d-flex flex-row gap-2 align-items-center">
                              <PiBag />
                              <h5 className="mb-0 text-trun">
                                {job.jobLocation.jobAddressLine}
                              </h5>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-2">
                          <Button
                            variant="contained"
                            className="custom-green bg-green-custom rounded-5 py-3 w-100"
                            onClick={handleClick} // Button click triggers the navigation
                          >
                            Contact
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer text-light">
        <Container>
          <Row>
            {/* Left Section: Logo and Description */}
            <Col md={4} className="mb-4">
              <img src={logoWhite} alt="logo" />
              <p className="fw-normal mt-3">
                Great platform for connecting service Hunters to Service
                providers in Australia
              </p>
            </Col>

            {/* Center Section: Links */}
            <Col md={4} className="mb-4">
              <Row>
                <Col>
                  <h6>About</h6>
                  <ul className="list-unstyled mt-4 d-flex flex-column gap-3">
                    <li>
                      <a href="terms" className="text-light">
                        Terms
                      </a>
                    </li>
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

export default Search;
