import React, { useState, useEffect, useCallback } from "react";
import LoggedHeader from "../User/Auth/component/loggedNavbar";
import Form from "react-bootstrap/Form";
import { IoIosSearch } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa";
import Button from "@mui/material/Button";
import { FaTrash } from "react-icons/fa";
import {
  ref,
  onValue,
  off,
  remove,
  update,
  get,
  set,
  child,
} from "firebase/database";
import { realtimeDb } from "../Chat/lib/firestore";
import { Link, useLocation } from "react-router-dom";
import Chat from "./chat";
import Loader from "../Loader";
import noData from "../assets/no_data_found.gif";
import axiosInstance from "../components/axiosInstance";
import Avatar from "@mui/material/Avatar";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import AdvertiserChat from "./advertiserChat";
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
  const [visibleChats, setVisibleChats] = useState(5); // Initial number of chats to show
  const [allMessages, setAllMessages] = useState([]); // Store all messages
  const userFinder = location.pathname.includes("/provider");

  useEffect(() => {
    const storedUserId =
      localStorage.getItem("ProviderId") || localStorage.getItem("hunterId");

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

        if (!senderId || !receiverId) {
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
  const getChatList = useCallback(
    (user) => {
      setMessageLoader(true);
      if (!user) return;

      const chatListRef = ref(realtimeDb, `chatList/${user}`);

      const listener = onValue(chatListRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const formattedChatList = Object.keys(data).flatMap((receiverId) =>
            Object.keys(data[receiverId]).map((chatId) => ({
              chatId,
              messages: data[receiverId][chatId].messages || {},
              unRead: data[receiverId][chatId].unRead || 0,
              users: data[receiverId][chatId].users || {},
            }))
          );
          setAllMessages(formattedChatList);
          setMessages(formattedChatList.slice(0, visibleChats)); // Only show initial batch
          setMessageLoader(false);
        } else {
          setAllMessages([]);
          setMessages([]);
          setMessageLoader(false);
        }
      });

      return () => off(chatListRef, listener);
    },
    [visibleChats]
  ); // Add visibleChats as dependency

  const loadMoreChats = () => {
    const newVisibleChats = visibleChats + 5;
    setVisibleChats(newVisibleChats);
    setMessages(allMessages.slice(0, newVisibleChats)); // Show more chats
  };
  console.log("messages in chat", messages);

  const getChatMessages = useCallback((selectedChat) => {
    setMessageLoader(true);
    if (!selectedChat || !selectedChat.chatId) return;

    const { chatId, users } = selectedChat;
    const { jobId } = users;

    if (!chatId) {
      console.error("Missing chatId in selectedChat");
      return;
    }

    const chatMessagesRef = ref(
      realtimeDb,
      `chats/${jobId}/${chatId}/messages` || `chats/${chatId}/messages`
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
  }, [currentUser, getChatList, visibleChats]); // Add visibleChats as dependency
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

  const sortedMessages = [...filteredMessages].sort((a, b) => {
    const timeA = a.messages?.timeStamp || 0;
    const timeB = b.messages?.timeStamp || 0;
    return timeB - timeA;
  });

  const deleteChat = async (chatId, currentUser) => {
    try {
      if (!currentUser || !chatId) {
        console.error("Missing currentUser or chatId");
        return;
      }

      // Get a reference to the user's chatList
      const userChatListRef = ref(realtimeDb, `chatList/${currentUser}`);

      // Fetch the user's chatList data
      const snapshot = await get(userChatListRef);

      if (!snapshot.exists()) {
        console.log("No chats found for this user");
        return;
      }

      let found = false;
      const updates = {};

      // Iterate through all receiverIds
      snapshot.forEach((receiverSnapshot) => {
        const receiverId = receiverSnapshot.key;

        // Check if this receiver has the chatId we want to delete
        if (receiverSnapshot.val()[chatId]) {
          found = true;
          updates[`${currentUser}/${receiverId}/${chatId}`] = null; // Mark for deletion
        }
      });

      if (found) {
        // Perform the deletion
        await update(ref(realtimeDb, "chatList"), updates);
        console.log("Chat deleted successfully");
        return true;
      } else {
        console.log("Chat not found for this user");
        return false;
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      throw error;
    }
  };

  const handleDelete = async (chatId) => {
    setOpen(false);
    setLoading(true);
    try {
      const success = await deleteChat(chatId, currentUser);
      window.location.reload();
      if (success) {
        getChatList(currentUser);
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to delete chat:", error);
      setLoading(false);
    }
  };

  console.log("messageData", sortedMessages, "selectedChat ", selectedChat);
  console.log(currentUser);

  return (
    <>
      <LoggedHeader />
      <div className="bg-second">
        <div className="container">
          {open && (
            <FaArrowLeft
              onClick={() => setOpen(false)}
              className="mt-4 fs-4"
              style={{ cursor: "pointer" }}
            />
          )}
          <div className="top-section-main py-4 px-lg-5">
            {!open && (
              <div className="row gy-4 align-items-center mb-4">
                <div className="col-lg-2">
                  <h3>Messages</h3>
                </div>
                {/* <div className="col-lg-10">
                  <div className="position-relative icon">
                    <IoIosSearch className="mt-lg-1 mt-2 ms-1 fs-4" />
                    <Form.Control
                      placeholder="Search Message"
                      className="w-100 border-0 px-2 ps-5 py-3 rounded-5"
                    />
                  </div>
                </div> */}
              </div>
            )}
            <div className="row gy-3 gx-2">
              <div className={open ? "d-none " : "col-lg-12"}>
                <div className="d-flex flex-column gap-3 message-box limit-design">
                  {sortedMessages.length === 0 ? (
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
                    <>
                      {sortedMessages.map((item) => (
                        <>
                          <div className="d-flex flex-row gap-1 w-100">
                            <Link
                              className="text-decoration-none w-100"
                              onClick={() => handleSendMessage(item)} // Pass chat data to handleSendMessage
                              key={item.chatId}
                            >
                              <div className="user-card">
                                <div className="row align-items-center">
                                  <div
                                    className={
                                      open
                                        ? "col-lg-2 px-0"
                                        : "col-lg-1 px-lg-0 col-3 px-0"
                                    }
                                  >
                                    <Avatar
                                      alt="Image"
                                      src={item?.displayUser?.images}
                                      className="w-100"
                                      style={{ height: "82px", width: "82px" }}
                                    >
                                      {item?.displayUser?.businessName?.[0] ||
                                        item?.displayUser?.name?.[0]}
                                    </Avatar>
                                  </div>

                                  <div
                                    className={
                                      open
                                        ? "col-lg-9"
                                        : "col-lg-9 ps-lg-2 col-8"
                                    }
                                  >
                                    <div className="d-flex flex-column gap-1">
                                      <h5 className="mb-0 fw-bold fs-5 text-dark">
                                        {item?.displayUser?.businessName ||
                                          item?.displayUser?.name}
                                      </h5>
                                      <p className="mb-0 fw-medium fs-6 text-dark">
                                        {item?.messages?.msg}
                                      </p>
                                      <span className="text-muted">
                                        {new Date(
                                          item?.messages?.timeStamp
                                        ).toLocaleTimeString("en-AU", {
                                          timeZone: "Australia/Sydney",
                                          weekday: "short",
                                          day: "numeric",
                                          month: "short",
                                          year: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                          hour12: true,
                                        })}{" "}
                                      </span>
                                    </div>
                                  </div>

                                  {/* <div className="col-1 text-end px-0 ms-auto">
                                <button
                                  className="btn btn-danger p-2 py-1 z-1"
                                  onClick={() => {
                                    handleDelete(item.chatId);
                                  }}
                                >
                                  <FaTrash />
                                </button>
                              </div> */}
                                </div>
                              </div>
                            </Link>
                            <button
                              className="btn btn-danger p-2 py-1 z-1"
                              onClick={() => {
                                handleDelete(item.chatId);
                              }}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </>
                      ))}
                      {allMessages.length > visibleChats && (
                        <div className="text-center mt-3">
                          <Button
                            variant="contained"
                            className="custom-green bg-green-custom rounded-5 py-3 px-5 mb-3"
                            onClick={loadMoreChats}
                            disabled={messageLoader}
                          >
                            {messageLoader ? "Loading..." : "Load More"}
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              {open && (
                <div className="col-lg-12">
                  <div className="message-box">
                    {localStorage.getItem("PlanType") === "Advertising" ||
                    (selectedChat &&
                      messageData[selectedChat.chatId]?.receiver
                        ?.subscriptionType === "Advertising") ||
                    messageData[selectedChat.chatId]?.sender
                      ?.subscriptionType === "Advertising" ? (
                      <AdvertiserChat
                        messageData={messageData}
                        messages={chatMessages}
                        selectedChat={selectedChat}
                        setSelectedChat={setSelectedChat}
                      />
                    ) : (
                      <Chat
                        messageData={messageData}
                        messages={chatMessages}
                        selectedChat={selectedChat}
                        setSelectedChat={setSelectedChat}
                      />
                    )}
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
