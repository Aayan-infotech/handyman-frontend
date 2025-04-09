import { GoArrowRight } from "react-icons/go";
import { Row, Col, Form } from "react-bootstrap";
import logo from "./assets/logo.png";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "./axiosInstance";
import Container from "react-bootstrap/Container";
import Button from "@mui/material/Button";
import logoWhite from "../assets/logo-white.png";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaDribbble,
  FaLinkedin,
} from "react-icons/fa";
import Loader from "../Loader";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
export default function BlogDetail() {
  const { id } = useParams(); // Get the dynamic id from the URL
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`/blog/getAll`)
      .then((response) => {
        const allBlogs = response?.data?.blog;
        const currentBlog = allBlogs.find((b) => b._id.toString() === id);
        setBlog(currentBlog);
        setRelatedBlogs(
          allBlogs.filter((b) => b._id !== currentBlog?._id)
        ); 
      })
      .catch((error) => {
        console.error("Error fetching blog details:", error);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!blog)
    return <div className="text-center mt-5 text-danger">Blog not found!</div>;

  return (
    <>
      <Navbar collapseOnSelect expand="lg" className="position-relative z-1">
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
      <div className="container my-lg-5 mt-3 mb-4">
        <div className="row gy-4">
          <div className="col-lg-8">
            <div className="card shadow-lg p-4 border-0 rounded-3">
              <img
                src={blog.image}
                alt="Blog Thumbnail"
                className="img-fluid rounded mb-3"
                style={{
                  maxHeight: "300px",
                  width: "auto",
                  objectFit: "cover",
                }}
              />
              <h2 className=" mb-3">{blog.title}</h2>
              <p className="text-muted">
                Published on {new Date(blog.createdAt).toLocaleDateString()}.
              </p>
              <div
                className="content"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card shadow p-3 border-0 rounded-3">
              <h4 className="text-secondary">Related Blogs</h4>
              <ul className="list-unstyled mt-3">
                {relatedBlogs.map((relatedBlog) => (
                  <li key={relatedBlog._id} className="mb-2">
                    <Link
                      to={`/blog-detail/${relatedBlog._id}`}
                      className="text-decoration-none"
                    >
                      {relatedBlog.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
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
                      <a href="allblogs" className="text-light">
                        Blogs
                      </a>
                    </li>
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
