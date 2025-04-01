import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { IoIosSearch, IoMdNotificationsOutline } from "react-icons/io";
import "../../user.css";
import { FaRegUserCircle } from "react-icons/fa";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getHunterUser, getProviderUser } from "../../../Slices/userSlice";
export default function LoggedHeader() {
  const navigate = useNavigate();
  const [images, setImages] = useState(null);
  const hunterToken = localStorage.getItem("hunterToken");
  const providerToken = localStorage.getItem("ProviderToken");
  const dispatch = useDispatch();
  const Location = useLocation();
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
        className="position-relative z-1 loggedheader"
      >
        <Container className="d-flex justify-content-between" fluid>
          <div className="d-flex justify-content-between align-items-center w-100">
            <Link
              to={`${providerToken ? "/provider/home" : "/home"}`}
              className="py-1"
            >
              <img src={logo} alt="logo" className="w-100" />
            </Link>
            {Location.pathname === "/post-new-job" ? (
              <b className="fs-5 ms-2 d-none d-lg-flex">Post a new Job!</b>
            ) : (
              <></>
            )}

            <div className="   d-flex justify-content-between align-items-center gap-5">
              <div className=" d-flex justify-content-between align-items-center gap-4">
                <Link className="notification" to="/notification">
                  <IoMdNotificationsOutline className="fs-4" />
                </Link>
                {providerToken ? (
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
          </div>
        </Container>
      </Navbar>
    </>
  );
}
