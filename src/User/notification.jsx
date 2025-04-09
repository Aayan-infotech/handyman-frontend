import React, { useEffect, useState } from "react";
import axiosInstance from "../components/axiosInstance";
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
  const [markingAsRead, setMarkingAsRead] = useState(false);
  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });

  const handleName = async (notification) => {
    try {
      const response = await axiosInstance.post(
        "/match/getMatchedDataNotification",
        {
          senderId: notification.userId,
          receiverId: notification.receiverId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
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
      setLoading(true);
      const url = `/pushNotification/get-notification/${userType}`;
      const response = await axiosInstance.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const notifList = response.data.data || [];

      const updatedList = await Promise.all(
        notifList.map(async (notification) => {
          try {
            const nameData = await handleName(notification);
            return { ...notification, nameData };
          } catch (error) {
            console.error("Error processing notification:", error);
            return notification;
          }
        })
      );

      setNotifications(updatedList);
    } catch (error) {
      setToastProps({
        message: "Failed to fetch notifications",
        type: "error",
        toastKey: Date.now(),
      });
    } finally {
      setLoading(false);
      setMarkingAsRead(false);
    }
  };

  const handleMarkAsRead = async (notificationId, type) => {
    try {
      setMarkingAsRead(true);
      await axiosInstance.get(
        `/pushNotification/Read-notification/${notificationId}/${type}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Instead of filtering locally, refetch all notifications
      await fetchNotifications();
    } catch (error) {
      console.log("Error marking notification as read:", error);
      setToastProps({
        message: "Failed to mark notification as read",
        type: "error",
        toastKey: Date.now(),
      });
    } finally {
      setMarkingAsRead(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(
        `/pushNotification/deleteNotification/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setToastProps({
          message: "Notifications deleted successfully",
          type: "success",
          toastKey: Date.now(),
        });
        fetchNotifications(); // Refresh notifications after deletion
      }
    } catch (error) {
      setToastProps({
        message: "Failed to delete notifications",
        type: "error",
        toastKey: Date.now(),
      });
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [userType]);

  return (
    <>
      {loading || markingAsRead ? (
        <Loader />
      ) : (
        <>
          <LoggedHeader />
          <div className="bg-second">
            <div className="container">
              <div className="top-section-main py-4 px-lg-5">
                <div className="d-flex justify-content-between align-items-center">
                  <h3 className="mb-0">Notifications</h3>
                </div>
                {notifications.length === 0 && !loading ? (
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
                            <h5 className="mb-0">
                              {notification.nameData?.sender?.contactName
                                ? notification.nameData.sender.contactName
                                    .charAt(0)
                                    .toUpperCase() +
                                  notification.nameData.sender.contactName.slice(
                                    1
                                  )
                                : ""}{" "}
                              {notification.title}{" "}
                              {notification.nameData?.sender?.name
                                ? notification.nameData.sender.name
                                    .charAt(0)
                                    .toUpperCase() +
                                  notification.nameData.sender.name.slice(1)
                                : ""}
                            </h5>

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
                                notification.isRead === false
                                  ? `col-lg-7`
                                  : `col-lg-10`
                              }
                            >
                              <p className="mt-3 mb-0">{notification.body}</p>
                            </div>
                            {notification.isRead === false && (
                              <div className="col-lg-3 d-flex justify-content-end">
                                <Button
                                  variant="outlined"
                                  color="success"
                                  className="custom-green bg-green-custom rounded-5 text-light border-light w-100"
                                  onClick={() =>
                                    handleMarkAsRead(
                                      notification._id,
                                      notification?.type
                                    )
                                  }
                                  disabled={markingAsRead}
                                >
                                  {markingAsRead
                                    ? "Processing..."
                                    : "Mark as Read"}
                                </Button>
                              </div>
                            )}
                            <div className="col-lg-2 d-flex justify-content-end">
                              <Button
                                variant="outlined"
                                color="success"
                                className="custom-green bg-green-custom rounded-5 px-3 text-light border-light w-100"
                                onClick={() => handleDelete(notification._id)}
                              >
                                Delete
                              </Button>
                            </div>
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
