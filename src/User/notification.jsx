import React, { useEffect, useState } from "react";
import axiosInstance from "../components/axiosInstance";
import LoggedHeader from "./Auth/component/loggedNavbar";
import { FaRegClock } from "react-icons/fa";
import Loader from "../Loader";
import Toaster from "../Toaster";
import "./user.css";
import noData from "../assets/no_data_found.gif";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import {
  messageNotification,
  assignedJobNotification,
} from "../Slices/notificationSlice";
import { useDispatch } from "react-redux";
export default function Notification() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hunterId = localStorage.getItem("hunterId");
  const providerId = localStorage.getItem("ProviderId");
  const userType = hunterId ? "hunter" : "provider";
  const userId = hunterId || providerId;
  const isGuest = JSON.parse(
    localStorage.getItem("notificationEnableProvider") ?? "false"
  );
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

  const handleJobCompletNotify = async ({ id, receiverId, title }) => {
    setLoading(true);
    try {
      const apiResponse = await axiosInstance.put(
        `/jobPost/notifyCompletion/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (apiResponse.status === 200) {
        const response = dispatch(
          messageNotification({
            receiverId,
            jobId: id,
            body: `Provider have completed your job ${title}`,
          })
        );
        await fetchNotifications();
        if (messageNotification.fulfilled.match(response)) {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleName = async (notification) => {
    try {
      const response = await axios.post(
        "http://18.209.91.97:7787/api/match/getMatchedData",
        {
          senderId: notification.userId,
          receiverId: notification.receiverId,
          jobPostId: notification.job._id || null,
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
      console.log("notifList", notifList);
      const {  currentPage, total, totalPages } = response.data.pagination;
      console.log("total", total, "page", currentPage, "totalPages", totalPages);

      // Update pagination state with new page
      setPagination((prev) => ({
        ...prev,
        total,
        page: currentPage,
        totalPages
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
      setNotifications(notifList);
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
        `/jobpost/changeJobStatus/${notification.job._id}`,
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

      await dispatch(
        assignedJobNotification({
          receiverId: assignToId,
          jobId: notification.job._id,
        })
      );

      setLoading(false);
      setToastProps({
        message: response.data.message || "Job assigned successfully",
        type: "success",
        toastKey: Date.now(),
      });

      await fetchNotifications();
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
        `/jobPost/changeJobStatus/${notification.job._id}`,
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
      await fetchNotifications();
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

  const handleCompletedJob = async (notification) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        `/provider/completedCount/${notification?.userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      console.log(response);
      setToastProps({
        message: response.message,
        type: "success",
        toastKey: Date.now(),
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
      setToastProps({
        message: error,
        type: "error",
        toastKey: Date.now(),
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/pushNotification/deleteNotification/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchNotifications();

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

  const handleDeleteMass = async (id) => {
    try {
      await axiosInstance.delete(`/massNotification/delete/${id}`, {
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
  console.log("pagination:", pagination);

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
                          <div className="d-flex flex-wrap justify-content-center flex-column flex-lg-row justify-content-lg-end align-items-center gap-2">
                            {/* <h5 className="mb-0 text-center text-lg-start">
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
                            </h5> */}

                            {/* <div>
                              <FaRegClock className="me-1" />
                              <span>
                                {new Date(
                                  notification.createdAt
                                ).toLocaleString("en-AU", {
                                  timeZone: "Australia/Sydney",
                                  weekday: "short",
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </span>
                            </div> */}
                          </div>
                          <div className="row gy-2 align-items-start">
                            <div
                              className={
                                notification.isRead === false
                                  ? `col-lg-8`
                                  : `col-lg-8`
                              }
                            >
                              <p className=" mb-0 text-center text-lg-start mb-3 mb-lg-0 fs-5">
                                {providerId
                                  ? `${notification.body} ${
                                      notification?.type !== "mass" &&
                                      ((isGuest &&
                                        notification.nameData?.sender
                                          ?.contactName) ||
                                        notification.nameData?.sender?.name)
                                        ? `from ${
                                            notification.nameData?.sender
                                              ?.contactName ||
                                            notification.nameData?.sender?.name
                                          }`
                                        : ""
                                    }`
                                  : notification.body}
                              </p>
                            </div>

                            <div className="col-lg-4">
                              <div className="text-end">
                                <FaRegClock className="me-1" />
                                <span>
                                  {new Date(
                                    notification.createdAt
                                  ).toLocaleString("en-AU", {
                                    timeZone: "Australia/Sydney",
                                    weekday: "short",
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  })}
                                </span>
                              </div>
                            </div>
                            {notification?.type != "mass" && (
                              <div className="col-lg-3 d-flex justify-content-end">
                                <Button
                                  variant="outlined"
                                  color="success"
                                  onClick={() => {
                                    handleMarkAsRead(
                                      notification?._id,
                                      notification?.type
                                    );
                                    userType === "hunter"
                                      ? navigate(
                                          `/chat/${
                                            notification.userId === userId
                                              ? notification.receiverId
                                              : notification.userId
                                          }?jobId=${
                                            notification.job._id
                                          }&path=notification`
                                        )
                                      : navigate(
                                          `/provider/chat/${
                                            notification.userId === userId
                                              ? notification.receiverId
                                              : notification.userId
                                          }?jobId=${
                                            notification.job._id
                                          }&path=notification`
                                        );
                                  }}
                                  className="custom-green bg-green-custom rounded-5 text-light border-light w-100"
                                >
                                  View Message
                                </Button>
                              </div>
                            )}

                            {notification?.nameData?.jobPost?.jobStatus ===
                              "Pending" &&
                              hunterId && (
                                <>
                                  <div className="col-lg-3 d-flex justify-content-end">
                                    <Button
                                      variant="outlined"
                                      color="success"
                                      onClick={() => {
                                        handleMarkAsRead(
                                          notification?._id,
                                          notification?.type
                                        );
                                        handleJobAccept(notification);
                                        handleCompletedJob(notification);
                                      }}
                                      className="custom-green bg-green-custom rounded-5 text-light border-light w-100"
                                    >
                                      Assign job
                                    </Button>
                                  </div>
                                </>
                              )}

                            {notification?.type != "mass" &&notification?.nameData?.jobPost?.jobStatus !==
                              "Completed" &&
                              hunterId && (
                                <div className="col-lg-3 d-flex justify-content-end">
                                  <Button
                                    variant="outlined"
                                    color="success"
                                    className="custom-green bg-green-custom rounded-5 text-light border-light w-100"
                                    onClick={() => {
                                      handleMarkAsRead(
                                        notification?._id,
                                        notification?.type
                                      );
                                      navigate(
                                        `/job-detail/${notification.job._id}`
                                      );
                                    }}
                                    disabled={markingAsRead}
                                  >
                                    Mark as completed
                                  </Button>
                                </div>
                              )}
                            {providerId &&
                              notification.job._id &&
                              (notification?.nameData?.jobPost
                                ?.completionNotified === false ? (
                                <div className="col-lg-3 d-flex justify-content-end">
                                  <Button
                                    variant="outlined"
                                    color="success"
                                    className="custom-green bg-green-custom rounded-5 px-3 text-light border-light w-100"
                                    onClick={() => {
                                      handleMarkAsRead(
                                        notification?._id,
                                        notification?.type
                                      );
                                      handleJobCompletNotify({
                                        id: notification.job._id,
                                        receiverId:
                                          notification.userId === userId
                                            ? notification.receiverId
                                            : notification.userId,
                                        title:
                                          notification?.nameData?.jobPost
                                            ?.title,
                                      });
                                    }}
                                  >
                                    Job Completed
                                  </Button>
                                </div>
                              ) : (
                                <div className="col-lg-3 d-flex justify-content-end">
                                  <Button
                                    variant="outlined"
                                    color="success"
                                    className="custom-green bg-green-custom rounded-5 px-3 text-light border-light w-100"
                                    disabled
                                  >
                                    Already Notified
                                  </Button>
                                </div>
                              ))}
                            <div className="col-lg-3 d-flex justify-content-end">
                              {notification?.type === "mass" ? (
                                <Button
                                  variant="outlined"
                                  color="success"
                                  className="custom-green bg-green-custom rounded-5 px-3 text-light border-light w-100"
                                  onClick={() => {
                                    handleMarkAsRead(
                                      notification?._id,
                                      notification?.type
                                    );
                                    handleDeleteMass(notification._id);
                                  }}
                                >
                                  Delete Message
                                </Button>
                              ) : (
                                <Button
                                  variant="outlined"
                                  color="success"
                                  className="custom-green bg-green-custom rounded-5 px-3 text-light border-light w-100"
                                  onClick={() => handleDelete(notification._id)}
                                >
                                  Delete Message
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {pagination.totalPages > 1 && (
                <Stack spacing={2} sx={{ mt: 4, pb: 4, alignItems: "center" }}>
                  <Pagination
                    count={pagination.totalPages}
                    page={pagination.page}
                    onChange={(event, page) => handlePageChange(page)}
                    color="primary"
                    size="large"
                    variant="outlined"
                    shape="rounded"
                    siblingCount={1}
                    boundaryCount={1}
                    className="pagination-custom"
                    sx={{
                      "& .MuiPaginationItem-root": {
                        color: "#fff",
                        backgroundColor: "#4CAF50",
                        "&:hover": {
                          backgroundColor: "#388E3C",
                        },
                      },
                      "& .Mui-selected": {
                        backgroundColor: "#2E7D32",
                        "&:hover": {
                          backgroundColor: "#1B5E20",
                        },
                      },
                    }}
                  />
                </Stack>
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
