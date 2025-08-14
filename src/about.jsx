import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Button from "@mui/material/Button";
import logo from "./assets/logo.png";
import Container from "react-bootstrap/Container";
import { Link, useParams, useNavigate } from "react-router-dom";
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
import LoggedHeader from "./components/loggedNavbar";

export default function About() {
  const { section } = useParams();
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const hunterToken = localStorage.getItem("hunterToken");
  const ProviderToken = localStorage.getItem("ProviderToken");
  const navCondition = ProviderToken || hunterToken;

  useEffect(() => {
    const handleResponse = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/StaticContent/${section}`);

        if (response.status === 200 && response.data.content) {
          setBusinessData(response.data.content);
        } else {
          navigate("/error"); // Redirect to error page if content not found
        }
      } catch (error) {
        console.error("Error fetching content:", error);
        navigate("/error"); // Redirect to error page on API failure
      } finally {
        setLoading(false);
      }
    };

    if (section) handleResponse();
    else navigate("/error"); // Redirect if section param is missing
  }, [section, navigate]);

  return (
    <>
      {loading === true ? (
        <Loader />
      ) : (
        <div className="">
          <div className="">
            {localStorage.getItem("ProviderToken") ||
            localStorage.getItem("hunterToken") ? (
              <LoggedHeader />
            ) : (
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
                    {/* <Nav className="me-auto d-flex flex-column flex-lg-row gap-4 gap-lg-5">
              <Link href="#">About UCCCs</Link>
              <a href="mailto:admin@tradehunters.com.au">Contact Us</a>
            </Nav> */}

                    <Nav className="me-auto d-flex flex-column flex-lg-row gap-4 gap-lg-5">
                      <Link to="/about" style={{ fontWeight: "350" }}>
                        About Us
                      </Link>
                      <Link to="/contact-us" style={{ fontWeight: "350" }}>
                        Contact Us
                      </Link>
                    </Nav>

                    <Nav>
                      <Link
                        to={
                          navCondition
                            ? hunterToken
                              ? "/home"
                              : "/provider/home"
                            : "/welcome"
                        }
                      >
                        <Button variant="contained" color="success">
                          {navCondition ? "Get Back" : "Get Started"}
                          <GoArrowRight className="fs-4 ms-1" />
                        </Button>
                      </Link>
                    </Nav>
                  </Navbar.Collapse>
                </Container>
              </Navbar>
            )}
          </div>
          <div className="container category my-5">
            <div className="row gy-4 mt-3">
              <div dangerouslySetInnerHTML={{ __html: businessData }} />
            </div>
          </div>
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
    </>
  );
}
