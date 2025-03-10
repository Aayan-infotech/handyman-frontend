import React, { useEffect, useState } from "react";
import axios from "axios";
import LoggedHeader from "./Auth/component/loggedNavbar";
import { FaRegClock } from "react-icons/fa";
import Loader from "../Loader";
import Toaster from "../Toaster";
import "./user.css";
import noData from "../assets/no_data_found.gif";

export default function Notification() {
  const hunterId = localStorage.getItem("hunterId");
  const providerId = localStorage.getItem("ProviderId");
  const userType = hunterId ? "hunter" : "provider";
  const userId = hunterId || providerId;

  const [notifications, setNotifications] = useState([]);
  const [massNotifications, setMassNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });

  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      const url = `http://54.236.98.193:7777/api/notification/getAll/${userType}/${userId}`;
      const response = await axios.get(url);
      setNotifications(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setToastProps({
        message: "Failed to fetch notifications",
        type: "error",
        toastKey: Date.now(),
      });
    }
  };

  const fetchMassNotifications = async () => {
    try {
      const url = `http://54.236.98.193:7777/api/massNotification/?userType=${userType}`;
      const response = await axios.get(url);
      setMassNotifications(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setToastProps({
        message: "Failed to fetch mass notifications",
        type: "error",
        toastKey: Date.now(),
      });
    }
  };

  useEffect(() => {
    (async () => {
      await fetchMassNotifications();
      await fetchNotifications();
      setLoading(false);
    })();
  }, []);

  const allData = [...massNotifications, ...notifications];
  console.log(massNotifications);
  console.log(notifications);
  console.log(allData);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <LoggedHeader />
          <div className="bg-second">
            <div className="container">
              <div className="top-section-main py-4 px-lg-5">
                <h1>Notification</h1>
                {allData.length > 0 ? null : (
                  <div className="text-center">
                    <img
                      src={noData}
                      alt="No data found"
                      className="img-fluid"
                    />
                  </div>
                )}
                <div className="d-flex flex-column gap-3 mt-4">
                  {massNotifications.map((massNotification, index) => (
                    <div
                      key={index}
                      className="card notification-read-card border-0 rounded-4"
                    >
                      <div className="card-body px-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <h5 className="mb-0">{massNotification.subject}</h5>
                          <div>
                            <span className="ms-3 me-1">
                              <FaRegClock />
                            </span>
                            <span>
                              {new Date(
                                massNotification.createdAt
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <p className="mt-3 mb-0"> {massNotification.message}</p>
                      </div>
                    </div>
                  ))}
                  {notifications.map((notification, index) => (
                    <div
                      key={index}
                      className="card notification-card border-0 rounded-4"
                    >
                      <div className="card-body px-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <h5 className="mb-0">Apply Success</h5>
                          <div>
                            <span className="ms-3 me-1">
                              <FaRegClock />
                            </span>
                            <span>10h ago</span>
                          </div>
                        </div>
                        <p className="mt-3 mb-0">
                          You have applied for a job at Queenify Group as a UI
                          Designer
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <Toaster
        message={toastProps.message}
        type={toastProps.type}
        toastKey={toastProps.toastKey}
      />
    </>
  );
}
