import React, { useState } from "react";
import logo from "../../../assets/logo.png";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Link, useLocation } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { IoIosSearch, IoMdNotificationsOutline } from "react-icons/io";
import "../../../User/user.css";
import { FaRegUserCircle } from "react-icons/fa";
import Toaster from "../../../Toaster";

export default function LoggedHeader() {
  const [toastProps, setToastProps] = useState({ message: "", type: "" });
  const location = useLocation();
  const guestCondition = JSON.parse(localStorage.getItem("Guest")) || false;

  console.log("guestCondition", guestCondition);

  const handleGuest = () => {
    setToastProps({ message: "Please login first", type: "error" });
  };

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

      <Toaster message={toastProps.message} type={toastProps.type} />
    </>
  );
}
