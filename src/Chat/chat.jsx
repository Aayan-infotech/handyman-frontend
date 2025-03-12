import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "../User/user.css";
import user1 from "../assets/user1.png";
import { IoIosSearch } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import Form from "react-bootstrap/Form";
import { IoSendSharp } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import { ref, push, set, onValue, update } from "firebase/database";
import { realtimeDb, auth } from "./lib/firestore";

const sendMessage = async (
  msgType,
  msg,
  chatId,
  receiverId,
  isReceiverOnline,
  setMessages,
  jobId
) => {
  if (!chatId || !jobId) {
    console.error("Chat ID or Job ID is missing");
    return;
  }
  const time = Date.now();
  const senderId = auth.currentUser?.uid;
  if (!senderId) {
    console.error("Sender ID is undefined");
    return;
  }

  console.log("Sending message with Job ID:", jobId);

  const chat = {
    msg,
    timeStamp: time,
    type: msgType,
    receiverId,
    senderId,
    jobId,
  };

  const users = {
    receiverId,
    senderId,
    jobName: "Job Title",
    jobId,
  };

  const chatMap = { messages: chat, users };
  console.log("CHAT MAP =>", chatMap);

  try {
    const newMessageRef = push(ref(realtimeDb, `chats/${chatId}/messages`));
    await set(newMessageRef, chat);
    setMessages((prevMessages) => [...prevMessages, chat]);

    await set(ref(realtimeDb, `chats/${chatId}/jobStatus`), {
      status: "Pending",
      acceptedBy: "",
    });
    await set(
      ref(realtimeDb, `chatList/${senderId}/${receiverId}/${chatId}`),
      chatMap
    );
    await set(
      ref(realtimeDb, `chatList/${receiverId}/${senderId}/${chatId}`),
      chatMap
    );

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

export default function Chat() {
  const [show, setShow] = useState(false);
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [chatId, setChatId] = useState(null);
  const [receiverId] = useState("IFEWMaijDDWqXHlQQ5Xl1Heih1l1");
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();
  const jobId = new URLSearchParams(location.search).get("jobId");
  useEffect(() => {
    const storedUserId = location.pathname.includes("/provider")
      ? localStorage.getItem("ProviderUId")
      : localStorage.getItem("hunterUId");
    setCurrentUser(storedUserId || "");
  }, [location]);

  // useEffect(() => {
  //   if (!currentUser || !receiverId || !chatId) return;

  //   const chatMessagesRef = ref(realtimeDb, `chats/${chatId}/messages`);
  //   const unsubscribe = onValue(chatMessagesRef, (snapshot) => {
  //     if (snapshot.exists()) {
  //       const data = Object.values(snapshot.val());
  //       data.sort((a, b) => a.createdAt - b.createdAt);
  //       setMessages(data);
  //     } else {
  //       setMessages([]);
  //     }
  //   });

  //   return () => unsubscribe();
  // }, []);

  useEffect(() => {
    if (!chatId) return;
    const chatMessagesRef = ref(realtimeDb, `chats/${chatId}/messages`);
    onValue(chatMessagesRef, (snapshot) => {
      setMessages(
        snapshot.exists()
          ? Object.values(snapshot.val()).sort(
              (a, b) => a.timeStamp - b.timeStamp
            )
          : []
      );
    });
  }, [chatId]);

  useEffect(() => {
    if (!currentUser || !receiverId) return;
    setChatId([currentUser, receiverId].sort().join("_chat_"));
  }, [currentUser, receiverId]);

  // useEffect(() => {
  //   if (!currentUser || !receiverId) return;

  //   const generateChatId = () => {
  //     return [currentUser, receiverId].sort().join("_");
  //   };

  //   const newChatId = generateChatId();
  //   console.log("Generated Chat ID:", newChatId);

  //   setChatId(newChatId);
  //   localStorage.setItem("chatId", newChatId);
  // }, [currentUser, receiverId]);

  // const handleSend = async () => {
  //   if (text.trim() === "" || !currentUser || !chatId) return;

  //   try {
  //     const newMessageRef = push(ref(realtimeDb, `chats/${chatId}/messages`));
  //     await set(newMessageRef, {
  //       senderId: currentUser,
  //       receiverId: receiverId,
  //       name:
  //         localStorage.getItem("hunterName") ||
  //         localStorage.getItem("ProviderName"),
  //       type: localStorage.getItem("hunterName") ? "hunter" : "provider",
  //       text,
  //       createdAt: Date.now(),
  //     });
  //     setText("");
  //   } catch (err) {
  //     console.log("Error sending message:", err);
  //   }
  // };

  const handleSend = async () => {
    console.log("Send button clicked");
   
    if (msg.trim() === "" || !chatId || !jobId) return;
    console.error("Message, Chat ID, or Job ID is missing");
    console.log("Chat ID:", chatId);
    console.log("Job ID:", jobId);

    msg;
    await sendMessage(
      "text",
      msg,
      chatId,
      receiverId,
      false,
      setMessages,
      jobId
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

  useEffect(() => {
    handleProvider();
  }, [location]);

  console.log("messages", messages);

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
      <div className="container-fluid">
        <div className="row">
          <div className={`mw-condition mx-auto`}>
            <div className="card rounded-5 border-0 shadow">
              <div className="card-body px-4 py-3">
                <span className="text-center d-flex justify-content-center">
                  Do you want to work with them for this job
                  <br /> Home cleaning
                </span>
                <div className="d-flex justify-content-evenly mt-3">
                  <button className="btn btn-primary px-5">Yes</button>
                  <button className="btn btn-danger px-5">No</button>
                </div>
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
  );
}
