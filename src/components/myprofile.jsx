import React, { useState, useEffect } from "react";
import LoggedHeader from "./loggedNavbar";
import {
  MdMessage,
  MdOutlineWork,
  MdOutlineSupportAgent,
} from "react-icons/md";
import "swiper/css";
import "swiper/css/navigation";
import { ref, onValue, off, remove, update, get } from "firebase/database";
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
export default function MyProfile() {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [backgroundImg, setBackgroundImg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState("");
  const [logoutModal, setLogoutModal] = useState(false);
  const [aboutText, setAboutText] = useState("");
  const [fileToUpload, setFileToUpload] = useState(null);

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
  const [selectedFile, setSelectedFile] = useState(null);
  const [gallery, setGallery] = useState([]);

  const userId =
    localStorage.getItem("hunterId") || localStorage.getItem("ProviderId"); //new
  const userType = localStorage.getItem("hunterToken") ? "Hunter" : "Provider"; // new
  const [isModalVisible, setIsModalVisible] = useState(false); // Renamed state

  const [email, setEmail] = useState("");
  const [address, setAdress] = useState("");
  const [loading, setLoading] = useState(false);
  const [businessType, setBusinessType] = useState([]);
  const [profile, setProfile] = useState("");
  const id =
    localStorage.getItem("hunterId") || localStorage.getItem("ProviderId");
  const hunterToken = localStorage.getItem("hunterToken");
  const providerToken = localStorage.getItem("ProviderToken");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });
  const user = useSelector((state) => state?.user?.user?.data);
  const providerId = localStorage.getItem("ProviderId");
  const hunterId = localStorage.getItem("hunterId");

  const handleClose = () => setIsModalVisible(false);
  const handleShow = () => setIsModalVisible(true);
  // new
  useEffect(() => {
    if (userId) {
      fetchBackgroundImage();
    }
  }, [userId]);

  const fetchBackgroundImage = async () => {
    try {
      const response = await axiosInstance.get(`/backgroundImg/${userId}`);
      setBackgroundImg(response.data.data[0].backgroundImg);
    } catch (error) {
      console.error("Error fetching background image:", error);
    }
  };

  const handleImageUpload = async (event) => {
    setToastProps({
      message: "Image uploading",
      type: "info",
      toastKey: Date.now(),
    });
    const file = event.target.files[0];

    console.log(file, ".....file");
    if (!file) return;

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
    axiosInstance
      .get(`/provider/about/${userId}`)
      .then((response) => {
        if (response.data.data.length > 0) {
          setAboutText(response.data.data[0].about);
        }
      })
      .catch((error) => console.error("Error fetching about data:", error));
  }, []);

  // Function to handle save (POST request)
  const handleSave = () => {
    axiosInstance
      .post(`/provider/about/${userId}`, {
        about: description,
      })
      .then((response) => {
        if (response.data.success) {
          setAboutText(response.data.data[0].about); // Set new about text
          setShowModal(false); // Close modal
        }
      })
      .catch((error) => console.error("Error updating about:", error));
  };
  // Handle file change and trigger upload
  const handleFileChange = (event) => {
    setToastProps({
      message: "Image uploading",
      type: "info",
      toastKey: Date.now(),
    });
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      handleUpload(file); // Trigger upload on file selection
    }
  };
  // Handle file upload to the server
  const handleUpload = async (file) => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("files", file);
    formData.append("userId", providerId); // Replace with actual providerId

    try {
      const response = await axiosInstance.post(
        "/providerPhoto/upload", // Update the URL as required
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Upload Response:", response.data);
      setToastProps({
        message: "Image uploaded successfully",
        type: "success",
        toastKey: Date.now(),
      });
      fetchGallery(); // Fetch the gallery after successful upload
    } catch (error) {
      console.error("Upload Failed:", error);
      alert("Upload Failed!");
    }
  };

  const fetchGallery = async () => {
    try {
      const response = await axiosInstance.get(
        `/providerPhoto/${providerId}` // Adjust API endpoint
      );

      if (response.data && response.data.data.files) {
        const files = response.data.data.files;
        setGallery(files); // Set the gallery state with URLs
      } else {
        console.error("No images found in the response.");
      }
    } catch (error) {
      console.error("Failed to fetch gallery:", error);
    }
  };

  useEffect(() => {
    fetchGallery(); // Fetch gallery images when the component mounts
  }, []);

  const handleDeleteGallery = async (imageId) => {
    try {
      await axiosInstance.delete(`/providerPhoto/${imageId}`);

      fetchGallery(); // Fetch the gallery after successful deletion
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
          console.log(fetchedUser);
        } else if (providerToken) {
          const providerResponse = await dispatch(getProviderUser());
          fetchedUser = providerResponse?.payload?.data;
        }

        if (fetchedUser) {
          setName(fetchedUser.contactName || fetchedUser.name || "");
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
  const deleteAccount = async () => {
    try {
      const token = hunterToken || providerToken;
      if (!token) {
        console.error("No token found");
        return;
      }

      const userId = providerId || hunterId;

      // First delete the chats from Firebase
      await deleteUserChats(userId);

      // Then proceed with account deletion
      const response = await axiosInstance.delete(
        `/DeleteAccount/${providerId ? "provider" : "delete"}/${userId}`
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
        message: error?.response?.data?.message || "Logout failed",
        type: "error",
        toastKey: Date.now(),
      });
    }
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

      console.log("Successfully deleted all chat data for user:", userId);
    } catch (error) {
      console.error("Error deleting user chats:", error);
      throw error;
    }
  };
  console.log("dgrd", gallery);

  const Location = useLocation();
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <LoggedHeader />
          <Link
            to={`/${hunterToken ? "support/chat/1" : "provider/admin/chat/"}`}
          >
            <div className="admin-message">
              <MdOutlineSupportAgent />
            </div>
          </Link>
          <div className="message">
            <Link to={`/${hunterToken ? "message" : "provider/message"}`}>
              <MdMessage />
            </Link>
          </div>
          <div className="bg-second pb-3">
            <div className="container">
              <div className="profile-container position-relative">
                <div className="image-shadow">
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
                </div>
              </div>
              <div className="row gy-4 gx-lg-3">
                <div className="col-lg-3">
                  <div className="position-relative ">
                    <div className="pos-profile start-0 mx-auto">
                      <img
                        src={profile || notFound}
                        alt="profile"
                        className="profile-img"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="mt-5 mt-lg-0 text-center text-lg-start">
                    <h3 className="fw-bold fs-1">{name}</h3>
                    <h5
                      className="text-muted"
                      style={{ textTransform: "capitalize" }}
                    >
                      {user?.userType}
                    </h5>

                    {providerToken && (
                      <>
                        {" "}
                        {aboutText ? (
                          <div className="d-flex flex-column align-items-center align-items-lg-start gap-1 justify-content-center justify-content-lg-start">
                            <p className="mt-3">{aboutText}</p>{" "}
                            <button
                              className=" px-3 py-2 rounded-pill shadow"
                              style={{
                                backgroundColor: "#32de84",
                                color: "#fff",
                                border: "none",
                              }}
                              onClick={() => setShowModal(true)} // Open the modal for editing
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
                            onClick={() => setShowModal(true)} // Open the modal for adding about text
                          >
                            Add Description
                          </button>
                        )}
                      </>
                    )}

                    {/* Modal Component */}
                    <Modal
                      show={showModal}
                      onHide={() => setShowModal(false)}
                      centered
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Add Description</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <textarea
                          className="form-control"
                          rows="3"
                          placeholder="Enter your description (max 150 words)..."
                          value={description}
                          onChange={(e) => {
                            const words = e.target.value.trim().split(/\s+/);
                            if (words.length <= 50 || e.target.value === "") {
                              setDescription(e.target.value);
                            }
                          }}
                        ></textarea>
                        <p className="text-muted">
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
                      {hunterToken ? (
                        <Link to="/editProfile" className="mw-20">
                          <Button
                            variant="dark"
                            className="d-flex gap-2 align-items-center w-100 justify-content-center"
                          >
                            <FiEdit />
                            Edit Profile
                          </Button>
                        </Link>
                      ) : (
                        <Link to="/provider/editProfile" className="mw-20">
                          <Button
                            variant="dark"
                            className="d-flex gap-2 align-items-center w-100 justify-content-center"
                          >
                            <FiEdit />
                            Edit Profile
                          </Button>
                        </Link>
                      )}
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
                  <a href={`tel::${number}`} className="text-dark">
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
                  <a href={`mailto:${email}`} className="text-dark">
                    <IoMdMail className="me-2" />
                    {email}
                  </a>
                </div>
              </div>

              {Location.pathname.includes("provider") ? (
                <div className="d-flex flex-row flex-wrap justify-content-lg-start justify-content-center gap-1 gap-lg-2 align-items-center profile my-4">
                  {businessType.map((type, index) => (
                    <div
                      className="color-profile px-3 py-2 pt-1 rounded-5 fs-5"
                      key={index}
                    >
                      <span className="fs-6">{type}</span>
                    </div>
                  ))}
                </div>
              ) : (
                ""
              )}

              {userType === "Provider" && (
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
                            onChange={handleFileChange}
                          />
                        </Button2>
                      </div>

                      <div className="row mt-4">
                        {gallery.length > 0 ? (
                          gallery.map((image, index) => {
                            return (
                              <div
                                key={index}
                                className="col-md-3 col-6 mb-3 position-relative"
                              >
                                <div className="position-absolute top-0 end-0 me-4 mt-3">
                                  <button
                                    className="btn btn-danger"
                                    onClick={() =>
                                      handleDeleteGallery(image._id)
                                    }
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                                <img
                                  src={image?.url}
                                  alt="Gallery Item"
                                  className="rounded-5"
                                  style={{
                                    width: "100%",
                                    height: "200px",
                                    objectFit: "cover",
                                  }}
                                />
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
                      ? "d-none"
                      : "col-lg-3"
                  }`}
                >
                  <Link to="/support">
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
