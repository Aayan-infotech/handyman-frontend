import React, { useState, useEffect } from "react";
import LoggedHeader from "./Auth/component/loggedNavbar";
import { MdMessage, MdOutlineSupportAgent } from "react-icons/md";
import Chip from "@mui/material/Chip";
import { FaRegCheckCircle } from "react-icons/fa";
import { BiCoinStack } from "react-icons/bi";
import { PiBag } from "react-icons/pi";
import { IoIosStar } from "react-icons/io";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader";
import noData from "../assets/no_data_found.gif";
export default function JobDetail() {
  const [data, setData] = useState(null);
  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const hunterToken = localStorage.getItem("hunterToken");
  const ProviderToken = localStorage.getItem("ProviderToken");
  const { id } = useParams();

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
        setData(res.data.data); // Ensure `data` is not an array
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

  useEffect(() => {
    handleProviderJobs();
  }, [id]);

  if (loading) return <Loader />;
  if (!data) return <noData />;

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
                        {data.jobLocation.jobAddressLine || "N/A"}
                      </b>
                    </div>
                  </div>
                </div>
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
