import React, { useState, useEffect } from "react";
import "./user.css";
import user1 from "../assets/user1.png";
import user2 from "../assets/user2.png";
import { IoIosSearch } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import Form from "react-bootstrap/Form";
import { IoSendSharp } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";

export default function Chat() {
  const [show, setShow] = useState(false);
  const Location = useLocation();

  const handleProvider = () => {
    if (location.pathname.includes("provider")) {
      setShow(!show);
    }
  };

  useEffect(() => {
    handleProvider();
  }, [Location]);

  console.log(Location);
  console.log(show);
  return (
    <>
      <div
        className={`d-flex flex-column gap-3 ${show ? "container-fluid" : ""}`}
      >
        <div className="card border-0 rounded-3">
          <div className="card-body p-2">
            <div className="d-flex flex-row gap-2 align-items-center justify-content-between">
              <div className="d-flex flex-row align-items-center gap-2">
                <img src={user1} alt="user1" height={60} width={60} />
                <div className="d-flex flex-column gap-1">
                  <h5 className="mb-0 fw-medium fs-5 text-dark">John Doe</h5>
                  <span className="text-muted fs-6">2m ago</span>
                </div>
              </div>
              <div className="d-flex flex-row gap-2 align-items-center">
                <IoIosSearch className="fs-3" />
                <BsThreeDotsVertical className="fs-3" />
              </div>
            </div>
          </div>
        </div>
        <div className={` ${show ? "bg-second h-100" : ""}`}>
          <div className={`d-block ${show ? "container my-4" : ""}`}>
            <div className=" fl-left">
              <p className="msg-recieved mb-1">
                Do you have a time for interviews today?
              </p>
              <span className="text-muted time-status">4.30 AM</span>
            </div>
            <div className=" fl-right">
              <p className="msg-sent mb-1">Yes, I have.</p>
              <span className="text-muted time-status">9.30 AM</span>
            </div>
            <div className=" fl-left">
              <p className="msg-recieved mb-1">
                Do you have a time for interviews today?
              </p>
              <span className="text-muted time-status">4.30 AM</span>
            </div>
            <div className=" fl-right">
              <p className="msg-sent mb-1">Yes, I have.</p>
              <span className="text-muted time-status">9.30 AM</span>
            </div>
          </div>
          <div className={`d-block ${show ? "container mb-5" : ""}`}>
            <div className={`input-send  ${show ? "input-send-provider" : ""}`}>
              <Form.Control
                placeholder="Type Message"
                className="w-100 border-0 py-3 px-3 rounded-5"
              />
              <IoSendSharp />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
