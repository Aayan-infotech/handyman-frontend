import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "../User/user.css";
import user1 from "../assets/user1.png";
import { IoIosSearch } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import Form from "react-bootstrap/Form";
import { FaArrowLeft } from "react-icons/fa";

import { IoSendSharp } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { realtimeDb } from "./lib/firestore";
import { ref, push, set, onValue, update } from "firebase/database";
import Avatar from "@mui/material/Avatar";
const sendMessage = async (
  msgType,
  msg,
  chatId,
  receiverId,
  senderId,
  name,
  setMessages
) => {
  console.log("function working");
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

    const newMessageRef = push(
      ref(realtimeDb, `chatsAdmin/${chatId}/messages`)
    );
    await set(newMessageRef, chat);

    // Remove this manual state update to avoid duplication
    // setMessages((prevMessages) => [...prevMessages, chat]); ❌ REMOVE THIS
  } catch (error) {
    console.error("Firebase Error:", error.message);
  }
};

export default function AdminChat() {
  const location = useLocation();
  const [show, setShow] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [chatId, setChatId] = useState(null);
  const [receiverId] = useState("YWF5YW5pbmZvdGVjaEBnbWFpbC5jb20=");
  const userType = localStorage.getItem("ProviderId") ? "Provider" : "Hunter";
  const navigate = useNavigate();
  const currentUser =
    localStorage.getItem("ProviderId") || localStorage.getItem("hunterId");
  const currentUserName =
    localStorage.getItem("ProviderName") || localStorage.getItem("hunterName");

  console.log("currentUseradmin", currentUser);

  // Fetch messages when chatId and currentUser are available
  useEffect(() => {
    if (!currentUser || !receiverId || !chatId) return;

    const chatMessagesRef = ref(realtimeDb, `chatsAdmin/${chatId}/messages`);
    const unsubscribe = onValue(chatMessagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = Object.values(snapshot.val());
        data.sort((a, b) => a.createdAt - b.createdAt);
        setMessages(data);
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe(); // Proper cleanup to prevent memory leaks
  }, [chatId, currentUser, receiverId]);

  // Handle message send

  // Generate and store a consistent chat ID
  const generateChatId = () => {
    return [currentUser, receiverId].sort().join("_chat_");
  };

  useEffect(() => {
    if (!currentUser || !receiverId) return;

    const newChatId = generateChatId();
    console.log("Generated Chat ID:", newChatId);

    setChatId(newChatId);
    localStorage.setItem("chatId", newChatId); // Store chat ID for persistence
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
    // if (messages.trim() === "" || !chatId || !currentUser) return;
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

  console.log("messages", messages);
  console.log(currentUser);

  return (
    <div className={`d-flex flex-column gap-3 pb-4 bg-second`}>
      <div className="card border-0 rounded-3">
        <div className="card-body p-2">
          <div className="d-flex flex-row gap-2 align-items-center justify-content-start">
            <FaArrowLeft
              onClick={() => {
                userType === "Provider"
                  ? navigate("/provider/home")
                  : navigate("/home");
              }}
              className="fs-4"
              style={{ cursor: "pointer" }}
            />
            <div className="d-flex flex-row align-items-center gap-2 profile-icon">
              <Avatar
                alt="Image"
                className=""
                style={{ height: "82px", width: "82px" }}
              >
                S
              </Avatar>
              <div className="d-flex flex-column gap-1">
                <h5 className="mb-0 fw-medium fs-5 text-dark">Support</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`position-relative ${show ? "bg-second h-100" : ""}`}>
        <div className={`d-block mh-100vh ${show ? "container my-4" : ""}`}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={msg.senderId === currentUser ? "fl-right" : "fl-left"}
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
          ))}
        </div>

        <div className={`send-box ${show ? "container mb-5" : ""}`}>
          <div className={`input-send ${show ? "input-send-provider" : ""}`}>
            <textarea
              placeholder="Type Message"
              className="w-100 border-0 px-3 rounded-5"
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
              onClick={() => handleSend()}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
