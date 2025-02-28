import React, { useState, useEffect } from "react";
import LoggedHeader from "./Auth/component/loggedNavbar";
import { IoIosSearch } from "react-icons/io";
import Form from "react-bootstrap/Form";
import { MdMessage, MdOutlineSupportAgent } from "react-icons/md";

import { BiCoinStack } from "react-icons/bi";
import { PiBag } from "react-icons/pi";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import Toaster from "../Toaster";
import Loader from "../Loader";
import noData from "../assets/no_data_found.gif";

export default function JobManagement() {
  const [data, setData] = useState([]);
  const [toastProps, setToastProps] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const provider = location.pathname.includes("provider");
  console.log(provider);
  const hunterToken = localStorage.getItem("hunterToken");
  const ProviderToken = localStorage.getItem("ProviderToken");

  const handleProviderJobs = async () => {
    setLoading(true);
    console.log(provider);
    try {
      const res = await axios.get(
        `http://54.236.98.193:7777/api/jobpost/getJobPostByUserId`,
        {
          headers: {
            Authorization: `Bearer ${ProviderToken || hunterToken}`,
          },
        }
      );
      if (res.status === 200) {
        setToastProps({ message: res.data.message, type: "success" });
        setData(res.data.data);
        setLoading(false);
      }
    } catch (error) {
      setToastProps({ message: error.message, type: "error" });
      setLoading(false);
    }
  };
  console.log(data);
  useEffect(() => {
    handleProviderJobs();
  }, [location]);
  return (
    <>
      {loading && <Loader />}
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
      <div className="bg-second py-3">
        <div className="container">
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
            {data.length === 0 && (
              <div className="d-flex justify-content-center align-items-center flex-column gap-3">
                <img src={noData} alt="image" className="w-nodata"/>
              </div>
            )}
            {data?.map((item) => (
              <div className="col-lg-12" key={item._id}>
                <Link to={`/job-detail/${item._id}`}>
                  <div className="card border-0 rounded-3 px-4">
                    <div className="card-body">
                      <div className="row gy-4 align-items-center">
                        <div className="col-lg-2">
                          <div className="d-flex flex-row gap-3 align-items-center">
                            <div className="d-flex flex-column align-items-start gap-1">
                              <h3 className="mb-0">{item?.title}</h3>
                              <h6>
                                {new Date(item?.date).toLocaleDateString()}
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-8">
                          <div className="d-flex flex-column flex-lg-row gap-2 gap-lg-4 align-items-lg-center">
                            <div className="d-flex flex-row gap-2 align-items-center">
                              <BiCoinStack />
                              <h5 className="mb-0">${item.estimatedBudget}</h5>
                            </div>
                            <div className="d-flex flex-row gap-2 align-items-center">
                              <PiBag />
                              <h5 className="mb-0">
                                {item?.jobLocation?.jobAddressLine}
                              </h5>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-2">
                          <div className="">
                            <h5 className="mb-0 text-success text-center text-lg-start">
                              {item.jobStatus}
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Toaster message={toastProps.message} type={toastProps.type} />
    </>
  );
}
