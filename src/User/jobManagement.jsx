import React, { useState, useEffect } from "react";
import LoggedHeader from "./Auth/component/loggedNavbar";
import { IoIosSearch } from "react-icons/io";
import Form from "react-bootstrap/Form";
import { MdMessage, MdOutlineSupportAgent } from "react-icons/md";
import { BiCoinStack } from "react-icons/bi";
import { PiBag } from "react-icons/pi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Toaster from "../Toaster";
import Loader from "../Loader";
import noData from "../assets/no_data_found.gif";
import { IoEyeSharp, IoTrashOutline } from "react-icons/io5";
import Table from "react-bootstrap/Table";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Pagination from "react-bootstrap/Pagination";
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
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });

  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const provider = location.pathname.includes("provider");

  const [jobStatus, setJobStatus] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const ProviderToken = localStorage.getItem("ProviderToken");
  const queryParams = new URLSearchParams(location.search);
  const hunterToken = localStorage.getItem("hunterToken");
  let currentPage = parseInt(queryParams.get("page")) || 1;
  const navigate = useNavigate();
  // Auto-update URL if `page` is missing
  useEffect(() => {
    if (!queryParams.get("page")) {
      queryParams.set("page", "1");
      navigate(`?${queryParams.toString()}`, { replace: true });
    }
  }, [location.search, navigate]);

  const handleChange = (event) => {
    setJobStatus(event.target.value);
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://3.223.253.106:7777/api/jobpost/getJobPostByUserId?page=${currentPage}`,
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

        setData(res.data.data);
        setFilteredData(res.data.data);
        setSearch("");
        setTotalPages(res.data.pagination.totalPages);
        if (res.data.data.length === 0) {
          setToastProps({
            message: "No jobs posted yet",
            type: "info",
            toastKey: Date.now(),
          });
          return;
        }
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

  const fetchJobsHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://3.223.253.106:7777/api/jobpost/myAcceptedJobs?page=${currentPage}`,
        {
          headers: {
            Authorization: `Bearer ${ProviderToken || hunterToken}`,
          },
        }
      );
      console.log(res);
      if (res.status === 200) {
        setData(res?.data?.jobs);
        setFilteredData(res?.data?.jobs);
        setSearch("");
        setTotalPages(res.data.jobs.totalPages);
        if (res.data.jobs.length === 0) {
          setToastProps({
            message: "No jobs history yet",
            type: "info",
            toastKey: Date.now(),
          });
          return;
        }
        setToastProps({
          message: res.data.message,
          type: "success",
          toastKey: Date.now(),
        });
        console.log("res.data", res.data);
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
    if (location.pathname.includes("job-history")) {
      fetchJobsHistory();
      return;
    }
    fetchJobs(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    queryParams.set("page", page.toString());
    navigate(`?${queryParams.toString()}`);
  };

  console.log("filteredData", data);
  return (
    <>
      {loading === true ? (
        <Loader />
      ) : (
        <>
          <LoggedHeader />
          <Link
            to={`/${hunterToken ? "support/chat/1" : "provider/admin/chat/"}`}
          >
            <div className="admin-message">
              <MdOutlineSupportAgent />
            </div>
          </Link>
          <div className="message">
            <Link to={`${hunterToken ? "/message" : "/provider/message"}`}>
              <MdMessage />
            </Link>
          </div>
          <div className="bg-second py-3">
            <div className="container">
              <div className="d-flex justify-content-lg-between flex-column flex-lg-row gap-4">
                <div className="position-relative icon ">
                  <IoIosSearch className="mt-1" />
                  <Form.Control
                    placeholder="search for Name"
                    className="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                {!location.pathname.includes("job-history") && (
                  <FormControl className="sort-input" sx={{ m: 1 }}>
                    <InputLabel id="radius-select-label">Job status</InputLabel>
                    <Select
                      labelId="business-type-select-label"
                      id="business-type-select"
                      multiple
                      value={jobStatus}
                      onChange={handleChange}
                      input={<OutlinedInput label="Select Business Type" />}
                      renderValue={(selected) => selected.join(", ")}
                      MenuProps={MenuProps}
                      placeholder="Select Business Type"
                    >
                      {Array.from(
                        new Set(data.flatMap((provider) => provider.jobStatus))
                      ).map((type, index) => (
                        <MenuItem key={index} value={type}>
                          <Checkbox checked={jobStatus.includes(type)} />
                          <ListItemText primary={type} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
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
                <div className="card shadow border-0 rounded-5 p-lg-3">
                  <div className="card-body">
                    <Table responsive hover>
                      <thead className="">
                        <tr className="">
                          <th className="green-card-important py-3 text-center">
                            #
                          </th>
                          <th className="green-card-important py-3 text-center">
                            Title
                          </th>
                          <th className="green-card-important py-3 text-center">
                            Price
                          </th>
                          <th className="green-card-important py-3 text-center">
                            Address
                          </th>
                          <th className="green-card-important py-3 text-center">
                            Date Posted
                          </th>
                          <th className="green-card-important py-3 text-center">
                            job Status
                          </th>
                          <th className="green-card-important py-3 text-center">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData?.map((provider, index) => (
                          <tr key={provider._id} className="text-center">
                            <td>{index + 1}</td>
                            <td> {provider.title}</td>
                            <td className={`text-start flex-wrap`}>
                              ${provider.estimatedBudget}
                            </td>

                            <td>{provider?.jobLocation?.jobAddressLine}</td>
                            <td>
                              {" "}
                              {new Date(provider?.date).toLocaleDateString()}
                            </td>
                            <td>{provider.jobStatus}</td>
                            <td className="d-grid">
                              <span>
                                <Link to={`/job-detail/${provider._id}`}>
                                  <IoEyeSharp height={10} />
                                </Link>
                                {!location.pathname.includes("job-history") && (
                                  <IoTrashOutline
                                    onClick={() =>
                                      handleJobDelete(provider._id)
                                    }
                                    style={{ cursor: "pointer" }}
                                    height={10}
                                  />
                                )}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <Pagination className="justify-content-center pagination-custom">
                      {[...Array(totalPages)].map((_, index) => (
                        <Pagination.Item
                          key={index + 1}
                          active={index + 1 === currentPage}
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </Pagination.Item>
                      ))}
                    </Pagination>
                  </div>
                </div>
                {/* {data.map((item) => (
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
                ))} */}
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
