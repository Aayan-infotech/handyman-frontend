import react, { useEffect, useState } from "react";
import LoggedHeader from "./Auth/component/loggedNavbar";
import { IoIosSearch } from "react-icons/io";
import Form from "react-bootstrap/Form";
import { MdMessage } from "react-icons/md";
import { BiCoinStack } from "react-icons/bi";
import { PiBag } from "react-icons/pi";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Button from "@mui/material/Button";
import speaker from "./assets/announcement.png";
import { getProviderJobs, getGuestProviderJobs } from "../Slices/providerSlice";
import { getProviderUser } from "../Slices/userSlice";
import Loader from "../Loader";
import axios from "axios";
import Toaster from "../Toaster";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from "@mui/material/Skeleton";
import noData from "../assets/no_data_found.gif";

export default function HomeProvider() {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
  };
  const [loading, setLoading] = useState(false);
  const [businessType, setBusinessType] = useState("");
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [guestLatitude, setGuestLatitude] = useState();
  const [guestLongitude, setGuestLongitude] = useState();
  const [data, setData] = useState([]);
  const [toastProps, setToastProps] = useState({ message: "", type: "" });
  const name = localStorage.getItem("ProviderName");
  const dispatch = useDispatch();
  const guestCondition = localStorage.getItem("Guest") === "true";
  const guestLocation = JSON.parse(localStorage.getItem("guestLocation"));

  useEffect(() => {
    if (guestLocation) {
      const response = guestLocation.latitude;
      const response1 = guestLocation.longitude;
      setGuestLatitude(response);
      setGuestLongitude(response1);
    } else {
      console.log("No location found in localStorage");
    }
  }, []);

  const getUser = async () => {
    try {
      const result = await dispatch(getProviderUser());
      if (result.payload?.status === 200) {
        const { businessType, address } = result.payload.data;
        setBusinessType(businessType[0]);
        setLatitude(address?.location?.coordinates?.[1] || "");
        setLongitude(address?.location?.coordinates?.[0] || "");
      } else {
        throw new Error("Failed to fetch user data.");
      }
    } catch (error) {
      console.error("User error:", error);
      setToastProps({ message: "Error fetching user data", type: "error" });
    }
  };

  const handleAllData = async () => {
    if (!businessType || !latitude || !longitude) return;

    setLoading(true);
    try {
      const result = await dispatch(
        getProviderJobs({ businessType, latitude, longitude })
      );
      if (getProviderJobs.fulfilled.match(result)) {
        setToastProps({
          message: "Nearby Jobs Fetched Successfully",
          type: "success",
        });
        setData(result.payload?.data);
      } else {
        throw new Error(result.payload?.message || "Error fetching jobs.");
      }
    } catch (error) {
      console.error("Error Getting Nearby Jobs:", error);
      setToastProps({ message: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleGuestJob = async () => {
    try {
      const response = await dispatch(
        getGuestProviderJobs({
          latitude: guestLatitude,
          longitude: guestLongitude,
        })
      );
      if (getGuestProviderJobs.fulfilled.match(response)) {
        setToastProps({
          message: "Nearby Jobs Fetched Successfully",
          type: "success",
        });
        setData(response.payload?.data);
      }
    } catch (error) {
      console.error("Error Getting Nearby Jobs:", error);
      setToastProps({ message: error.message, type: "error" });
    }
  };

  useEffect(() => {
    if (guestCondition) {
      handleGuestJob();
    } else {
      getUser();
    }
  }, [guestCondition, guestLatitude, guestLongitude]);

  useEffect(() => {
    if (!guestCondition && businessType && latitude && longitude) {
      handleAllData();
    }
  }, [businessType, latitude, longitude]);

  console.log(data);

  return (
    <>
      <LoggedHeader />
      <div className="message">
        <Link to="/message">
          <MdMessage />
        </Link>
      </div>
      <div className="bg-second py-3">
        <div className="container top-section-main">
          <div className="d-flex justify-content-between flex-column flex-lg-row gap-3 align-items-center pb-3">
            <h5 className="user">Hello {name || "Guest"}</h5>
            <div className="position-relative icon-speaker">
              <img src={speaker} alt="speaker" />
              <Slider {...settings} className="mySwiper">
                <div>
                  <span>
                    10% Discount on Plumbing Services before Christmas, grab
                    this opportunity by clicking on the lorem ipsum dolar ajab
                    kar lorem inpsume
                  </span>
                </div>
                <div>
                  <span>
                    10% Discount on Plumbing Services before Christmas, grab
                    this opportunity by clicking on the lorem ipsum dolar ajab
                    kar lorem inpsume
                  </span>
                </div>
                <div>
                  <span>
                    10% Discount on Plumbing Services before Christmas, grab
                    this opportunity by clicking on the lorem ipsum dolar ajab
                    kar lorem inpsume
                  </span>
                </div>
                <div>
                  <span>
                    10% Discount on Plumbing Services before Christmas, grab
                    this opportunity by clicking on the lorem ipsum dolar ajab
                    kar lorem inpsume
                  </span>
                </div>
                <div>
                  <span>
                    10% Discount on Plumbing Services before Christmas, grab
                    this opportunity by clicking on the lorem ipsum dolar ajab
                    kar lorem inpsume
                  </span>
                </div>
              </Slider>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center gap-3 mb-4 mt-3">
            <h2 className="fw-normal">Job Requests</h2>
            <a href="#" className="text-dark">
              See More
            </a>
          </div>
          <div className="d-flex justify-content-start align-items-center">
            <div className="position-relative icon ">
              <IoIosSearch className="mt-1" />
              <Form.Control
                placeholder="search for something"
                className="search"
              />
            </div>
          </div>
          <div className="row mt-4 gy-4 management">
            {loading === true ? (
              [...Array(2)].map((_, index) => (
                <div key={index} className="card border-0 rounded-3 px-4">
                  <div className="card-body">
                    <div className="row gy-4 gx-1 align-items-center">
                      <div className="col-lg-6">
                        <div className="d-flex flex-row gap-3 align-items-center">
                          <div className="d-flex flex-column align-items-start gap-1">
                            <Skeleton
                              sx={{ width: 200, height: 20 }}
                              animation="wave"
                              variant="rectangular"
                            />
                            <Skeleton
                              sx={{ width: 100, height: 20 }}
                              animation="wave"
                              variant="rectangular"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="d-flex flex-column flex-lg-row gap-2 gap-lg-4 align-items-center">
                          <Skeleton
                            sx={{ height: 30 }}
                            animation="wave"
                            variant="rectangular"
                            className="w-100"
                          />
                          <Skeleton
                            sx={{ height: 30 }}
                            animation="wave"
                            variant="rectangular"
                            className="w-100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <>
                {data.length === 0 ? (
                  <div className="d-flex justify-content-center">
                    <img src={noData} alt="No Data Found" />
                  </div>
                ) : (
                  data.map((job) => (
                    <>
                      <div className="col-lg-12" key={job._id}>
                        <Link to={`/provider/jobspecification/${job._id}`}>
                          <div className="card border-0 rounded-3 px-4">
                            <div className="card-body">
                              <div className="row gy-4 gx-1 align-items-center">
                                {guestCondition ? (
                                  <div className="col-lg-4">
                                    <div className="d-flex flex-row gap-3 align-items-center">
                                      <div className="d-flex flex-column align-items-start gap-1">
                                        <h3 className="mb-0">
                                          {job.businessType}
                                        </h3>
                                        <h6>
                                          {new Date(
                                            job.createdAt
                                          ).toDateString()}
                                        </h6>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="col-lg-3">
                                    <div className="d-flex flex-row gap-3 align-items-center">
                                      <div className="d-flex flex-column align-items-start gap-1">
                                        <h3 className="mb-0">
                                          {job.businessType}
                                        </h3>
                                        <h6>
                                          {new Date(
                                            job.createdAt
                                          ).toDateString()}
                                        </h6>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                <div className="col-lg-7">
                                  <div className="d-flex flex-column flex-lg-row gap-2 gap-lg-4 align-items-center">
                                    <div className="d-flex flex-row gap-2 align-items-center">
                                      <BiCoinStack />
                                      <h5 className="mb-0">
                                        ${job.estimatedBudget}
                                      </h5>
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
                                      Accept
                                    </Button>
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </>
                  ))
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Toaster message={toastProps.message} type={toastProps.type} />
    </>
  );
}
