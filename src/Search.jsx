import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdMessage, MdOutlineSupportAgent } from "react-icons/md";
import { BiCoinStack } from "react-icons/bi";
import { Row, Col } from "react-bootstrap";
import { PiBag } from "react-icons/pi";
import Button from "@mui/material/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import axiosInstance from "./components/axiosInstance";
import Navbar from "react-bootstrap/Navbar";
import logo from "./assets/logo.png";
import { GoArrowRight } from "react-icons/go";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaFacebook,
  FaDribbble,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa"; // Add social icons
import Loader from "./Loader";
import Toaster from "./Toaster";
import noData from "./assets/no_data_found.gif";
import logoWhite from "./assets/logo-white.png";
function Search() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });

  const latitude = searchParams.get("lat");
  const longitude = searchParams.get("lng");
  const businessType = searchParams.get("businessType");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const filteredJobs = data?.filter((job) =>
    job.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClick = () => {
    navigate("/login");
  };

  const handleSearchJob = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post(`/provider/getProvidersListing`, {
        businessType: [businessType],
        lat: latitude,
        lng: longitude,
      });
      if (res.data.status === 200) {
        setData(res.data.data);
        setLoading(false);
        setToastProps({
          message: res.data.message,
          type: "success",
          toastKey: Date.now(),
        });
      }
    } catch (error) {
      setLoading(false);
      setToastProps({
        message: error,
        type: "error",
        toastKey: Date.now(),
      });
    }
  };

  useEffect(() => {
    handleSearchJob();
  }, []);

  const filterAddressPatterns = (address) => {
    if (!address) return address;

    // Regular expression to match patterns like C-84, D-19, etc.
    const pattern = /^.*?,\s*/;

    return address.replace(pattern, "").trim();
  };

  return (
    <>
      {loading === true ? (
        <Loader />
      ) : (
        <>
          <Navbar
            collapseOnSelect
            expand="lg"
            className="position-relative z-1"
          >
            <Container fluid>
              <Link to="/" className="py-1">
                <img src={logo} alt="logo" />
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
          <div className="bg-second py-3">
            <div className="container top-section-main">
              <div className="row gy-4 management">
                {filteredJobs?.length === 0 ? (
                  <div className="d-flex justify-content-center">
                    <img
                      src={noData}
                      alt="No Data Found"
                      className="w-nodata"
                    />
                  </div>
                ) : (
                  filteredJobs.map((job) => (
                    <div className="col-lg-12" key={job._id}>
                      <div className="card border-0 rounded-5 shadow px-4">
                        <div className="card-body">
                          <div className="row gy-4 gx-1 align-items-center">
                            <div className="col-lg-4">
                              <div className="d-flex flex-row gap-3 align-items-center">
                                <div className="d-flex flex-column align-items-start gap-1">
                                  <h3 className="mb-0">{job?.businessName}</h3>
                                  <h6>ABN No:{job?.ABN_Number}</h6>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="d-flex flex-column flex-lg-row gap-2 gap-lg-4 align-items-start">
                                <div className="d-flex flex-row gap-2 align-items-center flex-wrap w-100">
                                  <PiBag />
                                  <h5 className="mb-0 text-trun">
                                    {filterAddressPatterns(
                                      job?.address?.addressLine
                                    )}
                                  </h5>
                                  <h6 className="mb-0 text-trun">
                                    {job?.about}
                                  </h6>
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

          <Toaster
            message={toastProps.message}
            type={toastProps.type}
            toastKey={toastProps.toastKey}
          />
        </>
      )}
    </>
  );
}

export default Search;
