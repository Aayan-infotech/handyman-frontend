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
import axios from "axios";
import Loader from "./Loader";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaDribbble,
} from "react-icons/fa";

export default function LatestJobs() {
  const [recentJob, setRecentJob] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleResponse = async () => {
      setLoading(true);
      const response = await axios.get("http://54.236.98.193:7777/api/jobs");
      console.log(response);
      if (response.data.success === true || response.data.status === 200) {
        setLoading(false);
        setRecentJob(response?.data?.data?.jobPosts);
      }
    };
    handleResponse();
  }, []);

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
              {/* <Nav className="me-auto d-flex flex-column flex-lg-row gap-4 gap-lg-5">
                <Link href="#">About UCCCs</Link>
                <a href="mailto:admin@tradehunters.com.au">Contact Us</a>
              </Nav> */}


              <Nav className="me-auto d-flex flex-column flex-lg-row gap-4 gap-lg-5">
                <Link href="#" style={{ fontWeight: '350' }}>About Us</Link>
                <Link to="/contact-us" style={{ fontWeight: '350' }}>Contact Us</Link>
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
          <div className="latest-job pt-5">
            <div className="container jobs my-5">
              <div className="d-flex justify-content-start justify-content-lg-between align-items-lg-end flex-column flex-md-row gap-3">
                <h2 className="mb-0">
                  Latest <span className="text-primary"> jobs open</span>
                </h2>
              </div>
              <div className="row gy-4 mt-4">
                {recentJob.map((item) => (
                  <div className="col-lg-6" key={item._id}>
                    <Link to="/welcome" className="text-decoration-none">
                      <div className="card border-0 rounded-0 px-4 py-2">
                        <div className="card-body">
                          <div className="d-flex flex-row gap-4 align-items-start">
                            <div className="d-flex flex-column gap-2 justify-content-start">
                              <div className="d-flex justify-content-start align-items-center">
                                <h6 className="mb-0">{item?.title}</h6>
                               
                              </div>

                              <div className="d-flex justify-content-start align-items-center flex-row  flex-wrap">
                                <span className="text-muted">
                                  {item?.user?.name}
                                </span>
                                <span className="text-muted">
                                  {item?.jobLocation?.jobAddressLine}
                                </span>
                              </div>
                              <Stack
                                direction="row"
                                className="flex-wrap gap-2 justify-content-start align-items-start"
                              >
                                {item.businessType.map((text, index) => (
                                  <>
                                    <Chip
                                      label={text}
                                      key={index}
                                      className=" green-line"
                                    />
                                  </>
                                ))}
                              </Stack>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
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
