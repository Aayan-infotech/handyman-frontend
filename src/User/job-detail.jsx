import React, { useState, useEffect } from "react";
import LoggedHeader from "./Auth/component/loggedNavbar";
import { MdMessage, MdOutlineSupportAgent } from "react-icons/md";
import Chip from "@mui/material/Chip";
import { FaRegCheckCircle } from "react-icons/fa";
import { BiCoinStack } from "react-icons/bi";
import { PiBag } from "react-icons/pi";
import Button from "@mui/material/Button";
import { Eye } from "lucide-react";

import Rating from "@mui/material/Rating";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { IoIosStar } from "react-icons/io";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../components/axiosInstance";
import { CiUser } from "react-icons/ci";
import Loader from "../Loader";
import NoData from "../assets/no_data_found.gif";
import { useDispatch, useSelector } from "react-redux";
import {
  completedJobNotification,
  reviewJobNotification,
  messageNotification,
} from "../Slices/notificationSlice";

export default function JobDetail() {
  const [data, setData] = useState(null);
  const [user, setUser] = useState("");
  const [value, setValue] = useState(2);
  const [review, setReview] = useState("");
  const dispatch = useDispatch();
  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });
  const [show, setShow] = useState(false);
  const providerbusinessName = localStorage.getItem("ProviderBusinessName");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [loading, setLoading] = useState(false);
  const [providerName, setProviderName] = useState("");
  const name = localStorage.getItem("hunterName");
  const location = useLocation();
  const hunterToken = localStorage.getItem("hunterToken");
  const ProviderToken = localStorage.getItem("ProviderToken");
  const { id } = useParams();
  const [receiverId, setRecieverId] = useState(null);
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const isHistoryType = searchParams.get("type") === "history";
  const handleProviderJobs = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/jobpost/jobpost-details/${id}`, {
        headers: {
          Authorization: `Bearer ${ProviderToken || hunterToken}`,
        },
      });
      if (res.status === 200) {
        setToastProps({
          message: res.data.message,
          type: "success",
          toastKey: Date.now(),
        });
        setData(res.data.data);
        setRecieverId(res.data.data.provider);
        setUser(res.data.data.user);
      }
    } catch (error) {
      setToastProps({
        message: error.message,
        type: "error",
        toastKey: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  };

  const noficationFunctionality = async () => {
    setLoading(true);
    try {
      // const response1 = await dispatch(
      //   completedJobNotification({
      //     receiverId,
      //     body: `You have completed the job ${data?.title}`,
      //   })
      // );

      const response2 = await dispatch(
        reviewJobNotification({
          receiverId,
          body: `${name} has submitted Feedback for the job ${data?.title}   `,
        })
      );

      if (
        // completedJobNotification.fulfilled.match(response1) &&
        reviewJobNotification.fulfilled.match(response2)
      ) {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error Sending Notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProvider = async () => {
    try {
      const response = await axiosInstance.post(
        "/match/getMatchedData",
        { jobPostId: id, senderId: user, receiverId },
        {
          headers: {
            Authorization: `Bearer ${ProviderToken || hunterToken}`,
          },
        }
      );

      const responseData = response.data.data;

      if (responseData.sender && responseData.receiver) {
        // Check if the logged-in user's name matches sender or receiver
        if (responseData.sender.name === name) {
          setProviderName(
            responseData.receiver.contactName || responseData.sender.name
          );
        } else if (
          responseData.sender.name === name ||
          responseData.receiver.contactName === name
        ) {
          setProviderName(responseData.sender.name);
        } else {
          // If name does not match either, set any of them as provider name
          setProviderName(
            responseData.receiver.contactName || responseData.sender.name
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleReview = async () => {
    setLoading(true);
    try {
      const reponse = await axiosInstance.post(
        `/rating/giveRating/${receiverId}`,
        {
          jobId: data?._id,
          rating: value,
          review,
        },
        {
          headers: {
            Authorization: `Bearer ${ProviderToken || hunterToken}`,
          },
        }
      );
      setLoading(false);
      setShow(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleJobStatus = async () => {
    setLoading(true);
    try {
      const reponse = await axiosInstance.post(
        `/jobPost/changeJobStatus/${id}`,
        {
          jobStatus: "Completed",
          providerId: receiverId,
        },
        {
          headers: {
            Authorization: `Bearer ${ProviderToken || hunterToken}`,
          },
        }
      );
      setLoading(false);
      setShow(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleJobCompletNotify = async ({ id, receiverId, title }) => {
    setLoading(true);
    try {
      const apiResponse = await axiosInstance.put(
        `/jobPost/notifyCompletion/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${ProviderToken}`,
          },
        }
      );
      if (apiResponse.status === 200) {
        await fetchData();
        setLoading(false);
        const response = dispatch(
          messageNotification({
            receiverId,
            jobId: id,
            body: `${providerbusinessName} have completed your job ${title}`,
          })
        );
        // if (messageNotification.fulfilled.match(response)) {

        // }
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const jobRes = await axiosInstance.get(`/jobpost/jobpost-details/${id}`, {
        headers: {
          Authorization: `Bearer ${ProviderToken || hunterToken}`,
        },
      });

      console.log("jobRes", jobRes?.data?.data);

      if (jobRes.status === 200) {
        // Changed from statusCode to status
        const jobData = jobRes.data.data; // Access data properly
        setData(jobData);

        // Set user and receiverId together
        setUser(jobData?.user);
        setRecieverId(jobData?.provider);

        // Only fetch provider if we have both IDs
        if (jobData?.user && jobData?.provider) {
          const providerRes = await axiosInstance.post(
            "/match/getMatchedData",
            {
              jobPostId: id,
              senderId: jobData.user, // Removed optional chaining since we checked it exists
              receiverId: jobData.provider,
            },
            {
              headers: {
                Authorization: `Bearer ${ProviderToken || hunterToken}`,
              },
            }
          );

          const responseData = providerRes.data.data;
          if (responseData?.sender && responseData?.receiver) {
            let nameToSet = "";
            if (responseData.sender.name === name) {
              nameToSet =
                responseData.receiver.businessName || responseData.sender.name;
            } else if (
              responseData.sender.name === name ||
              responseData.receiver.businessName === name
            ) {
              nameToSet = responseData.sender.name;
            } else {
              nameToSet =
                responseData.receiver.businessName || responseData.sender.name;
            }
            setProviderName(nameToSet);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error?.response?.status === 500) {
        navigate("/error");
        return;
      }
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
    fetchData();
  }, [id]);

  const filterAddressPatterns = (address) => {
    if (!address) return address;

    // Regular expression to match patterns like C-84, D-19, etc.
    const pattern = /^.*?,\s*/;

    return address.replace(pattern, "").trim();
  };

  const doubleFunction = async () => {
    setLoading(true);
    try {
      await handleReview();
      await handleJobStatus();
      await fetchData();
      await noficationFunctionality();
      setShow(false);
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  console.log(data);
  return (
    <>
      {loading ? (
        <Loader />
      ) : !data ? (
        <>
          <LoggedHeader />
          <img src={NoData} alt="No data found" />
        </>
      ) : (
        <>
          {" "}
          <LoggedHeader />
          {/* <div className="message">
            <Link to="/message">
              <MdMessage />
            </Link>
          </div> */}
          <div className="bg-second py-5">
            <div className="container">
              <div className="row gy-4 gx-lg-2 management">
                <div className="col-lg-6">
                  <div className="d-flex flex-column gap-4 align-items-start">
                    <div className="d-flex flex-row gap-2 align-items-center">
                      <div className="d-flex flex-column align-items-start gap-1">
                        <h3 className="mb-0">{data?.title || "Job Title"}</h3>
                        <h6>
                          Date Posted:
                          {data?.createdAt
                            ? new Date(data.createdAt).toLocaleDateString(
                                "en-AU",
                                {
                                  timeZone: "Australia/Sydney",
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )
                            : "No date provided"}
                        </h6>
                        <h6>
                          Date Required:
                          {data?.date
                            ? new Date(data.date).toLocaleDateString("en-AU", {
                                timeZone: "Australia/Sydney",
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })
                            : "No date provided"}
                        </h6>
                      </div>
                    </div>
                    <div className="d-flex flex-row gap-2 align-items-center flex-wrap">
                      {data?.businessType?.map((tag, index) => (
                        <Chip key={index} label={tag} variant="outlined" />
                      ))}
                    </div>
                    <div className="mt-4">
                      <h3>Uploaded Document</h3>
                      <div className="row g-2 gy-3">
                        {data?.documents?.length > 0 ? (
                          data?.documents?.map((doc, index) => (
                            <div
                              className="col-lg-4 position-relative"
                              key={index}
                            >
                              <a className="" href={doc} target="_blank">
                                <img
                                  src={doc}
                                  alt="document"
                                  className="w-100 h-100 px-1"
                                  style={{
                                    maxHeight: "200px",
                                    objectFit: "cover",
                                  }}
                                />
                              </a>
                            </div>
                          ))
                        ) : (
                          <p>No document uploaded</p>
                        )}
                      </div>
                    </div>
                    {/* <ul className="list-unstyled d-flex flex-column gap-2">
                  {data.requirements?.map((req, index) => (
                    <li key={index}>
                      <span>
                        <FaRegCheckCircle />
                      </span>
                      {req}
                    </li>
                  ))}
                </ul> */}
                  </div>
                </div>
                <div className="col-lg-6">
                  <h3 className="fw-bold">Job Description</h3>
                  <p>{data?.requirements || "No description available"}</p>
                  {/* <h6>Scheduled for</h6>
                  <h6>
                    {data?.date
                      ? new Date(data.date).toLocaleTimeString("en-AU", {
                          timeZone: "Australia/Sydney",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "No date provided"}
                  </h6> */}
                  <hr />
                  <div className="d-flex flex-column gap-3 align-items-start more-info">
                    <div className="d-flex flex-row gap-4 align-items-start w-100">
                      <BiCoinStack />
                      <div className="d-flex flex-column gap-2 align-items-start">
                        <span className="text-muted">Estimated budget</span>
                        <b className="fw-medium fs-5">
                          ${data?.estimatedBudget || "N/A"}
                        </b>
                      </div>
                    </div>
                    <div className="row gy-4 gx-4 w-100">
                      <div className="col-2">
                        <PiBag />
                      </div>
                      <div className="col-10 ps-lg-4 ps-5">
                        <div className="d-flex flex-column gap-2 align-items-start">
                          <span className="text-muted">Location</span>
                          <b className="fw-medium fs-5">
                            {hunterToken
                              ? data?.jobLocation?.jobAddressLine
                              : filterAddressPatterns(
                                  data?.jobLocation?.jobAddressLine
                                )}
                          </b>
                        </div>
                      </div>
                    </div>
                    {localStorage.getItem("ProviderToken") && isHistoryType && (
                      <div className="row gy-4 w-100">
                        <div className="col-lg-12">
                          {data?.jobStatus !== "Completed" &&
                            (data?.completionNotified === false ? (
                              <Button
                                variant="contained"
                                onClick={() =>
                                  handleJobCompletNotify({
                                    id: id,
                                    receiverId: data?.user,
                                    title: data?.title,
                                  })
                                }
                                className="custom-green bg-green-custom rounded-5 py-3 w-100"
                              >
                                Mark As Completed
                              </Button>
                            ) : (
                              <Button
                                variant="outlined"
                                color="success"
                                className="custom-green h-100 py-3 bg-green-custom rounded-5 text-light border-light w-100"
                                disabled
                              >
                                Already Notified
                              </Button>
                            ))}
                          {}
                        </div>
                      </div>
                    )}

                    {receiverId && localStorage.getItem("hunterToken") && (
                      <>
                        <div className="row gy-4 gx-4 w-100 align-items-center">
                          <div className="col-2">
                            <CiUser />
                          </div>
                          <div className="col-10 ps-lg-4 ps-5">
                            <div className="d-flex flex-column align-items-start gap-2">
                              <span className="text-muted">
                                You have Assigned job to
                              </span>
                              <div className="d-flex flex-row align-items-start gap-3 ">
                                <b className="fw-medium fs-5">
                                  {providerName.toLocaleUpperCase()}
                                </b>
                                <button
                                  className="btn btn-info text-light"
                                  onClick={() => {
                                    navigate(`/service-profile/${receiverId}`);
                                  }}
                                >
                                  View Profile
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    {receiverId && localStorage.getItem("hunterToken") && (
                      <Button
                        variant="contained"
                        color="success"
                        className="custom-green py-3 w-100 rounded-5 bg-green-custom"
                        onClick={handleShow}
                        disabled={data.jobStatus === "Completed"}
                      >
                        {data?.jobStatus === "Completed"
                          ? "This job has been Completed"
                          : " Mark As Complete"}
                      </Button>
                    )}
                  </div>
                  <hr />
                  {/* <div className="d-flex flex-row gap-2 flex-wrap flex-lg-nowrap gap-lg-4 align-items-center w-lg-75">
                <div className="card outline-card">
                  <div className="card-body d-flex flex-row gap-2 align-items-center">
                    <span>{data.rating || "0.0"}</span>
                    <IoIosStar />
                  </div>
                </div>
                <div className="card green-card">
                  <div className="card-body d-flex flex-row gap-2 align-items-center">
                    {data.review || "No reviews available"}
                  </div>
                </div>
              </div> */}
                  {/* <Modal show={show} onHide={handleClose} centered>
                <Modal.Header className="border-0" closeButton>
                  <Modal.Title>Add Your Review</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="d-flex flex-column align-items-center justify-content-center gap-2">
                    <Rating
                      name="simple-controlled"
                      value={value}
                      className="fs-2"
                      onChange={(event, newValue) => {
                        setValue(newValue);
                      }}
                    />
                    <Form.Control
                      as="textarea"
                      placeholder="Leave a comment here"
                      style={{ height: "150px" }}
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      color="success"
                      className="custom-green py-3 w-100 rounded-5 bg-green-custom"
                      onClick={doubleFunction}
                    >
                      Submit
                    </Button>
                  </div>
                </Modal.Body>
              </Modal> */}

                  <Modal show={show} onHide={handleClose} centered>
                    <Modal.Header className="border-0" closeButton>
                      <Modal.Title>Add Your Review</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="d-flex flex-column align-items-center justify-content-center gap-2">
                        <Rating
                          name="simple-controlled"
                          value={value}
                          className="fs-2"
                          onChange={(event, newValue) => {
                            setValue(newValue);
                          }}
                        />
                        <Form.Control
                          as="textarea"
                          placeholder="Leave a comment here"
                          style={{ height: "150px" }}
                          value={review}
                          onChange={(e) => setReview(e.target.value)}
                        />
                        <Button
                          variant="contained"
                          color="success"
                          className="custom-green py-3 w-100 rounded-5 bg-green-custom"
                          onClick={() => {
                            if (!review.trim()) {
                              // If the review field is empty, show an alert message
                              alert(
                                "Please fill in the comment field before submitting!"
                              );
                            } else {
                              doubleFunction();
                            }
                          }}
                        >
                          Submit
                        </Button>
                      </div>
                    </Modal.Body>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
