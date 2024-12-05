import react from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "@mui/material/Button";
import logo from "./assets/logo.png";
import { Link } from "react-router-dom";
import { GoArrowRight } from "react-icons/go";
import bigLogo from "./assets/big-logo.png";
import logoText from "./assets/logo-text.png";
import female from "./assets/female.png";
import male from "./assets/male.png";
export default function Welcome() {
  return (
    <>
    <div className="bg-welcome">
      <Navbar collapseOnSelect expand="lg" className="position-relative z-1">
        <Container fluid>
        <Link to="/" className="py-1">
              <img src={logo} alt="logo" />
            </Link>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto d-flex flex-column flex-lg-row gap-4 gap-lg-5">
              <Link href="#">Find Jobs</Link>
              <Link href="#">Browse Companies</Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="container top-avatar">
        <div className="d-flex justify-content-center align-items-center flex-column gap-1">
          <img src={bigLogo} alt="" />
          <img src={logoText} alt="" />
          <b className="fs-2">Continue as</b>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor{" "}
          </p>
          <div className="d-flex flex-column flex-lg-row gap-4 align-items-center avatar-selection">
            <a href="#">
            <div className="card border-0 shadow-lg rounded-4 px-4 pe-5 py-2">
              <div className="card-body">
                <div className="d-flex flex-column flex-lg-row align-items-center gap-4">
                  <img src={female} alt="" />
                  <div className="d-flex flex-column align-items-center align-items-lg-start">
                    <h5>Service hunter</h5>
                    <p>
                      Finding a service here never <br /> been easier than
                      before
                    </p>
                  </div>
                </div>
              </div>
            </div>
            </a>
            <a href="#" className="">
            <div className="card border-0 shadow-lg rounded-4 px-4 pe-5 py-2 ">
              <div className="card-body">
                <div className="d-flex flex-column flex-lg-row align-items-center gap-4">
                  <img src={male} alt="" />
                  <div className="d-flex flex-column align-items-center align-items-lg-start">
                    <h5>Service Provider</h5>
                    <p>
                      Let’s provide your great <br /> services faster here{" "}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            </a>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
