


import React, { useEffect, useState } from "react";
import axios from "axios";
import LoggedHeader from "./Auth/component/loggedNavbar";
import { Link } from "react-router-dom";
import { MdMessage, MdOutlineSupportAgent } from "react-icons/md";
import "./user.css";
import { FaRegClock } from "react-icons/fa";

export default function Notification() {
  const hunterToken = localStorage.getItem("hunterToken");
  const providerToken = localStorage.getItem("ProviderToken");

  // Fetching IDs from local storage
  const hunterId = localStorage.getItem("hunterId");
  const providerId = localStorage.getItem("ProviderId");
  const guestCondition = JSON.parse(localStorage.getItem("Guest")) || false;

  // Determine userType based on available ID
  const userType = hunterId ? 'hunter' : 'provider';  // If hunterId exists, userType is 'hunter', else 'provider'
  const userId = hunterId || providerId;  // Use hunterId if hunterType, else providerId

  // States to store notifications and mass notifications
  const [notifications, setNotifications] = useState([]);
  const [massNotifications, setMassNotifications] = useState([]);
  const [loading, setLoading] = useState(true); // To handle loading state

  // Function to call the GET API for individual notifications
  const fetchNotifications = () => {
    if (!userId) {
      console.error("User ID is missing, cannot make the API request.");
      return;
    }

    const url = `http://54.236.98.193:7777/api/notification/getAll/${userType}/${userId}`;

    axios
      .get(url)
      .then((response) => {
        console.log("Notification API response:", response);
        setNotifications(response.data);  // Store notifications in state
      })
      .catch((error) => {
        console.error("Error calling the notification API:", error);
      });
  };

  // Function to call the GET API for mass notifications with userType as a query parameter
  const fetchMassNotifications = () => {
    if (!userType) {
      console.error("UserType is missing, cannot make the API request.");
      return;
    }

    // Passing userType as a query parameter in the URL
    const url = `http://54.236.98.193:7777/api/massNotification/?userType=${userType}`;

    axios
      .get(url)
      .then((response) => {
        console.log("Mass Notification API response:", response);
        setMassNotifications(response.data);  // Store mass notifications in state
      })
      .catch((error) => {
        console.error("Error calling the mass notification API:", error);
      });
  };

  // useEffect to call both APIs when the component mounts
  useEffect(() => {
    fetchNotifications();  // Trigger the individual notifications API call
    fetchMassNotifications();  // Trigger the mass notifications API call
    setLoading(false);  // Set loading to false after both calls complete
  }, []);  // Empty dependency array to ensure it runs once when the page loads

  return (
    <>
      <LoggedHeader />
      <Link to={`/${hunterToken ? "support" : "provider"}/chat/1`}>
        <div className="admin-message">
          <MdOutlineSupportAgent />
        </div>
      </Link>
      <div className="message">
        <Link to="/message">
          <MdMessage />
        </Link>
      </div>
      <div className="bg-second">
        <div className="container">
          <div className="top-section-main py-4 px-lg-5">
            <h1>Notification</h1>

            {/* Show loading state if data is still being fetched */}
            {loading ? (
              <p>Loading notifications...</p>
            ) : (
              <div className="d-flex flex-column gap-3 mt-4">
                {/* Render individual notifications */}
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <div key={index} className="card notification-card border-0 rounded-4">
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
                          You have applied for a job at Queenify Group as a UI Designer
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No notifications available</p> // If no notifications are available
                )}

                {/* Render mass notifications */}
                {massNotifications.length > 0 ? (
                  massNotifications.map((massNotification, index) => (
                    <div key={index} className="card notification-read-card border-0 rounded-4">
                      <div className="card-body px-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex flex-row gap-3 align-items-center">
                            <h5 className="mb-0 ">{massNotification.title}</h5>
                            <div className="">
                              <span className="ms-3 me-1">
                                <FaRegClock />
                              </span>
                              <span>{massNotification.time}</span>
                            </div>
                          </div>
                        </div>
                        <p className=" mt-3 mb-0">
                          {massNotification.message}
                        </p>
                        <p className=" mt-3 mb-0">
                          {massNotification.subject}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No mass notifications available</p> // If no mass notifications are available
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
