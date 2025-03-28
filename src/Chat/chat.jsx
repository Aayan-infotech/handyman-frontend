import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "../User/user.css";
import user1 from "../assets/user1.png";
import { IoIosSearch } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import Form from "react-bootstrap/Form";
import { IoSendSharp } from "react-icons/io5";
import { useLocation, useParams } from "react-router-dom";
import { ref, push, set, onValue, update } from "firebase/database";
import { realtimeDb, auth } from "./lib/firestore";
import Loader from "../Loader";
import Toaster from "../Toaster";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
const sendMessage = async (
  msgType,
  msg,
  chatId,
  receiverId,
  senderId,
  isReceiverOnline,
  setMessages,
  jobId
) => {
  if (!chatId || !jobId) {
    console.error("Chat ID or Job ID is missing");
    return;
  }

  const time = Date.now();
  console.log("Sending message with Job ID:", jobId);

  try {
    const chat = {
      msg,
      timeStamp: time,
      type: msgType,
      receiverId,
      senderId,
      jobId,
      chatId,
    };

    const users = {
      receiverId,
      senderId,
      jobId,
    };

    const chatMap = {
      messages: chat,
      users,
      unRead: isReceiverOnline ? 0 : 1,
    };
    console.log("CHAT MAP =>", chatMap);

    const newMessageRef = push(
      ref(realtimeDb, `chats/${jobId}/${chatId}/messages`)
    );
    await set(newMessageRef, chat);

    setMessages((prevMessages) => [...prevMessages, chat]);

    // Step 3: Update job status in chat
    await set(ref(realtimeDb, `chats/${jobId}/${chatId}/jobStatus`), {
      status: "Pending",
      acceptedBy: "",
    });

    // Step 4: Save chat details in chatList for both users
    await set(
      ref(realtimeDb, `chatList/${senderId}/${receiverId}/${chatId}`),
      chatMap
    );
    await set(
      ref(realtimeDb, `chatList/${receiverId}/${senderId}/${chatId}`),
      chatMap
    );

    // Step 5: If receiver is offline, mark as unread
    if (!isReceiverOnline) {
      await update(
        ref(realtimeDb, `chatList/${receiverId}/${senderId}/${chatId}`),
        {
          unRead: 1,
        }
      );
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
  console.log("message data in chat", messages);
  console.log("chat id in chat", chatId);

  const chatMessage = selectedChat?.messages;
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

  useEffect(() => {
    if (chatId && Array.isArray(messageData)) {
      setFilteredMessageData(filterMessageDataByChatId(chatId, messageData));
    }
  }, [chatId, messageData]);

  console.log("filteredMessageData", filteredMessageData);
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
      console.log("Valid message data:", messageData);
      setValidMessageData(messageData);
    } else {
      setValidMessageData(null);
    }
  };

  useEffect(() => {
    validateAndSetMessageData(storedUserId, messageData, setValidMessageData);
  }, [storedUserId, messageData]);

  console.log("Filtered messageData:", validMessageData);
  const hunterId = localStorage.getItem("hunterId");
  const receiverId = id || chatMessage?.senderId;
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();
  const jobId =
    new URLSearchParams(location.search).get("jobId") ||
    messageData?.jobPost?._id ||
    selectedChat?.users?.jobId;

  console.log("job id in chat", jobId);
  useEffect(() => {
    const storedUserId = location.pathname.includes("/provider")
      ? localStorage.getItem("ProviderId")
      : localStorage.getItem("hunterId");
    setCurrentUser(storedUserId || "");
  }, [location]);

  useEffect(() => {
    if (!chatId) return;
  
    const chatMessagesRef = ref(realtimeDb, `chats/${jobId}/${chatId}/messages`);
  
    const unsubscribe = onValue(chatMessagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const messagesData = snapshot.val();
        
        // Convert to array and sort
        let messagesArray = Object.values(messagesData)
          .sort((a, b) => a.timeStamp - b.timeStamp);
  
        // Advanced deduplication
        const uniqueMessages = [];
        const seenKeys = new Set();
  
        messagesArray.forEach(message => {
          // Create a unique key combining timestamp, message, and sender
          const messageKey = `${message.timeStamp}_${message.msg}_${message.senderId}`;
          
          if (!seenKeys.has(messageKey)) {
            seenKeys.add(messageKey);
            uniqueMessages.push(message);
          }
        });
  
        setMessagesPeople(uniqueMessages);
      } else {
        setMessagesPeople([]);
      }
    });
  
    return () => unsubscribe();
  }, [chatId, jobId]);

  console.log("messages1", messages);
  console.log("messagesPeople", messagesPeople);

  useEffect(() => {
    console.log("currentUser", currentUser);
    console.log("receiverId", receiverId);

    if (!currentUser || !receiverId) return;

    // Ensure chatId is always a string
    const generatedChatId = [currentUser, receiverId].sort().join("_chat_");

    setChatId(generatedChatId);
  }, [currentUser, receiverId]);

  const handleSend = async () => {
    if (msg.trim() === "" || !chatId || !jobId || !currentUser) return;

    await sendMessage(
      "text",
      msg,
      chatId,
      receiverId,
      currentUser,
      false,
      setMessagesPeople,
      selectedChat?.users?.jobId || jobId
    );
    setMsg("");
  };

  // Handle visibility toggle
  const handleProvider = () => {
    if (
      location.pathname.includes("provider") ||
      location.pathname.includes("support")
    ) {
      setShow(!show);
    }
  };

  console.log("storedUserId", storedUserId);
  const handleCompletedJob = async ({ id }) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `http://3.223.253.106:7777/api/provider/completedCount/${id}`,
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
  const handleJobAccept = async ({ id }) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `http://3.223.253.106:7777/api/jobpost/changeJobStatus/${jobId}`,
        {
          jobStatus: "Assigned",
          providerId: id,
        },
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
      selectedChat.jobData.jobStatus = "Assigned";
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
  useEffect(() => {
    handleProvider();
  }, [location]);

  const dobFunction = ({ id }) => {
    handleCompletedJob({ id });
    handleJobAccept({ id });
  };

  console.log("messageData in chat", selectedChat);

  if (loading) return <Loader />;

  return (
    <>
      <div className={`d-flex flex-column gap-3 pb-4 bg-second`}>
        <div className="card border-0 rounded-3">
          <div className="card-body p-2">
            <div className="d-flex flex-row gap-2 align-items-center justify-content-between">
              <div className="d-flex flex-row align-items-center gap-2 profile-icon">
                <Avatar
                  alt="Image"
                  src={selectedChat?.displayUser?.images}
                  style={{ height: "82px", width: "82px" }}
                >
                  {/* {selectedChat?.displayUser
                    ? 
                    : filteredMessage?.name
                    ? filteredMessage?.name.toUpperCase().charAt(0)
                    : ""} */}
                  {selectedChat?.displayUser?.name?.toUpperCase().charAt(0) ||
                    selectedChat?.displayUser?.contactName
                      .toUpperCase()
                      .charAt(0)}
                </Avatar>
                <div className="d-flex flex-column gap-1">
                  <h5 className="mb-0 fw-medium fs-5 text-dark">
                    {selectedChat?.displayUser?.name ||
                      selectedChat?.displayUser?.contactName}
                  </h5>
                  {/* {!show ? (
                    <span className="text-muted fs-6">2m ago</span>
                  ) : null} */}
                </div>
              </div>
              <div className="d-flex flex-row gap-2 align-items-center">
                <IoIosSearch className="fs-3" />
                <BsThreeDotsVertical className="fs-3" />
              </div>
            </div>
          </div>
        </div>
        {hunterId && selectedChat?.jobData?.jobStatus === "Pending" && (
          <div className="container-fluid">
            <div className="row">
              <div className={`mw-condition mx-auto`}>
                <div className="card rounded-5 border-0 shadow">
                  <div className="card-body px-4 py-3">
                    <span className="text-center d-flex justify-content-center">
                      Do you want to work with them for this job
                      <br /> {selectedChat?.jobData?.title}
                    </span>
                    <div className="d-flex justify-content-evenly mt-3">
                      <button
                        className="btn btn-primary px-5"
                        onClick={() =>
                          dobFunction({
                            id: selectedChat?.displayUser?._id,
                          })
                        }
                      >
                        Yes
                      </button>
                      <button className="btn btn-danger px-5">No</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div
          className={`position-relative container${
            show ? "bg-second h-100" : ""
          }`}
        >
          <div className={`d-block mh-100vh ${show ? "container my-4" : ""}`}>
            {messagesPeople?.length === 0 ? (
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
            ) : (
              messagesPeople?.map((msg, index) => (
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
                    {msg?.msg}
                  </p>
                  <span className="text-muted time-status">
                    {new Date(msg.timeStamp).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className={`send-box ${show ? "container mb-5" : ""}`}>
            <div className={`input-send ${show ? "input-send-provider" : ""}`}>
              <Form.Control
                placeholder="Type Message"
                className="w-100 border-0 py-3 px-3 rounded-5"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
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
