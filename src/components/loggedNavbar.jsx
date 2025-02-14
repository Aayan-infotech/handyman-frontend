import react, { useEffect } from "react";
import logo from "../assets/logo.png";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { IoIosSearch, IoMdNotificationsOutline } from "react-icons/io";
import "../User/user.css"
import { FaRegUserCircle } from "react-icons/fa";
import axios from "axios";

export default function LoggedHeader() {
  const Location = useLocation();
  console.log(Location);

 

  return (
    <>
      <Navbar
        collapseOnSelect
        expand="lg"
        className="position-relative z-1 loggedheader"
      >
        <Container fluid>
          <Link to="/provider/pricing" className="py-1">
            <img src={logo} alt="logo" />
          </Link>
          {Location.pathname === "/post-new-job" ? (
            <b className="fs-5 ms-2 d-none d-lg-flex">Post a new Job!</b>
          ) : (
            <></>
          )}

          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <div className="ms-auto d-flex justify-content-between align-items-center gap-5">
              {Location.pathname === "/post-new-job" ||
              Location.pathname === "/home" ? (
                <>
                  <div className="position-relative icon ">
                    <IoIosSearch />
                    <Form.Control placeholder="search" className="w-100" />
                  </div>
                </>
              ) : (
                <></>
              )}

              <div className="ms-auto d-flex justify-content-between align-items-center gap-4">
                <Link className="notification" to="/notification">
                  <IoMdNotificationsOutline className="fs-4" />
                </Link>
                {location.pathname.includes("provider") ? (
                  <Link to="/provider/myprofile">
                    <FaRegUserCircle className="fs-1" />
                  </Link>
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
