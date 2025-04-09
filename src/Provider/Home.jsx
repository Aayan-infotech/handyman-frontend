import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  const [toastMessage, setToastMessage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [massNotifications, setMassNotifications] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });
  const [jobStatus, setJobStatus] = useState([]);
  const [alertMessages, setAlertMessages] = useState([]); // Store alerts
  const name = localStorage.getItem("ProviderName") || "Guest";
  const providerToken = localStorage.getItem("ProviderToken");
  const guestCondition = localStorage.getItem("Guest") === "true";
  const dispatch = useDispatch();

  const handleChange = (event) => {
    setJobStatus(event.target.value);
  };

  const guesNavigation = () => {
    if (localStorage.getItem("Guest") == "true") {
      return "/provider/pricing";
    }
    return `/provider/jobspecification/${job._id}`;
  };
  const handleAllData = async () => {
    if (!businessType || latitude === null || longitude === null) return;
    setLoading(true);
    try {
      const result = await dispatch(
        getProviderJobs({ businessType, latitude, longitude, radius })
      );

      if (getProviderJobs.fulfilled.match(result)) {
        setData(result.payload?.data || []);
        // setToastProps({
        //   message: "Nearby Jobs Fetched Successfully",
        //   type: "success",
        //   toastKey: Date.now(),
        // });
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
  }, [providerToken]);

  useEffect(() => {
    let filtered = data;

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
      handleAllData();
    }
  }, [businessType, latitude, longitude]);

  const getUser = async () => {
    try {
      const result = await dispatch(getProviderUser());
      if (result.payload?.status === 200) {
        const { businessType, address } = result.payload.data;
        setBusinessType(businessType);
        setLatitude(address?.location?.coordinates?.[1] || null);
        setLongitude(address?.location?.coordinates?.[0] || null);
        setRadius(address?.radius || null);
      } else {
        throw new Error("Failed to fetch user data.");
      }
    } catch (error) {
      console.error("User error:", error);
      // addAlert("Error fetching user data", "error");
    }
  };

  const filterAddressPatterns = (address) => {
    if (!address) return address;

    // Regular expression to match patterns like C-84, D-19, etc.
    const pattern = /^.*?,\s*/;

    return address.replace(pattern, "").trim();
  };


  return (
    <>
      <div></div>
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

      <Link to="/provider/admin/chat/" className="admin-message">
        <MdOutlineSupportAgent />
      </Link>
      <div className="message">
        <Link to="/provider/message">
          <MdMessage />
        </Link>
      </div>

      <div className="bg-second py-3">
        <div className="container top-section-main">
          <div className="d-flex justify-content-between align-items-center pb-3">
            <h5 className="user">Hello {name}</h5>
          </div>
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
                {Array.from(
                  new Set(data.flatMap((provider) => provider.businessType))
                ).map((type, index) => (
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
                <img src={noData} alt="No Data Found" className="w-nodata" />
              </div>
            ) : (
              filteredData.map((job) => (
                <div className="col-lg-12 management" key={job._id}>
                  <Link
                    to={`/provider/jobspecification/${job._id}`}
                    className="card border-0 rounded-3 px-4"
                  >
                    <div className="card-body">
                      <div className="row gy-4 gx-1 align-items-center">
                        <div className="col-lg-3">
                          <div className="d-flex flex-row gap-3 align-items-center">
                            <div className="d-flex flex-column align-items-start gap-1">
                              <h3 className="mb-0">{job.title}</h3>
                              <h6>{new Date(job.createdAt).toDateString()}</h6>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-7">
                          <div className="d-flex flex-column flex-lg-row gap-2 gap-lg-4 align-items-lg-center">
                            <div className="d-flex flex-row gap-2 align-items-center">
                              <BiCoinStack />
                              <h5 className="mb-0">${job.estimatedBudget}</h5>
                            </div>
                            <div className="d-flex flex-row gap-2 align-items-center flex-wrap w-100">
                              <PiBag />
                              <h5 className="mb-0 text-trun">
                                {filterAddressPatterns(job.jobLocation.jobAddressLine)}
                              </h5>
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-2">
                          <Button
                            variant="contained"
                            className="custom-green bg-green-custom rounded-5 py-3 w-100"
                            onClick={
                              localStorage.getItem("Guest") === "true"
                                ? `/provider/pricing`
                                : `/provider/jobspecification/${job._id}`
                            }
                          >
                            Contact
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            )}
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
