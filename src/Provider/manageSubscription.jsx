import React, { useState, useEffect } from "react";
import LoggedHeader from "./auth/component/loggedNavbar";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../components/axiosInstance";
import Loader from "../Loader";
import Button from "@mui/material/Button";
import Toaster from "../Toaster";

export default function ManageSubscription() {
  const [activeSubscriptions, setActiveSubscriptions] = useState([]);
  const [expiredSubscriptions, setExpiredSubscriptions] = useState([]);
  const [voucher, setVoucher] = useState([]);
  const [expiredVoucher, setExpiredVoucher] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const name = localStorage.getItem("ProviderName");
  const providerId = localStorage.getItem("ProviderId");
  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/eway/getSusbcriptionById`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ProviderToken")}`,
          },
        });

        if (res?.data?.status === 200) {
          // Filter data into active and expired subscriptions
          const active = [];
          const expired = [];

          res?.data?.data.forEach((item) => {
            if (item.subscriptionStatus !== "expired") {
              active.push(item);
            } else if (item.subscriptionStatus === "expired") {
              expired.push(item);
            }
          });

          setActiveSubscriptions(active);
          setExpiredSubscriptions(expired);
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    const getVoucherData = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(
          `/voucher/getVoucherUsers/${providerId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("ProviderToken")}`,
            },
          }
        );

        if (res?.data?.status === 200) {
          const active = [];
          const expired = [];

          res?.data?.data.forEach((item) => {
            if (item.status !== "expired") {
              active.push(item);
            } else if (item.status === "expired") {
              expired.push(item);
            }
          });
          setVoucher(active);
          setExpiredVoucher(expired);
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    getData();
    getVoucherData();
  }, []);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime())
        ? "Invalid Date"
        : date.toLocaleDateString("en-AU", {
            timeZone: "Australia/Sydney", // or 'Australia/Adelaide', 'Australia/Perth'
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
    } catch (e) {
      return "Invalid Date";
    }
  };

  const getRenewalDate = (createdDate, validity) => {
    try {
      const createdAt = new Date(createdDate);
      if (isNaN(createdAt.getTime())) return "Invalid Date";

      const validityDays = Number(validity) || 0;
      const renewalDate = new Date(createdAt);
      renewalDate.setDate(createdAt.getDate() + validityDays);

      return renewalDate.toLocaleString("en-AU", {
        timeZone: "Australia/Sydney",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (e) {
      console.error("Date conversion error:", e);
      return "Invalid Date";
    }
  };

  console.log(voucher);
  console.log("activeSubscriptions", activeSubscriptions);
  console.log("expiredSubscriptions", expiredSubscriptions);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            <LoggedHeader />

            <div className="bg-second">
              <div className="container">
                <div className="top-section-main py-4 px-lg-5">
                  <div className="row ">
                    <div className="col-lg-4">
                      <h5 className="user ">Hello {name}</h5>
                    </div>
                    <div className="col-lg-8">
                      <div className="d-flex justify-content-center justify-content-lg-end">
                        <Button
                          variant="contained"
                          color="success"
                          className="rounded-0 custom-green bg-green-custom"
                          onClick={() => navigate("/provider/subscription")}
                        >
                          Update your subscription
                        </Button>
                      </div>
                    </div>
                  </div>
                  {voucher && voucher.length > 0 && (
                    <div className="row py-3 gy-2 mt-lg-4">
                      <>
                        <h3 className="text-center text-lg-start mb-1">
                          Your Voucher Plan
                        </h3>
                        {voucher.map((item) => (
                          <div className="col-lg-6" key={item?._id}>
                            <div className="w-100 h-100 card price-card border-0 rounded-5 position-relative overflow-hidden px-4 py-5">
                              <div className="card-body d-flex flex-column gap-3 align-items-center">
                                <div className="w-100 d-flex flex-column flex-lg-row gap-3 justify-content-between align-items-center"></div>
                                <h6>
                                  Valid From:{" "}
                                  {new Date(item?.startDate).toLocaleString(
                                    "en-AU",
                                    {
                                      timeZone: "Australia/Sydney",
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    }
                                  )}
                                </h6>
                                <h4>Code: {item?.code}</h4>
                                <h4>Radius: {item?.kmRadius} KM</h4>
                                <h6>
                                  Valid To:{" "}
                                  {new Date(item?.endDate).toLocaleString(
                                    "en-AU",
                                    {
                                      timeZone: "Australia/Sydney",
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    }
                                  )}
                                </h6>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    </div>
                  )}
                  <div className="row py-3 gy-2 mt-lg-4 mb-4">
                    {/* Active Subscriptions Section */}
                    {activeSubscriptions.length > 0 && (
                      <>
                        {activeSubscriptions.map((item) => (
                          <div className="col-lg-12" key={item._id}>
                            <h3 className="text-center text-lg-start">
                              Your{" "}
                              {`${
                                item.subscriptionStatus
                                  .charAt(0)
                                  .toUpperCase() +
                                item.subscriptionStatus.slice(1)
                              }`}{" "}
                              Plan
                            </h3>
                            <div className="w-100 card price-card border-0 rounded-5 position-relative px-4 pb-4 pt-4">
                              <div className="card-body d-flex flex-column gap-3 align-items-start pb-0">
                                <div className="w-100 d-flex flex-column flex-lg-row gap-3 justify-content-between align-items-start ">
                                  <h6>
                                    Valid From:{" "}
                                    {formatDate(item?.subscriptionStartDate)}
                                  </h6>
                                  <h6>
                                    Valid To:{" "}
                                    {formatDate(item?.subscriptionEndDate)}
                                  </h6>
                                </div>
                                <h3 className="mt-3 text-start">
                                  {item.subscriptionPlanId.planName}
                                </h3>
                                <div className="d-flex justify-content-lg-between justify-content-start align-items-center w-100 flex-wrap flex-lg-nowrap gap-4">
                                  <h5>${item.amount}</h5>
                                  <h4>
                                    Radius: {item.subscriptionPlanId.kmRadius}KM
                                  </h4>
                                  <h5>
                                    Valid for{" "}
                                    {item.subscriptionPlanId.validity === 365
                                      ? "Year"
                                      : "Month"}
                                  </h5>
                                </div>
                                <div className=" d-flex flex-column flex-lg-row gap-3 justify-content-between align-items-start w-100">
                                  <h6>
                                    Payment Method:{" "}
                                    {item?.payment?.paymentSource}
                                  </h6>
                                  <h6>
                                    Subscription Id:{" "}
                                    {item?.subscriptionPlanId?._id}
                                  </h6>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}

                    {/* Expired Subscriptions Section */}
                    {expiredSubscriptions.length > 0 && (
                      <>
                        <h3 className="text-center pt-3">Your Expired Plans</h3>
                        {expiredSubscriptions.map((item) => (
                          <div className="col-lg-6" key={item._id}>
                            <div className="w-100 h-100 card price-card expired border-0 rounded-5 position-relative overflow-hidden px-4 pt-5 pb-3">
                              <div className="card-body d-flex flex-column gap-3 align-items-start pb-0">
                                <div className="w-100 d-flex flex-column flex-lg-row gap-3 justify-content-between align-items-start">
                                  <h6>
                                    Valid From:{" "}
                                    {formatDate(item?.subscriptionStartDate)}
                                  </h6>
                                  <h6>
                                    Valid To:{" "}
                                    {formatDate(item?.subscriptionEndDate)}
                                  </h6>
                                </div>
                                <h3 className="mt-3 text-start">
                                  {item.subscriptionPlanId.planName}
                                </h3>
                                <h5 className="mt-3">${item.amount}</h5>
                                <h4>
                                  Radius: {item.subscriptionPlanId.kmRadius}KM
                                </h4>
                                <h3>
                                  Valid for{" "}
                                  {item.subscriptionPlanId.validity === 365
                                    ? "Year"
                                    : "Month"}
                                </h3>
                                <div className=" d-flex flex-column  gap-3 justify-content-start align-items-start">
                                  <h6>
                                    Payment Method:{" "}
                                    {item?.payment?.paymentSource}
                                  </h6>
                                  <h6>
                                    Transaction Id:{" "}
                                    {item?.subscriptionPlanId?._id}
                                  </h6>
                                </div>
                                <span className="line-white"></span>
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: item.subscriptionPlanId.description,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>

                  {expiredVoucher && expiredVoucher.length > 0 && (
                    <>
                      <h3 className="text-center text-lg-start mb-1 pt-4">
                        Your Expired Voucher Plan
                      </h3>
                      {expiredVoucher.map((item) => (
                        <div className="col-lg-6" key={item?._id}>
                          <div className="w-100 h-100 card price-card border-0 expired rounded-5 position-relative overflow-hidden px-4 py-5">
                            <div className="card-body d-flex flex-column gap-3 align-items-center">
                              <div className="w-100 d-flex flex-column flex-lg-row gap-3 justify-content-between align-items-center"></div>
                              <h6>
                                Valid From:{" "}
                                {new Date(item?.startDate).toLocaleString(
                                  "en-AU",
                                  {
                                    timeZone: "Australia/Sydney",
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  }
                                )}
                              </h6>
                              <h4>Code: {item?.code}</h4>
                              <h4>Radius: {item?.kmRadius} KM</h4>
                              <h6>
                                Valid To:{" "}
                                {new Date(item?.endDate).toLocaleString(
                                  "en-AU",
                                  {
                                    timeZone: "Australia/Sydney",
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  }
                                )}
                              </h6>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
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
