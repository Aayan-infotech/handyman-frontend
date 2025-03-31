import React, { useState, useEffect } from "react";
import LoggedHeader from "./auth/component/loggedNavbar";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader";

import Toaster from "../Toaster";
export default function ManageSubscription() {
  const [data, setData] = useState();
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
        const res = await axios.get(
          `http://3.223.253.106:7777/api/demoTransaction/subscription/getById`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("ProviderToken")}`,
            },
          }
        );

        if (res?.data?.status === 200) {
          setData(res?.data?.data);
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    getData();
  }, []);

  console.log(data);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <LoggedHeader />

          <div className="bg-second">
            <div className="container">
              <div className="top-section-main py-4 px-lg-5">
                <div className="row ">
                  <div className="col-lg-4">
                    <h5 className="user d-flex justify-content-center justify-content-lg-start">
                      Hello {name}
                    </h5>
                  </div>
                </div>
                <div className="row py-3 gy-4 mt-lg-4">
                  <h1 className="text-center text-lg-start">
                    Your Subscription Plan
                  </h1>
                  {data?.map((item) => (
                    <div className="col-lg-12" key={item._id}>
                      <div className="w-100 h-100 card price-card border-0 rounded-5 position-relative overflow-hidden px-4 py-5">
                        <div className="card-body d-flex flex-column gap-3 align-items-center">
                          <div className="w-100 d-flex flex-column flex-lg-row gap-3 justify-content-between align-items-center">
                            <h6>Payment Method: {item.paymentMethod}</h6>
                            <h6>Transaction Id: {item.transactionId}</h6>
                          </div>
                          <h3 className="mt-3 text-center">
                            {item.subscriptionPlanId.planName}
                          </h3>
                          <h5 className="mt-3">${item.amount}</h5>
                          <h4>KM Radius: {item.subscriptionPlanId.kmRadius}</h4>
                          <h3>
                            Valid for{" "}
                            {item.subscriptionPlanId.validity === 365
                              ? "Year"
                              : "Month"}
                          </h3>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toaster
        message={toastProps.message}
        type={toastProps.type}
        toastKey={toastProps.toastKey}
      />
    </>
  );
}
