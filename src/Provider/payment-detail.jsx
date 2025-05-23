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

export default function PaymentDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [month, setMonth] = useState("01");
  const [year, setYear] = useState("23");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user?.user?.data);
  const providerId = localStorage.getItem("ProviderId");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const hunterId = localStorage.getItem("hunterId");
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
        if (error.response.status === 500) {
          navigate("/error");
        }
        console.log(error);
        setLoading(false);
      }
    };
    getData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare the payment data in the required format
    const paymentData = {
      userId: providerId,
      subscriptionPlanId: id,
      Amount: data?.amount * 100,
      Customer: {
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        CardDetails: {
          Name: `${firstName} ${lastName}`,
          Number: cardNumber.replace(/\s/g, ""),
          ExpiryMonth: month,
          ExpiryYear: year,
          CVN: cvv,
        },
      },
      Payment: {
        TotalAmount: data?.amount * 100,
        CurrencyCode: "AUD",
      },
    };

    try {
      const result = await dispatch(handlePayment(paymentData));

      if (handlePayment.fulfilled.match(result)) {
        setToastProps({
          message: "Subscription purchased successfully!",
          type: "success",
          toastKey: Date.now(),
        });
        setLoading(false);
        localStorage.setItem("Guest", false);
        localStorage.setItem(
          "PlanType",
          result?.payload?.data?.newSubscription?.type
        );
        setTimeout(() => {
          navigate("/provider/payment/success");
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
      setTimeout(() => {
        navigate("/provider/payment/error");
      }, 2000);
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
      <div className="bg-second ">
        <div className="container">
          <div className="top-section-main py-4 px-lg-5">
            <div className="row gy-4 price-line gx-lg-5">
              <div className="col-lg-4  price-line-line d-none d-lg-block">
                <h5 className="fw-medium mb-4">Payment Options</h5>
                <div className="d-flex flex-column gap-3 align-items-center justify-content-center">
                  <div className="card rounded-3 border-0 card-wallet w-100 debit-card ">
                    <div className="card-body text-center p-2">
                      <div className="d-flex justify-content-start align-items-center gap-1 flex-row mb-3">
                        <CiBank className="fs-3" />
                        <h6 className="mb-0">FYI Bank</h6>
                      </div>
                      <span className="text-start d-flex w-100">
                        0000 2363 8364 8269
                      </span>
                      <div className="d-flex justify-content-center align-items-center gap-5 flex-row mt-4">
                        <span className="valid-thru">5/23</span>
                        <span>633</span>
                      </div>
                      <h6 className="mt-3 d-flex w-100">Okechukwu ozioma</h6>
                    </div>
                  </div>
                  <div className="card rounded-3 border-0 card-wallet w-100 credit-card ">
                    <div className="card-body text-center p-2">
                      <div className="d-flex justify-content-between align-items-center gap-1 flex-row mb-3">
                        <div className="d-flex flex-row gap-2 align-items-center justify-content-center ">
                          <CiBank className="fs-3" />
                          <h6 className="mb-0">FYI Bank</h6>
                        </div>
                        <h6 className="mb-0">CREDIT</h6>
                      </div>
                      <div className="text-start d-flex w-100 justify-content-between align-items-center gap-2">
                        <span>0000 2363 8364 8269</span>
                        <span>
                          <FaWifi
                            className="fs-5"
                            style={{ transform: "rotate(90deg)" }}
                          />
                        </span>
                      </div>
                      <div className="d-flex justify-content-center align-items-center gap-5 flex-row mt-4">
                        <span className="valid-thru">5/23</span>
                        <span>633</span>
                      </div>
                      <h6 className="mt-3 d-flex w-100">Okechukwu ozioma</h6>
                    </div>
                  </div>
                  <div className="card rounded-3 border-0 card-wallet w-100 credit-card ">
                    <div className="card-body text-center p-2">
                      <div className="d-flex justify-content-between align-items-center gap-1 flex-row mb-3">
                        <div className="d-flex flex-row gap-2 align-items-center justify-content-center ">
                          <CiBank className="fs-3" />
                          <h6 className="mb-0">FYI Bank</h6>
                        </div>
                        <h6 className="mb-0">CREDIT</h6>
                      </div>
                      <div className="text-start d-flex w-100 justify-content-between align-items-center gap-2">
                        <span>0000 2363 8364 8269</span>
                        <span>
                          <FaWifi
                            className="fs-5"
                            style={{ transform: "rotate(90deg)" }}
                          />
                        </span>
                      </div>
                      <div className="d-flex justify-content-center align-items-center gap-5 flex-row mt-4">
                        <span className="valid-thru">5/23</span>
                        <span>633</span>
                      </div>
                      <h6 className="mt-3 d-flex w-100">Okechukwu ozioma</h6>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-7 offset-lg-1">
                <h5 className="fw-medium mb-4 text-center">
                  Enter card details
                </h5>
                <div className="d-flex justify-content-center align-items-center flex-column w-100">
                  <div className="card rounded-5 border-0 w-100">
                    <div className="card-body text-center">
                      <div className="row">
                        <div className="col-lg-10 mx-auto">
                          <Box
                            component="form"
                            noValidate
                            autoComplete="off"
                            className="w-100 d-flex flex-column gap-4"
                            onSubmit={handleSubmit}
                          >
                            <div className="d-flex flex-column gap-2 justify-content-start align-items-start w-100">
                              <h3>Plan Information</h3>
                              <h6>{data?.planName}</h6>
                              <h6>${data?.amount}</h6>
                            </div>

                            <div className="d-flex flex-row gap-3">
                              <TextField
                                id="standard-basic"
                                label="First Name"
                                variant="standard"
                                className="w-100"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                              />
                              <TextField
                                id="standard-basic"
                                label="Last Name"
                                variant="standard"
                                className="w-100"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                              />
                            </div>
                            <TextField
                              id="standard-basic"
                              label="Email"
                              variant="standard"
                              className="w-100"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              type="email"
                              required
                            />
                            <TextField
                              id="standard-basic"
                              label="Card Number"
                              variant="standard"
                              className="w-100"
                              value={cardNumber}
                              onChange={(e) =>
                                setCardNumber(formatCardNumber(e.target.value))
                              }
                              inputProps={{ maxLength: 19 }}
                              required
                            />
                            <div className="d-flex justify-content-between gap-3 flex-row">
                              <FormControl
                                variant="standard"
                                sx={{ minWidth: 120 }}
                              >
                                <InputLabel id="month-select-label">
                                  Month
                                </InputLabel>
                                <Select
                                  labelId="month-select-label"
                                  id="month-select"
                                  value={month}
                                  onChange={(e) => setMonth(e.target.value)}
                                  label="Month"
                                  required
                                >
                                  {months.map((month) => (
                                    <MenuItem
                                      key={month.value}
                                      value={month.value}
                                    >
                                      {month.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                              <FormControl
                                variant="standard"
                                sx={{ minWidth: 120 }}
                              >
                                <InputLabel id="year-select-label">
                                  Year
                                </InputLabel>
                                <Select
                                  labelId="year-select-label"
                                  id="year-select"
                                  value={year}
                                  onChange={(e) => setYear(e.target.value)}
                                  label="Year"
                                  required
                                >
                                  {years.map((year) => (
                                    <MenuItem key={year} value={year}>
                                      {year}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                              <TextField
                                id="standard-basic"
                                label="CVV"
                                variant="standard"
                                className="w-100"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                                inputProps={{ maxLength: 4 }}
                                required
                              />
                            </div>

                            <Button
                              type="submit"
                              variant="contained"
                              className="custom-green bg-green-custom rounded-5 py-3 w-100 mt-4"
                              disabled={loading}
                            >
                              {loading ? "Processing..." : "Pay Now"}
                            </Button>
                          </Box>
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
