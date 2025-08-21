import React, { useState, useEffect, useRef, useCallback } from "react";
import LoggedHeader from "../Provider/auth/component/loggedNavbar";
import LoggedHeader1 from "../User/Auth/component/loggedNavbar";

import {
  MdMessage,
  MdOutlineWork,
  MdOutlineSupportAgent,
} from "react-icons/md";
import { IoIosStar } from "react-icons/io";

import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import Tooltip from "@mui/material/Tooltip";
import "swiper/css/navigation";
import { ref, onValue, off, remove, update, get, set } from "firebase/database";
import { realtimeDb } from "../Chat/lib/firestore";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaLock, FaPen } from "react-icons/fa";
import { PiCircleHalfFill } from "react-icons/pi";
import Button from "react-bootstrap/Button";
import Button2 from "@mui/material/Button"; // Import Button as Button2
import { FaTrash } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { CiLogout } from "react-icons/ci";
import { IoCallSharp, IoLocationSharp } from "react-icons/io5";
import { IoMdMail } from "react-icons/io";
import { CiBadgeDollar } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { getHunterUser, getProviderUser } from "../Slices/userSlice";
import { getAddress } from "../Slices/addressSlice";
import Loader from "../Loader";
import axiosInstance from "./axiosInstance";
import Toaster from "../Toaster";
import notFound from "./assets/noprofile.png";
import { Modal } from "react-bootstrap";
import { styled } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function MyProfile() {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [notificationModal, setNotificationModal] = useState(false);
  const [backgroundImg, setBackgroundImg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState("");
  const [logoutModal, setLogoutModal] = useState(false);
  const [aboutText, setAboutText] = useState("");
  const [fileToUpload, setFileToUpload] = useState(null);
  const [editShowModal, setEditShowModal] = useState(false);
  const [showAllTypes, setShowAllTypes] = useState(false);
  const visibleTypesLimit = 2; // Number of types to show initially
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });
  const [selectedFile, setSelectedFile] = useState([]);
  const [gallery, setGallery] = useState([]);

  const userId =
    localStorage.getItem("hunterId") || localStorage.getItem("ProviderId"); //new
  const userType = localStorage.getItem("hunterToken") ? "Hunter" : "Provider"; // new
  const [isModalVisible, setIsModalVisible] = useState(false); // Renamed state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info"); // can be 'error', 'warning', 'info', 'success'
  const [email, setEmail] = useState("");
  const [address, setAdress] = useState("");
  const [loading, setLoading] = useState(false);
  const [businessType, setBusinessType] = useState([]);
  const [profile, setProfile] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const id =
    localStorage.getItem("hunterId") || localStorage.getItem("ProviderId");
  const hunterToken = localStorage.getItem("hunterToken");
  const providerToken = localStorage.getItem("ProviderToken");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [avgRating, setAvgRating] = useState(0);

  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });
  const [rating, setRating] = useState([]);
  const user = useSelector((state) => state?.user?.user?.data);
  const providerId = localStorage.getItem("ProviderId");
  const hunterId = localStorage.getItem("hunterId");
  const Guest = JSON.parse(localStorage.getItem("Guest"));
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [notificationSetting, setNotificationSetting] = useState(() => {
    if (providerToken) {
      const setting = localStorage.getItem("notificationEnableProvider");
      return setting === null ? true : setting === "true";
    } else {
      const setting = localStorage.getItem("notificationEnableHunter");
      return setting === null ? true : setting === "true";
    }
  });

  const handleClose = () => setIsModalVisible(false);
  const handleShow = () => setIsModalVisible(true);
  // new
  useEffect(() => {
    if (userId) {
      fetchBackgroundImage();
    }
  }, [userId]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const fetchBackgroundImage = async () => {
    try {
      const response = await axiosInstance.get(`/backgroundImg/${userId}`);
      setBackgroundImg(response.data.data[0].backgroundImg);
    } catch (error) {
      console.error("Error fetching background image:", error);
    }
  };
  const lineClampStyle = {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: "3",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };
  const handleImageUpload = async (event) => {
    setToastProps({
      message: "Image uploading",
      type: "info",
      toastKey: Date.now(),
    });
    const file = event.target.files[0];
    if (!file) return;

    const allowedExtensions = /\.(jpeg|jpg|png)$/i;
    if (!allowedExtensions.test(file.name)) {
      setToastProps({
        message: "Invalid file type. Only JPEG, JPG, and PNG are allowed.",
        type: "error",
        toastKey: Date.now(),
      });

      return;
    }

    const formData = new FormData();
    formData.append("backgroundImg", file);
    formData.append("userType", userType);
    formData.append("userId", userId);

    try {
      const response = await axiosInstance.post(
        "/backgroundImg/upload",
        formData
      );
      setBackgroundImg(response.data.data[0].backgroundImg);
      setToastProps({
        message: "Image Update Successfully",
        type: "success",
        toastKey: Date.now(),
      });
    } catch (error) {
      console.error("Error uploading background image:", error);
      setToastProps({
        message: "Image not Updated Successfully",
        type: "danger",
        toastKey: Date.now(),
      });
    }
  };

  useEffect(() => {
    if (providerId) {
      axiosInstance
        .get(`/provider/about/${userId}`)
        .then((response) => {
          if (response.data.data.length > 0) {
            setAboutText(response.data.data[0].about);
          }
        })
        .catch((error) => console.error("Error fetching about data:", error));
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [ratingRes] = await Promise.all([
        axiosInstance.get(`/rating/getRatings/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("providerToken")}`,
          },
        }),
      ]);

      setRating(ratingRes?.data?.data?.providerRatings || []);
      setAvgRating(ratingRes?.data?.data || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [providerToken]);
  const handleSave = async () => {
    try {
      const response = await axiosInstance.post(`/provider/about/${userId}`, {
        about: description,
      });
      console.log("Response:", response);
      if (response.data.status === 200) {
        setAboutText(response.data.data[0].about); // Set new about text
        setEditShowModal(false);
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error updating about:", error);
    }
  };
  // Handle file change and trigger upload
  const handleFileChange = (event) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

    setSnackbarMessage("Image uploading...");
    setSnackbarSeverity("info");
    setSnackbarOpen(true);

    const files = event.target.files;
    console.log(files);
    if (!files || files.length === 0) return;

    // Check each file's size
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > MAX_FILE_SIZE) {
        setSnackbarMessage("File size exceeds 5MB limit");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return; // Exit if any file is too large
      }
    }

    if (files) {
      setSelectedFile(files);
      handleUpload(files); // Trigger upload on file selection
    }
  };
  // Handle file upload to the server
  const handleUpload = async (files) => {
    if (!files) {
      setSnackbarMessage("Please select a file first.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("image", file); // Same field name for each file
    });

    // formData.append("files", files);
    formData.append("userId", providerId); // Replace with actual providerId

    try {
      const response = await axiosInstance.post(
        "/providerPhoto/upload", // Update the URL as required
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setSnackbarMessage(`${files.length} file(s) uploaded successfully!`);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => {
        setSnackbarOpen(false);
      }, 2000);
      fetchGallery(); // Fetch the gallery after successful upload
    } catch (error) {
      console.error("Upload Failed:", error);
      setSnackbarMessage("Upload failed!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setTimeout(() => {
        setSnackbarOpen(false);
      }, 2000);
    }
  };

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/providerPhoto/${providerId}` // Adjust API endpoint
      );

      if (response.data && response.data.data.files) {
        const files = response.data.data.files;
        setGallery(files); // Set the gallery state with URLs
        setLoading(false);
      } else {
        console.error("No images found in the response.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch gallery:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (providerId) {
      fetchGallery();
    }
  }, []);

  const handleDeleteGallery = async (imageId) => {
    try {
      const response = await axiosInstance.delete(`/providerPhoto/${imageId}`);
      if (response.status === 200) {
        setDeleteModal(false);
        fetchGallery(); // Fetch the gallery after successful deletion
      }
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      try {
        let fetchedUser = null;

        if (hunterToken) {
          const hunterResponse = await dispatch(getHunterUser());
          fetchedUser = hunterResponse?.payload?.data;
        } else if (providerToken) {
          const providerResponse = await dispatch(getProviderUser());
          fetchedUser = providerResponse?.payload?.data;
        }

        if (fetchedUser) {
          setName(fetchedUser.businessName || fetchedUser.name || "");
          setNumber(fetchedUser.phoneNo || "");
          setEmail(fetchedUser.email || "");
          setAdress(fetchedUser.address?.addressLine || "");
          setBusinessType(fetchedUser.businessType || []);
          setProfile(fetchedUser.images || "");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [dispatch, hunterToken, providerToken]);

  const signOut = async () => {
    try {
      const token = hunterToken || providerToken;
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axiosInstance.post(
        "/auth/logout",
        {
          userType: hunterToken ? "hunter" : "provider",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setToastProps({
          message: "You have been Logged Out",
          type: "success",
          toastKey: Date.now(),
        });
        localStorage.removeItem("hunterToken");
        localStorage.removeItem("hunterEmail");
        localStorage.removeItem("hunterName");
        localStorage.removeItem("hunterId");
        localStorage.removeItem("ProviderToken");
        localStorage.removeItem("ProviderEmail");
        localStorage.removeItem("ProviderName");
        localStorage.removeItem("ProviderId");
        localStorage.removeItem("ProviderUId");
        localStorage.removeItem("Guest");
        localStorage.removeItem("PlanType");
        localStorage.removeItem("hunterUId");
        localStorage.removeItem("ProviderRefreshToken");
        localStorage.removeItem("chatId");
        localStorage.removeItem("hunterRefreshToken");
        localStorage.removeItem("verifyEmailOtp");
        navigate("/welcome");
      }
    } catch (error) {
      console.log(error);
      setToastProps({
        message: error?.response?.data?.message || "Logout failed",
        type: "error",
        toastKey: Date.now(),
      });
    }
  };

  const handleNotification = () => {
    const newSetting = !notificationSetting;
    setNotificationSetting(newSetting);

    if (providerToken) {
      localStorage.setItem("notificationEnableProvider", newSetting);
    } else {
      localStorage.setItem("notificationEnableHunter", newSetting);
    }
  };

  const handleNotificationToggle = (id) => {
    setDeleteModal(true);
    setDeleteId(id);
  };

  // const handleNotificationToggle = async () => {
  //   try {
  //     const response = await fetch(`http://3.223.253.106:7777/api/pushNotification/notification/${userId}`, {
  //       method: 'PATCH',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ notificationEnable: false }), // Sending the required payload
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to update notification settings.');
  //     }

  //     const data = await response.json();
  //     console.log('Notification settings updated:', data);
  //     alert('Notification settings updated successfully!');
  //   } catch (error) {
  //     console.error('Error:', error);
  //     alert('Failed to update notification settings.');
  //   }
  // };
  const aboutTextRef = useRef(null);
  useEffect(() => {
    if (aboutTextRef.current) {
      const lineHeight = parseFloat(
        getComputedStyle(aboutTextRef.current).lineHeight
      );
      const maxHeight = lineHeight * 3; // 3 lines
      setIsOverflowing(aboutTextRef.current.scrollHeight > maxHeight);
    }
  }, [aboutText]);
  const deleteAccount = async () => {
    try {
      const token = hunterToken || providerToken;
      if (!token) {
        console.error("No token found");
        return;
      }

      const userId = providerId || hunterId;

      // First delete the chats from Firebase
      // await deleteUserChats(userId);

      // Then proceed with account deletion
      // const response = await axiosInstance.delete(
      //   `${providerId ? "Prvdr" : "DeleteAccount"}/delete/${userId}`
      // );

      const response = await axiosInstance.delete(
        `DeleteAccount/${providerId ? "provider" : "hunter"}/${userId}`
      );

      if (response.status === 200) {
        setToastProps({
          message: "You have been Deleted your Account",
          type: "success",
          toastKey: Date.now(),
        });
        // Clear local storage
        localStorage.removeItem("hunterToken");
        localStorage.removeItem("hunterEmail");
        localStorage.removeItem("hunterName");
        localStorage.removeItem("hunterId");
        localStorage.removeItem("ProviderToken");
        localStorage.removeItem("ProviderEmail");
        localStorage.removeItem("ProviderName");
        localStorage.removeItem("ProviderId");
        localStorage.removeItem("ProviderUId");
        localStorage.removeItem("Guest");
        localStorage.removeItem("hunterUId");
        localStorage.removeItem("ProviderUId");
        localStorage.clear();
        setTimeout(() => navigate("/welcome"), 2000);
      }
    } catch (error) {
      console.log(error);
      setIsModalVisible(false);
      setToastProps({
        message: error?.response?.data?.message || "Delete Account failed",
        type: "error",
        toastKey: Date.now(),
      });
    }
  };
  const modalNotification = () => {
    setNotificationModal(true);
  };

  const closeModalNotification = () => {
    setNotificationModal(false);
  };
  // Function to delete user chats from Firebase
  const deleteUserChats = async (userId) => {
    try {
      const db = realtimeDb; // Initialize Firebase database

      // Get references to all relevant paths
      const userChatListRef = ref(db, `chatList/${userId}`);
      const allChatListRef = ref(db, "chatList");
      const chatsRef = ref(db, "chats");
      const chatsAdminRef = ref(db, "chatsAdmin");

      // Get user's chat list snapshot
      const userChatListSnapshot = await get(userChatListRef);

      if (userChatListSnapshot.exists()) {
        // Get all chat IDs where this user is involved
        const chatIds = [];
        const userChatList = userChatListSnapshot.val();

        // Iterate through all chat partners
        for (const partnerId in userChatList) {
          for (const chatKey in userChatList[partnerId]) {
            chatIds.push(chatKey);
          }
        }

        // Remove user's entry from chatList
        await remove(userChatListRef);

        // Remove references to user's chats from other users' chatLists
        const allChatListSnapshot = await get(allChatListRef);
        if (allChatListSnapshot.exists()) {
          const updates = {};
          const allChatList = allChatListSnapshot.val();

          for (const otherUserId in allChatList) {
            if (otherUserId !== userId && allChatList[otherUserId][userId]) {
              updates[`chatList/${otherUserId}/${userId}`] = null;
            }
          }

          if (Object.keys(updates).length > 0) {
            await update(ref(db), updates);
          }
        }

        // Remove chat data from chats node
        const chatsSnapshot = await get(chatsRef);
        if (chatsSnapshot.exists()) {
          const chats = chatsSnapshot.val();
          const chatUpdates = {};

          for (const jobId in chats) {
            for (const chatId in chats[jobId]) {
              if (chatIds.includes(chatId)) {
                chatUpdates[`chats/${jobId}/${chatId}`] = null;
              }
            }
          }

          if (Object.keys(chatUpdates).length > 0) {
            await update(ref(db), chatUpdates);
          }
        }
      }

      // Remove admin chats if user is in chatsAdmin
      const chatsAdminSnapshot = await get(chatsAdminRef);
      if (chatsAdminSnapshot.exists()) {
        const chatsAdmin = chatsAdminSnapshot.val();
        const adminUpdates = {};

        for (const adminChatKey in chatsAdmin) {
          if (
            adminChatKey.includes(`_chat_${userId}`) ||
            adminChatKey.includes(`${userId}_chat_`)
          ) {
            adminUpdates[`chatsAdmin/${adminChatKey}`] = null;
          }
        }

        if (Object.keys(adminUpdates).length > 0) {
          await update(ref(db), adminUpdates);
        }
      }

      // Remove user from online status
      await remove(ref(db, `user/${userId}`));
    } catch (error) {
      console.error("Error deleting user chats:", error);
      throw error;
    }
  };

  const Location = useLocation();
  return (
    <>
      {loading && !name ? (
        <Loader />
      ) : (
        <>
          {hunterToken ? <LoggedHeader1 /> : <LoggedHeader />}

          {/* <Link to={`/${hunterToken ? "message" : "provider/message"}`}>
            <Tooltip title="Message" placement="left-start">
              <div className="message">
                <MdMessage />
              </div>
            </Tooltip>
          </Link> */}

          <div className="bg-second pb-3">
            <div className="container">
              <div className="profile-container position-relative">
                {/* <div className="image-shadow">
                  <img
                    className="w-100 rounded-4 object-fit-cover"
                    src={backgroundImg || notFound}
                    alt="background"
                  />
                  <div className="exper position-absolute bottom-0 end-0 m-3">
                    <button
                      className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill shadow"
                      style={{
                        backgroundColor: "#32de84",
                        color: "#fff",
                        border: "none",
                      }}
                      onClick={() =>
                        document.getElementById("fileInput").click()
                      }
                    >
                      <FaPen />
                      <span>Change Cover</span>
                    </button>
                    <input
                      type="file"
                      id="fileInput"
                      style={{ display: "none" }}
                      onChange={handleImageUpload}
                      accept="image/*"
                    />
                  </div>
                </div> */}
              </div>
              <div className="row gy-4 gx-lg-3 align-items-center pt-lg-3 pt-2 pt-lg-0">
                <div className="col-lg-3">
                  <div className="position-relative ">
                    <div className="d-flex justify-content-center">
                      <img
                        src={profile || notFound}
                        alt="profile"
                        className="profile-img"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className=" text-center text-lg-start">
                    <h3 className="fw-bold fs-1">{name}</h3>
                    <h5
                      className="text-muted"
                      style={{ textTransform: "capitalize" }}
                    >
                      {user?.userType}
                    </h5>

                    {providerToken && (
                      <>
                        {aboutText ? (
                          <div className="d-flex flex-column align-items-center align-items-lg-start gap-1 justify-content-center justify-content-lg-start">
                            <div className="mt-3">
                              <div
                                ref={aboutTextRef}
                                style={isExpanded ? {} : lineClampStyle}
                              >
                                {aboutText}
                              </div>
                              {isOverflowing && (
                                <p
                                  onClick={() => setIsExpanded((prev) => !prev)}
                                  className="text-primary mt-2"
                                  style={{ cursor: "pointer" }}
                                >
                                  {isExpanded ? "Read less" : "Read more"}
                                </p>
                              )}
                            </div>
                            <button
                              className="px-3 py-2 rounded-pill shadow"
                              style={{
                                backgroundColor: "#32de84",
                                color: "#fff",
                                border: "none",
                              }}
                              onClick={() => {
                                setDescription(aboutText);
                                setEditShowModal(true);
                              }}
                            >
                              Edit About
                            </button>
                          </div>
                        ) : (
                          <button
                            className="px-3 py-2 rounded-pill shadow"
                            style={{
                              backgroundColor: "#32de84",
                              color: "#fff",
                              border: "none",
                            }}
                            onClick={() => setShowModal(true)}
                          >
                            Add Description
                          </button>
                        )}

                        {/* Modal */}
                        <Modal
                          show={showModal}
                          onHide={() => setShowModal(false)}
                          centered
                        >
                          <Modal.Header closeButton>
                            <Modal.Title>Description</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <textarea
                              className="form-control"
                              rows="5"
                              placeholder="Enter your description (max 50 words)..."
                              value={description}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === "") {
                                  setDescription(value);
                                  return;
                                }
                                const words = value.trim().split(/\s+/);
                                const hasOversizedWord = words.some(
                                  (word) => word.length > 30
                                );

                                if (!hasOversizedWord && words.length <= 50) {
                                  setDescription(value);
                                }
                              }}
                            ></textarea>
                            <p className="text-muted mb-0">
                              Word count:{" "}
                              {description.trim()
                                ? description.trim().split(/\s+/).length
                                : 0}
                              /50
                            </p>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button
                              variant="secondary"
                              onClick={() => setShowModal(false)}
                            >
                              Close
                            </Button>
                            <Button variant="primary" onClick={handleSave}>
                              Save
                            </Button>
                          </Modal.Footer>
                        </Modal>
                      </>
                    )}

                    {/* Modal */}
                    <Modal
                      show={editShowModal}
                      onHide={() => setEditShowModal(false)}
                      centered
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Description</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <textarea
                          className="form-control"
                          rows="5"
                          placeholder="Enter your description (max 50 words)..."
                          value={description}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                              setDescription(value);
                              return;
                            }
                            const words = value.trim().split(/\s+/);
                            const hasOversizedWord = words.some(
                              (word) => word.length > 30
                            );

                            if (!hasOversizedWord && words.length <= 50) {
                              setDescription(value);
                            }
                          }}
                        ></textarea>
                        <p className="text-muted mb-0">
                          Word count:{" "}
                          {description.trim()
                            ? description.trim().split(/\s+/).length
                            : 0}
                          /50
                        </p>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          variant="secondary"
                          onClick={() => setShowModal(false)}
                        >
                          Close
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                          Save
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </div>
                </div>

                <div className="col-lg-3">
                  <div className="w-100 ">
                    <div className="d-flex flex-column justify-content-between gap-3 align-items-center align-items-lg-end mt-lg-1">
                      <Link
                        to={
                          `${userType}` === "Provider"
                            ? "/provider/editProfile"
                            : "/editProfile"
                        }
                        className="mw-20"
                      >
                        <Button
                          variant="dark"
                          className="d-flex gap-2 align-items-center w-100 justify-content-center"
                        >
                          <FiEdit />
                          Edit Profile
                        </Button>
                      </Link>

                      {providerToken ? (
                        <Link to="/provider/edit/upload" className="mw-20">
                          <Button
                            variant="dark"
                            className="d-flex gap-2 align-items-center w-100 justify-content-center"
                          >
                            <FiEdit />
                            Edit Document
                          </Button>
                        </Link>
                      ) : null}
                      <Button
                        variant="danger"
                        className="d-flex gap-2 align-items-center  mw-20 justify-content-center"
                        onClick={() => setLogoutModal(true)}
                      >
                        <CiLogout />
                        Logout
                      </Button>

                      <Modal
                        show={logoutModal}
                        onHide={() => setLogoutModal(false)}
                        centered
                      >
                        <Modal.Header className="border-0" closeButton>
                          <Modal.Title></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <h3 className="text-center">
                            Do you really want to logout?
                          </h3>
                          <div className="d-flex justify-content-center flex-row align-items-center gap-2 mt-3">
                            <Button
                              variant="success"
                              onClick={() => setLogoutModal(false)}
                            >
                              Close
                            </Button>
                            <Button
                              variant="danger"
                              className="px-4"
                              onClick={signOut}
                            >
                              Yes
                            </Button>
                          </div>
                        </Modal.Body>
                      </Modal>

                      <Button
                        variant="outline-danger"
                        className="d-flex gap-2 align-items-center mw-20 justify-content-center"
                        onClick={handleShow} // Open the modal on button click
                      >
                        Delete Account
                      </Button>

                      {/* Modal for account deletion confirmation */}
                      <Modal
                        show={isModalVisible}
                        onHide={handleClose}
                        centered // This ensures the modal is vertically centered
                      >
                        <Modal.Header className="border-0" closeButton>
                          <Modal.Title>Confirm Account Delete</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <h5 className="fw-normal text-center">
                            Are you sure you want to delete your account? This
                            action cannot be undone.
                          </h5>
                          <div className="d-flex justify-content-center align-items-center flex-row gap-3 mt-4">
                            <Button
                              variant="success"
                              onClick={handleClose}
                              className="px-4"
                            >
                              Cancel
                            </Button>
                            <Button variant="danger" onClick={deleteAccount}>
                              Delete Account
                            </Button>
                          </div>
                        </Modal.Body>
                      </Modal>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-lg-center gap-4 gap-lg-5 flex-column flex-lg-row mt-3 flex-wrap">
                <div className="contact">
                  <a
                    href={`tel::${number}`}
                    className="text-dark d-flex align-items-center flex-wrap"
                  >
                    <IoCallSharp className="me-2" />
                    {number}
                  </a>
                </div>
                <div className="contact">
                  <a className="text-dark d-flex flex-row flex-wrap gap-2 address-wrap align-items-lg-center">
                    <IoLocationSharp className="" />
                    <span>{address}</span>
                  </a>
                </div>
                <div className="contact">
                  <a
                    href={`mailto:${email}`}
                    className="text-dark d-flex align-items-center flex-wrap"
                  >
                    <IoMdMail className="me-2" />
                    <span>{email}</span>
                  </a>
                </div>
              </div>

              {Location.pathname.includes("provider") ? (
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex flex-row flex-wrap justify-content-lg-start justify-content-center gap-1 gap-lg-2 align-items-center profile my-4">
                    {businessType
                      .slice(
                        0,
                        showAllTypes ? businessType.length : visibleTypesLimit
                      )
                      .map((type, index) => (
                        <div
                          className="color-profile px-3 py-2 pt-1 rounded-5 fs-5"
                          key={index}
                        >
                          <span className="fs-6">{type}</span>
                        </div>
                      ))}
                    {businessType.length > visibleTypesLimit && (
                      <button
                        className="btn btn-link p-0 text-decoration-none"
                        onClick={() => setShowAllTypes(!showAllTypes)}
                      >
                        {showAllTypes
                          ? "Show Less"
                          : `Show More (+${
                              businessType.length - visibleTypesLimit
                            })`}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                ""
              )}

              {userType === "Provider" && (
                <>
                  <div className="card border-0 rounded-5">
                    <div className="card-body py-4 px-lg-4">
                      <div>
                        <div className="d-flex align-items-center justify-content-between flex-column flex-lg-row gap-2">
                          <h4 className="mb-0 text-center text-lg-start">
                            Add your work gallery here
                          </h4>
                          <Button2
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            style={{
                              backgroundColor: "#32de84",
                              color: "#fff",
                              border: "none",
                            }}
                          >
                            Upload files
                            <VisuallyHiddenInput
                              type="file"
                              multiple
                              onChange={handleFileChange}
                              accept="image/jpeg, image/jpg, image/png"
                            />
                          </Button2>
                        </div>

                        <div className="row mt-4">
                          {gallery.length > 0 ? (
                            gallery.map((image, index) => {
                              return (
                                <div
                                  key={index}
                                  className="col-md-2 col-6 mb-3 position-relative"
                                >
                                  <div className="position-absolute top-0 end-0 me-4 mt-3">
                                    <button
                                      className="btn btn-danger"
                                      onClick={() =>
                                        handleNotificationToggle(image._id)
                                      }
                                    >
                                      <FaTrash />
                                    </button>
                                  </div>
                                  <a href={image?.url} target="_blank">
                                    <img
                                      src={image?.url}
                                      alt="Gallery Item"
                                      className="rounded-5"
                                      style={{
                                        width: "100%",
                                        height: "150px",
                                        objectFit: "cover",
                                      }}
                                      loading="lazy"
                                    />
                                  </a>
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-center mt-3">
                              No images uploaded yet.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Modal
                    show={deleteModal}
                    onHide={() => setDeleteModal(false)}
                    centered
                  >
                    <Modal.Header className="border-0" closeButton>
                      <Modal.Title>Delete Alert</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="border-0 text-center">
                      <h3>Do you want to delete this photo?</h3>
                    </Modal.Body>
                    <Modal.Footer className="border-0 ">
                      <Button
                        variant="secondary"
                        onClick={() => setDeleteModal(false)}
                      >
                        Close
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteGallery(deleteId)}
                      >
                        Delete
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </>
              )}

              {userType === "Provider" && rating.length > 0 && (
                <>
                  {avgRating?.avgRating !== 0 && (
                    <div className="d-flex justify-content-start align-items-center mb-3 mt-4">
                      <h5 className="mb-0 me-1">Your Average Review</h5>
                      <IoIosStar size={30} style={{ color: "#ebeb13" }} />

                      <h3 className="mb-0 me-1" style={{ lineHeight: "31px" }}>
                        {avgRating?.avgRating?.toFixed(1)}
                      </h3>

                      {/* <div className="d-flex flex-row gap-1 align-items-center">
                                        {[...Array(5)].map((_, i) => (
                                          <IoIosStar
                                            key={i}
                                            size={30}
                                            style={{ color: "#ebeb13" }}
                                          />
                                        ))}
                                      </div> */}
                    </div>
                  )}
                  <div className="mt-4">
                    <div className="d-flex align-items-center justify-content-between flex-column flex-lg-row gap-2">
                      <h4 className="mb-0 text-center text-lg-start">
                        Your Job Reviews
                      </h4>
                    </div>

                    <div className="row mt-4">
                      <Swiper
                        navigation
                        spaceBetween={50}
                        modules={[Autoplay, Pagination, Navigation]}
                        autoplay={{
                          delay: 4500,
                          disableOnInteraction: false,
                        }}
                        pagination
                        className="swiper-review-people swiper-services"
                        breakpoints={{
                          640: { slidesPerView: 1, spaceBetween: 10 },
                          768: { slidesPerView: 2, spaceBetween: 20 },

                          1200: { slidesPerView: 3, spaceBetween: 40 },
                        }}
                      >
                        {rating.map((item) => (
                          <SwiperSlide key={item._id}>
                            <div className="card border-0 rounded-4">
                              <div className="card-body">
                                <div className="d-flex flex-row justify-content-between align-items-center">
                                  <img
                                    loading="lazy"
                                    src={item?.userId?.images || notFound}
                                    alt="profile"
                                    className="object-fit-cover"
                                    style={{
                                      width: "100px",
                                      height: "100px",
                                    }}
                                  />
                                  <div className="d-flex flex-row gap-1 align-items-center">
                                    <div className="flex">
                                      {[
                                        ...Array(Math.floor(item?.rating || 0)),
                                      ].map((_, i) => (
                                        <IoIosStar
                                          key={i}
                                          size={30}
                                          style={{ color: "#ebeb13" }}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <b className="mb-0 pt-2 ms-2">
                                  Name: {item?.userId?.name}
                                </b>
                                <p className="fw-bold text-start mx-2">
                                  {item?.review}
                                </p>
                              </div>
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  </div>
                </>
              )}

              <div className="row gy-4 my-4">
                <div
                  className={` ${
                    Location.pathname.includes("provider")
                      ? "col-lg-2"
                      : "col-lg-3"
                  }`}
                >
                  {hunterToken ? (
                    <Link to={`/changePassword/${id}`}>
                      <div className="card border-0 rounded-5 h-100">
                        <div className="card-body">
                          <div
                            className={`d-flex gap-3 align-items-center justify-content-center ${
                              Location.pathname.includes("provider")
                                ? "flex-column"
                                : "flex-row"
                            }`}
                          >
                            <div className="circle-container">
                              <div className="progress-circle">
                                <div className="lock-icon">
                                  <FaLock />
                                </div>
                              </div>
                            </div>

                            <div className="d-flex flex-row gap-3 align-items-center">
                              <span className="text-success text-center">
                                Change Password
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <Link to={`/provider/changePassword/${id}`}>
                      <div className="card border-0 rounded-5 h-100">
                        <div className="card-body">
                          <div
                            className={`d-flex gap-3 align-items-center justify-content-center ${
                              Location.pathname.includes("provider")
                                ? "flex-column"
                                : "flex-row"
                            }`}
                          >
                            <div className="circle-container">
                              <div className="progress-circle">
                                <div className="lock-icon">
                                  <FaLock />
                                </div>
                              </div>
                            </div>

                            <div className="d-flex flex-row gap-3 align-items-center">
                              <span className="text-success text-center">
                                Change Password
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
                <div
                  className={` ${
                    Location.pathname.includes("provider")
                      ? "d-none"
                      : "col-lg-3"
                  }`}
                >
                  <Link to="/change-radius">
                    <div className="card border-0 rounded-5 h-100">
                      <div className="card-body">
                        <div
                          className={`d-flex gap-3 align-items-center justify-content-center ${
                            Location.pathname.includes("provider")
                              ? "flex-column"
                              : "flex-row"
                          }`}
                        >
                          <div className="circle-container">
                            <div className="progress-circle">
                              <div className="lock-icon">
                                <PiCircleHalfFill />
                              </div>
                            </div>
                          </div>

                          <div className="d-flex flex-row gap-3 align-items-center">
                            <span className="text-success text-center">
                              Radius Setting
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                <div
                  className={` ${
                    Location.pathname.includes("provider")
                      ? "col-lg-2"
                      : "col-lg-3"
                  }`}
                >
                  <Link
                    to={
                      Location.pathname.includes("provider")
                        ? "/provider/admin/chat"
                        : "/support/chat/"
                    }
                  >
                    <div className="card border-0 rounded-5 h-100">
                      <div className="card-body">
                        <div
                          className={`d-flex gap-3 align-items-center justify-content-center ${
                            Location.pathname.includes("provider")
                              ? "flex-column"
                              : "flex-row"
                          }`}
                        >
                          <div className="circle-container">
                            <div className="progress-circle">
                              <div className="lock-icon">
                                <PiCircleHalfFill />
                              </div>
                            </div>
                          </div>

                          <div className="d-flex flex-row gap-3 align-items-center">
                            <span className="text-success text-center">
                              Support
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
                <div
                  className={` ${
                    Location.pathname.includes("provider")
                      ? "col-lg-2"
                      : "col-lg-3"
                  }`}
                >
                  <div
                    onClick={modalNotification}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="card border-0 rounded-5 h-100">
                      <div className="card-body">
                        <div
                          className={`d-flex gap-3 align-items-center justify-content-center ${
                            Location.pathname.includes("provider")
                              ? "flex-column"
                              : "flex-row"
                          }`}
                        >
                          <div className="circle-container">
                            <div className="progress-circle">
                              <div className="lock-icon">
                                <FaLock />
                              </div>
                            </div>
                          </div>

                          <div className="d-flex flex-row gap-3 align-items-center">
                            <span className="text-success text-center">
                              Notification Setting
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Modal
                  show={notificationModal}
                  onHide={closeModalNotification}
                  centered // This ensures the modal is vertically centered
                >
                  <Modal.Header className="border-0" closeButton>
                    <Modal.Title>Notification setting</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="d-flex flex-row gap-2 justify-content-between align-items-center">
                      <h5 className="fw-normal">Enable your Notification</h5>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={notificationSetting}
                              onChange={handleNotification}
                            />
                          }
                          label={notificationSetting ? "Active" : "Inactive"}
                        />
                      </FormGroup>
                    </div>
                    <div className="d-flex justify-content-center align-items-center flex-row gap-3 mt-4">
                      <Button
                        variant="success"
                        onClick={closeModalNotification}
                        className="px-4"
                      >
                        Cancel
                      </Button>
                    </div>
                  </Modal.Body>
                </Modal>
                <div
                  className={`${
                    Location.pathname.includes("provider")
                      ? "col-lg-2"
                      : "col-lg-3"
                  }`}
                >
                  <Link
                    to={`${
                      Location.pathname.includes("provider")
                        ? "/provider/job-history"
                        : "/privacy"
                    }`}
                  >
                    <div className="card border-0 rounded-5 h-100">
                      <div className="card-body">
                        <div
                          className={`d-flex gap-3 align-items-center justify-content-center ${
                            Location.pathname.includes("provider")
                              ? "flex-column"
                              : "flex-row"
                          }`}
                        >
                          <div className="circle-container">
                            <div className="progress-circle">
                              <div className="lock-icon">
                                <MdOutlineWork />
                              </div>
                            </div>
                          </div>

                          <div className="d-flex flex-row gap-3 align-items-center">
                            <span className="text-success text-center">
                              {Location.pathname.includes("provider")
                                ? " Job History"
                                : "Privacy Policy"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                <div
                  className={`${
                    Location.pathname.includes("provider")
                      ? "col-lg-2"
                      : "d-none"
                  }`}
                >
                  <Link to="/provider/managesubscription">
                    <div className="card border-0 rounded-5 h-100">
                      <div className="card-body">
                        <div
                          className={`d-flex gap-3 align-items-center justify-content-center ${
                            Location.pathname.includes("provider")
                              ? "flex-column"
                              : "flex-row"
                          }`}
                        >
                          <div className="circle-container">
                            <div className="progress-circle">
                              <div className="lock-icon">
                                <CiBadgeDollar />
                              </div>
                            </div>
                          </div>

                          <div className="d-flex flex-row gap-3 align-items-center">
                            <span className="text-success text-center">
                              Manange Subscription
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
                {Location.pathname.includes("provider") && (
                  <div
                    className={`${
                      Location.pathname.includes("provider")
                        ? "col-lg-2"
                        : "col-lg-3"
                    }`}
                  >
                    <Link
                      to={`${
                        Location.pathname.includes("provider") && "/privacy"
                      }`}
                    >
                      <div className="card border-0 rounded-5 h-100">
                        <div className="card-body">
                          <div
                            className={`d-flex gap-3 align-items-center justify-content-center ${
                              Location.pathname.includes("provider") &&
                              "flex-column"
                            }`}
                          >
                            <div className="circle-container">
                              <div className="progress-circle">
                                <div className="lock-icon">
                                  <MdOutlineWork />
                                </div>
                              </div>
                            </div>

                            <div className="d-flex flex-row gap-3 align-items-center">
                              <span className="text-success text-center">
                                {Location.pathname.includes("provider") &&
                                  "Privacy Policy"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                )}
                {
                  <div
                    className={`${
                      Location.pathname.includes("provider")
                        ? "col-lg-2"
                        : "col-lg-3"
                    }`}
                  >
                    <Link to={"/terms"}>
                      <div className="card border-0 rounded-5 h-100">
                        <div className="card-body">
                          <div
                            className={`d-flex gap-3 align-items-center justify-content-center ${
                              Location.pathname.includes("provider") &&
                              "flex-column"
                            }`}
                          >
                            <div className="circle-container">
                              <div className="progress-circle">
                                <div className="lock-icon">
                                  <MdOutlineWork />
                                </div>
                              </div>
                            </div>

                            <div className="d-flex flex-row gap-3 align-items-center">
                              <span
                                className={`text-success ${
                                  Location.pathname.includes("provider")
                                    ? "text-center"
                                    : "text-start"
                                }`}
                              >
                                Terms & Conditions
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                }
              </div>
            </div>
          </div>
        </>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Toaster
        message={toastProps.message}
        type={toastProps.type}
        toastKey={toastProps.toastKey}
      />
    </>
  );
}
