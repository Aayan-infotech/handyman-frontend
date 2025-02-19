import react, { useState, useEffect } from "react";
import LoggedHeader from "./Auth/component/loggedNavbar";
import { MdMessage, MdEmail, MdCall } from "react-icons/md";
import company1 from "./assets/logo/companyLogo.png";
import Chip from "@mui/material/Chip";
import { FaRegCheckCircle } from "react-icons/fa";
import { BiCoinStack } from "react-icons/bi";
import { PiBag } from "react-icons/pi";
import { IoIosStar } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
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
  const [toastProps, setToastProps] = useState({ message: "", type: "" });
  const handleClose = () => setShow(false);
  const guestCondition = localStorage.getItem("Guest") === "true";
  const { id } = useParams();
  const handleJobStatus = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `http://44.196.64.110:7777/api/jobpost/changeJobStatus/${id}`,
        {
          jobStatus: "Accepted",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ProviderToken")}`,
          },
        }
      );
      if (response.status === 200) {
        setShow(true);
        setToastProps({ message: response.message, type: "success" });
        setLoading(false);
      }
    } catch (error) {
      setToastProps({ message: error, type: "error" });
      setLoading(false);
    }
  };
  const handleJob = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://44.196.64.110:7777/api/jobpost/jobpost-details/${id}`,

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

  useEffect(() => {
    if (guestCondition) {
      handleGuestJob();
    } else handleJob();
  }, [id]);

  console.log(data);

  return (
    <>
      {loading && <Loader />}
      <div className="">
        <LoggedHeader />
        <div className="message">
          <Link to="/message">
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
                      <div className="d-flex flex-row gap-4 align-items-center pb-3 pt-2">
                        <div className="contact">
                          <Link to="/provider/home">
                            <MdMessage />
                          </Link>
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
                      </div>
                      <div className="d-flex flex-row gap-2 align-items-center flex-wrap">
                        <Chip label="Fulltime" variant="outlined" />
                        <Chip label="On-site working" variant="outlined" />
                        <Chip label="Hourly" variant="outlined" />
                      </div>
                      <ul className="list-unstyled d-flex flex-column gap-2">
                        <li>
                          <FaRegCheckCircle /> Sed ut perspiciatis unde omnis
                        </li>
                        <li>
                          <FaRegCheckCircle /> Doloremque laudantium
                        </li>
                        <li>
                          <FaRegCheckCircle /> Ipsa quae ab illo inventore
                        </li>
                        <li>
                          <FaRegCheckCircle /> Architecto beatae vitae dicta
                        </li>
                        <li>
                          <FaRegCheckCircle /> Sunt explicabo
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <h3 className="fw-bold">Job Description</h3>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                    <hr />
                    <div className="d-flex flex-column gap-3 align-items-start more-info">
                      <div className="row gy-4 w-100">
                        <div className="col-lg-2">
                          <BiCoinStack />
                        </div>
                        <div className="col-lg-10">
                          <div className="d-flex flex-column gap-2 align-items-start">
                            <span className="text-muted">Estimated budget</span>
                            <b className="fw-medium fs-5">
                              ${data?.estimatedBudget}
                            </b>
                          </div>
                        </div>
                      </div>
                      <div className="row gy-4 w-100">
                        <div className="col-lg-2">
                          <PiBag />
                        </div>
                        <div className="col-lg-10">
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
                      <div className="d-flex flex-row gap-2 flex-wrap flex-lg-nowrap gap-lg-4 align-items-center w-75">
                        <Button
                          variant="contained"
                          className="custom-green bg-red-outline rounded-5 py-3 w-50"
                        >
                          Reject
                        </Button>
                        <Button
                          variant="contained"
                          onClick={handleJobStatus}
                          className="custom-green bg-green-custom rounded-5 py-3 w-100"
                        >
                          Accept
                        </Button>
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
          <Link to="/provider/chat/1234" className="mx-auto w-75">
            <Button
              variant="contained"
              className="custom-green bg-green-custom rounded-5 py-3 w-100 mb-4"
            >
              Message
            </Button>
          </Link>
        </Modal>
      </div>

      <Toaster message={toastProps.message} type={toastProps.type} />
    </>
  );
}
