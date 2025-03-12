import React, { useState, useEffect } from "react";
import LoggedHeader from "../User/Auth/component/loggedNavbar";
import Form from "react-bootstrap/Form";
import { IoIosSearch, IoMdNotificationsOutline } from "react-icons/io";
import "../User/user.css";
import { FaArrowLeft } from "react-icons/fa";
import user1 from "../assets/user1.png";
import user2 from "../assets/user2.png";
import { Link } from "react-router-dom";
import Chat from "./chat";
import { ref, push, set, onValue } from "firebase/database";
import { realtimeDb } from "./lib/firestore";

export default function Message() {
  const [open, setOpen] = useState(false);
  console.log(localStorage.getItem("hunterName"));
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const storedUserId = location.pathname.includes("/provider")
      ? localStorage.getItem("ProviderUId")
      : localStorage.getItem("hunterUId");
    setCurrentUser(storedUserId || "");
  }, [location]);
  const handleChange = () => {
    setOpen(true);
  };

  const handleBack = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!currentUser) return;

    const chatMessagesRef = ref(realtimeDb, `chat_list`);
    const unsubscribe = onValue(chatMessagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = Object.values(snapshot.val()).filter(
          (chat) => chat.userId1 === currentUser || chat.userId2 === currentUser
        );
        data.sort((a, b) => a.createdAt - b.createdAt);
        setMessages(data);
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  console.log(messages);
  console.log("currentUser", currentUser);

  return (
    <>
      <LoggedHeader />
      <div className="bg-second">
        <div className="container">
          {open ? (
            <FaArrowLeft onClick={handleBack} className="mt-4 fs-4" />
          ) : (
            <></>
          )}
          <div className="top-section-main py-4 px-lg-5">
            {!open ? (
              <div className="row gy-4 align-items-center mb-4">
                <div className="col-lg-2">
                  <h3>Messages</h3>
                </div>
                <div className="col-lg-10">
                  <div className="position-relative icon ">
                    <IoIosSearch className="mt-lg-1 mt-2 ms-1 fs-4" />
                    <Form.Control
                      placeholder="Serach Message"
                      className="w-100 border-0 px-2 ps-5 py-3 rounded-5"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <h3>Chat Screen</h3>
            )}

            <div className="row gy-3 gx-2">
              <div
                className={`${
                  open ? "col-lg-6 d-none d-lg-block" : "col-lg-12"
                }`}
              >
                <div className="d-flex flex-column gap-3  message-box">
                  <Link className="text-decoration-none" onClick={handleChange}>
                    <div className="user-card">
                      <div className="row align-items-center">
                        <div
                          className={`active ${
                            open ? "col-lg-3" : "col-lg-1 px-lg-0 col-4"
                          }`}
                        >
                          <img src={user1} alt="user1" className="w-100" />
                        </div>
                        <div
                          className={`${
                            open ? "col-lg-9 px-0" : "col-lg-9 ps-lg-2 col-8"
                          }`}
                        >
                          <div className="d-flex flex-column gap-1">
                            <h5 className="mb-0 fw-bold fs-5 text-dark">
                              John Doe
                            </h5>
                            <p className="mb-0 fw-medium fs-6 text-dark">
                              Lorem ipsum dolor sit amet
                            </p>
                            <span className="text-muted">2m ago</span>
                          </div>
                        </div>
                        <div
                          className={`${
                            open ? "d-none" : "col-lg-2 d-none d-lg-block"
                          }`}
                        >
                          <div className="tick">
                            <span className="user-seen">Read</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <Link className="text-decoration-none" onClick={handleChange}>
                    <div className="user-card">
                      <div className="row align-items-center">
                        <div
                          className={`active ${
                            open ? "col-lg-3" : "col-lg-1 px-lg-0 col-4"
                          }`}
                        >
                          <img src={user2} alt="user2" className="w-100" />
                        </div>
                        <div
                          className={`${
                            open ? "col-lg-9 px-0" : "col-lg-9 ps-lg-2 col-8"
                          }`}
                        >
                          <div className="d-flex flex-column gap-1">
                            <h5 className="mb-0 fw-bold fs-5 text-dark">
                              John Doe
                            </h5>
                            <p className="mb-0 fw-medium fs-6 text-dark">
                              Lorem ipsum dolor sit amet
                            </p>
                            <span className="text-muted">2m ago</span>
                          </div>
                        </div>
                        <div
                          className={`${
                            open ? "d-none" : "col-lg-2 d-none d-lg-block"
                          }`}
                        >
                          <div className="tick">
                            <span className="text-muted">Pending</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              <div className={`${open ? "col-lg-6" : "d-none"}`}>
                <div className=" message-box">
                  <Chat open={open} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
