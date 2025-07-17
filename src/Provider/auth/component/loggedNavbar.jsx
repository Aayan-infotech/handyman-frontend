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
import { MdMessage, MdOutlineSupportAgent } from "react-icons/md";

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
  const plan = localStorage.getItem("PlanType");
console.log(plan)
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
      const newSocket = io("http://98.82.228.18:7777", {
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
        // First fetch the latest notifications
        await fetchNotifications();

        // Then handle the new notification (which will check if we should show toast)
        // handleNewNotification(notification);
      });

      newSocket.onAny((event, ...args) => {
        console.log(`Received socket event: ${event}`, args);
        console.log("12122", args[0]?.jobId);

        // if (args[0]?.notificationType === "admin_message") {
        //   setToastProps({
        //     message: "You have received a new message from a Trade Hunter",
        //     type: "info",
        //     toastKey: Date.now(),
        //   });
        //   return;
        // }
        // if (args[0]?.jobId) {
        if (event === "newNotification" && args[0]?.receiverId === userId) {
          setToastProps({
            message: "You have received a new notification",
            type: "info",
            toastKey: Date.now(),
          });
        }

        if (event === "Admin Notification" && args[0]?.receiverId === userId) {
          setToastProps({
            message: "You have received a new message from a Trade Hunter",
            type: "info",
            toastKey: Date.now(),
          });
        }

        if (args[0]?.userType === "provider") {
          setToastProps({
            message: "You have received a new Notification from a Trade Hunter",
            type: "info",
            toastKey: Date.now(),
          });
        }
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

  // const handleNewNotification = (notification) => {
  //   // Get the current length before updating state
  //   const currentLength = notifications.length;

  //   // Update list and unread count
  //   setNotifications((prev) => [notification, ...prev]);
  //   setUnRead((prev) => prev + 1);

  //   // Only show toast if current length is greater than the stored reference
  //   // if (currentLength >= notificationLengthRef.current) {
  //   //   setToastProps({
  //   //     message: notification.message || "You have received a new notification",
  //   //     type: "info",
  //   //     toastKey: Date.now(),
  //   //   });
  //   // }

  //   // Update the reference to the new length
  //   notificationLengthRef.current = currentLength + 1;
  // };

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
    if (!providerToken) return;
    if (!userId) return;
    try {
      const url = `/pushNotification/get-notification/${userType}`;

      const response = await axiosInstance.get(url, {
        headers: { Authorization: `Bearer ${hunterToken || providerToken}` },
      });
      const notificationsList = response.data.data || [];

      setNotifications(notificationsList);
      setUnRead(response.data.unreadCount);
      setInitialNotificationsLoaded(true);

      // Update the reference with the initial length
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
          fetchedUser?.subscriptionType || fetchedUser?.subscriptionStatus
        );
        localStorage.setItem(
          "ProviderBusinessName",
          providerResponse?.payload?.data?.businessName
        );
        localStorage.setItem(
          "ProviderName",
          providerResponse?.payload?.data?.contactName
        );
        localStorage.setItem(
          "ProviderEmail",
          providerResponse?.payload?.data?.email
        );
        localStorage.setItem("ProviderId", fetchedUser?._id);
        if (
          providerResponse?.payload?.data?.subscriptionStatus === 0 &&
          providerResponse?.payload?.data?.subscriptionType === null
        ) {
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
          <div className=" d-flex justify-content-between align-items-center w-100">
            <Link to="/provider/home" className="py-1">
              <img src={logo} alt="logo" loading="lazy" />
            </Link>

            {location.pathname === "/post-new-job" && (
              <b className="fs-5 ms-2 d-none d-lg-flex">Post a new Job!</b>
            )}
            {(location.pathname === "/post-new-job" ||
              location.pathname === "/home") && (
              <div className="position-relative icon">
                <IoIosSearch />
                <Form.Control placeholder="search" className="w-100" />
              </div>
            )}

            <div className="d-flex justify-content-between align-items-center gap-2">
              {providerToken && plan !== "null" && (
                <Link to="/message">
                  {/* <Tooltip title="Message" placement="left-start"> */}
                  <div className="message">
                    <MdMessage />{" "}
                  </div>
                  {/* </Tooltip> */}
                </Link>
              )}

              {hunterToken && (
                <Link to="/message">
                  {/* <Tooltip title="Message" placement="left-start"> */}
                  <div className="message">
                    <MdMessage />{" "}
                  </div>
                  {/* </Tooltip> */}
                </Link>
              )}
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

              <Link
                to={`${providerToken ? "/provider/myprofile" : "/myprofile"}`}
                className="myprofile"
              >
                {!images ? (
                  <FaRegUserCircle className="fs-1" />
                ) : (
                  <img src={images} alt="profile" loading="lazy" />
                )}
              </Link>
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
