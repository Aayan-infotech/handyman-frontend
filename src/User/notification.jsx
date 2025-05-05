import React, { useEffect, useState } from "react";
import axiosInstance from "../components/axiosInstance";
import LoggedHeader from "./Auth/component/loggedNavbar";
import { FaRegClock } from "react-icons/fa";
import Loader from "../Loader";
import Toaster from "../Toaster";
import "./user.css";
import noData from "../assets/no_data_found.gif";
import { Button } from "@mui/material";
import Pagination from "react-bootstrap/Pagination";
import { useNavigate } from "react-router-dom";
export default function Notification() {
  const navigate = useNavigate();
  const hunterId = localStorage.getItem("hunterId");
  const providerId = localStorage.getItem("ProviderId");
  const userType = hunterId ? "hunter" : "provider";
  const userId = hunterId || providerId;
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
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
        "/match/getMatchedData",
        {
          senderId: notification.userId,
          receiverId: notification.receiverId,
          jobPostId: notification.jobId,
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

  const fetchNotifications = async (page = pagination.page) => {
    if (!userId) return;

    try {
      setLoading(true);
      const url = `/pushNotification/get-notification/${userType}?page=${page}&limit=${pagination.limit}`;
      const response = await axiosInstance.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const notifList = response.data.data || [];
      const { data, total, page: currentPage, limit } = response.data;

      // Update pagination state with new page
      setPagination((prev) => ({
        ...prev,
        total,
        page: currentPage,
        limit,
        totalPages: Math.ceil(total / limit),
      }));

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

  const handlePageChange = (page) => {
    if (page !== pagination.page) {
      setPagination((prev) => ({ ...prev, page }));
      fetchNotifications(page);
    }
  };

  const handleJobAccept = async (notification) => {
    // Get current user ID
    const currentUserId = userId;

    // Determine which ID to use (the one that doesn't match current user)
    const assignToId =
      notification.userId === currentUserId
        ? notification.receiverId
        : notification.userId;

    if (!assignToId) {
      setToastProps({
        message: "No valid user to assign job to",
        type: "error",
        toastKey: Date.now(),
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post(
        `/jobpost/changeJobStatus/${notification.jobId}`,
        {
          jobStatus: "Assigned",
          providerId: assignToId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);
      setToastProps({
        message: response.data.message || "Job assigned successfully",
        type: "success",
        toastKey: Date.now(),
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
      setToastProps({
        message: error.response?.data?.message || "Error assigning job",
        type: "error",
        toastKey: Date.now(),
      });
    }
  };

  const handleJobCompleted = async (notification) => {
    // Get current user ID
    const currentUserId = userId;

    // Determine which ID to use (the one that doesn't match current user)
    const assignToId =
      notification.userId === currentUserId
        ? notification.receiverId
        : notification.userId;

    setLoading(true);
    try {
      const reponse = await axiosInstance.post(
        `/jobPost/changeJobStatus/${notification.jobId}`,
        {
          jobStatus: " Completed",
          providerId: assignToId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(reponse);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const handleMarkAsRead = async (notificationId, type) => {
    try {
      setMarkingAsRead(true);
      await axiosInstance.get(
        `/pushNotification/Read-notification/${notificationId}/${type}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state instead of refetching
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setToastProps({
        message: "Notification Mark as Read successfully",
        type: "success",
        toastKey: Date.now(),
      });
    } catch (error) {
      console.log(error);
      setToastProps({
        message: "error marking notification as read",
        type: "error",
        toastKey: Date.now(),
      });
    } finally {
      setMarkingAsRead(false);
    }
  };

  // const handlePageChange = (page) => {
  //   if (page !== pagination.page) {
  //     fetchNotifications(page);
  //   }
  // };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/pushNotification/deleteNotification/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update local state instead of refetching
      setNotifications((prev) => prev.filter((notif) => notif._id !== id));
      setPagination((prev) => ({
        ...prev,
        total: prev.total - 1,
        totalPages: Math.ceil((prev.total - 1) / prev.limit),
      }));
      setToastProps({
        message: "Notification deleted successfully",
        type: "success",
        toastKey: Date.now(),
      });
      if (notifications.length === 1 && pagination.page > 1) {
        fetchNotifications(pagination.page - 1);
      }
    } catch (error) {
      setToastProps({
        message: "error deleting notification",
        type: "error",
        toastKey: Date.now(),
      });
    }
  };

  // const handleMarkAsRead = async (notificationId, type) => {
  //   try {
  //     setMarkingAsRead(true);
  //     await axiosInstance.get(
  //       `/pushNotification/Read-notification/${notificationId}/${type}`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     // Instead of filtering locally, refetch all notifications
  //     await fetchNotifications();
  //   } catch (error) {
  //     console.log("Error marking notification as read:", error);
  //     setToastProps({
  //       message: "Failed to mark notification as read",
  //       type: "error",
  //       toastKey: Date.now(),
  //     });
  //   } finally {
  //     setMarkingAsRead(false);
  //   }
  // };

  // const handleDelete = async (id) => {
  //   try {
  //     const response = await axiosInstance.delete(
  //       `/pushNotification/deleteNotification/${id}`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     if (response.status === 200) {
  //       setToastProps({
  //         message: "Notifications deleted successfully",
  //         type: "success",
  //         toastKey: Date.now(),
  //       });
  //       fetchNotifications(); // Refresh notifications after deletion
  //     }
  //   } catch (error) {
  //     setToastProps({
  //       message: "Failed to delete notifications",
  //       type: "error",
  //       toastKey: Date.now(),
  //     });
  //   }
  // };

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
    } else {
      setLoading(false); // Set loading to false immediately if notifications are disabled
    }
  }, [userType]);

  console.log("Notifications:", notifications);

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
                          <div className="d-flex flex-wrap justify-content-center flex-column flex-lg-row justify-content-lg-between align-items-center gap-2">
                            <h5 className="mb-0 text-center text-lg-start">
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
                                {new Date(
                                  notification.createdAt
                                ).toLocaleTimeString("en-AU", {
                                  timeZone: "Australia/Sydney",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </span>
                            </div>
                          </div>
                          <div className="row gy-2 align-items-end">
                            <div
                              className={
                                notification.isRead === false
                                  ? `col-lg-12`
                                  : `col-lg-12`
                              }
                            >
                              <p className="mt-3 mb-0 text-center text-lg-start mb-3 mb-lg-0">
                                {notification.body}
                              </p>
                            </div>
                            <div className="col-lg-3 d-flex justify-content-end">
                              <Button
                                variant="outlined"
                                color="success"
                                onClick={() => {
                                  userType === "hunter"
                                    ? navigate(
                                        `/chat/${
                                          notification.userId === userId
                                            ? notification.receiverId
                                            : notification.userId
                                        }?jobId=${notification.jobId}`
                                      )
                                    : navigate(
                                        `/provider/chat/${
                                          notification.userId === userId
                                            ? notification.receiverId
                                            : notification.userId
                                        }?jobId=${notification.jobId}`
                                      );
                                }}
                                className="custom-green bg-green-custom rounded-5 text-light border-light w-100"
                              >
                                View Message
                              </Button>
                            </div>
                            {notification?.jobStatus === "Pending" && (
                              <>
                                <div className="col-lg-3 d-flex justify-content-end">
                                  <Button
                                    variant="outlined"
                                    color="success"
                                    onClick={() =>
                                      handleJobAccept(notification)
                                    }
                                    className="custom-green bg-green-custom rounded-5 text-light border-light w-100"
                                  >
                                    Assign job
                                  </Button>
                                </div>
                              </>
                            )}

                            {notification?.nameData?.jobPost?.jobStatus !==
                              "Completed" && (
                              <div className="col-lg-3 d-flex justify-content-end">
                                <Button
                                  variant="outlined"
                                  color="success"
                                  className="custom-green bg-green-custom rounded-5 text-light border-light w-100"
                                  onClick={() =>
                                    handleJobCompleted(notification)
                                  }
                                  disabled={markingAsRead}
                                >
                                  Mark as completed
                                </Button>
                              </div>
                            )}
                            <div className="col-lg-3 d-flex justify-content-end">
                              <Button
                                variant="outlined"
                                color="success"
                                className="custom-green bg-green-custom rounded-5 px-3 text-light border-light w-100"
                                onClick={() => handleDelete(notification._id)}
                              >
                                Delete Message
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {pagination.totalPages > 1 && (
                <Pagination className="justify-content-center pagination-custom mt-4">
                  <Pagination.Prev
                    disabled={pagination.page === 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                  />
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <Pagination.Item
                      key={page}
                      active={page === pagination.page}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                  />
                </Pagination>
              )}
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
