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
import axiosInstance from "../../../components/axiosInstance";
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
      console.log(response.data.data, "response.data.data");

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
          localStorage.setItem(
            "PlanType",
            providerResponse?.payload?.data?.subscriptionType
          );
          localStorage.setItem(
            "ProviderName",
            providerResponse?.payload?.data?.contactName
          );
          console.log("1212121", fetchedUser);
          if (providerResponse?.payload?.data?.subscriptionStatus === 0) {
            localStorage.setItem("PlanType", null);
          }
          if (fetchedUser === undefined || fetchedUser === null) {
            localStorage.clear();
            return;
          }
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

  console.log("notifications", notifications);

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
          <Link to="/provider/home" className="py-1">
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

            <div className="d-flex justify-content-between align-items-center gap-2">
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
