import React, { useState, useEffect } from "react";
import LoggedHeader from "./Auth/component/loggedNavbar";
import { MdMessage, MdOutlineSupportAgent } from "react-icons/md";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import Tooltip from "@mui/material/Tooltip";

import arrow from "./assets/arrow.png";
import pillai from "./assets/pillai.png";
import bag from "./assets/bag.png";
import grassCutting from "./assets/grassCutting.png";
import acRepair from "./assets/acRepair.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import Toaster from "../Toaster";
// import axios from "axios";
import axiosInstance from "../components/axiosInstance";
import Loader from "../Loader";
import Button from "@mui/material/Button";
import Table from "react-bootstrap/Table";
import { IoEyeSharp, IoTrashOutline } from "react-icons/io5";
export default function Main() {
  const [loading, setLoading] = useState(false);
  const [businessData, setBusinessData] = useState([]);
  const name = localStorage.getItem("hunterName");
  const [filteredData, setFilteredData] = useState([]);
  const [jobStatus, setJobStatus] = useState([]);
  const hunterToken = localStorage.getItem("hunterToken");
  const ProviderToken = localStorage.getItem("ProviderToken");
  const [data, setData] = useState([]);
  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });

  // const handleJobDelete = async (id) => {
  //   setLoading(true);
  //   try {
  //     await axios.delete(`http://3.223.253.106:7777/api/jobPost/${id}`, {
  //       headers: { Authorization: `Bearer ${hunterToken}` },
  //     });

  //     setToastProps({
  //       message: "Job deleted successfully!",
  //       type: "success",
  //       toastKey: Date.now(),
  //     });
  //     fetchJobs();
  //   } catch (error) {
  //     setToastProps({
  //       message: "Failed to delete job",
  //       type: "error",
  //       toastKey: Date.now(),
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const fetchJobs = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await axios.get(
  //       "http://3.223.253.106:7777/api/jobpost/getJobPostByUserId",
  //       {
  //         headers: {
  //           Authorization: `Bearer ${ProviderToken || hunterToken}`,
  //         },
  //       }
  //     );
  //     if (res.status === 200) {
  //       // const filteredData = res.data.data.filter(
  //       //   (job) => job.jobStatus !== "Deleted"
  //       // );
  //       setData(res.data.data);
  //       setFilteredData(res.data.data);
  //       setToastProps({
  //         message: res.data.message,
  //         type: "success",
  //         toastKey: Date.now(),
  //       });
  //     }
  //   } catch (error) {
  //     setToastProps({
  //       message: error.message,
  //       type: "error",
  //       toastKey: Date.now(),
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchJobs();
  // }, []);

  useEffect(() => {
    if(!hunterToken) {
      window.location.href = "/error";
    }
    const handleJobs = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          "/jobpost/business-type-count"
        );
        if (response.status === 200) {
          setBusinessData(response.data.data);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    handleJobs();
  }, []);

  useEffect(() => {
    const pendingJobs = data;
    setFilteredData(pendingJobs.slice(0, 10)); // Limit to 10 jobs
  }, [data]);

  return (
    <>
      {loading === true ? (
        <Loader />
      ) : (
        <>
          <LoggedHeader />
          {/* <Link to="/support/chat/1">
            <Tooltip title="Admin chat" placement="left-start">
              <div className="admin-message">
                <MdOutlineSupportAgent />
              </div>
            </Tooltip>
          </Link> */}

          {/* <Link to="/message">
            <Tooltip title="Message" placement="left-start">
              <div className="message">
                <MdMessage />{" "}
              </div>
            </Tooltip>
          </Link> */}

          <div className="bg-second">
            <div className="container">
              <div className="top-section-main py-4 px-lg-5">
                <div className="d-flex justify-content-between flex-column flex-lg-row gap-3 align-items-center pb-3">
                  <h5 className="user text-center">Hello {name}</h5>
                </div>
                <div className="row py-3 gy-4">
                  <div className="col-lg-3 col-6">
                    <Link to="/post-new-job">
                      <div className="card green-card border-0 rounded-4 position-relative overflow-hidden h-200">
                        <div className="card-body">
                          <h3 className="mt-3">New Job</h3>
                          <h6>Post New Job</h6>
                          <div className="pos-design-icon">
                            <img src={arrow} alt="arrow" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="col-lg-3 col-6">
                    <Link to="/service-provider">
                      <div className="card blue-card border-0 rounded-4 position-relative overflow-hidden h-200">
                        <div className="card-body">
                          <h3 className="mt-3">Services</h3>
                          <h6>Service Provider</h6>
                          <div className=" pos-design-pillai">
                            <img src={pillai} alt="pillai" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="col-lg-6">
                    <Link to="/job-management">
                      <div className="card green-card border-0 rounded-4 position-relative overflow-hidden h-200">
                        <div className="card-body">
                          <h2 className="mt-3 fs-1">Job Management</h2>
                          <h6>Manage Jobs</h6>
                          <div className="pos-design-bag">
                            <img src={bag} alt="bag" className="bag-image" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Most Popular Services Section */}
                <div className="d-flex justify-content-start flex-column gap-3 align-items-start pt-3">
                  <h5 className="user">Most Popular Services</h5>
                  <div className="w-100">
                    <Swiper
                      navigation={true}
                      spaceBetween={50}
                      modules={[Navigation, Autoplay]}
                      autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                      }}
                      className="swiper-services"
                      breakpoints={{
                        640: {
                          slidesPerView: 2,
                          spaceBetween: 20,
                        },
                        768: {
                          slidesPerView: 4,
                          spaceBetween: 50,
                        },
                      }}
                    >
                      {businessData.length > 0 ? (
                        businessData.map((item, index) => (
                          <SwiperSlide key={index}>
                            <Link
                              to={`/services-provider?businessType=${item?.name}`}
                            >
                              <div className="card green-card border-0 rounded-4 position-relative overflow-hidden mh-200">
                                <div className="card-body">
                                  <div className="d-flex flex-column align-items-start gap-2">
                                    <h3 className="mt-3 fs-4">{item.name}</h3>
                                    <div className="pos-design-icon">
                                      <img
                                        src={bag} // Replace with actual image path
                                        alt={item.name}
                                        className="service-image"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </SwiperSlide>
                        ))
                      ) : (
                        <div>No popular services available.</div>
                      )}
                    </Swiper>
                  </div>
                </div>

                {/* <div className="d-flex justify-content-start flex-column gap-3 align-items-start pt-5">
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <h5 className="user">Recent Job Post</h5>
                    <Link to="/job-management">
                      <Button
                        variant="contained"
                        color="success"
                        className="rounded-0 custom-green bg-green-custom"
                      >
                        View All
                      </Button>
                    </Link>
                  </div>

                  <div className="w-100 management ">
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
                                <IoTrashOutline
                                  onClick={() => handleJobDelete(provider._id)}
                                  style={{ cursor: "pointer" }}
                                  height={10}
                                />
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </div> */}
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
