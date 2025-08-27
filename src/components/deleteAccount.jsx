import React from "react";
import { Container, Row, Col, Card, Alert, Badge } from "react-bootstrap";
import Header from "./Navbar";
import logoWhite from "../assets/logo-white.png";
import appleIcon from "../assets/apple.png";
import playIcon from "../assets/google.png";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaDribbble,
  FaLinkedin,
} from "react-icons/fa";
import { useParams, Link, useNavigate } from "react-router-dom";

const DeleteAccountPage = () => {
  return (
    <>
      <Header />
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <div className="text-center mb-5">
              <h1 className="display-5 fw-bold mb-3">Account Deletion</h1>
              <p className="lead text-muted">
                Learn how to delete your account and what happens to your data
              </p>
            </div>

            <Alert variant="warning" className="mb-4">
              <Alert.Heading>
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                Important Notice
              </Alert.Heading>
              Account deletion is Temporary and can be undone. Please review
              this information carefully.
            </Alert>

            <Card className="mb-4">
              <Card.Header className="bg-light">
                <h5 className="mb-0">
                  <i className="bi bi-trash-fill me-2 text-danger"></i>
                  How to Delete Your Account
                </h5>
              </Card.Header>
              <Card.Body>
                <ol className="list-group list-group-numbered">
                  <li className="list-group-item border-0">
                    Open the Settings app on your iOS device
                  </li>
                  <li className="list-group-item border-0">
                    Tap on your name at the top of the screen
                  </li>
                  <li className="list-group-item border-0">
                    Scroll down and select "Request to Delete Account"
                  </li>
                  <li className="list-group-item border-0">
                    Follow the on-screen instructions to confirm deletion
                  </li>
                </ol>
              </Card.Body>
            </Card>
            <Card className="border-0 bg-light">
              <Card.Body className="text-center py-4">
                <h5>Need Help?</h5>
                <p className="text-muted mb-3">
                  Contact our support team for assistance with account deletion
                </p>
                <div className="d-flex flex-row gap-3 align-items-center justify-content-center">
                  <button className="btn btn-outline-primary me-2">
                    <i className="bi bi-envelope me-1"></i> Email Support
                  </button>
                  <div className="">
                    <a
                      href="mailto:support@tradehunters.com"
                      className="text-dark text-decoration-none"
                    >
                      support@tradehunters.com
                    </a>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
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
                <a
                  href="https://www.facebook.com/tradehunters11/"
                  className="text-light bg-dark"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaFacebook size={16} />
                </a>
                <a href="#dribble" className="text-light">
                  <FaDribbble size={16} />
                </a>
                <a
                  href="https://www.instagram.com/tradehunters2025/"
                  className="text-light"
                  target="_blank"
                  rel="noreferrer"
                >
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
                      <Link to="/guide-and-updates" className="text-light">
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
    </>
  );
};

export default DeleteAccountPage;
