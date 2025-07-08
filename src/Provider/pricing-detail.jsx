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

  const [kmRadius, setKmRadius] = useState(""); // New state for kmRadius
  const [subscriptionAmount, setSubscriptionAmount] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
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
  const hunterId = localStorage.getItem("hunterId");

  useEffect(() => {
    if (hunterId) {
      navigate("/error");
      return;
    }
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

        setLoading(false);
      } catch (error) {
        if (error.response.status === 500) {
          navigate("/error");
        }
        console.log(error);
        setLoading(false);
      }
    };
    getData();
  }, [id]);

  const homeNavigation = () => {
    navigate("/home");
  };

  const handleSubmit = () => {
    navigate(`/provider/paymentdetail/${id}`);
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
                  <div className="row mt-4 px-3 px-lg-0">
                    <div className="col-lg-5 mx-auto pt-4">
                      <div className="card shadow-lg border-0 rounded-5 p-4">
                        <div className="d-flex flex-column gap-4">
                          <div className="d-flex flex-row gap-2 align-items-center justify-content-between price-detail">
                            <h4>Radius</h4>
                            <h4>
                              {kmRadius}
                              km
                            </h4>
                          </div>

                          <div className="d-flex flex-row gap-2 align-items-center justify-content-between price-detail">
                            <h4>Price</h4>
                            <h4>${subscriptionAmount}</h4>
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
                            <h4>
                              <span style={{ color: "rgba(50, 205, 222, 1)" }}>
                                Validity for{" "}
                                {validity === 30 ? "Month" : "Year"}
                              </span>
                            </h4>
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
