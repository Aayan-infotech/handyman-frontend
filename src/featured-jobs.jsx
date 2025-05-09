import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Button from "@mui/material/Button";
import logo from "./assets/logo.png";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import { GoArrowRight } from "react-icons/go";
import logoWhite from "./assets/logo-white.png";
import { Row, Col } from "react-bootstrap";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Pagination from "react-bootstrap/Pagination";
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
import noImage from "./components/assets/noprofile.png";
import Loader from "./Loader";

export default function FeaturedJobs() {
  const [providers, setProviders] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProviders = async (page = 1, query = "") => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/provider/getAllProviders", {
        params: {
          page,
          limit: 9,
          ...(query && { search: query }),
        },
      });
      if (response.status === 200) {
        setProviders(response.data.data);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.page);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching providers:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleSearch = () => {
    fetchProviders(1, searchQuery);
  };

  const filterAddressState = (address) => {
    if (!address) return "";
    const pattern = /.*,\s*([^,]+,\s*[^,]+)$/;
    const match = address.match(pattern);
    return match ? match[1].trim() : address;
  };

  if (loading) return <Loader />;

  return (
    <>
      <div>
        <Navbar collapseOnSelect expand="lg" className="position-relative z-1">
          <Container fluid>
            <Link to="/" className="py-1">
              <img src={logo} alt="logo" />
            </Link>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
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

      <div className="container jobs my-5">
        <div className="d-flex justify-content-start justify-content-lg-between align-items-lg-end flex-column flex-md-row gap-3">
          <h2 className="mb-0">
            Featured <span className="text-primary">Businesses</span>
          </h2>
          <div className="d-flex flex-row gap-2 align-items-center navbar">
            <TextField
              id="standard-basic"
              label="Search by Business Type"
              variant="standard"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
            />

            <Button variant="contained" color="success" onClick={handleSearch}>
              Search
            </Button>
          </div>
        </div>

        <div className="row gy-4 mt-4">
          {providers.length > 0 ? (
            providers.map((item) => (
              <div className="col-lg-4" key={item._id}>
                <Link to="/welcome" className="text-decoration-none">
                  <div className="card rounded-0 h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center flex-row">
                        <img
                          src={item?.images || noImage}
                          alt="company"
                          className="img-fluid"
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                          }}
                        />
                      </div>
                      <b>{item?.businessName}</b>
                      <div className="d-flex justify-content-start align-items-start flex-column my-2">
                        <span>{item?.contactName}</span>
                        <span>
                          {filterAddressState(item?.address?.addressLine)}
                        </span>
                      </div>
                      <span className="text-secondary">{item?.about}</span>
                      <div className="d-flex flex-row flex-wrap gap-2">
                        {item?.businessType?.map((text, index) => (
                          <Chip
                            key={index}
                            label={text}
                            className="green-line"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <p>No businesses found</p>
            </div>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <Pagination className="justify-content-center pagination-custom mt-4">
          <Pagination.Prev
            disabled={currentPage === 1}
            onClick={() => fetchProviders(currentPage - 1, searchQuery)}
          />
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Pagination.Item
              key={page}
              active={page === currentPage}
              onClick={() => fetchProviders(page, searchQuery)}
            >
              {page}
            </Pagination.Item>
          ))}
          <Pagination.Next
            disabled={currentPage === totalPages}
            onClick={() => fetchProviders(currentPage + 1, searchQuery)}
          />
        </Pagination>
      )}

      <footer className="footer text-light">
        <Container>
          <Row>
            <Col md={4} className="mb-4">
              <img src={logoWhite} alt="logo" />
              <p className="fw-normal mt-3">
                Great platform for connecting service Hunters to Service
                providers in Australia
              </p>
            </Col>

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

            <Col md={4} className="mb-4">
              <h6>Download Our app</h6>
              <img
                src={playIcon}
                alt="play store icon"
                className="rounded-4 mb-4"
                style={{ height: "60px", width: "200px" }}
              />
              <img
                src={appleIcon}
                alt="apple store icon"
                className=" rounded-4"
                style={{ height: "60px", width: "200px" }}
              />
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
