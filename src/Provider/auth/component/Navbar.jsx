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
                              <Link href="#" style={{ fontWeight: "350" }}>
                                About Us
                              </Link>
                              <Link to="/contact-us" style={{ fontWeight: "350" }}>
                                Contact Us
                              </Link>
                            </Nav>
              
                            <Nav className="mb-4">
                              <Link to="/welcome">
                               
                              </Link>
                            </Nav>
                          </Navbar.Collapse>
                        </Container>
                      </Navbar>
    </>
  );
}
