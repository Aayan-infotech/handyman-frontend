import React, { useState, useEffect } from "react";
import LoggedHeader from "./auth/component/loggedNavbar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CiBank } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { handlePayment } from "../Slices/paymentSlice";
import { FaWifi } from "react-icons/fa";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import Toaster from "../Toaster";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import axiosInstance from "../components/axiosInstance";
import axios from "axios";
export default function PaymentDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [month, setMonth] = useState("01");
  const [year, setYear] = useState("23");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user?.user?.data);
  const providerId = localStorage.getItem("ProviderId");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const hunterId = localStorage.getItem("hunterId");
  const [ewayLoaded, setEwayLoaded] = useState(false);
  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });

  const months = [
    { value: "01", name: "January" },
    { value: "02", name: "February" },
    { value: "03", name: "March" },
    { value: "04", name: "April" },
    { value: "05", name: "May" },
    { value: "06", name: "June" },
    { value: "07", name: "July" },
    { value: "08", name: "August" },
    { value: "09", name: "September" },
    { value: "10", name: "October" },
    { value: "11", name: "November" },
    { value: "12", name: "December" },
  ];

  const years = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() - 2000 + i;
    return year < 10 ? `0${year}` : `${year}`;
  });

  // Load eWay encryption script
  useEffect(() => {
    if (hunterId) {
      navigate("/error");
      return;
    }

    const getData = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(
          `/SubscriptionNew/subscription-plan/${id}`
        );
        const subscriptionData = res?.data?.data;
        setData(subscriptionData);
        setLoading(false);
      } catch (error) {
        if (error.response?.status === 500) {
          // navigate("/error");
        }
        console.log(error);
        setLoading(false);
      }
    };
    getData();
  }, [id]);

  useEffect(() => {
    // Load eWay script
    const script = document.createElement("script");
    script.src = "https://secure.ewaypayments.com/scripts/eCrypt.min.js";
    script.async = true;
    script.onload = () => {
      console.log("eWay encryption script loaded");
      setEwayLoaded(true);
    };
    script.onerror = () => {
      console.error("Failed to load eWay encryption script");
      setToastProps({
        message: "Failed to load payment processor. Please refresh the page.",
        type: "error",
        toastKey: Date.now(),
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const encryptCardDetails = () => {
    if (!window.eCrypt || !window.eCrypt.encryptValue) {
      throw new Error("Payment processor not ready. Please try again.");
    }

    const cleanedCardNumber = cardNumber.replace(/\s/g, "");
    const cleanedCvv = cvv.trim();

    if (!cleanedCardNumber || !cleanedCvv) {
      throw new Error("Card details are incomplete");
    }

    try {
      return {
        Name: cardHolderName,
        Number: window.eCrypt.encryptValue(cleanedCardNumber),
        CVN: window.eCrypt.encryptValue(cleanedCvv),
        ExpiryMonth: month,
        ExpiryYear: year,
      };
    } catch (error) {
      console.error("Encryption failed:", error);
      throw new Error(
        "Failed to secure card details. Please check your entries."
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("Submit started");

    if (!ewayLoaded) {
      setToastProps({
        message: "Payment processor is still loading. Please wait.",
        type: "error",
        toastKey: Date.now(),
      });
      return;
    }

    setLoading(true);

    try {
      // Validate all required fields
      if (
        !firstName ||
        !lastName ||
        !email ||
        !cardHolderName ||
        !cardNumber ||
        !cvv
      ) {
        throw new Error("Please fill all card details.");
      }

      // Encrypt card details
      const encryptedCard = encryptCardDetails();

      // Prepare the payment data
      const paymentData = {
        userId: providerId,
        subscriptionPlanId: id,
        Customer: {
          FirstName: firstName,
          LastName: lastName,
          Email: email,
          CardDetails: encryptedCard,
        },
        Payment: {
          TotalAmount: data?.amount * 100,
          CurrencyCode: "AUD",
        },
      };

      console.log("payment data", paymentData);

      // Make the API call to eWay endpoint
      const response = await axios.post(
        "https://api.tradehunters.com.au/api/eway/pay",
        paymentData
      );

      const result = response.data; // Remove await here since response is already resolved

      // Fix: Check response.status instead of response.ok (axios doesn't have ok property)
      if (response.status < 200 || response.status >= 300) {
        throw new Error(result?.message || "Payment failed");
      }

      setToastProps({
        message: "Subscription purchased successfully!",
        type: "success",
        toastKey: Date.now(),
      });

      localStorage.setItem("Guest", false);
      localStorage.setItem(
        "PlanType",
        result?.data?.newSubscription?.type || ""
      );

      setTimeout(() => {
        navigate("/provider/payment/success");
      }, 2000);
    } catch (error) {
      console.error("Payment error:", error);
      setToastProps({
        message: error.message || "Payment processing failed",
        type: "error",
        toastKey: Date.now(),
      });

      if (
        error.message.includes("processor") ||
        error.message.includes("secure")
      ) {
        // For script loading/encryption errors, suggest page refresh
        setTimeout(() => window.location.reload(), 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  return (
    <>
      <LoggedHeader />
      {!ewayLoaded && (
        <div className="alert alert-info">
          Loading payment processor... Please wait.
        </div>
      )}
      <div className="bg-second ">
        <div className="container">
          <div className="top-section-main py-4 px-lg-5">
            <div className="row gy-4 price-line gx-lg-5">
              <div className="col-lg-5 order-2 order-lg-1 ">
                <div className=" price-card px-4 py-3 d-flex flex-column rounded-4 gap-2 h-100">
                  <h3>Plan Information</h3>
                  <h4 className="fs-5">{data?.planName}</h4>
                  <h4 className="fs-5">${data?.amount}</h4>
                  <h4 className="fs-5">
                    Valid for {data?.validity === 30 ? "Month" : "Year"}
                  </h4>
                  <h4 className="fs-5">For {data?.kmRadius}km</h4>
                </div>
              </div>

              <div className="col-lg-7 order-1 order-lg-2">
                <div className="d-flex justify-content-center align-items-center flex-column w-100">
                  <div className="card rounded-5 border-0 w-100 pt-3">
                    <div className="card-body text-center">
                      <div className="row">
                        <div className="col-lg-10 mx-auto">
                          <h5 className="fw-medium mb-4 text-start">
                            Enter card details
                          </h5>
                          <form
                            data-eway-encrypt-key="09n/nrZ2RtlG9HWIuWmDq+w/KIv5E4BJwP413gyPZ5xnRFf6HvgS8P5q478oLsYQji+b2TuJVBdxRurAl6qZWioRjbI4uG2VAzxsuX5bnK8TkmU15MSZkSWd9m4wFYjnIFMkxbCPhKHOzwrVz7fZcxckY1d1is3K2D8J7NnDv3WmTxmYKnJkHZwxdeD7XgSCThcexrTJZEYBlaYftHbxfEOVHvcj4Cu1zKPcQfn+ZWlITm/QEjqgZHov957LeavJOhpzcGJAkK8X4o6W99PcQbj277Tus+S3qQsd7miz+H5dObjUSz7w/b7EMaD4GecVgKm18zdCoOraN3Cs3ON3nQ=="
                            className="w-100 d-flex flex-column gap-4"
                            onSubmit={handleSubmit}
                          >
                            <div className="d-flex flex-row gap-3">
                              <TextField
                                id="card_firstname"
                                label="First Name"
                                variant="standard"
                                className="w-100"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                              />
                              <TextField
                                id="card_lastname"
                                label="Last Name"
                                variant="standard"
                                className="w-100"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                              />
                            </div>
                            <TextField
                              id="card_name"
                              label="Card Holder Name"
                              variant="standard"
                              className="w-100"
                              value={cardHolderName}
                              onChange={(e) =>
                                setCardHolderName(e.target.value)
                              }
                              placeholder="John Doe"
                              type="TEXT"
                              required
                            />
                            <TextField
                              id="card_email"
                              label="Email"
                              variant="standard"
                              className="w-100"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              type="email"
                              required
                            />
                            <TextField
                              id="card_number"
                              label="Card Number"
                              variant="standard"
                              className="w-100"
                              value={cardNumber}
                              onChange={(e) =>
                                setCardNumber(formatCardNumber(e.target.value))
                              }
                              placeholder="4444333322221111"
                              inputProps={{ maxLength: 19 }}
                              required
                            />
                            <div className="d-flex justify-content-between gap-3 flex-row">
                              <FormControl
                                variant="standard"
                                sx={{ minWidth: 120 }}
                                md={{ minWidth: 150 }}
                              >
                                <InputLabel id="expiry_month-select-label">
                                  Month
                                </InputLabel>
                                <Select
                                  labelId="expiry_month-select-label"
                                  id="expiry_month"
                                  value={month}
                                  onChange={(e) => setMonth(e.target.value)}
                                  label="Month"
                                  required
                                >
                                  {months.map((monthItem) => (
                                    <MenuItem
                                      key={monthItem.value}
                                      value={monthItem.value}
                                    >
                                      {monthItem.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                              <FormControl
                                variant="standard"
                                sx={{ minWidth: 100 }}
                                md={{ minWidth: 150 }}
                              >
                                <InputLabel id="expiry_year-select-label">
                                  Year
                                </InputLabel>
                                <Select
                                  labelId="expiry_year-select-label"
                                  id="expiry_year"
                                  value={year}
                                  onChange={(e) => setYear(e.target.value)}
                                  label="Year"
                                  required
                                >
                                  {years.map((yearItem) => (
                                    <MenuItem key={yearItem} value={yearItem}>
                                      {yearItem}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                              <TextField
                                id="card_cvn"
                                label="CVV"
                                variant="standard"
                                className="w-100"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                                placeholder="123"
                                inputProps={{ maxLength: 4 }}
                                required
                              />
                            </div>

                            <button
                              type="submit"
                              className="custom-green bg-green-custom rounded-5 py-3 w-100 mt-4 btn btn-primary"
                              disabled={loading}
                              style={{ border: "none", padding: "12px" }}
                            >
                              {loading ? "Processing..." : "Make Payment"}
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Toaster
        message={toastProps.message}
        type={toastProps.type}
        toastKey={toastProps.toastKey}
      />
    </>
  );
}
