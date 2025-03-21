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
import { IoEyeSharp, IoTrashOutline } from "react-icons/io5";
import Table from "react-bootstrap/Table";
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
export default function JobManagement() {
  const [data, setData] = useState([]);
  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const provider = location.pathname.includes("provider");

  const hunterToken = localStorage.getItem("hunterToken");
  const ProviderToken = localStorage.getItem("ProviderToken");

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://3.223.253.106:7777/api/jobpost/getJobPostByUserId",
        {
          headers: {
            Authorization: `Bearer ${ProviderToken || hunterToken}`,
          },
        }
      );
      if (res.status === 200) {
        const filteredData = res.data.data.filter(
          (job) => job.jobStatus !== "Deleted"
        );

        setData(filteredData);
        setToastProps({
          message: res.data.message,
          type: "success",
          toastKey: Date.now(),
        });
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
    fetchJobs();
  }, []);

  const handleJobDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://3.223.253.106:7777/api/jobPost/${id}`, {
        headers: { Authorization: `Bearer ${hunterToken}` },
      });

      setToastProps({
        message: "Job deleted successfully!",
        type: "success",
        toastKey: Date.now(),
      });
      fetchJobs();
    } catch (error) {
      setToastProps({
        message: "Failed to delete job",
        type: "error",
        toastKey: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
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
                    <img
                      src={noData}
                      alt="No Data Found"
                      className="w-nodata"
                    />
                  </div>
                )}
                {data.map((item) => (
                  <div className="col-lg-12" key={item._id}>
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
                          <div className="col-lg-7">
                            <div className="d-flex flex-column flex-lg-row gap-2 align-items-lg-center justify-content-lg-between">
                              <div className="d-flex flex-row gap-2 align-items-center">
                                <BiCoinStack />
                                <h5 className="mb-0">
                                  ${item.estimatedBudget}
                                </h5>
                              </div>
                              <div className="d-flex flex-row gap-2 align-items-center">
                                <PiBag />
                                <h5 className="mb-0">
                                  {item?.jobLocation?.jobAddressLine}
                                </h5>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-3 details">
                            <div className="d-flex flex-row align-items-center gap-3 justify-content-lg-end">
                              <h5 className="mb-0 text-success text-center text-lg-start">
                                {item.jobStatus}
                              </h5>
                              <div className="d-flex flex-row gap-1 align-items-center">
                                <Link to={`/job-detail/${item._id}`}>
                                  <IoEyeSharp height={10} />
                                </Link>
                                <IoTrashOutline
                                  onClick={() => handleJobDelete(item._id)}
                                  style={{ cursor: "pointer" }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
      <Toaster
        message={toastProps.message}
        type={toastProps.type}
        toastKey={toastProps.toastKey}
      />
    </>
  );
}
