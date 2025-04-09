import React, { useState, useEffect } from "react";
import LoggedHeader from "./auth/component/loggedNavbar";
import { MdMessage, MdOutlineSupportAgent } from "react-icons/md";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaRegCircleCheck } from "react-icons/fa6";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { handlePayment } from "../Slices/paymentSlice";
import Loader from "../Loader";
import axiosInstance from "../components/axiosInstance";
import Toaster from "../Toaster";

export default function PricingProvider() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });
  const name = localStorage.getItem("ProviderName");
  const [transactionId, setTransactionId] = useState(45435435435);
  const [transactionDate, setTransactionDate] = useState(new Date());
  const [kmRadius, setKmRadius] = useState(""); // New state for kmRadius

  const [transactionStatus, setTransactionStatus] = useState("done");
  const [subscriptionAmount, setSubscriptionAmount] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionMode, setTransactionMode] = useState("Pending");
  const [subscriptionId, setSubscriptionId] = useState("");
  const [subscriptionType, setSubscriptionType] = useState("");
  const [description, setDescription] = useState("");
  const [planName, setPlanName] = useState("");
  const [validity, setValidity] = useState("");
  const [data, setData] = useState([]); // Update this to store new API data
  const [loading, setLoading] = useState(false); // Define loading state
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.user?.data);
  const providerId = localStorage.getItem("ProviderId");
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        // Make API call to the new endpoint
        const res = await axiosInstance.get(
          `/SubscriptionNew/subscription-plan/${id}` // Send id to API
        );
        // Set the response data into the state
        const subscriptionData = res?.data?.data;
        setData(subscriptionData);
        setPlanName(subscriptionData?.planName);
        setSubscriptionAmount(subscriptionData?.amount);
        setKmRadius(subscriptionData?.kmRadius); // ✅ Store kmRadius from API response
        setTransactionAmount(subscriptionData?.amount);
        setSubscriptionId(subscriptionData?._id);
        setSubscriptionType(subscriptionData?.type);
        setDescription(subscriptionData?.description);
        setValidity(subscriptionData?.validity);
        console.log(subscriptionData);

        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    getData();
  }, [id]);

  const homeNavigation = () => {
    navigate("/home");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await dispatch(
        handlePayment({
          userId: providerId,
          subscriptionPlanId: id,
          amount: subscriptionAmount,
          paymentMethod: "credit_card",
        })
      );

      if (handlePayment.fulfilled.match(result)) {
        setToastProps({
          message: "Subscription purchased successfully!",
          type: "success",
          toastKey: Date.now(),
        });
        setLoading(false);

        setTimeout(() => {
          // navigate("/provider/home");
          navigate("/provider/payment")
         
        }, 2000);
      } else {
        const errorMessage =
          result.payload.message ||
          "Failed to complete the transaction. Please try again.";
        setToastProps({
          message: errorMessage,
          type: "error",
          toastKey: Date.now(),
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error during transaction:", error);
      setToastProps({
        message: error?.response?.data?.message,
        type: "error",
        toastKey: Date.now(),
      });
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <LoggedHeader />
          <div className="h-100">
            <div className="bg-second fixed-curl">
              <div className="container">
                <div className="top-section-main py-4 px-lg-5">
                  <h3 className="pb-3">Hello {name}</h3>
                  <h2 className="fw-bold fs-1 mt-4">{planName}</h2>
                  <div className="row mt-5 px-3 px-lg-0">
                    <div className="col-lg-4 mx-auto pt-4">
                      <div className="d-flex flex-column gap-4">
                        <div className="d-flex flex-row gap-2 align-items-center justify-content-between price-detail">
                          <h2>
                            <span className="highlighted-text">
                              {kmRadius} km
                            </span>{" "}
                            Radius
                          </h2>
                          <FaRegCircleCheck />
                        </div>

                        <div className="d-flex flex-row gap-2 align-items-center justify-content-between price-detail">
                          <h2>
                            <span className="highlighted-text">
                              {subscriptionAmount}
                            </span>{" "}
                            Amount
                          </h2>
                          <FaRegCircleCheck />
                        </div>

                        {/* <div className="d-flex flex-row gap-2 align-items-center justify-content-between price-detail">
                          <h2>
                            <span className="highlighted-text">
                            Validity for {' '}
                              {validity === 30 ? "Monthly" : 'Yearly'}
                            </span>
                          </h2>
                       
                        </div> */}
                        <div
                          className="d-flex flex-column align-items-center justify-content-center price-detail"
                          style={{
                            color: "rgba(50, 205, 222, 1) !important",
                            textAlign: "center",
                          }}
                        >
                          <h2>
                            <span style={{ color: "rgba(50, 205, 222, 1)" }}>
                              Validity for{" "}
                              {validity === 30 ? "Monthly" : "Yearly"}
                            </span>
                          </h2>
                        </div>

                        <span
                          className="text-dark"
                          dangerouslySetInnerHTML={{ __html: description }}
                        ></span>

                        <Button
                          variant="contained"
                          className="custom-green bg-green-custom rounded-5 py-3 w-100"
                          onClick={handleSubmit}
                        >
                          Purchase
                        </Button>
                      </div>
                    </div>
                  </div>
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
