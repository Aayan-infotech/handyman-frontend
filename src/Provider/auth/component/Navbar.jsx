import React from "react";
import logo from "../../../assets/logo.png";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

import react from "react";

import { GoArrowRight } from "react-icons/go";

export default function Header() {
  const userType = location.pathname.startsWith("/provider") ? "/provider" : '';
  return (
    <>
      <Navbar collapseOnSelect expand="lg" className="position-relative z-1">
        <Container fluid>
          <Link to="/" className="py-1">
            <img src={logo} alt="logo" loading="lazy"/>
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
                   <Link
                                                    to="/guide-and-updates"
                                                    style={{ fontWeight: "350" }}
                                                  >
                                                    Guide & Updates
                                                  </Link>
            </Nav>

            <Nav>
              <div className="d-flex flex-row gap-1">
              <Link to={`${userType}/login`}>
                  <Button
                    variant="contained"
                    color="success"
                    className="rounded-0"
                    size="small"
                  >
                    Login
                  </Button>
                </Link>
                <hr className="h-100" />
                <Link to={`${userType}/signup`}>
                  <Button
                    variant="contained"
                    color="success"
                    className="rounded-0 custom-green-outline"
                    size="small"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
