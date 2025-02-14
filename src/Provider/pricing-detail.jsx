import React, { useState, useEffect } from "react";
import LoggedHeader from "./Auth/component/loggedNavbar";
import { MdMessage } from "react-icons/md";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaRegCircleCheck } from "react-icons/fa6";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { getProviderUser } from "../Slices/userSlice";
import { handlePayment } from "../Slices/paymentSlice";
import Loader from "../Loader";
import axios from "axios"; // Import axios
import Toaster from "../Toaster";

export default function PricingProvider() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [toastProps, setToastProps] = useState({ message: "", type: "" });
  const name = localStorage.getItem("ProviderName");
  const [title, setTitle] = useState("");
  const [transactionId, setTransactionId] = useState(45435435435);
  const [transactionDate, setTransactionDate] = useState(new Date());
  const [transactionStatus, setTransactionStatus] = useState("done");
  const [subscriptionAmount, setSubscriptionAmount] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionMode, setTransactionMode] = useState("Pending");
  const [subscriptionId, setSubscriptionId] = useState(
    "67aef862ccb4059e6e9f4bd4"
  );

  const [description, setDescription] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false); // Define loading state
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.user?.data);
  console.log(transactionDate);
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://44.196.64.110:7777/api/subscription/getSubscriptionById/${id}`
        );
        setData(res?.data?.data);
        setTitle(res?.data?.data?.title);
        setDescription(res?.data?.data?.description);
        setSubscriptionAmount(res?.data?.data?.amount);
        setTransactionAmount(res?.data?.data?.amount);
        console.log(data);

        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  const homeNavigation = () => {
    navigate("/provider/home");
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await dispatch(
        handlePayment({
          transactionId,
          transactionDate,
          transactionStatus,
          transactionAmount,
          transactionMode,
          SubscriptionId: subscriptionId,
          SubscriptionAmount: subscriptionAmount,
        })
      );
      if (handlePayment.fulfilled.match(result)) {
        setToastProps({
          message: "Password changed Successfully",
          type: "success",
        });
        setLoading(false);
        setTimeout(() => {
          navigate("/provider/myprofile");
        }, 2000);
      } else {
        const errorMessage =
          result.payload.message ||
          "Failed to change password. Please check your credentials.";
        setToastProps({ message: errorMessage, type: "error" });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setToastProps({ message: error, type: "error" });
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
          <div className="">
            <div className="message">
              <Link to="/message">
                <MdMessage />
              </Link>
            </div>
            <div className="bg-second fixed-curl">
              <div className="container">
                <div className="top-section-main py-4 px-lg-5">
                  <h3 className="pb-3">Hello {name}</h3>
                  <h2 className="fw-bold fs-1 mt-4">{title}</h2>
                  <div className="row mt-5 px-3 px-lg-0">
                    <div className="col-lg-4 mx-auto pt-4">
                      <div className="d-flex flex-column gap-4">
                        <div className="d-flex flex-row gap-2 align-items-center justify-content-between price-detail">
                          <h2>
                            <span className="highlighted-text">30GB</span> Per
                            Month
                          </h2>
                          <FaRegCircleCheck />
                        </div>
                        <div className="d-flex flex-row gap-2 align-items-center justify-content-between price-detail">
                          <h2>
                            <span className="highlighted-text">5TB</span> Per
                            Month
                          </h2>
                          <FaRegCircleCheck />
                        </div>
                        <div className="d-flex flex-row gap-2 align-items-center justify-content-between price-detail">
                          <h2>
                            <span className="highlighted-text">1</span> CPU’s
                          </h2>
                          <FaRegCircleCheck />
                        </div>
                        <span className="text-dark">{title}</span>
                      
                          <Button
                            variant="contained"
                            className="custom-green bg-green-custom rounded-5 py-3 w-100"
                            // onClick={handleSubmit}
                            onClick={homeNavigation}
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

      <Toaster message={toastProps.message} type={toastProps.type} />
    </>
  );
}
