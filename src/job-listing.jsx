import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Button from "@mui/material/Button";
import logo from "./assets/logo.png";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import { GoArrowRight } from "react-icons/go";
import logoWhite from "./assets/logo-white.png";
import { LuPencilRuler } from "react-icons/lu";
import { GiNetworkBars } from "react-icons/gi";
import { TbSpeakerphone } from "react-icons/tb";
import appleIcon from "./assets/apple.png";
import playIcon from "./assets/google.png";
import { PiBagSimpleLight } from "react-icons/pi";
import { GrGroup } from "react-icons/gr";
import { Row, Col, Form } from "react-bootstrap";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaDribbble,
} from "react-icons/fa";
import axiosInstance from "./components/axiosInstance";
import Loader from "./Loader";

export default function JobListing() {
  const [businessData, setBusinessData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleResponse = async () => {
      setLoading(true);
      const response = await axiosInstance.get("/jobpost/business-type-count");

      if (response.data.success === true || response.data.status === 200) {
        setLoading(false);
        setBusinessData(response?.data?.data);
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
          <div className="container category my-5">
            <div className="d-flex justify-content-start justify-content-lg-between align-items-lg-end flex-column flex-md-row gap-3">
              <h2 className="mb-0">
                Explore by <span className="highlighted-text">Categories</span>
              </h2>
            </div>
            <div className="row gy-4 mt-3">
              {businessData.map((item) => (
                <div className="col-lg-3" key={item.id}>
                  <Link to="/welcome" className="h-100">
                    <div className="card rounded-0 h-100">
                      <div className="card-body">
                        <div className="d-flex flex-column gap-4 justify-content-start">
                          <PiBagSimpleLight className="fs-3" />
                          <h6 className="mb-0 fw-normal fs-5">{item?.name}</h6>
                          {/* <a>
                            {item?.count} jobs available{" "}
                            <GoArrowRight className="fs-4 ms-1" />
                          </a> */}
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
                  <img src={logoWhite} alt="logo" loading="lazy" />
                  <p className="fw-normal mt-3">
                    Great platfrom for connecting service Hunters to Service
                    providers in Australia
                  </p>
                  <div className="social-icons d-flex justify-content-start gap-4 mb-3">
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
