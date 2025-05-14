import React, { useState, useEffect } from "react";
import LoggedHeader from "./auth/component/loggedNavbar";
import {
  MdMessage,
  MdEmail,
  MdCall,
  MdOutlineSupportAgent,
} from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
import { Eye } from "lucide-react";

import company1 from "./assets/logo/companyLogo.png";
import Chip from "@mui/material/Chip";
import { FaRegCheckCircle } from "react-icons/fa";
import { BiCoinStack } from "react-icons/bi";
import { PiBag } from "react-icons/pi";
import { IoIosStar } from "react-icons/io";
import { Link, useParams, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Modal from "react-bootstrap/Modal";
import axiosInstance from "../components/axiosInstance";
import Loader from "../Loader";
import Toaster from "../Toaster";
import { useDispatch, useSelector } from "react-redux";
import { getGuestProviderJobId } from "../Slices/providerSlice";
import { acceptJobNotification } from "../Slices/notificationSlice";

export default function JobSpecification() {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });
  const handleClose = () => setShow(false);
  const ProviderToken = localStorage.getItem("ProviderToken");
  const ProviderId = localStorage.getItem("ProviderId");
  const navigate = useNavigate();
  const { id } = useParams();
  // const guestCondition = () => {
  //   const guestVerify = localStorage.getItem("Guest") === "true";
  //   if (guestVerify) {
  //     navigate("/provider/pricing");
  //     return;
  //   }
  // };

  // const guestCondition = localStorage.getItem("Guest") === "true";
  const checkGuestCondition = () => {
    const planType = localStorage.getItem("PlanType");
    const planCondition =
      planType === null || planType === "null" || planType === "";

    if (planCondition) {
      navigate("/provider/pricing");
      return true;
    }
    return false;
  };

  const noficationFunctionality = async () => {
    setLoading(true);
    const businessName = localStorage.getItem("ProviderBusinessName");
    try {
      const response = dispatch(
        acceptJobNotification({
          receiverId: data?.user,
          jobId: id,
          body: `${businessName} is interested in your job ${data?.title}`,
        })
      );
      if (acceptJobNotification.fulfilled.match(response)) {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error Getting Nearby Jobs:", error);
      setLoading(false);
    }
  };

  const handleJob = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/jobpost/jobpost-details/${id}`,

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ProviderToken")}`,
          },
        }
      );

      if (response.status === 500) {
        navigate("/error");
        return;
      }
      if (response.status === 200) {
        setData(response?.data?.data);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      if (error.response?.status === 500) {
        navigate("/error");
      }
    }
  };

  const handleJobStatus = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.put(
        `/jobPost/job/accept/${id}`,
        {
          providerId: ProviderId,
        },
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("hunterToken") ||
              localStorage.getItem("ProviderToken")
            }`,
          },
        }
      );

      if (response.status === 200) {
        // setShow(true);
        // noficationFunctionality();
        handleJob();
        setToastProps({
          message: response.message,
          type: "success",
          toastKey: Date.now(),
        });
        setLoading(false);
      }
      try {
        const response = await axiosInstance.post(
          `/provider/acceptCount/${ProviderId}`
        );
        if (response.status === 200) {
          // setShow(true);
          // noficationFunctionality();
          setToastProps({
            message: response.message,
            type: "success",
            toastKey: Date.now(),
          });
        }
        if (response.status === 400) {
          setToastProps({
            message: response.message,
            type: "error",
            toastKey: Date.now(),
          });
        }
      } catch (error) {
        setToastProps({
          message: error?.response?.data?.message,
          type: "error",
          toastKey: Date.now(),
        });
        setLoading(false);
      }
    } catch (error) {
      setToastProps({
        message: error?.response?.data?.message,
        type: "error",
        toastKey: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGuestJob = async () => {
    setLoading(true);
    try {
      const response = await dispatch(
        getGuestProviderJobId({
          id: id,
        })
      );
      if (getGuestProviderJobId.fulfilled.match(response)) {
        setData(response.payload?.data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error Getting Nearby Jobs:", error);
      setLoading(false);
    }
  };

  const providerIdToMatch = ProviderId;

  const hasAcceptedJob = data?.jobAcceptCount?.some(
    (job) => job.providerId === providerIdToMatch
  );

  const hasCompletedJob = data.jobStatus === "Completed" ? true : false;
  const handleChat = () => {
    navigate(`/provider/chat/${data.user?._id}?jobId=${data?._id}`);
  };

  useEffect(() => {
    const isGuest = localStorage.getItem("Guest") === "true";
    if (isGuest) {
      handleGuestJob();
    } else {
      handleJob();
    }
  }, [id]);

  const filterAddressPatterns = (address) => {
    if (!address) return address;

    // Regular expression to match patterns like C-84, D-19, etc.
    const pattern = /^.*?,\s*/;

    return address.replace(pattern, "").trim();
  };

  return (
    <>
      {loading === true ? (
        <Loader />
      ) : (
        <div className="">
          <LoggedHeader />
          {/* <Link to="/provider/admin/chat/">
            <Tooltip title="Admin chat" placement="left-start">
              <div className="admin-message">
                <MdOutlineSupportAgent />
              </div>
            </Tooltip>
          </Link> */}
          <div className="message">
            <Tooltip title="Message" placement="left-start">
              <Link to="/provider/message">
                <MdMessage />
              </Link>
            </Tooltip>
          </div>
          <div className="bg-second py-5">
            <div className="container">
              <div className="row gy-4 gx-lg-2 management">
                {data && Object.keys(data).length > 0 ? (
                  <>
                    <div className="col-lg-6">
                      <div className="d-flex flex-column gap-4 align-items-start">
                        <div className="d-flex flex-row gap-2 align-items-center">
                          <div className="d-flex flex-column align-items-start gap-1">
                            <h3 className="mb-0">{data?.title}</h3>
                            <h6>
                              Date Poster:
                              {data?.date
                                ? new Date(data.createdAt).toLocaleTimeString(
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
                          </div>
                        </div>
                        {/* <div className="d-flex flex-row gap-4 align-items-center pb-3 pt-2">
                        <div className="contact">
                          <a href="/provider/home">
                            <MdMessage />
                          </a>
                        </div>
                        <div className="contact">
                          <Link to="/provider/home">
                            <MdEmail />
                          </Link>
                        </div>
                        <div className="contact">
                          <a href={`tel:${data?.title}`}>
                            <MdCall />
                          </a>
                        </div>
                      </div> */}
                        <div className="d-flex flex-row gap-2 align-items-center flex-wrap">
                          {data.businessType?.map((item, index) => (
                            <Chip label={item} variant="outlined" key={index} />
                          ))}
                        </div>
                        {data.documents?.length > 0 && (
                          <div className="mt-4">
                            <h3>Uploaded Document</h3>
                            <div className="row g-2 gy-3">
                              {data.documents && data.documents.length > 0 ? (
                                data.documents.map((doc, index) => {
                                  // Handle both string URLs and File objects
                                  const isFileObject =
                                    doc instanceof File || doc instanceof Blob;
                                  const fileUrl = isFileObject
                                    ? URL.createObjectURL(doc)
                                    : doc.url || doc;
                                  const fileName = isFileObject
                                    ? doc.name
                                    : fileUrl.split("/").pop();

                                  // Determine file type
                                  const fileExtension = fileName
                                    .split(".")
                                    .pop()
                                    .toLowerCase();
                                  const isImage = [
                                    "jpg",
                                    "jpeg",
                                    "png",
                                    "webp",
                                    "gif",
                                  ].includes(fileExtension);
                                  const isPDF = fileExtension === "pdf";
                                  const isVideo = [
                                    "mp4",
                                    "webm",
                                    "ogg",
                                  ].includes(fileExtension);

                                  return (
                                    <div className="col-lg-4 mb-3" key={index}>
                                      {isImage ? (
                                        <div className="position-relative">
                                          <a
                                            className=""
                                            href={fileUrl}
                                            target="_blank"
                                          >
                                            <img
                                              src={fileUrl}
                                              alt={fileName}
                                              className="img-fluid w-100"
                                              style={{
                                                height: "150px",
                                                objectFit: "cover",
                                              }}
                                            />
                                          </a>
                                        </div>
                                      ) : isPDF ? (
                                        <iframe
                                          src={fileUrl}
                                          className="w-100"
                                          style={{ height: "150px" }}
                                          title={fileName}
                                        />
                                      ) : isVideo ? (
                                        <video
                                          controls
                                          className="w-100"
                                          style={{ height: "150px" }}
                                        >
                                          <source
                                            src={fileUrl}
                                            type={`video/${fileExtension}`}
                                          />
                                          Your browser does not support the
                                          video tag.
                                        </video>
                                      ) : (
                                        <div
                                          className="document-preview d-flex align-items-center justify-content-center bg-light"
                                          style={{ height: "150px" }}
                                        >
                                          <i className="fas fa-file-alt fa-3x text-secondary"></i>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })
                              ) : (
                                <p>No document uploaded</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <h3 className="fw-bold">Job Description</h3>
                      <p>{data?.requirements}</p>
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
                        <div className="row gy-4 w-100">
                          <div className=" col-3 col-lg-2">
                            <BiCoinStack />
                          </div>
                          <div className="col-9 col-lg-10">
                            <div className="d-flex flex-column gap-2 align-items-start">
                              <span className="text-muted">
                                Estimated budget
                              </span>
                              <b className="fw-medium fs-5">
                                ${data?.estimatedBudget || "00"}
                              </b>
                            </div>
                          </div>
                        </div>
                        <div className="row gy-4 w-100">
                          <div className=" col-3 col-lg-2">
                            <PiBag />
                          </div>
                          <div className="col-9 col-lg-10">
                            <div className="d-flex flex-column gap-2 align-items-start">
                              <span className="text-muted">Location</span>
                              <b className="fw-medium fs-5">
                                {filterAddressPatterns(
                                  data?.jobLocation?.jobAddressLine
                                ) || "Location not available"}
                              </b>
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr />
                      {hasCompletedJob === false ? (
                        <div className="d-flex flex-row gap-2 flex-wrap flex-lg-nowrap gap-lg-2 align-items-center w-100">
                          {/* <Button
                          variant="contained"
                          className="custom-green bg-red-outline rounded-5 py-3 w-50"
                        >
                          Reject
                        </Button> */}

                          <Button
                            variant="contained"
                            onClick={() => {
                              if (checkGuestCondition()) return;
                              handleJobStatus();
                            }}
                            disabled={hasAcceptedJob}
                            className="custom-green bg-green-custom rounded-5 py-3 w-100"
                          >
                            {hasAcceptedJob
                              ? "You have accepted to quote this job"
                              : "Quote"}
                          </Button>

                          {hasAcceptedJob && (
                            <Button
                              variant="contained"
                              onClick={handleChat}
                              className="custom-green bg-green-custom rounded-5 py-3 w-100"
                              style={{ maxWidth: "160px" }}
                            >
                              Quick Message
                            </Button>
                          )}
                        </div>
                      ) : null}
                      {hasCompletedJob === true ? (
                        <Button
                          variant="contained"
                          disabled={hasCompletedJob}
                          className="custom-green bg-green-custom rounded-5 py-3 w-100"
                        >
                          You have completed this Job
                        </Button>
                      ) : null}
                    </div>
                  </>
                ) : (
                  <p>No job details found.</p>
                )}
              </div>
            </div>
          </div>

          <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton className="border-0">
              <Modal.Title>Job Request</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h3 className="text-center">
                Job Request <br /> Accepted
              </h3>
            </Modal.Body>
            {/* <Link to="/provider/chat/1234" className=""> */}
            <div className="mx-auto w-75">
              <Button
                variant="contained"
                className="custom-green bg-green-custom rounded-5 py-3 w-100 mb-4"
                onClick={handleChat}
              >
                Message to {data?.user?.name}
              </Button>
            </div>

            {/* </Link> */}
          </Modal>
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
