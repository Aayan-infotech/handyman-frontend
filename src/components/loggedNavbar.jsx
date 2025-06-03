import React, { useEffect, useState } from "react";
import logo from "./assets/logo.png";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Link, useLocation } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { MdMessage, MdOutlineSupportAgent } from "react-icons/md";

import { IoIosSearch, IoMdNotificationsOutline } from "react-icons/io";
import "../User/user.css";
import { FaRegUserCircle } from "react-icons/fa";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getHunterUser, getProviderUser } from "../Slices/userSlice";
export default function LoggedHeader() {
  const Location = useLocation();
  const dispatch = useDispatch();
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

  return (
    <>
      <Navbar
        collapseOnSelect
        expand="lg"
        className="position-relative z-1 loggedheader hwtwrfe"
      >
        <Container
          className="d-flex justify-content-between flex-row align-items-center flex-nowrap"
          fluid
        >
          <Link
            to={`${providerToken ? "/provider/home" : "/home"}`}
            className="py-1"
          >
            <img src={logo} alt="logo" />
          </Link>
          {Location.pathname === "/post-new-job" ? (
            <b className="fs-5 ms-2 d-none d-lg-flex">Post a new Job!</b>
          ) : (
            <></>
          )}

          <div className="d-flex justify-content-between align-items-center gap-5">
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

            <div className=" d-flex justify-content-between align-items-center gap-2">
              <Link to="/message">
                {/* <Tooltip title="Message" placement="left-start"> */}
                <div className="message">
                  <MdMessage />{" "}
                </div>
                {/* </Tooltip> */}
              </Link>
              <Link className="notification" to="/notification">
                <IoMdNotificationsOutline className="fs-4" />
              </Link>

              <Link
                to={`${providerToken ? "/provider/myprofile" : "/myprofile"}`}
                className="myprofile"
              >
                {!images ? (
                  <FaRegUserCircle className="fs-1" />
                ) : (
                  <img src={images} alt="profile" />
                )}
              </Link>
            </div>
          </div>
        </Container>
      </Navbar>
    </>
  );
}
