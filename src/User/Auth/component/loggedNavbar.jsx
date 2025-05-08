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
import axiosInstance from "../../../components/axiosInstance";
export default function LoggedHeader() {
  const navigate = useNavigate();
  const [images, setImages] = useState(null);
  const hunterToken = localStorage.getItem("hunterToken");
  const providerToken = localStorage.getItem("ProviderToken");
  const dispatch = useDispatch();
  const Location = useLocation();
  const hunterId = localStorage.getItem("hunterId");
  const providerId = localStorage.getItem("ProviderId");
  const userType = hunterId ? "hunter" : "provider";
  const userId = hunterId || providerId;
  const [notifications, setNotifications] = useState([]);
  const handleName = async (notification) => {
    try {
      const response = await axiosInstance.post(
        "/match/getMatchedDataNotification",
        {
          senderId: notification.userId,
          receiverId: notification.receiverId,
        },
        {
          headers: { Authorization: `Bearer ${hunterToken || providerToken}` },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching name:", error);
      return null;
    }
  };

  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      const url = `/pushNotification/get-notification/${userType}`;
      const response = await axiosInstance.get(url, {
        headers: { Authorization: `Bearer ${hunterToken || providerToken}` },
      });

      // const notifList = response.data.data || [];

      // const updatedList = await Promise.all(
      //   notifList.map(async (notification) => {
      //     try {
      //       const nameData = await handleName(notification);
      //       return { ...notification, nameData };
      //     } catch (error) {
      //       console.error("Error processing notification:", error);
      //       return notification;
      //     }
      //   })
      // );

      setNotifications(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Get the stored notification setting (parsed as boolean)
    const isNotificationEnabled =
      userType === "provider"
        ? JSON.parse(
            localStorage.getItem("notificationEnableProvider") ?? "true"
          )
        : JSON.parse(
            localStorage.getItem("notificationEnableHunter") ?? "true"
          );

    // Only fetch notifications if enabled
    if (isNotificationEnabled) {
      fetchNotifications();
    }
  }, [userType]);

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
        localStorage.setItem(
          "hunterName",
          fetchedUser?.name
        );
        if (fetchedUser === undefined || fetchedUser === null) {
          localStorage.clear();
          return;
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
              <div className=" d-flex justify-content-between align-items-center gap-2">
                <Link
                  className="notification position-relative"
                  to="/notification"
                >
                  {notifications[0]?.isRead === false && (
                    <span
                      className="position-absolute translate-middle p-1 bg-danger border border-light rounded-circle"
                      style={{ left: "80%", top: "4%" }}
                    >
                      <span className="visually-hidden">New alerts</span>
                    </span>
                  )}
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
