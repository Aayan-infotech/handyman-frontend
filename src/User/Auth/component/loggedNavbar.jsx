import react from "react";
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
  const location = useLocation(); // ✅ Correct way to get pathname
  const guestCondition = JSON.parse(localStorage.getItem("Guest")) || false; // ✅ Ensure Boolean value

  console.log("guestCondition", guestCondition); // ✅ Should now log correctly

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
                  guestCondition ? (
                    <FaRegUserCircle className="fs-1" />
                  ) : (
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