import React, { useState, useEffect } from "react";
import "../User/user.css";
import { IoIosSearch } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import Form from "react-bootstrap/Form";
import { IoSendSharp } from "react-icons/io5";
import { useLocation, useParams } from "react-router-dom";
import { realtimeDb } from "./lib/firestore";
import { ref, push, set, onValue } from "firebase/database";
import Avatar from "@mui/material/Avatar";
import axiosInstance from "../components/axiosInstance";

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
    await set(
      ref(realtimeDb, `chatList/${receiverId}/${senderId}/${chatId}`),
      chatMap
    );
  } catch (error) {
    console.error("Firebase Error:", error.message);
  }
};

export default function AdvertiserChat() {
  const location = useLocation();
  const { id } = useParams();
  const [show, setShow] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [chatData, setChatData] = useState([]);
  const [filteredChatData, setFilteredChatData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [chatId, setChatId] = useState(null);
  const [receiverId] = useState(id);
  const userType = localStorage.getItem("ProviderId") ? "Provider" : "Hunter";
  const currentUser =
    localStorage.getItem("ProviderId") || localStorage.getItem("hunterId");
  const currentUserName =
    localStorage.getItem("ProviderName") || localStorage.getItem("hunterName");

  // Fetch messages when chatId and currentUser are available
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

      if (
        responseData &&
        typeof responseData === "object" &&
        (responseData.sender?._id === id || responseData.receiver?._id === id)
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
  }, [id]); // Add id to dependency array to refetch when it changes

  useEffect(() => {
    if (!currentUser || !receiverId) return;

    const newChatId = generateChatId();
    setChatId(newChatId);
    localStorage.setItem("chatId", newChatId);
  }, [currentUser, receiverId]);

  const handleProvider = () => {
    if (
      location.pathname.includes("provider") ||
      location.pathname.includes("support")
    ) {
      setShow(!show);
    }
  };

  const handleSend = async () => {
    if (text.trim() === "" || !chatId || !currentUser) return;

    await sendMessage(
      userType,
      text,
      chatId,
      receiverId,
      currentUser,
      currentUserName,
      setMessages
    );
    setText("");
  };

  useEffect(() => {
    handleProvider();
  }, [location]);

  // Determine the other user in the conversation
  const otherUser = filteredChatData
    ? filteredChatData.receiver?._id === id
      ? filteredChatData.receiver
      : filteredChatData.sender
    : null;

  // Display name based on user type
  const displayName = otherUser
    ? otherUser.name || otherUser.businessName
    : "User";

  // Display avatar based on user type
  const avatarContent = otherUser
    ? otherUser.name?.charAt(0) || otherUser.businessName?.charAt(0)
    : "U";

  console.log("messages", messages);

  return (
    <div className={`d-flex flex-column gap-3 pb-4 bg-second`}>
      <div className="card border-0 rounded-3">
        <div className="card-body p-2">
          <div className="d-flex flex-row gap-2 align-items-center justify-content-between">
            <div className="d-flex flex-row align-items-center gap-2 profile-icon">
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
        <div className="text-center py-4">Loading messages...</div>
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
                      {new Date(msg.timeStamp).toLocaleTimeString()}
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
                <Form.Control
                  placeholder="Type Message"
                  className="w-100 border-0 py-3 px-3 rounded-5"
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
