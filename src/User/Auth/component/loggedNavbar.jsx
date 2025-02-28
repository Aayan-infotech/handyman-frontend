import React from "react";
import logo from "../../../assets/logo.png";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { IoIosSearch, IoMdNotificationsOutline } from "react-icons/io";
import "../../user.css";
import { FaRegUserCircle } from "react-icons/fa";

export default function LoggedHeader() {
  const location = useLocation(); 
  const hunterId = localStorage.getItem("hunterId");
  const guestCondition = JSON.parse(localStorage.getItem("Guest")) || false; // ✅ Ensure Boolean value
  return (
    <>
      <Navbar
        collapseOnSelect
        expand="lg"
        className="position-relative z-1 loggedheader"
      >
        <Container fluid>
          {!hunterId ? (
            <Link to="/provider/home" className="py-1">
              <img src={logo} alt="logo" />
            </Link>
          ) : (
            <Link to="/home" className="py-1">
              <img src={logo} alt="logo" />
            </Link>
          )}

          {location.pathname === "/post-new-job" && (
            <b className="fs-5 ms-2 d-none d-lg-flex">Post a new Job!</b>
          )}

          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <div className="ms-auto d-flex justify-content-between align-items-center gap-5">
              {(location.pathname === "/post-new-job" ||
                location.pathname === "/home") && (
                <div className="position-relative icon">
                  <IoIosSearch />
                  <Form.Control placeholder="search" className="w-100" />
                </div>
              )}

              <div className="ms-auto d-flex justify-content-between align-items-center gap-4">
                <Link className="notification" to="/notification">
                  <IoMdNotificationsOutline className="fs-4 2323" />
                </Link>

                {!hunterId ? (
                 (
                    <Link to="/provider/myprofile">
                      <FaRegUserCircle className="fs-1" />
                    </Link>
                  )
                ) : (
                  <Link to="/myprofile">
                    <FaRegUserCircle className="fs-1" />
                  </Link>
                )}
              </div>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
