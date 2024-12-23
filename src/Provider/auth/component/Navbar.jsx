import react from "react";
import logo from "../../../assets/logo.png";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

export default function Header() {
  return (
    <>
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
            <Nav>
              <div className="d-flex flex-row gap-1">
                <Link to="/provider/login">
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
                <Link to="/provider/signup">
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
