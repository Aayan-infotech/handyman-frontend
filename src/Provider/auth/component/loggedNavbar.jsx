import React, { useState, useEffect, useRef } from "react";
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
import { io } from "socket.io-client";
export default function LoggedHeader() {
  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });
  const location = useLocation();
  const socketRef = useRef(null);
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
  const [unRead, setUnRead] = useState(0);
  const notificationLengthRef = useRef(0);

  const [initialNotificationsLoaded, setInitialNotificationsLoaded] =
    useState(false);
  useEffect(() => {
    if (!userId) return;

    if (!socketRef.current || socketRef.current.disconnected) {
      const newSocket = io("http://18.209.91.97:7787", {
        auth: {
          token: hunterToken || providerToken,
          userId,
          userType,
        },
        transports: ["websocket"],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        autoConnect: true,
      });

      socketRef.current = newSocket;

      newSocket.on("connect", () => {
        console.log("Socket.IO connected", newSocket.id);
      });

      newSocket.on("disconnect", (reason) => {
        console.log("Socket.IO disconnected", reason);
        if (reason === "io server disconnect") {
          setTimeout(() => newSocket.connect(), 1000);
        }
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket.IO connection error:", error);
      });

      newSocket.on("newNotification", async (notification) => {
        await fetchNotifications();
        handleNewNotification(notification);
      });

      newSocket.onAny((event, ...args) => {
        console.log(`Received socket event: ${event}`, args);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("connect");
        socketRef.current.off("disconnect");
        socketRef.current.off("connect_error");
        socketRef.current.off("newNotification");
        socketRef.current.offAny();

        setTimeout(() => {
          if (socketRef.current?.connected) {
            socketRef.current.disconnect();
          }
        }, 1000);
      }
    };
  }, [userId, hunterToken, providerToken, userType]);

  const handleNewNotification = (notification) => {
    const newLength = notifications.length + 1;

    // Update list and unread count
    setNotifications((prev) => [notification, ...prev]);
    setUnRead((prev) => prev + 1);

    // Only show toast if newLength > storedLength
    if (newLength > notificationLengthRef.current) {
      setToastProps({
        message: notification.message || "You have received a new notification",
        type: "info",
        toastKey: Date.now(),
      });
      notificationLengthRef.current = newLength;
    }
  };

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
      const notificationsList = response.data.data || [];

      setNotifications(response.data.data);
      setUnRead(response.data.unreadCount);
      setInitialNotificationsLoaded(true);
      notificationLengthRef.current = notificationsList.length;
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

    // Reset initial load state when user changes
    return () => {
      setInitialNotificationsLoaded(false);
    };
  }, [userType]);

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
          providerResponse?.payload?.data?.subscriptionType ||
            providerResponse?.payload?.data?.subscriptionStatus
        );
        localStorage.setItem(
          "ProviderBusinessName",
          providerResponse?.payload?.data?.businessName
        );
        localStorage.setItem(
          "ProviderName",
          providerResponse?.payload?.data?.contactName
        );
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

  useEffect(() => {
    fetchUserData();
  }, []);
  useEffect(() => {
    fetchUserData();
  }, [dispatch]);

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
                {unRead > 0 && (
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
