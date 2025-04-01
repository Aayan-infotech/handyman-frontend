import React, { useState, useEffect } from "react";
import LoggedHeader from "./auth/component/loggedNavbar";
import {
  MdMessage,
  MdEmail,
  MdCall,
  MdOutlineSupportAgent,
} from "react-icons/md";
import company1 from "./assets/logo/companyLogo.png";
import Chip from "@mui/material/Chip";
import { FaRegCheckCircle } from "react-icons/fa";
import { BiCoinStack } from "react-icons/bi";
import { PiBag } from "react-icons/pi";
import { IoIosStar } from "react-icons/io";
import { Link, useParams, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import Loader from "../Loader";
import Toaster from "../Toaster";
import { useDispatch, useSelector } from "react-redux";
import { getGuestProviderJobId } from "../Slices/providerSlice";

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
  const guestCondition = localStorage.getItem("Guest") === "true";

  const handleJobStatus = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `http://3.223.253.106:7777/api/jobPost/job/accept/${id}`,
        {
          providerId: ProviderId,
        }
      );

      if (response.status === 200) {
        setShow(true);
        setToastProps({
          message: response.message,
          type: "success",
          toastKey: Date.now(),
        });
        setLoading(false);
      }
      try {
        const response = await axios.post(
          `http://3.223.253.106:7777/api/provider/acceptCount/${ProviderId}`
        );
        if (response.status === 200) {
          setShow(true);
          setToastProps({
            message: response.message,
            type: "success",
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
  const handleJob = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://3.223.253.106:7777/api/jobpost/jobpost-details/${id}`,

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ProviderToken")}`,
          },
        }
      );
      console.log("data", response?.data?.data);
      if (response.status === 200) {
        setData(response?.data?.data);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
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

  const handleChat = () => {
    navigate(`/provider/chat/${data.user}?jobId=${data?._id}`);
  };

  useEffect(() => {
    if (localStorage.getItem("Guest") === "true") {
      handleGuestJob();
    } else handleJob();
  }, [id]);

  console.log(data);

  return (
    <>
      {loading && <Loader />}
      <div className="">
        <LoggedHeader />
        <Link to="/provider/admin/chat/">
          <div className="admin-message">
            <MdOutlineSupportAgent />
          </div>
        </Link>
        <div className="message">
          <Link to="/provider/message">
            <MdMessage />
          </Link>
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
                          <h6>24/01/24</h6>
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
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <h3 className="fw-bold">Job Description</h3>
                    <p>{data?.requirements}</p>
                    <hr />
                    <div className="d-flex flex-column gap-3 align-items-start more-info">
                      <div className="row gy-4 w-100">
                        <div className=" col-3 col-lg-2">
                          <BiCoinStack />
                        </div>
                        <div className="col-9 col-lg-10">
                          <div className="d-flex flex-column gap-2 align-items-start">
                            <span className="text-muted">Estimated budget</span>
                            <b className="fw-medium fs-5">
                              ${data?.estimatedBudget}
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
                              {data?.jobLocation?.jobAddressLine}
                            </b>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr />
                    {!guestCondition ? (
                      <div className="d-flex flex-row gap-2 flex-wrap flex-lg-nowrap gap-lg-4 align-items-center w-100">
                        {/* <Button
                          variant="contained"
                          className="custom-green bg-red-outline rounded-5 py-3 w-50"
                        >
                          Reject
                        </Button> */}
                        <Button
                          variant="contained"
                          onClick={handleJobStatus}
                          disabled={hasAcceptedJob}
                          className="custom-green bg-green-custom rounded-5 py-3 w-100"
                        >
                          {hasAcceptedJob
                            ? "You have accept this job"
                            : "Accept"}
                        </Button>
                        {hasAcceptedJob && (
                          <Button
                            variant="contained"
                            onClick={() => setShow(true)}
                            className="custom-green bg-green-custom rounded-5 py-3 w-100"
                          >
                            Quick Message
                          </Button>
                        )}
                      </div>
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
              Message
            </Button>
          </div>

          {/* </Link> */}
        </Modal>
      </div>

      <Toaster
        message={toastProps.message}
        type={toastProps.type}
        toastKey={toastProps.toastKey}
      />
    </>
  );
}
