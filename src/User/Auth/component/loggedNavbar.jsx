import React, { useState, useEffect, useRef } from "react";
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
import { io } from "socket.io-client";
import Toaster from "../../../Toaster";
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
  const [unRead, setUnRead] = useState(0);
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);
  const notificationLengthRef = useRef(0);

  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });

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
      setUnRead(response.data.unreadCount);
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
        localStorage.setItem("hunterName", fetchedUser?.name);
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

      <Toaster
        message={toastProps.message}
        type={toastProps.type}
        toastKey={toastProps.toastKey}
      />
    </>
  );
}
