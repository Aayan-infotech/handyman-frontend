import Container from "react-bootstrap/Container";
import React, { useEffect, useState } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "@mui/material/Button";
import Toaster from "../Toaster";
import logo from "../assets/logo.png";
import logoWhite from "../assets/logo-white.png";

import { GoArrowRight } from "react-icons/go";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { CiSearch } from "react-icons/ci";
import MenuItem from "@mui/material/MenuItem";
import { SlLocationPin } from "react-icons/sl";

import { Link } from "react-router-dom";
import { PiBagSimpleLight } from "react-icons/pi";
import Autocomplete from "react-google-autocomplete";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { LuDot } from "react-icons/lu";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { Row, Col, Form } from "react-bootstrap";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Select from "react-select";

import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaDribbble,
  FaLinkedin,
} from "react-icons/fa";
import axiosInstance from "./axiosInstance";
import appleIcon from "../assets/apple.png";
import playIcon from "../assets/google.png";
export default function AllBlogs() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/blog/getAll")
      .then((response) => {
        setBlogs(response.data.blog);
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
      });
  }, []);

  return (
    <>
      <Navbar collapseOnSelect expand="lg" className="position-relative z-1">
        <Container fluid>
          <Link to="/" className="py-1">
            <img src={logo} alt="logo" loading="lazy" />
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
      <div className="container mt-5">
        <Container>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <h2>
              All <span style={{ color: "#1976D2" }}>Blogs</span>
            </h2>
          </Grid>
          <Grid container spacing={4}>
            {blogs?.map((blog) => (
              <Grid item xs={12} sm={6} md={3} key={blog.id}>
                <Card sx={{ maxWidth: 400 }}>
                  <CardActionArea
                    component={Link}
                    to={`/blog-detail/${blog._id}`}
                  >
                    <CardMedia
                      component="img"
                      height="180"
                      image={blog.image}
                      alt={blog.title}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div">
                        {blog.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {blog.description}
                      </Typography>
                      <Typography
                        variant="caption"
                        display="block"
                        color="text.secondary"
                        mt={1}
                      >
                        {blog.date}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
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
    </>
  );
}
