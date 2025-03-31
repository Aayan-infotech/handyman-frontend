import React, { useState, useEffect } from "react";
import logo from "../../../assets/logo.png";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Link, useLocation } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { IoIosSearch, IoMdNotificationsOutline } from "react-icons/io";
import "../../../User/user.css";
import { FaRegUserCircle } from "react-icons/fa";
import Toaster from "../../../Toaster";
import { useDispatch } from "react-redux";

import { getHunterUser, getProviderUser } from "../../../Slices/userSlice";

export default function LoggedHeader() {
  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });
  const location = useLocation();
  const guestCondition = JSON.parse(localStorage.getItem("Guest")) || false;
  const dispatch = useDispatch();
  const Location = useLocation();
  const [images, setImages] = useState(null);
  const hunterToken = localStorage.getItem("hunterToken");
  const providerToken = localStorage.getItem("ProviderToken");
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let fetchedUser = null;
        if (hunterToken) {
          const hunterResponse = await dispatch(getHunterUser());
          fetchedUser = hunterResponse?.payload?.data;
        } else if (!fetchedUser && providerToken) {
          const providerResponse = await dispatch(getProviderUser());
          fetchedUser = providerResponse?.payload?.data;
        }

        if (fetchedUser) {
          setImages(fetchedUser?.images || "");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [dispatch]);

  console.log("guestCondition", guestCondition);

  const handleGuest = () => {
    setToastProps({
      message: "Please login first",
      type: "error",
      toastKey: Date.now(),
    });
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

          <div className=" d-flex justify-content-between align-items-center gap-5">
            {(location.pathname === "/post-new-job" ||
              location.pathname === "/home") && (
              <div className="position-relative icon">
                <IoIosSearch />
                <Form.Control placeholder="search" className="w-100" />
              </div>
            )}

            <div className="d-flex justify-content-between align-items-center gap-4">
              <Link className="notification" to="/notification">
                <IoMdNotificationsOutline className="fs-4" />
              </Link>

              {location.pathname.includes("provider") ? (
                <Link to="/provider/myprofile">
                  {!images ? (
                    <FaRegUserCircle className="fs-1" />
                  ) : (
                    <img src={images} alt="profile" />
                  )}
                </Link>
              ) : (
                <Link to="/myprofile">
                  {!images ? (
                    <FaRegUserCircle className="fs-1" />
                  ) : (
                    <img src={images} alt="profile" />
                  )}
                </Link>
              )}
            </div>
          </div>
        </Container>
      </Navbar>

      <Toaster
        message={toastProps.message}
        type={toastProps.type}
        toastKey={toastProps.toastKey}
      />
    </>
  );
}
