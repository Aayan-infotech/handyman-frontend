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
import noData from "../assets/no_data_found.gif";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function HomeProvider() {
  const [loading, setLoading] = useState(false);
  const [businessType, setBusinessType] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [data, setData] = useState([]);
  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });

  const name = localStorage.getItem("ProviderName") || "Guest";
  const providerToken = localStorage.getItem("ProviderToken");
  const guestCondition = localStorage.getItem("Guest") === "true";
  const dispatch = useDispatch();

  const getUser = async () => {
    try {
      const result = await dispatch(getProviderUser());
      if (result.payload?.status === 200) {
        const { businessType, address } = result.payload.data;
        setBusinessType(businessType[0]);
        setLatitude(address?.location?.coordinates?.[1] || null);
        setLongitude(address?.location?.coordinates?.[0] || null);
      } else {
        throw new Error("Failed to fetch user data.");
      }
    } catch (error) {
      console.error("User error:", error);
      setToastProps({
        message: "Error fetching user data",
        type: "error",
        toastKey: Date.now(),
      });
    }
  };

  const handleAllData = async () => {
    if (!businessType || latitude === null || longitude === null) return;
    setLoading(true);
    try {
      const result = await dispatch(
        getProviderJobs({ businessType, latitude, longitude })
      );
      if (getProviderJobs.fulfilled.match(result)) {
        setData(result.payload?.data || []);
        setToastProps({
          message: "Nearby Jobs Fetched Successfully",
          type: "success",
          toastKey: Date.now(),
        });
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
            setToastProps({
              message: "Nearby Jobs Fetched Successfully",
              type: "success",
              toastKey: Date.now(),
            });
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
    if (businessType && latitude !== null && longitude !== null) {
      handleAllData();
    }
  }, [businessType, latitude, longitude]); // Runs when state updates

  return (
    <>
      <LoggedHeader />
      <Link to="/provider/chat/1" className="admin-message">
        <MdOutlineSupportAgent />
      </Link>
      <div className="message">
        <Link to="/message">
          <MdMessage />
        </Link>
      </div>
      <div className="bg-second py-3">
        <div className="container top-section-main">
          <div className="d-flex justify-content-between align-items-center pb-3">
            <h5 className="user">Hello {name}</h5>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-4 mt-3">
            <h2 className="fw-normal">Job Requests</h2>
            <a href="#" className="text-dark">
              See More
            </a>
          </div>
          <div className="d-flex justify-content-start align-items-center">
            <div className="position-relative icon">
              <IoIosSearch className="mt-1" />
              <Form.Control
                placeholder="Search for something"
                className="search"
              />
            </div>
          </div>
          <div className="row mt-4 gy-4 management">
            {loading ? (
              [...Array(2)].map((_, index) => (
                <Skeleton
                  key={index}
                  sx={{ height: 100, width: "100%" }}
                  animation="wave"
                />
              ))
            ) : data.length === 0 ? (
              <div className="d-flex justify-content-center">
                <img src={noData} alt="No Data Found" className="w-nodata" />
              </div>
            ) : (
              data.map((job) => (
                <div className="col-lg-12" key={job._id}>
                  <Link
                    to={`/provider/jobspecification/${job._id}`}
                    className="card border-0 rounded-3 px-4"
                  >
                    <div className="card-body">
                      <div className="row gy-4 gx-1 align-items-center">
                        {guestCondition ? (
                          <div className="col-lg-4">
                            <div className="d-flex flex-row gap-3 align-items-center">
                              <div className="d-flex flex-column align-items-start gap-1">
                                <h3 className="mb-0">{job.title}</h3>
                                <h6>
                                  {new Date(job.createdAt).toDateString()}
                                </h6>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="col-lg-3">
                            <div className="d-flex flex-row gap-3 align-items-center">
                              <div className="d-flex flex-column align-items-start gap-1">
                                <h3 className="mb-0">{job.title}</h3>
                                <h6>
                                  {new Date(job.createdAt).toDateString()}
                                </h6>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="col-lg-7">
                          <div className="d-flex flex-column flex-lg-row gap-2 gap-lg-4 align-items-center">
                            <div className="d-flex flex-row gap-2 align-items-center">
                              <BiCoinStack />
                              <h5 className="mb-0">${job.estimatedBudget}</h5>
                            </div>
                            <div className="d-flex flex-row gap-2 align-items-center">
                              <PiBag />
                              <h5 className="mb-0 text-trun">
                                {job.jobLocation.jobAddressLine}
                              </h5>
                            </div>
                          </div>
                        </div>
                        {!guestCondition ? (
                          <div className="col-lg-2">
                            <Button
                              variant="contained"
                              className="custom-green bg-green-custom rounded-5 py-3 w-100"
                            >
                              Contact
                            </Button>
                          </div>
                        ) : null}
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
