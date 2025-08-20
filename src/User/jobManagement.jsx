import React, { useState, useEffect } from "react";
import LoggedHeader from "./Auth/component/loggedNavbar";
import { IoIosSearch } from "react-icons/io";
import Form from "react-bootstrap/Form";
import { MdMessage, MdOutlineSupportAgent } from "react-icons/md";
import { BiCoinStack } from "react-icons/bi";
import { PiBag } from "react-icons/pi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Toaster from "../Toaster";
import Loader from "../Loader";
import Tooltip from "@mui/material/Tooltip";

import noData from "../assets/no_data_found.gif";
import { IoEyeSharp, IoTrashOutline, IoPencil } from "react-icons/io5";
import Table from "react-bootstrap/Table";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import axiosInstance from "../components/axiosInstance";
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

  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });

  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const provider = location.pathname.includes("provider");
  const [totalJobs, setTotalJobs] = useState("");
  const [jobStatus, setJobStatus] = useState("");
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

  const [search, setSearch] = useState(queryParams.get("search") || "");

  const handleChange = (event) => {
    const newStatus = event.target.value;

    // If clicking the same status that's already selected, deselect it
    if (jobStatus === newStatus) {
      setJobStatus("");
      // Update URL - remove jobStatus filter
      const queryParams = new URLSearchParams(location.search);
      queryParams.delete("jobStatus");
      queryParams.set("page", "1");
      navigate(`?${queryParams.toString()}`);
    } else {
      setJobStatus(newStatus);
      // Update URL with new job status
      const queryParams = new URLSearchParams(location.search);
      queryParams.set("jobStatus", newStatus);
      queryParams.set("page", "1");
      navigate(`?${queryParams.toString()}`);
    }
  };

  const fetchJobs = async (
    page = currentPage,
    searchTerm = queryParams.get("search") || ""
  ) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/jobpost/getJobPostByUserId?search=${searchTerm}&page=${page}&jobStatus=${jobStatus}`,
        {
          headers: {
            Authorization: `Bearer ${ProviderToken || hunterToken}`,
          },
        }
      );
      if (res.status === 200) {
        const filteredData = res.data.data;

        setData(res.data.data);
        setFilteredData(filteredData);
        setSearch("");
        setTotalPages(res.data.pagination.totalPages);
        setTotalJobs(res.data.pagination.totalJobs);

        // if (res.data.data.length === 0) {
        //   setToastProps({
        //     message: "No jobs posted yet",
        //     type: "info",
        //     toastKey: Date.now(),
        //   });
        //   return;
        // }
        // setToastProps({
        //   message: res.data.message,
        //   type: "success",
        //   toastKey: Date.now(),
        // });
      }
    } catch (error) {
      // setToastProps({
      //   message: error.message,
      //   type: "error",
      //   toastKey: Date.now(),
      // });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobDelete = async (id) => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/jobPost/${id}`, {
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

  const handleStatusChange = (event) => {
    const newStatus = event.target.value;
    setJobStatus(newStatus === jobStatus ? "" : newStatus);

    const queryParams = new URLSearchParams(location.search);
    if (newStatus === jobStatus) {
      queryParams.delete("jobStatus");
    } else {
      queryParams.set("jobStatus", newStatus);
    }
    queryParams.set("page", "1");
    navigate(`?${queryParams.toString()}`);
  };
  const fetchJobsHistory = async (
    page = currentPage,
    searchTerm = queryParams.get("search") || "",
    status = jobStatus
  ) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/jobpost/myAcceptedJobs?search=${search}&page=${currentPage}&jobStatus=${status}`,
        {
          headers: {
            Authorization: `Bearer ${ProviderToken || hunterToken}`,
          },
        }
      );
      if (res.status === 200) {
        setData(res?.data?.jobs);
        setFilteredData(res?.data?.jobs);
        setSearch("");
        setTotalPages(res?.data?.pagination?.totalPages);
        setTotalJobs(res.data.pagination.totalJobs);
        if (res?.data?.length === 0) {
          setToastProps({
            message: "No jobs history yet",
            type: "info",
            toastKey: Date.now(),
          });
          return;
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (location.pathname.includes("job-history")) {
      fetchJobsHistory(currentPage, search, jobStatus);
      return;
    }
    fetchJobs(currentPage);
  }, [currentPage, jobStatus, location.search]);

  const handlePageChange = (event, page) => {
    queryParams.set("page", page.toString());
    if (jobStatus) {
      queryParams.set("jobStatus", jobStatus);
    }
    navigate(`?${queryParams.toString()}`);
  };

  const handleSearch = () => {
    queryParams.set("page", "1");
    if (search.trim()) {
      queryParams.set("search", search.trim());
    } else {
      queryParams.delete("search");
    }
    navigate(`?${queryParams.toString()}`);

    if (location.pathname.includes("job-history")) {
      fetchJobsHistory(1, search);
    } else {
      fetchJobs(1, search);
    }
  };

  const resetSearch = () => {
    setSearch("");
    queryParams.delete("search");
    queryParams.set("page", "1");
    navigate(`?${queryParams.toString()}`);

    if (location.pathname.includes("job-history")) {
      fetchJobsHistory(1, "");
    } else {
      fetchJobs(1, "");
    }
  };

  const checkUserType = (id) => {
    if (localStorage.getItem("ProviderToken")) {
      navigate(`/provider/job-detail/${id}`);
      return;
    }
    navigate(`/job-detail/${id}`);
  };
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
        <>
          <LoggedHeader />
          {/* <Link
            to={`/${hunterToken ? "support/chat/1" : "provider/admin/chat/"}`}
          >
            <Tooltip title="Admin chat" placement="left-start">
              <div className="admin-message">
                <MdOutlineSupportAgent />
              </div>
            </Tooltip>
          </Link> */}

          {/* <Link to={`${hunterToken ? "/message" : "/provider/message"}`}>
            <Tooltip title="Message" placement="left-start">
              <div className="message">
                <MdMessage />
              </div>
            </Tooltip>
          </Link> */}

          <div className="bg-second py-3">
            <div className="container">
              <div className="d-flex justify-content-lg-between flex-column flex-lg-row gap-4">
                <div className="position-relative icon ">
                  <Form className="d-flex flex-row gap-2">
                    <IoIosSearch className="mt-1" />
                    <Form.Control
                      placeholder="Search for Title"
                      className="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <button onClick={handleSearch} className="btn btn-success">
                      Search
                    </button>
                    {queryParams.has("search") && (
                      <button className="btn btn-danger" onClick={resetSearch}>
                        Reset
                      </button>
                    )}
                  </Form>
                </div>
                {!location.pathname.includes("job-history") ? (
                  <>
                    <div className="d-flex flex-row gap-2 w-100 justify-content-end align-items-center">
                      <FormControl className="sort-input" sx={{ m: 1 }}>
                        <InputLabel id="job-status-select-label">
                          Job status
                        </InputLabel>

                        <Select
                          labelId="job-status-select-label"
                          id="job-status-select"
                          value={jobStatus}
                          onChange={handleChange}
                          input={<OutlinedInput label="Select Job Status" />}
                          MenuProps={MenuProps}
                          renderValue={(selected) =>
                            selected || "Select Job Status"
                          }
                        >
                          {[
                            "Completed",
                            "Pending",
                            "Assigned",
                            "Deleted",
                            "Quoted",
                          ].map((status) => (
                            <MenuItem key={status} value={status}>
                              <Checkbox
                                checked={jobStatus === status}
                                // Prevent the checkbox from intercepting clicks
                                onClick={(e) => e.stopPropagation()}
                              />
                              <ListItemText primary={status} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {jobStatus && (
                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            navigate("/job-management");
                            window.location.reload();
                          }}
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="d-flex flex-row gap-2 w-100 justify-content-end align-items-center">
                      <FormControl className="sort-input" sx={{ m: 1 }}>
                        <InputLabel id="job-status-select-label">
                          Job status
                        </InputLabel>

                        <Select
                          labelId="job-status-select-label"
                          id="job-status-select"
                          value={jobStatus}
                          onChange={handleStatusChange}
                          input={<OutlinedInput label="Select Job Status" />}
                          MenuProps={MenuProps}
                          renderValue={(selected) =>
                            selected || "Select Job Status"
                          }
                        >
                          {["Completed", "Assigned" , "Deleted"].map((status) => (
                            <MenuItem key={status} value={status}>
                              <Checkbox
                                checked={jobStatus === status}
                                // Prevent the checkbox from intercepting clicks
                                onClick={(e) => e.stopPropagation()}
                              />
                              <ListItemText primary={status} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {jobStatus && (
                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            setJobStatus("");
                            const params = new URLSearchParams(location.search);
                            params.delete("jobStatus");
                            navigate(`?${params.toString()}`);
                          }}
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
              <div className="row mt-4 gy-4 management">
                {data?.length === 0 && (
                  <div className="d-flex justify-content-center align-items-center flex-column gap-3">
                    <img
                      src={noData}
                      alt="No Data Found"
                      className="w-nodata"
                      loading="lazy"
                    />
                  </div>
                )}
                {filteredData?.length > 0 && (
                  <>
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
                              {!location.pathname.includes("job-history") && (
                                <>
                                  <th className="green-card-important py-3 text-center">
                                    Date Posted
                                  </th>
                                </>
                              )}
                              {location.pathname.includes("job-history") && (
                                <>
                                  <th className="green-card-important py-3 text-center">
                                    Date Completed
                                  </th>
                                </>
                              )}

                              <th className="green-card-important py-3 text-center">
                                Job Status
                              </th>
                              <th className="green-card-important py-3 text-center">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredData?.map((provider, index) => (
                              <tr key={provider._id} className="text-center">
                                <td>
                                  {totalJobs - (index + (currentPage - 1) * 10)}
                                </td>
                                <td> {provider?.title}</td>
                                <td className={`text-start flex-wrap`}>
                                  ${provider?.estimatedBudget || "00"}
                                </td>

                                <td>
                                  {filterAddressPatterns(
                                    provider?.jobLocation?.jobAddressLine
                                  )}
                                </td>
                                {!location.pathname.includes("job-history") && (
                                  <>
                                    <td>
                                      {" "}
                                      {new Date(
                                        provider?.createdAt
                                      ).toLocaleDateString("en-AU", {
                                        timeZone: "Australia/Sydney", // or 'Australia/Adelaide', 'Australia/Perth'
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                      })}
                                    </td>
                                  </>
                                )}
                                {location.pathname.includes("job-history") && (
                                  <>
                                    <td>
                                      {" "}
                                      {new Date(
                                        provider?.completionDate
                                      ).toLocaleDateString("en-AU", {
                                        timeZone: "Australia/Sydney", // or 'Australia/Adelaide', 'Australia/Perth'
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                      })}
                                    </td>
                                  </>
                                )}
                                <td>{provider?.jobStatus}</td>

                                <td>
                                  <tr>
                                    {provider?.jobStatus !== "Completed" &&
                                      provider?.jobStatus !== "Assigned" &&
                                      provider?.jobStatus !== "Deleted" &&
                                      !location.pathname.includes(
                                        "job-history"
                                      ) && (
                                        <td>
                                          <Link
                                            to={`/job-edit/${provider._id}`}
                                          >
                                            <HiOutlinePencilSquare
                                              style={{ height: "30px" }}
                                            />
                                          </Link>
                                        </td>
                                      )}

                                    <td>
                                      <Link
                                        to={
                                          location.pathname.includes(
                                            "job-history"
                                          )
                                            ? `/job-detail/${provider._id}?type=history`
                                            : `/job-detail/${provider._id}`
                                        }
                                      >
                                        <IoEyeSharp
                                          style={{ height: "30px" }}
                                        />
                                      </Link>
                                    </td>

                                    <td>
                                      {!location.pathname.includes(
                                        "job-history"
                                      ) &&
                                        provider?.jobStatus !== "Deleted" && (
                                          <IoTrashOutline
                                            onClick={() =>
                                              handleJobDelete(provider._id)
                                            }
                                            style={{
                                              cursor: "pointer",
                                              height: "30px",
                                            }}
                                          />
                                        )}
                                    </td>
                                  </tr>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                        {totalJobs >= 10 && (
                          <Stack
                            spacing={2}
                            sx={{ mt: 3, alignItems: "center" }}
                          >
                            <Pagination
                              count={totalPages}
                              page={currentPage}
                              onChange={handlePageChange}
                              color="primary"
                              size="large"
                              variant="outlined"
                              shape="rounded"
                              siblingCount={1}
                              boundaryCount={1}
                              className="pagination-custom"
                              sx={{
                                "& .MuiPaginationItem-root": {
                                  color: "#fff",
                                  backgroundColor: "#4CAF50",
                                  "&:hover": {
                                    backgroundColor: "#388E3C",
                                  },
                                },
                                "& .Mui-selected": {
                                  backgroundColor: "#2E7D32",
                                  "&:hover": {
                                    backgroundColor: "#1B5E20",
                                  },
                                },
                              }}
                            />
                          </Stack>
                        )}
                      </div>
                    </div>
                  </>
                )}

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
