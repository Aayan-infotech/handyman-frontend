import React, { useState, useEffect, useCallback } from "react";
import LoggedHeader from "../User/Auth/component/loggedNavbar";
import Form from "react-bootstrap/Form";
import { IoIosSearch } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import Chat from "./chat";
import { ref, onValue, off } from "firebase/database";
import { realtimeDb } from "./lib/firestore";
import Loader from "../Loader";
import noData from "../assets/no_data_found.gif";
import axiosInstance from "../components/axiosInstance";
import Avatar from "@mui/material/Avatar";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
export default function Message() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageLoader, setMessageLoader] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [messageData, setMessageData] = useState({});
  const [selectedChat, setSelectedChat] = useState(null); // Track selected chat
  const location = useLocation();
  const [chatMessages, setChatMessages] = useState([]);
  const userFinder = location.pathname.includes("/provider");

  useEffect(() => {
    const storedUserId = location.pathname.includes("/provider")
      ? localStorage.getItem("ProviderId")
      : localStorage.getItem("hunterId");

    if (storedUserId) {
      setCurrentUser(storedUserId);
    }
  }, []);

  const handleChat = useCallback(async () => {
    if (messages.length === 0) return; // Prevent API call if no messages exist
    setMessageLoader(true);
    try {
      // Loop through all messages and make API calls
      const apiCalls = messages.map(async (message) => {
        const { jobId, senderId, receiverId } = message.users;

        if ( !senderId || !receiverId) {
          console.error("Missing required parameters for API request");
          return null;
        }

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

        if (response.status === 200) {
          return {
            chatId: message.chatId,
            data: response.data.data,
            jobData: response.data.data.job || {},
          };
        }
        return null;
      });

      // Wait for all API calls to complete
      const results = await Promise.all(apiCalls);
      const newMessageData = results.reduce((acc, result) => {
        if (result) {
          acc[result.chatId] = { ...result.data, jobData: result.data.jobPost };
        }
        return acc;
      }, {});

      setMessageData(newMessageData);
      setMessageLoader(false);
    } catch (error) {
      console.error("Error fetching chat data:", error);
      setMessageLoader(false);
    }
  }, [messages]);

  console.log("message data", messageData);
  const getChatList = useCallback((user) => {
    setMessageLoader(true);
    if (!user) return;

    const chatListRef = ref(realtimeDb, `chatList/${user}`);

    const listener = onValue(chatListRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("chatList data", data);
        const formattedChatList = Object.keys(data).flatMap((receiverId) =>
          Object.keys(data[receiverId]).map((chatId) => ({
            chatId,
            messages: data[receiverId][chatId].messages || {},
            unRead: data[receiverId][chatId].unRead || 0,
            users: data[receiverId][chatId].users || {},
          }))
        );
        setMessages(formattedChatList);
        setMessageLoader(false);
      } else {
        setMessages([]);
        setMessageLoader(false);
      }
    });

    return () => off(chatListRef, listener);
  }, []);
  console.log("messages in chat", messages);

  const getChatMessages = useCallback((selectedChat) => {
    setMessageLoader(true);
    if (!selectedChat || !selectedChat.chatId) return;

    const { chatId, users } = selectedChat;
    const { jobId } = users;

    if (!jobId || !chatId) {
      console.error("Missing jobId or chatId in selectedChat");
      return;
    }

    const chatMessagesRef = ref(
      realtimeDb,
      `chats/${jobId}/${chatId}/messages`
    );

    const listener = onValue(chatMessagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const messagesData = snapshot.val();
        const formattedMessages = Object.keys(messagesData)
          .map((key) => ({ ...messagesData[key], id: key }))
          .sort((a, b) => a.timeStamp - b.timeStamp);

        setChatMessages(formattedMessages);
        setMessageLoader(false);
      } else {
        setChatMessages([]);
        setMessageLoader(false);
      }
    });

    return () => off(chatMessagesRef, listener);
  }, []);

  useEffect(() => {
    if (currentUser) {
      const cleanup = getChatList(currentUser);
      return cleanup;
    }
  }, [currentUser, getChatList]);
  useEffect(() => {
    if (selectedChat) {
      const cleanup = getChatMessages(selectedChat);
      return cleanup;
    }
  }, [selectedChat]);

  useEffect(() => {
    handleChat();
  }, [handleChat]);

  // Updated handleSendMessage to accept chat data
  const handleSendMessage = (chat) => {
    setSelectedChat({ ...chat, jobData: messageData[chat.chatId]?.jobData }); // Set the selected chat
    setOpen(!open); // Toggle the chat window
  };

  console.log("selectedChat", selectedChat);

  if (loading) return <Loader />;

  const filteredMessages = messages.map((item) => {
    const isSender = item.users.senderId === currentUser;
    return {
      ...item,
      displayUser: isSender
        ? messageData[item.chatId]?.receiver
        : messageData[item.chatId]?.sender,
    };
  });


  return (
    <>
      <LoggedHeader />
      <div className="bg-second">
        <div className="container">
          {open && (
            <FaArrowLeft onClick={() => setOpen(false)} className="mt-4 fs-4" />
          )}
          <div className="top-section-main py-4 px-lg-5">
            {!open && (
              <div className="row gy-4 align-items-center mb-4">
                <div className="col-lg-2">
                  <h3>Messages</h3>
                </div>
                <div className="col-lg-10">
                  <div className="position-relative icon">
                    <IoIosSearch className="mt-lg-1 mt-2 ms-1 fs-4" />
                    <Form.Control
                      placeholder="Search Message"
                      className="w-100 border-0 px-2 ps-5 py-3 rounded-5"
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="row gy-3 gx-2">
              <div
                className={open ? "col-lg-6 d-none d-lg-block" : "col-lg-12"}
              >
                <div className="d-flex flex-column gap-3 message-box">
                  {filteredMessages.length === 0 ? (
                    <div className="d-flex justify-content-center">
                      <img
                        src={noData}
                        alt="No Data Found"
                        className="w-nodata"
                      />
                    </div>
                  ) : messageLoader === true ? (
                    <>
                      <Stack spacing={1} className="d-block">
                        <div className=" ">
                          <Skeleton
                            variant="rounded"
                            className="mb-3 rounded-4"
                            animation="wave"
                            height={80}
                          />
                          <Skeleton
                            variant="rounded"
                            className="mb-3 rounded-4"
                            animation="wave"
                            height={80}
                          />
                          <Skeleton
                            variant="rounded"
                            animation="wave"
                            className="mb-3 rounded-4"
                            height={80}
                          />
                        </div>
                      </Stack>
                    </>
                  ) : (
                    filteredMessages.map((item) => (
                      <Link
                        className="text-decoration-none"
                        onClick={() => handleSendMessage(item)} // Pass chat data to handleSendMessage
                        key={item.chatId}
                      >
                        <div className="user-card">
                          <div className="row align-items-center">
                            <div
                              className={
                                open
                                  ? "col-lg-2 px-0"
                                  : "col-lg-1 px-lg-0 col-4"
                              }
                            >
                              <Avatar
                                alt="Image"
                                src={item.displayUser?.images}
                                className="w-100"
                                style={{ height: "82px", width: "82px" }}
                              >
                                {item.displayUser?.contactName?.[0] ||
                                  item.displayUser?.name?.[0]}
                              </Avatar>
                            </div>

                            <div
                              className={
                                open ? "col-lg-10" : "col-lg-9 ps-lg-2 col-8"
                              }
                            >
                              <div className="d-flex flex-column gap-1">
                                <h5 className="mb-0 fw-bold fs-5 text-dark">
                                  {item.displayUser?.contactName ||
                                    item.displayUser?.name}
                                </h5>
                                <p className="mb-0 fw-medium fs-6 text-dark">
                                  {item?.messages?.msg}
                                </p>
                                <span className="text-muted">
                                  {new Date(
                                    item?.messages?.timeStamp
                                  ).toLocaleTimeString()}{" "}
                                  ago
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
              {open && (
                <div className="col-lg-6">
                  <div className="message-box">
                    <Chat
                      messageData={messageData}
                      messages={chatMessages}
                      selectedChat={selectedChat}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
