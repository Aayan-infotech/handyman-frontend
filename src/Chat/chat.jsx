import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "../User/user.css";
import user1 from "../assets/user1.png";
import { IoIosSearch } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa";
import Form from "react-bootstrap/Form";
import { IoSendSharp } from "react-icons/io5";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { ref, push, set, onValue, update, get, off } from "firebase/database";
import { realtimeDb, auth } from "./lib/firestore";
import Loader from "../Loader";
import Toaster from "../Toaster";
import axiosInstance from "../components/axiosInstance";
import Avatar from "@mui/material/Avatar";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import {
  assignedJobNotification,
  messageNotification,
  messageNotificationProvider,
} from "../Slices/notificationSlice";
import { useDispatch, useSelector } from "react-redux";

const sendMessage = async (
  msgType,
  msg,
  chatId,
  receiverId,
  senderId,
  isReceiverOnline,
  setMessages,
  jobId,
  jobTitle,
  peerName
) => {
  if (!chatId) {
    console.error("Chat ID or Job ID is missing");
    return;
  }

  const timestamp = Date.now();
  console.log("Sending message with Job ID:", jobId);

  try {
    // Step 1: Save the message in messages collection
    const message = {
      message: msg,
      receiverId,
      senderId,
      timestamp,
      type: msgType,
    };

    const newMessageRef = push(ref(realtimeDb, `messages/${chatId}`));
    await set(newMessageRef, message);

    // Step 2: Forcefully recreate chatList entries for both users
    const updates = {};
    const senderName =
      localStorage.getItem("ProviderBusinessName") ||
      localStorage.getItem("hunterName") ||
      "Unknown";
    const receiverName = peerName || "Unknown";

    // Always create/update sender's chat entry
    updates[`chatList/${senderId}/${chatId}`] = {
      isRead: true,
      jobId: jobId || null,
      jobTitle: jobTitle || "",
      lastMessage: msg,
      peerId: receiverId,
      peerName: receiverName,
      timestamp,
    };

    // Always create/update receiver's chat entry
    updates[`chatList/${receiverId}/${chatId}`] = {
      isRead: false,
      jobId: jobId || null,
      jobTitle: jobTitle || "",
      lastMessage: msg,
      peerId: senderId,
      peerName: senderName,
      timestamp,
    };

    // Execute all updates atomically
    await update(ref(realtimeDb), updates);

    // If receiver is offline, ensure isRead is false
    if (!isReceiverOnline) {
      await update(ref(realtimeDb, `chatList/${receiverId}/${chatId}`), {
        isRead: false,
      });
    }
  } catch (error) {
    console.error("Firebase Error:", error.message);
  }
};

const filterMessageDataByChatId = (chatId, messageData) => {
  if (!chatId || !Array.isArray(messageData)) return null;
  return messageData.find((msg) => msg.chatId === chatId) || null;
};

export default function Chat({ messageData, messages, selectedChat }) {
  const [show, setShow] = useState(false);
  const [messagesPeople, setMessagesPeople] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState(selectedChat?.chatId);
  const [validMessageData, setValidMessageData] = useState(null);
  const [peerData, setPeerData] = useState(null); // Store peer user data
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });
  const token =
    localStorage.getItem("hunterToken") ||
    localStorage.getItem("ProviderToken");
  const { id } = useParams();
  const storedUserId =
    localStorage.getItem("hunterId") || localStorage.getItem("ProviderId");
  const [filteredMessageData, setFilteredMessageData] = useState(null);
  const senderId =
    localStorage.getItem("ProviderId") || localStorage.getItem("hunterId");
  const [jobShow, setJobShow] = useState(false);
  const [currentUser, setCurrentUser] = useState(senderId);
  const receiverId = id || selectedChat?.peerId || messageData[chatId]?.peerId;
  const location = useLocation();
  const hunterId = localStorage.getItem("hunterId");
  const jobId =
    new URLSearchParams(location.search).get("jobId") ||
    messageData?.jobId ||
    selectedChat?.jobId ||
    null;

  // Fetch peer user data from Firebase
  useEffect(() => {
    if (!receiverId) return;

    const isCurrentUserProvider = localStorage.getItem("ProviderId") !== null;
    const peerUserType = isCurrentUserProvider ? "hunter" : "provider";
    const peerRef = ref(realtimeDb, `users/${peerUserType}/${receiverId}`);

    const unsubscribe = onValue(peerRef, (snapshot) => {
      if (snapshot.exists()) {
        setPeerData(snapshot.val());
      } else {
        setPeerData(null);
      }
    });

    return () => {
      off(peerRef);
    };
  }, [receiverId]);

  const handleData = async () => {
    try {
      const response = await axiosInstance.post(
        "/match/getMatchedData",
        { jobPostId: jobId, senderId, receiverId },
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("hunterToken") ||
              localStorage.getItem("ProviderToken")
            }`,
          },
        }
      );

      if (response.status === 500) {
        navigate("/error");
        return;
      }

      const jobTitle = response?.data?.data?.jobPost?.title;
      console.log("Job Title:", jobTitle);

      // Instead of modifying selectedChat directly, we'll use this data when needed
      return jobTitle;
    } catch (error) {
      console.error("Match API error:", error);
      if (error.response?.status === 500) {
        navigate("/error");
      }
      return null;
    }
  };

  // Then modify your useEffect to handle the job title properly
  useEffect(() => {
    const fetchJobTitle = async () => {
      if (jobId && senderId && receiverId) {
        const jobTitle = await handleData();
        // You can store this in state if needed elsewhere
      }
    };

    fetchJobTitle();
  }, [jobId, senderId, receiverId]);

  console.log("peerData", peerData);

  useEffect(() => {
    if (chatId && Array.isArray(messageData)) {
      setFilteredMessageData(filterMessageDataByChatId(chatId, messageData));
    }
  }, [chatId, messageData]);

  useEffect(() => {
    validateAndSetMessageData(storedUserId, messageData, setValidMessageData);
  }, [storedUserId, messageData]);

  useEffect(() => {
    if (!chatId) return;

    console.log("Fetching messages for chatId:", chatId);
    setLoading(true);
    const chatMessagesRef = ref(realtimeDb, `messages/${chatId}`);

    const unsubscribe = onValue(chatMessagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const messagesData = snapshot.val();

        let messagesArray = Object.entries(messagesData)
          .map(([key, value]) => ({
            id: key,
            ...value,
            msg: value.message,
            timeStamp: value.timestamp,
            senderId: value.senderId,
            receiverId: value.receiverId,
          }))
          .sort((a, b) => a.timestamp - b.timestamp);

        setMessagesPeople(messagesArray);
        setLoading(false);
      } else {
        setMessagesPeople([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    console.log("currentUser", currentUser);
    console.log("receiverId", receiverId);

    if (!currentUser || !receiverId) return;

    const sortedIds = [currentUser, receiverId].sort();
    const baseChatId = sortedIds.join("_");
    const generatedChatId = jobId ? `${baseChatId}_${jobId}` : baseChatId;

    setChatId(generatedChatId);
  }, [currentUser, receiverId, jobId]);

  const handleSendEmail = async () => {
    try {
      const response = await axiosInstance.post(
        "/hunter/send-job-email",
        {
          jobTitle: selectedChat?.jobData?.title,
          name:
            localStorage.getItem("ProviderBusinessName") ||
            localStorage.getItem("hunterName"),
          receverEmail: peerData?.email, // Use email from Firebase peer data
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSend = async () => {
    if (msg.trim() === "" || !chatId || !currentUser) return;

    setMsg("");

    // Get job title from wherever you're storing it (might need to add state for this)
    const jobTitle = selectedChat?.jobData?.title || (await handleData()) || "";

    await sendMessage(
      "text",
      msg,
      chatId,
      receiverId,
      currentUser,
      false,
      setMessagesPeople,
      selectedChat?.users?.jobId || jobId || null,
      jobTitle, // Pass the job title here
      peerData?.businessName || peerData?.name
    );

    await handleSendEmail();

    const businessName =
      localStorage.getItem("ProviderBusinessName") ||
      localStorage.getItem("hunterName");

    if (businessName) {
      dispatch(
        messageNotification({
          receiverId: receiverId,
          jobId: jobId,
          body: `${businessName} sent you a message regarding the job ${jobTitle}`,
        })
      );
    }
  };

  const handleProvider = () => {
    if (
      location.pathname.includes("provider") ||
      location.pathname.includes("support")
    ) {
      setShow(!show);
    }
  };

  const handleBack = () => {
    const path = new URLSearchParams(location.search).get("path");

    if (path) {
      navigate(`/notification`);
      return;
    }
    if (hunterId) {
      navigate(`/job-detail/${jobId}`);
      return;
    }

    navigate(`/provider/home`);
  };

  const validateAndSetMessageData = (
    storedUserId,
    messageData,
    setValidMessageData
  ) => {
    if (
      storedUserId &&
      messages?.senderId !== storedUserId &&
      messages?.receiverId !== storedUserId
    ) {
      setValidMessageData(messageData);
    } else {
      setValidMessageData(null);
    }
  };

  useEffect(() => {
    handleProvider();
  }, [location]);

  if (loading) return <Loader />;

  const messages1 = messages || messagesPeople;
  console.log(
    "avatarContent",
    peerData?.profileImage ||
      peerData?.image ||
      selectedChat?.displayUser?.images
  );

  return (
    <>
      <div className={`d-flex flex-column gap-3 pb-4 bg-second`}>
        <div className="card border-0 rounded-3">
          <div className="card-body p-2">
            <div className="d-flex flex-row gap-2 align-items-center justify-content-start">
              <div className="d-flex flex-row align-items-center gap-2 profile-icon">
                {(location.pathname.startsWith("/provider/") ||
                  location.pathname.startsWith("/chat/")) && (
                  <FaArrowLeft
                    className="fs-4"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleBack(jobId)}
                  />
                )}
                <Avatar
                  alt="Image"
                  src={
                    peerData?.profileImage ||
                    peerData?.image ||
                    selectedChat?.displayUser?.images
                  }
                  style={{ height: "82px", width: "82px" }}
                >
                  {peerData?.businessName?.toUpperCase().charAt(0) ||
                    peerData?.name?.toUpperCase().charAt(0) ||
                    selectedChat?.displayUser?.businessName
                      ?.toUpperCase()
                      .charAt(0)}{" "}
                </Avatar>
                <div className="d-flex flex-column gap-1">
                  <h5
                    className="mb-0 fw-medium fs-5 text-dark"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      if (localStorage.getItem("hunterId")) {
                        navigate(`/service-profile/${receiverId}`);
                      }
                    }}
                  >
                    {peerData?.name ||
                      peerData?.businessName ||
                      selectedChat?.displayUser?.name ||
                      selectedChat?.displayUser?.businessName}
                  </h5>
                  {selectedChat?.jobData?.title && (
                    <p class="mb-0">{selectedChat?.jobData?.title}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`position-relative container${
            show ? "bg-second h-100" : ""
          }`}
        >
          <div className={`d-block mh-100vh ${show ? "container my-4" : ""}`}>
            {messages1?.length === 0 ? (
              <>
                {!loading ? (
                  <div className="text-center py-4">No messages yet</div>
                ) : (
                  <>
                    <Stack spacing={1} className="d-block">
                      <div className="fl-left">
                        <Skeleton
                          variant="rounded"
                          className="mb-3"
                          animation="wave"
                          width={210}
                          height={20}
                        />
                        <Skeleton
                          variant="rounded"
                          className="mb-3"
                          animation="wave"
                          width={150}
                          height={20}
                        />
                        <Skeleton
                          variant="rounded"
                          animation="wave"
                          width={110}
                          height={20}
                        />
                      </div>
                      <div className="fl-right">
                        <Skeleton
                          variant="rounded"
                          className="mb-3"
                          animation="wave"
                          width={210}
                          height={20}
                        />
                        <Skeleton
                          variant="rounded"
                          className="mb-3"
                          animation="wave"
                          width={150}
                          height={20}
                        />
                        <Skeleton
                          variant="rounded"
                          animation="wave"
                          width={110}
                          height={20}
                        />
                      </div>
                    </Stack>
                  </>
                )}
              </>
            ) : (
              messages1?.map((msg, index) => (
                <div
                  key={index}
                  className={
                    msg.senderId === currentUser ? "fl-right" : "fl-left"
                  }
                >
                  <p
                    className={
                      msg.senderId === currentUser
                        ? "msg-sent mb-1"
                        : "msg-recieved mb-1"
                    }
                  >
                    {msg?.message}
                  </p>
                  <span className="text-muted time-status">
                    {new Date(msg.timestamp).toLocaleTimeString("en-AU", {
                      timeZone: "Australia/Sydney",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className={`send-box ${show ? "container mb-5" : ""}`}>
            <div className={`input-send ${show ? "input-send-provider" : ""}`}>
              <textarea
                placeholder="Type Message"
                className="w-100 border-0 px-3  pt-2 pb-0 rounded-5"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <IoSendSharp onClick={handleSend} style={{ cursor: "pointer" }} />
            </div>
          </div>
        </div>
      </div>

      <Toaster
        message={toastProps.message}
        type={toastProps.type}
        toastKey={toastProps.toastKey}
      />
    </>
  );
}
