import React from "react";
import LoggedHeader from "./auth/component/loggedNavbar";
import { Link } from "react-router-dom";
import { MdMessage } from "react-icons/md";
import "./user.css";
import { FaRegClock } from "react-icons/fa";
export default function Notification() {
  return (
    <>
      <LoggedHeader />
      <div className="message">
        <Link to="/message">
          <MdMessage />
        </Link>
      </div>
      <div className="bg-second">
        <div className="container">
          <div className="top-section-main py-4 px-lg-5">
            <h1>Notifications</h1>
            <div className="d-flex flex-column gap-3 mt-4">
              <div className="card notification-card border-0 rounded-4">
                <div className="card-body px-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex flex-row gap-3 align-items-center">
                      <span className="notification"></span>
                      <h5 className="mb-0 ">Apply Success</h5>
                      <div className="">
                        <span className="ms-3 me-1">
                          <FaRegClock />
                        </span>
                        <span>10h ago</span>
                      </div>
                    </div>
                    <span className="">Mark as read</span>
                  </div>
                  <p className=" mt-3 mb-0">
                    You has apply an job in Queenify Group as UI Designer
                  </p>
                </div>
              </div>
              <div className="card notification-read-card border-0 rounded-4">
                <div className="card-body px-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex flex-row gap-3 align-items-center">
                      <h5 className="mb-0 ">Job Accepted</h5>
                      <div className="">
                        <span className="ms-3 me-1">
                          <FaRegClock />
                        </span>
                        <span>4m ago</span>
                      </div>
                    </div>
                  </div>
                  <p className=" mt-3 mb-0">
                    Congratulations! You have call tomorrow. Check schedule
                    here..
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
