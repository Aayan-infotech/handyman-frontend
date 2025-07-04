import React, { useState, useEffect, useCallback } from "react";
import LoggedHeader from "../User/Auth/component/loggedNavbar";
import Form from "react-bootstrap/Form";
import { IoIosSearch } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa";
import Button from "@mui/material/Button";
import { FaTrash } from "react-icons/fa";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
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
import AdvertiserChat from "./advertiserChat";

export default function Message() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageLoader, setMessageLoader] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [messageData, setMessageData] = useState({});
  const [selectedChat, setSelectedChat] = useState(null);
  const [userData, setUserData] = useState({}); // Store user data from Firebase
  const location = useLocation();
  const [chatMessages, setChatMessages] = useState([]);
  const [visibleChats, setVisibleChats] = useState(5);
  const [allMessages, setAllMessages] = useState([]);
  const userFinder = location.pathname.includes("/provider");

  useEffect(() => {
    const storedUserId =
      localStorage.getItem("ProviderId") || localStorage.getItem("hunterId");

    if (storedUserId) {
      setCurrentUser(storedUserId);
    }
  }, []);

  const listenToUserData = useCallback((userId, userType, callback) => {
    if (!userId) return;
    const userRef = ref(realtimeDb, `users/${userType}/${userId}`);
    const listener = onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      } else {
        callback(null);
      }
    });
    return () => off(userRef, listener); // cleanup function
  }, []);

  // Fetch user data from Firebase
  const fetchUserData = useCallback(async (userId, userType) => {
    if (!userId) return null;

    const userRef = ref(realtimeDb, `users/${userType}/${userId}`);
    const snapshot = await get(userRef);
    return snapshot.exists() ? snapshot.val() : null;
  }, []);

  const handleChat = useCallback(async () => {
    if (messages.length === 0) return;
    setMessageLoader(true);

    try {
      const cleanupFunctions = [];

      for (const message of messages) {
        const { senderId, receiverId } = message.users;
        const isCurrentUserProvider =
          localStorage.getItem("ProviderId") !== null;

        let peerUserType, peerId;
        if (isCurrentUserProvider) {
          peerUserType = "hunter";
          peerId = receiverId;
        } else {
          peerUserType = "provider";
          peerId = senderId === currentUser ? receiverId : senderId;
        }

        const cleanup = listenToUserData(peerId, peerUserType, (peerData) => {
          if (peerData) {
            setMessageData((prev) => ({
              ...prev,
              [message.chatId]: {
                receiver: peerData,
                jobData: {
                  title: message.jobTitle,
                },
                peerId: message.peerId,
                peerName: message.peerName,
                peerUserType,
              },
            }));
          }
        });

        if (typeof cleanup === "function") cleanupFunctions.push(cleanup);
      }

      setMessageLoader(false);

      return () => {
        cleanupFunctions.forEach((fn) => fn());
      };
    } catch (error) {
      console.error("Error fetching chat data:", error);
      setMessageLoader(false);
    }
  }, [messages, listenToUserData, currentUser]);

  const getChatList = useCallback(
    (user) => {
      setMessageLoader(true);
      if (!user) return;

      const userCategory = localStorage.getItem("ProviderId")
        ? "provider"
        : "hunter";
      const chatListRef = ref(realtimeDb, `chatList/${user}`);

      const listener = onValue(chatListRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const formattedChatList = Object.keys(data).map((chatId) => ({
            chatId,
            isRead: data[chatId].isRead,
            jobId: data[chatId].jobId,
            jobTitle: data[chatId].jobTitle,
            lastMessage: data[chatId].lastMessage,
            peerId: data[chatId].peerId,
            peerName: data[chatId].peerName,
            timestamp: data[chatId].timestamp,
            users: {
              senderId: user,
              receiverId: data[chatId].peerId,
              jobId: data[chatId].jobId,
            },
          }));

          const sorted = formattedChatList.sort(
            (a, b) => b.timestamp - a.timestamp
          );

          setAllMessages(sorted);
          setMessages(sorted.slice(0, visibleChats));
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
  );

  const loadMoreChats = () => {
    const newVisibleChats = visibleChats + 5;
    setVisibleChats(newVisibleChats);
    setMessages(allMessages.slice(0, newVisibleChats));
  };

  const getChatMessages = useCallback((selectedChat) => {
    setMessageLoader(true);
    if (!selectedChat || !selectedChat.chatId) return;

    const { chatId } = selectedChat;
    const chatMessagesRef = ref(realtimeDb, `messages/${chatId}`);

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
  }, [currentUser, getChatList, visibleChats]);

  useEffect(() => {
    if (selectedChat) {
      const cleanup = getChatMessages(selectedChat);
      return cleanup;
    }
  }, [selectedChat]);

  useEffect(() => {
    let isMounted = true;
    let cleanupFn;

    const run = async () => {
      const maybeCleanup = await handleChat();
      if (isMounted && typeof maybeCleanup === "function") {
        cleanupFn = maybeCleanup;
      }
    };

    run();

    return () => {
      isMounted = false;
      if (typeof cleanupFn === "function") {
        cleanupFn();
      }
    };
  }, [handleChat]);

  const handleSendMessage = async (chat) => {
    try {
      const peerId = chat.peerId;
      const updates = {};
      updates[`chatList/${currentUser}/${chat.chatId}/isRead`] = true;

      await update(ref(realtimeDb), updates);

      setSelectedChat({
        ...chat,
        jobData: messageData[chat.chatId]?.jobData,
      });
      setOpen(!open);
    } catch (error) {
      console.error("Error updating chat status:", error);
    }
  };

  if (loading) return <Loader />;

  const filteredMessages = messages.map((item) => {
    const peerData = messageData[item.chatId]?.receiver || {};
    const isCurrentUserProvider = localStorage.getItem("ProviderId") !== null;

    // Determine image source based on user type
    let imageSrc;
    let nameUser = "";
    if (isCurrentUserProvider) {
      // Current user is provider, peer is hunter
      imageSrc = peerData.profileImage || peerData.image;
      nameUser = peerData.businessName || peerData.name;
    } else {
      // Current user is hunter, peer is provider
      imageSrc = peerData.image || peerData.profileImage;
      nameUser = peerData.businessName || peerData.name;
    }

    return {
      ...item,
      displayUser: {
        name: nameUser,
        businessName: peerData.businessName,
        images: imageSrc,
      },
      jobData: {
        title: item.jobTitle,
      },
      messages: {
        msg: item.lastMessage,
        timeStamp: item.timestamp,
      },
    };
  });

  const getNewestMessageTime = (messages) => {
    if (!messages) return 0;
    const messageTimes = Object.values(messages).map(
      (msg) => msg?.timeStamp || 0
    );
    return Math.max(...messageTimes);
  };

  const sortedMessages = [...filteredMessages].sort((a, b) => {
    const newestA = getNewestMessageTime(a.messages);
    const newestB = getNewestMessageTime(b.messages);
    return newestB - newestA;
  });

  console.log("Sorted Messages:", sortedMessages);
  const deleteChat = async (chatId, currentUser) => {
    try {
      if (!currentUser || !chatId) {
        console.error("Missing currentUser or chatId");
        return;
      }

      const userChatRef = ref(realtimeDb, `chatList/${currentUser}/${chatId}`);
      await remove(userChatRef);
      return true;
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
      if (success) {
        getChatList(currentUser);
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to delete chat:", error);
      setLoading(false);
    }
  };

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
                        loading="lazy"
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
                          <Skeleton
                            variant="rounded"
                            animation="wave"
                            className="mb-3 rounded-4"
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
                        <div
                          className="d-flex flex-row gap-1 w-100 position-relative"
                          key={item.chatId}
                        >
                          <Link
                            className="text-decoration-none w-100"
                            onClick={() => handleSendMessage(item)}
                          >
                            <div
                              className={`${
                                item?.isRead == false && "unread"
                              } user-card`}
                            >
                              <div className="row align-items-center">
                                <div
                                  className={
                                    open
                                      ? "col-lg-2 px-0"
                                      : "col-lg-2 px-lg-4 col-3 px-0"
                                  }
                                >
                                  <Avatar
                                    alt="Image"
                                    src={item?.displayUser?.images}
                                    className="w-100"
                                    style={{
                                      height: "120px",
                                      width: "120px",
                                    }}
                                  >
                                    {item?.displayUser?.businessName?.[0] ||
                                      item?.displayUser?.name?.[0]}
                                  </Avatar>
                                </div>

                                <div
                                  className={
                                    open ? "col-lg-9" : "col-lg-9 ps-lg-2 col-8"
                                  }
                                >
                                  <div className="d-flex flex-column gap-1">
                                    <h6 className="mb-0 fw-bold fs-5 text-dark">
                                      {item?.jobTitle !== "" && (
                                        <div>
                                          Job Title: {item?.jobData?.title}
                                        </div>
                                      )}
                                    </h6>
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
                              </div>
                            </div>
                          </Link>
                          <button
                            className="btn btn-danger p-2 py-1 z-1 delete-msg-btn"
                            onClick={() => {
                              handleDelete(item.chatId);
                            }}
                          >
                            <FaTrash />
                          </button>
                        </div>
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
                    {selectedChat &&
                    messageData[selectedChat.chatId]?.jobData === null ? (
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
