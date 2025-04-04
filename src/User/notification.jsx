import React, { useEffect, useState } from "react";
import axios from "axios";
import LoggedHeader from "./Auth/component/loggedNavbar";
import { FaRegClock } from "react-icons/fa";
import Loader from "../Loader";
import Toaster from "../Toaster";
import "./user.css";
import noData from "../assets/no_data_found.gif";
import { Button } from "@mui/material";

export default function Notification() {
  const hunterId = localStorage.getItem("hunterId");
  const providerId = localStorage.getItem("ProviderId");
  const userType = hunterId ? "hunter" : "provider";
  const userId = hunterId || providerId;
  const token =
    localStorage.getItem("ProviderToken") ||
    localStorage.getItem("hunterToken");

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });

  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      const url = `http://3.223.253.106:7777/api/pushNotification/get-notification/${userType}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(response.data.data || []);
    } catch (error) {
      setToastProps({
        message: "Failed to fetch notifications",
        type: "error",
        toastKey: Date.now(),
      });
    }
    setLoading(false);
  };

  const handleMarkAsRead = async (notificationId, type) => {
    try {
      await axios.get(
        `http://3.223.253.106:7777/api/pushNotification/Read-notification/${notificationId}/${type}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications(
        notifications.filter((notif) => notif._id !== notificationId)
      );
      fetchNotifications();
    } catch (error) {
      console.log("Error marking notification as read:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [userType]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <LoggedHeader />
          <div className="bg-second">
            <div className="container">
              <div className="top-section-main py-4 px-lg-5">
                <div className="d-flex justify-content-between align-items-center">
                  <h3 className="mb-0">Notifications</h3>
                  {/* <Button
                    variant="contained"
                    className="custom-green bg-green-custom rounded-5 px-3"
                    onClick={fetchNotifications}
                  >
                    Mark As All Read
                  </Button> */}
                </div>
                {notifications.length === 0 ? (
                  <div className="text-center">
                    <img
                      src={noData}
                      alt="No notifications"
                      className="img-fluid"
                    />
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3 mt-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className={`card ${
                          notification.isRead === false
                            ? "notification-card"
                            : "notification-read-card"
                        } border-0 rounded-4`}
                      >
                        <div className="card-body px-3">
                          <div className="d-flex flex-wrap justify-content-center flex-column flex-lg-row justify-content-lg-between align-items-center">
                            <h5 className="mb-0">{notification.title}</h5>
                            <div>
                              <FaRegClock className="me-1" />
                              <span>
                                {new Date(notification.createdAt).toUTCString()}
                              </span>
                            </div>
                          </div>
                          <div className="row">
                            <div
                              className={
                                notification.isRead === false && `col-lg-9`
                              }
                            >
                              <p className="mt-3 mb-0">{notification.body}</p>
                            </div>
                            {notification.isRead === false && (
                              <div className="col-lg-3 d-flex justify-content-end">
                                <Button
                                  variant="outlined"
                                  color="success"
                                  className="custom-green bg-green-custom rounded-5 px-3 text-light border-light"
                                  onClick={() =>
                                    handleMarkAsRead(
                                      notification._id,
                                      notification?.type
                                    )
                                  }
                                >
                                  Mark as Read
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      <Toaster
        message={toastProps.message}
        type={toastProps.type}
        toastKey={toastProps.toastKey}
      />
    </>
  );
}
