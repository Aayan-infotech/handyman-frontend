import React, { useState, useEffect } from "react";
import LoggedHeader from "./Auth/component/loggedNavbar";
import { MdMessage, MdOutlineSupportAgent } from "react-icons/md";
import Chip from "@mui/material/Chip";
import { FaRegCheckCircle } from "react-icons/fa";
import { BiCoinStack } from "react-icons/bi";
import { PiBag } from "react-icons/pi";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { IoIosStar } from "react-icons/io";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { CiUser } from "react-icons/ci";
import Loader from "../Loader";
import noData from "../assets/no_data_found.gif";
import { useDispatch, useSelector } from "react-redux";
import {
  completedJobNotification,
  reviewJobNotification,
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

  const handleProviderJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://3.223.253.106:7777/api/jobpost/jobpost-details/${id}`,
        {
          headers: {
            Authorization: `Bearer ${ProviderToken || hunterToken}`,
          },
        }
      );
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

  // const noficationFunctionality = async () => {
  //   setLoading(true);
  //   try {
  //     const response = dispatch(
  //       completedJobNotification({
  //         receiverId: receiverId,
  //       })
  //     );
  //     if (completedJobNotification.fulfilled.match(response)) {
  //       setLoading(false);
  //     }
  //   } catch (error) {
  //     console.error("Error Getting Nearby Jobs:", error);
  //     setLoading(false);
  //   }
  // };

  const noficationFunctionality = async () => {
    setLoading(true);
    try {
      const response1 = await dispatch(
        completedJobNotification({ receiverId })
      );

      const response2 = await dispatch(reviewJobNotification({ receiverId }));

      if (
        completedJobNotification.fulfilled.match(response1) &&
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
      const response = await axios.post(
        "http://3.223.253.106:7777/api/match/getMatchedData",
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
    try {
      const reponse = await axios.post(
        `http://3.223.253.106:7777/api/rating/giveRating/${receiverId}`,
        {
          rating: value,
          review,
        },
        {
          headers: {
            Authorization: `Bearer ${ProviderToken || hunterToken}`,
          },
        }
      );
      console.log(reponse);
      setShow(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleJobStatus = async () => {
    try {
      const reponse = await axios.post(
        `http://3.223.253.106:7777/api/jobPost/changeJobStatus/${id}`,
        {
          jobStatus: " Completed",
          providerId: receiverId,
        },
        {
          headers: {
            Authorization: `Bearer ${ProviderToken || hunterToken}`,
          },
        }
      );
      console.log(reponse);
      setShow(false);
    } catch (error) {
      console.log(error);
    }
  };

  const doubleFunction = () => {
    handleReview();
    handleJobStatus();
    fetchData();
    noficationFunctionality();
    handleProviderJobs();
  };

  console.log("user", user);

  const fetchData = async () => {
    setLoading(true);
    await handleProviderJobs();
    if (user && receiverId) {
      await handleProvider();
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, [id, user, receiverId]);

  const filterAddressPatterns = (address) => {
    if (!address) return address;

    // Regular expression to match patterns like C-84, D-19, etc.
    const pattern = /^(?:[A-Za-z][\s-]?\d+|\d+\/\d+)[\s,]*/;

    return address.replace(pattern, "").trim();
  };

  if (loading) return <Loader />;
  if (!data) return <noData />;

  console.log("data", data);

  return (
    <>
      <LoggedHeader />
      <Link to="/support/chat/1">
        <div className="admin-message">
          <MdOutlineSupportAgent />
        </div>
      </Link>
      <div className="message">
        <Link to="/message">
          <MdMessage />
        </Link>
      </div>
      <div className="bg-second py-5">
        <div className="container">
          <div className="row gy-4 gx-lg-2 management">
            <div className="col-lg-6">
              <div className="d-flex flex-column gap-4 align-items-start">
                <div className="d-flex flex-row gap-2 align-items-center">
                  <div className="d-flex flex-column align-items-start gap-1">
                    <h3 className="mb-0">{data.title || "Job Title"}</h3>
                    <h6>
                      {data.date
                        ? new Date(data.date).toLocaleString("en-US", {
                            timeZone: "UTC",
                          })
                        : "No date provided"}
                    </h6>
                  </div>
                </div>
                <div className="d-flex flex-row gap-2 align-items-center flex-wrap">
                  {data.businessType?.map((tag, index) => (
                    <Chip key={index} label={tag} variant="outlined" />
                  ))}
                </div>
                <div className="mt-4">
                  <h3>Uploaded Document</h3>
                  <div className="row g-2 gy-3">
                    {data.documents ? (
                      data.documents.map((doc, index) => (
                        <div className="col-lg-4" key={index}>
                          <img
                            src={doc}
                            alt="document"
                            className="w-100 h-100 px-1"
                          />
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
            <div className="col-lg-5">
              <h3 className="fw-bold">Job Description</h3>
              <p>{data.requirements || "No description available"}</p>
              <hr />
              <div className="d-flex flex-column gap-3 align-items-start more-info">
                <div className="d-flex flex-row gap-4 align-items-start w-100">
                  <BiCoinStack />
                  <div className="d-flex flex-column gap-2 align-items-start">
                    <span className="text-muted">Estimated budget</span>
                    <b className="fw-medium fs-5">
                      ${data.estimatedBudget || "N/A"}
                    </b>
                  </div>
                </div>
                <div className="row gy-4 gx-4">
                  <div className="col-2">
                    <PiBag />
                  </div>
                  <div className="col-10 ps-lg-4 ps-5">
                    <div className="d-flex flex-column gap-2 align-items-start">
                      <span className="text-muted">Location</span>
                      <b className="fw-medium fs-5">
                        {filterAddressPatterns(
                          data.jobLocation.jobAddressLine
                        ) || "N/A"}
                      </b>
                    </div>
                  </div>
                </div>
                {receiverId && (
                  <>
                    <div className="row gy-4 gx-4 w-100 align-items-center">
                      <div className="col-2">
                        <CiUser />
                      </div>
                      <div className="col-10 ps-lg-4 ps-5">
                        <div className="d-flex flex-column align-items-start">
                          <span className="text-muted">
                            You have Assigned job to
                          </span>
                          <b className="fw-medium fs-5">{providerName}</b>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="contained"
                      color="success"
                      className="custom-green py-3 w-100 rounded-5 bg-green-custom"
                      onClick={handleShow}
                      disabled={data.jobStatus === "Completed"}
                    >
                      {data.jobStatus === "Completed"
                        ? "This job has been Completed"
                        : " Mark As Complete"}
                    </Button>
                  </>
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
  );
}
