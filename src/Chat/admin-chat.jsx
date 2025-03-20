import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "../User/user.css";
import user1 from "../assets/user1.png";
import { IoIosSearch } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import Form from "react-bootstrap/Form";
import { IoSendSharp } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import { realtimeDb } from "./lib/firestore";
import { ref, push, set, onValue, update } from "firebase/database";

export default function AdminChat() {
  const location = useLocation();
  const [show, setShow] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [chatId, setChatId] = useState(null);
  const [receiverId] = useState("TWhwzZu1xCNFmqaq3r9KVrRiE0q1");
  const currentUser =
    localStorage.getItem("ProviderId") || localStorage.getItem("hunterId");
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

  // Handle visibility toggle
  const sendMessage = async (
    msgType,
    msg,
    chatId,
    receiverId,
    senderId,
    isReceiverOnline,
    setMessages
  ) => {
    if (!chatId) {
      generateChatId();
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
      };

      const newMessageRef = push(
        ref(realtimeDb, `chatsAdmin/${chatId}/messages`)
      );
      await set(newMessageRef, chat);

      setMessages((prevMessages) => [...prevMessages, chat]);

      // Step 3: Update job status in chat
      await set(ref(realtimeDb, `chatsAdmin/${chatId}/jobStatus`), {
        status: "Pending",
        acceptedBy: "",
      });
    } catch (error) {
      console.error("Firebase Error:", error.message);
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

  useEffect(() => {
    handleProvider();
  }, [location]);

  console.log("messages", messages);
  console.log(currentUser);

  return (
    <div className={`d-flex flex-column gap-3 pb-4 bg-second`}>
      <div className="card border-0 rounded-3">
        <div className="card-body p-2">
          <div className="d-flex flex-row gap-2 align-items-center justify-content-between">
            <div className="d-flex flex-row align-items-center gap-2 profile-icon">
              <img src={user1} alt="user1" height={60} width={60} />
              <div className="d-flex flex-column gap-1">
                <h5 className="mb-0 fw-medium fs-5 text-dark">John Doe</h5>
                {!show ? <span className="text-muted fs-6">2m ago</span> : null}
              </div>
            </div>
            <div className="d-flex flex-row gap-2 align-items-center">
              <IoIosSearch className="fs-3" />
              <BsThreeDotsVertical className="fs-3" />
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
                {msg.text}
              </p>
              <span className="text-muted time-status">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>

        <div className={`send-box ${show ? "container mb-5" : ""}`}>
          <div className={`input-send ${show ? "input-send-provider" : ""}`}>
            <Form.Control
              placeholder="Type Message"
              className="w-100 border-0 py-3 px-3 rounded-5"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <IoSendSharp
              onClick={() => sendMessage()}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
