import react from "react";
import logo from "../../../assets/logo.png";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { IoIosSearch, IoMdNotificationsOutline } from "react-icons/io";
import "../../user.css";
import { FaRegUserCircle } from "react-icons/fa";

export default function LoggedHeader() {
  return (
    <>
      <Navbar
        collapseOnSelect
        expand="lg"
        className="position-relative z-1 loggedheader"
      >
        <Container>
          <Link to="/" className="py-1">
            <img src={logo} alt="logo" />
          </Link>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <div className="ms-auto d-flex justify-content-between align-items-center gap-5">
              <div className="position-relative icon">
                <IoIosSearch />
                <Form.Control placeholder="search" className="" />
              </div>

              <div className="ms-auto d-flex justify-content-between align-items-center gap-4">
                <Link className="notification">
                  <IoMdNotificationsOutline className="fs-4" />
                </Link>
                <Link>
                  <FaRegUserCircle className="fs-1"/>
                </Link>
              </div>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
