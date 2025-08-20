import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { IoIosSearch } from "react-icons/io";
import { MdMessage, MdOutlineSupportAgent } from "react-icons/md";

import { BiCoinStack } from "react-icons/bi";
import { PiBag } from "react-icons/pi";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Form from "react-bootstrap/Form";
import LoggedHeader from "./auth/component/loggedNavbar";
import { getProviderJobs, getGuestProviderJobs } from "../Slices/providerSlice";
import { getProviderUser } from "../Slices/userSlice";
import Tooltip from "@mui/material/Tooltip";
import { io } from "socket.io-client";

import Toaster from "../Toaster";
import { Alert, Stack } from "@mui/material";
import noData from "../assets/no_data_found.gif";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import FormControl from "@mui/material/FormControl";
import axiosInstance from "../components/axiosInstance";
import Pagination from "@mui/material/Pagination";
const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 150,
    },
  },
};

export default function HomeProvider() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [businessType, setBusinessType] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [data, setData] = useState([]);
  const [radius, setRadius] = useState(null);
  const hunterId = localStorage.getItem("hunterId");
  const providerId = localStorage.getItem("ProviderId");
  const userType = hunterId ? "hunter" : "provider";
  const userId = hunterId || providerId;
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [filteredData, setFilteredData] = useState([]);
  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });
  const [jobStatus, setJobStatus] = useState([]);
  const [socket, setSocket] = useState(null);

  const [alertMessages, setAlertMessages] = useState([]); // Store alerts
  const name = localStorage.getItem("ProviderName") || "Guest";
  const providerToken = localStorage.getItem("ProviderToken");
  const hunterToken = localStorage.getItem("hunterToken");
  const planType = localStorage.getItem("PlanType");
  const guestCondition = localStorage.getItem("Guest") === "true";
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  useEffect(() => {
    if (!providerToken) {
      console.log("No provider token, skipping socket setup");
      return;
    }

    console.log("Attempting to connect to socket...");
    const newSocket = io("http://54.147.249.209:7777", {
      auth: {
        token: providerToken,
      },
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = newSocket;

    newSocket.on("connect", () => {
      console.log("✅ Socket connected successfully");
      handleAllData(pagination.page);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });

    newSocket.on("connect_error", (error) => {
      console.log("❌ Socket connection error:", error.message);
    });

    newSocket.on("newJob", (jobData) => {
      console.log("🔔 Received newJob event:", jobData);
      handleAllData(pagination.page);
    });

    newSocket.on("jobUpdate", (updatedJob) => {
      console.log("🔔 Received jobUpdate event:", updatedJob);
      handleAllData(pagination.page);
    });

    newSocket.onAny((event, ...args) => {
      console.log(`Received socket event: ${event}`, args);
      if (event === "new Job") {
        // setToastProps({
        //   message: "You have received a new job",
        //   type: "info",
        //   toastKey: Date.now(),
        // });
        handleAllData();
      }
    });
    return () => {
      console.log("Cleaning up socket connection");
      newSocket.disconnect();
    };
  }, [providerToken]);

  const handleChange = (event) => {
    setJobStatus(event.target.value);
  };
  const providerIdToMatch = providerId;

  const hasAcceptedJob = data?.jobAcceptCount?.some(
    (job) => job.providerId === providerIdToMatch
  );
  const guesNavigation = () => {
    if (localStorage.getItem("Guest") == "true") {
      return "/provider/pricing";
    }
    return `/provider/jobspecification/${job._id}`;
  };
  const handleAllData = async (page = 1) => {
    if (!businessType || latitude === null || longitude === null) return;
    setLoading(true);
    try {
      const result = await dispatch(
        getProviderJobs({
          businessType,
          latitude,
          longitude,
          radius,
          page,
          limit: pagination.limit,
          filter: jobStatus,
          providerId,
        })
      );

      if (getProviderJobs.fulfilled.match(result)) {
        const jobs = result.payload?.data || [];
        setData(jobs);
        setData(result.payload?.data || []);
        setPagination({
          total: result.payload?.pagination?.totalJobs || 0,
          page: result.payload?.pagination?.currentPage || 1,
          totalPages: result.payload?.pagination?.totalPages || 1,
          limit: pagination.limit,
        });
        // if (socket && jobs.length > 0) {
        //   socket.emit(
        //     "subscribeToJobs",
        //     jobs.map((job) => job._id)
        //   );
        // }
      } else {
        throw new Error(result.payload?.message || "Error fetching jobs.");
      }
    } catch (error) {
      console.error("Error Getting Nearby Jobs:", error);
      setToastProps({
        message: error.message,
        type: "error",
        toastKey: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (hunterToken) {
      navigate("/error");
    }

    if (providerToken) {
      getUser();
    } else {
      dispatch(getGuestProviderJobs())
        .then((response) => {
          if (getGuestProviderJobs.fulfilled.match(response)) {
            setData(response.payload?.data || []);
            setFilteredData(response.payload?.data || []);
            // setToastProps({
            //   message: "Nearby Jobs Fetched Successfully",
            //   type: "success",
            //   toastKey: Date.now(),
            // });
          }
        })
        .catch((error) => {
          console.error("Error Getting Nearby Jobs:", error);
          setToastProps({
            message: error.message,
            type: "error",
            toastKey: Date.now(),
          });
        });
    }
  }, [providerToken, jobStatus, hunterToken]);

  useEffect(() => {
    var filtered = data;

    // Only apply filtering if jobStatus has values selected
    if (jobStatus.length > 0) {
      filtered = filtered.filter(
        (job) =>
          job.businessType &&
          job.businessType.some((type) => jobStatus.includes(type))
      );
    }
    setFilteredData(filtered);
  }, [jobStatus, data]);

  useEffect(() => {
    if (businessType && latitude !== null && longitude !== null) {
      if (planType !== "Advertising") {
        handleAllData();
      }
    }
  }, [businessType, latitude, longitude]);

  const getUser = async () => {
    const isGuest = JSON.parse(localStorage.getItem("Guest")) === true;
    try {
      const result = await dispatch(getProviderUser());
      if (result.payload?.status === 200) {
        const { businessType, address } = result.payload.data;
        setBusinessType(businessType);
        setLatitude(address?.location?.coordinates?.[1] || null);
        setLongitude(address?.location?.coordinates?.[0] || null);
        {
          isGuest ? setRadius(160000) : setRadius(address?.radius || null);
        }
      } else {
        throw new Error("Failed to fetch user data.");
      }
    } catch (error) {
      console.error("User error:", error);
      // addAlert("Error fetching user data", "error");
    }
  };

  console.log("businessType", businessType);
  const handlePageChange = (page) => {
    if (page !== pagination.page) {
      setPagination((prev) => ({ ...prev, page }));
      handleAllData(page);
    }
  };
  const filterAddressPatterns = (address) => {
    if (!address) return address;

    // Regular expression to match patterns like C-84, D-19, etc.
    const pattern = /^.*?,\s*/;

    return address.replace(pattern, "").trim();
  };

  const navTest = (id) => {
    // const isGuest = localStorage.getItem("Guest") === "true";
    // if (isGuest) {
    //   navigate("/provider/pricing");
    //   return;
    // }
    navigate(`/provider/jobspecification/${id}`);
  };
  // const handlePlan = async () => {
  //   try {
  //     const response = await axiosInstance.get(
  //       "/pushNotification/expiring-soon",
  //       {
  //         headers: {
  //           Authorization: `Bearer ${providerToken}`,
  //         },
  //       }
  //     );
  //     if (response.status === 200 && response?.data?.data) {
  //       setToastProps({
  //         message: response.data.message,
  //         type: "info",
  //         toastKey: Date.now(),
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // useEffect(() => {
  //   const providerAlert = localStorage.getItem("ProviderAlert");

  //   if (providerAlert !== "true") {
  //     handlePlan();
  //     localStorage.setItem("ProviderAlert", "true");
  //   }
  // }, []);

  console.log(filteredData);
  return (
    <>
      <LoggedHeader />
      <Stack
        sx={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 1000,
          width: "300px", // Adjust width to keep it compact
        }}
        spacing={2}
      >
        {alertMessages.map((alert) => (
          <Alert
            key={alert.id}
            variant="outlined"
            severity={alert.severity}
            sx={{ boxShadow: 3, borderRadius: 2 }} // Adds shadow and rounded corners
          >
            {alert.message}
          </Alert>
        ))}
      </Stack>

      {/* <Link to="/provider/admin/chat/">
        <Tooltip title="Admin chat" placement="left-start">
          <div className="admin-message">
            <MdOutlineSupportAgent />
          </div>
        </Tooltip>
      </Link> */}
      {/* <Link to="/provider/message">
        <Tooltip title="Message" placement="left-start">
          <div className="message">
            <MdMessage />
          </div>
        </Tooltip>
      </Link> */}

      <div className="bg-second py-3">
        <div className="container top-section-main">
          <div className="d-flex justify-content-between align-items-center pb-3">
            <h5 className="user">Hello {name}</h5>
          </div>
          {planType !== "Advertising" ? (
            <div>
              <div className="d-flex justify-content-between flex-column flex-lg-row align-items-center mb-4 mt-3">
                <h2 className="fw-normal">Job Requests</h2>
                <FormControl className="sort-input" sx={{ m: 1 }}>
                  <InputLabel id="radius-select-label">
                    Select Business Type
                  </InputLabel>
                  <Select
                    labelId="business-type-select-label"
                    id="business-type-select"
                    multiple
                    value={jobStatus}
                    onChange={handleChange}
                    input={<OutlinedInput label="Select Business Type" />}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                    placeholder="Select Business Type"
                  >
                    {businessType.map((type, index) => (
                      <MenuItem key={index} value={type}>
                        <Checkbox checked={jobStatus.includes(type)} />
                        <ListItemText primary={type} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="row mt-4 gy-4 ">
                {loading ? (
                  [...Array(4)].map((_, index) => (
                    <Skeleton
                      key={index}
                      sx={{ height: 100, width: "100%" }}
                      animation="wave"
                    />
                  ))
                ) : filteredData.length === 0 ? (
                  <div className="d-flex justify-content-center">
                    <img
                      src={noData}
                      alt="No Data Found"
                      className="w-nodata"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  filteredData.map((job) => {
                    const hasAcceptedJob = job.jobAcceptCount?.some(
                      (accept) => accept.providerId === providerId
                    );

                    const handleAccept = job?.jobAcceptCount.length === 4;

                    return (
                      <div className="col-lg-12 management" key={job._id}>
                        <div className="card border-0 rounded-3 px-lg-4">
                          <div className="card-body">
                            <div className="row gy-4 gx-1 align-items-center">
                              <div className="col-lg-3">
                                <div className="d-flex flex-row gap-3 align-items-center">
                                  <div className="d-flex flex-column align-items-start gap-1">
                                    <h3
                                      className="mb-0 text-truncate"
                                      style={{ maxWidth: "200px" }}
                                    >
                                      {job.title}
                                    </h3>
                                    <h6>
                                      {new Date(
                                        job.createdAt
                                      ).toLocaleDateString("en-AU", {
                                        timeZone: "Australia/Sydney",
                                        weekday: "long",
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                      })}
                                    </h6>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-7">
                                <div className="d-flex flex-column flex-lg-row gap-2 gap-lg-4 align-items-lg-center">
                                  <div
                                    className="d-flex flex-row gap-2 align-items-center"
                                    style={{ minWidth: "150px" }}
                                  >
                                    <BiCoinStack />
                                    <h5 className="mb-0">
                                      ${job.estimatedBudget || "00"}
                                    </h5>
                                  </div>
                                  <div className="d-flex flex-row gap-2 align-items-center flex-wrap w-100">
                                    <PiBag />
                                    <h5 className="mb-0 text-trun">
                                      {filterAddressPatterns(
                                        job.jobLocation.jobAddressLine
                                      )}
                                    </h5>
                                  </div>
                                </div>
                              </div>

                              <div className="col-lg-2">
                                {job?.jobAcceptCount.length === 4 ? (
                                  // If jobAcceptCount length is 4 (limit reached)
                                  hasAcceptedJob ? (
                                    // If current provider is one of the accepted providers
                                    <Button
                                      variant="outlined"
                                      color="success"
                                      className="rounded-5 w-100 py-3"
                                      onClick={() => navTest(job._id)}
                                    >
                                      Quoted
                                    </Button>
                                  ) : (
                                    // If current provider is NOT one of the accepted providers
                                    <Button
                                      variant="outlined"
                                      color="secondary"
                                      className="rounded-5 w-100 py-3 seconday-button px-0"
                                      onClick={() => navTest(job._id)}
                                    >
                                      Quote Reach
                                    </Button>
                                  )
                                ) : // If jobAcceptCount length is less than 4
                                hasAcceptedJob ? (
                                  // If current provider has already accepted
                                  <Button
                                    variant="outlined"
                                    color="success"
                                    className="rounded-5 w-100 py-3"
                                    onClick={() => navTest(job._id)}
                                  >
                                    Quoted
                                  </Button>
                                ) : (
                                  // If current provider hasn't accepted yet
                                  <Button
                                    variant="contained"
                                    className="custom-green bg-green-custom rounded-5 py-3 w-100"
                                    onClick={() => navTest(job._id)}
                                  >
                                    Contact
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            <div
              className="card rounded-5 h-100 py-5"
              style={{ border: "2px solid #32de84" }}
            >
              <div className="card-body text-center">
                <h3 className="">
                  You are currently on an <strong>Advertising Plan</strong>,
                  <br />
                  Job listing are not available for this plan.
                </h3>
              </div>
            </div>
          )}
          {pagination.totalPages > 1 && (
            <Stack spacing={2} sx={{ mt: 4, alignItems: "center" }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.page}
                onChange={(event, page) => handlePageChange(page)}
                color="primary"
                size="large"
                variant="outlined"
                shape="rounded"
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "#4CAF50",
                    borderColor: "#4CAF50",
                    "&:hover": {
                      backgroundColor: "#E8F5E9",
                    },
                  },
                  "& .Mui-selected": {
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#388E3C",
                    },
                  },
                }}
              />
            </Stack>
          )}
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
