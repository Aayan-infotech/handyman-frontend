import React, { useState, useEffect } from "react";
import "../User/user.css";
import { IoIosSearch } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoSendSharp } from "react-icons/io5";
import { useLocation, useParams } from "react-router-dom";
import { realtimeDb } from "./lib/firestore";
import { ref, push, set, onValue, update } from "firebase/database";
import Avatar from "@mui/material/Avatar";
import axiosInstance from "../components/axiosInstance";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { FaArrowLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  assignedJobNotification,
  messageNotification,
  messageNotificationProvider,
} from "../Slices/notificationSlice";
import {useNavigate} from "react-router-dom";
const sendMessage = async (
  msgType,
  msg,
  chatId,
  receiverId,
  senderId,
  name,
  setMessages
) => {
  if (!chatId) {
    console.error("Chat ID is missing");
    return;
  }
  const time = Date.now();
  try {
    const chat = {
      msg,
      timeStamp: time,
      type: msgType,
      receiverId,
      senderId,
      name,
    };

    const newMessageRef = push(ref(realtimeDb, `chats/${chatId}/messages`));
    await set(newMessageRef, chat);
    const users = {
      receiverId,
      senderId,
    };

    const chatMap = {
      messages: chat,
      users,
    };
    // await set(
    //   ref(
    //     realtimeDb,
    //     `chatList/${receiverId}/${senderId}/${chatId}` ||
    //       `chatList/${senderId}/${receiverId}/${chatId}`
    //   ),
    //   chatMap
    // );

    const updates = {
      [`chatList/${senderId}/${receiverId}/${chatId}`]: chatMap,
      [`chatList/${receiverId}/${senderId}/${chatId}`]: chatMap,
    };

    await update(ref(realtimeDb), updates);
  } catch (error) {
    console.error("Firebase Error:", error.message);
  }
};

export default function AdvertiserChat({ messageData, selectedChat }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [show, setShow] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [chatData, setChatData] = useState([]);
  const [filteredChatData, setFilteredChatData] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const [chatId, setChatId] = useState(selectedChat?.chatId || null);

  const userType = localStorage.getItem("ProviderId") ? "Provider" : "Hunter";
  const currentUser =
    localStorage.getItem("ProviderId") || localStorage.getItem("hunterId");
  const currentUserName =
    localStorage.getItem("ProviderBusinessName") ||
    localStorage.getItem("hunterName");
  const chatMessage = selectedChat?.messages;
  console.log("chatId", chatId);
  const receiverId =
    id ||
    (chatMessage?.receiverId !== currentUser && chatMessage.receiverId) ||
    (chatMessage?.senderId !== currentUser && chatMessage.senderId);

  console.log("receiverId", receiverId);
  console.log("currentUser", currentUser);
  console.log("chatId", chatId);

  useEffect(() => {
    if (!currentUser || !receiverId || !chatId) return;

    const chatMessagesRef = ref(realtimeDb, `chats/${chatId}/messages`);
    const unsubscribe = onValue(chatMessagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = Object.values(snapshot.val());
        data.sort((a, b) => a.createdAt - b.createdAt);
        setMessages(data);
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, [chatId, currentUser, receiverId]);

  const generateChatId = () => {
    return [currentUser, receiverId].sort().join("_chat_");
  };

  const handleData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        "/match/getMatchedDataNotification",
        { senderId: currentUser, receiverId },
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("hunterToken") ||
              localStorage.getItem("ProviderToken")
            }`,
          },
        }
      );

      const responseData = response?.data?.data;
      console.log("responseData", responseData);

      if (
        (responseData &&
          typeof responseData === "object" &&
          (responseData.senderId === id || responseData.receiverId === id)) ||
        responseData.sender?._id === id ||
        responseData.receiver?._id === id
      ) {
        setChatData([responseData]); // wrap in array if used elsewhere
        setFilteredChatData(responseData);
      } else {
        setChatData([]);
        setFilteredChatData(null);
      }
    } catch (error) {
      console.error("Error fetching chat data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleData();
  }, [id]);

    const goBack = () => {
    navigate(-1); // Goes back one page in history
    // or navigate('/specific-path') to go to a specific route
  };
  useEffect(() => {
    console.log("currentUser", currentUser);
    console.log("receiverId", receiverId);

    if (!currentUser || !receiverId) return;

    // Ensure chatId is always a string
    const generatedChatId = [currentUser, receiverId].sort().join(`_chat_`);

    setChatId(generatedChatId);
  }, [currentUser, receiverId]);

  const handleProvider = () => {
    if (
      location.pathname.includes("provider") ||
      location.pathname.includes("support")
    ) {
      setShow(!show);
    }
  };
console.log("chatData", chatData);
  const handleSendEmail = async () => {
    try {
      const response = await axiosInstance.post(
        "/hunter/send-job-email",
        {
          jobTitle:
            chatData?.jobPost?.title || selectedChat?.jobData?.title || "",
          name:
            localStorage.getItem("ProviderBusinessName") ||
            localStorage.getItem("hunterName"),
          receverEmail: selectedChat?.displayUser?.email || chatData[0]?.receiver?.email,
        },
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("hunterToken") ||
              localStorage.getItem("ProviderToken")
            }`,
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSend = async () => {
    if (text.trim() === "" || !chatId || !currentUser) return;
    setText("");
    await sendMessage(
      userType,
      text,
      chatId,
      receiverId,
      currentUser,
      currentUserName,
      setMessages
    );

    await handleSendEmail();
    dispatch(
      messageNotification({
        receiverId: receiverId,

        body: `You have a new message from ${currentUserName}`,
      })
    );
  };

  useEffect(() => {
    handleProvider();
  }, [location]);

  console.log("filteredChatData", chatData);
  const otherUser =
    chatData[0]?.receiver?._id === receiverId
      ? chatData[0]?.receiver
      : chatData[0]?.sender;

  const displayName = otherUser?.name || otherUser?.businessName || "User";
  const avatarContent =
    otherUser?.name?.charAt(0) || otherUser?.businessName?.charAt(0) || "U";

  console.log("messages", messages);

  return (
    <div className={`d-flex flex-column gap-3 pb-4 bg-second advertiser-chat`}>
      <div className="card border-0 rounded-3">
        <div className="card-body p-2">
          <div className="d-flex flex-row gap-2 align-items-center justify-content-between">
            <div className="d-flex flex-row align-items-center gap-2 profile-icon">
               {(
                  location.pathname.startsWith("/advertiser/")) && (
                  <FaArrowLeft
                    className="fs-4"
                    style={{ cursor: "pointer" }}
                    onClick={goBack}
                  />
                )}
              <Avatar
                alt="Image"
                src={otherUser?.images}
                style={{ height: "82px", width: "82px" }}
              >
                {avatarContent}
              </Avatar>
              <div className="d-flex flex-column gap-1">
                <h5 className="mb-0 fw-medium fs-5 text-dark">{displayName}</h5>
              </div>
            </div>
            {/* <div className="d-flex flex-row gap-2 align-items-center">
              <IoIosSearch className="fs-3" />
              <BsThreeDotsVertical className="fs-3" />
            </div> */}
          </div>
        </div>
      </div>

      {loading ? (
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
        <>
          <div
            className={`container position-relative ${
              show ? "bg-second h-100" : ""
            }`}
          >
            <div className={`d-block mh-100vh ${show ? "container my-4" : ""}`}>
              {messages.length > 0 ? (
                messages.map((msg, index) => (
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
                      {msg.msg}
                    </p>
                    <span className="text-muted time-status">
                      {new Date(msg.timeStamp).toLocaleTimeString("en-AU", {
                        timeZone: "Australia/Sydney",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">No messages yet</div>
              )}
            </div>

            <div className={`send-box ${show ? "container mb-5" : ""}`}>
              <div
                className={`input-send ${show ? "input-send-provider" : ""}`}
              >
                <textarea
                  placeholder="Type Message"
                  className="w-100 border-0 px-3  pt-2 pb-0 rounded-5"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault(); // Prevent default behavior (like new line in textarea)
                      handleSend();
                    }
                  }}
                />
                <IoSendSharp
                  onClick={handleSend}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
