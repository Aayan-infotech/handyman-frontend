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
import axiosInstance from "./components/axiosInstance";
import Loader from "./Loader";
import Chip from "@mui/material/Chip";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import appleIcon from "./assets/apple.png";
import playIcon from "./assets/google.png";
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
  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: 1,
    limit: 10,
    totalPages: 1,
  });

  const handlePageChange = async (page) => {
    if (page !== pagination.page) {
      setPagination((prev) => ({ ...prev, page }));
      await handleResponse(page);
    }
  };

  console.log("pagination", pagination);
  const handleResponse = async (page = pagination?.currentPage) => {
    setLoading(true);
    const response = await axiosInstance.get(`/jobs?page=${page}&total=${20}`);

    if (response.data.success === true || response.data.status === 200) {
      setLoading(false);
      setRecentJob(response?.data?.data?.jobPosts);
      setPagination(response?.data?.data?.pagination);
    }
  };
  useEffect(() => {
    handleResponse();
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
                     <Link to="/guide" style={{ fontWeight: "350" }}>
                                   Contact & Updates
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
          <div className="latest-job job-design-nonre pt-5">
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

                              <div className="d-flex justify-content-start align-items-start flex-column  flex-wrap">
                                <span className="text-muted">
                                  {item?.user?.name}
                                </span>
                                <span className="text-muted">
                                  {filterAddressPatterns(
                                    item?.jobLocation?.jobAddressLine
                                  )}
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
              {pagination.totalPages > 1 && (
                <Stack spacing={2} sx={{ mt: 4, pb: 4, alignItems: "center" }}>
                  <Pagination
                    count={pagination.totalPages}
                    page={pagination.currentPage}
                    onChange={(event, page) => handlePageChange(page)}
                    color="primary"
                    size="large"
                    variant="outlined"
                    shape="rounded"
                    siblingCount={1}
                    boundaryCount={1}
                    className="pagination-custom"
                    sx={{
                      "& .MuiPaginationItem-root": {
                        color: "#fff",
                        backgroundColor: "#4CAF50",
                        "&:hover": {
                          backgroundColor: "#388E3C",
                        },
                      },
                      "& .Mui-selected": {
                        backgroundColor: "#2E7D32",
                        "&:hover": {
                          backgroundColor: "#1B5E20",
                        },
                      },
                    }}
                  />
                </Stack>
              )}
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
                    <a href="https://www.instagram.com/tradehunters2025/" className="text-light" target="_blank" rel="noreferrer">
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
