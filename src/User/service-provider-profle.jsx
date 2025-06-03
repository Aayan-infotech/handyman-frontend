import React, { useEffect, useState, useCallback } from "react";
import LoggedHeader from "./Auth/component/loggedNavbar";
import { MdMessage, MdEmail, MdOutlineSupportAgent } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Eye } from "lucide-react";
import { IoIosStar } from "react-icons/io";
import { IoCall } from "react-icons/io5";
import { RiMessage2Fill } from "react-icons/ri";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import { Link, useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../components/axiosInstance";
import Loader from "../Loader";
import notFound from "./assets/noprofile.png";
import "swiper/css";
import Tooltip from "@mui/material/Tooltip";
import "swiper/css/navigation";

export default function ServiceProviderProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [rating, setRating] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [backgroundImg, setBackgroundImg] = useState(null);
  const [avgRating, setAvgRating] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRes, bgRes, ratingRes, galleryRes] = await Promise.all([
        axiosInstance.get(`/provider/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("hunterToken")}`,
          },
        }),
        axiosInstance.get(`/backgroundImg/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("hunterToken")}`,
          },
        }),
        axiosInstance.get(`/rating/getRatings/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("hunterToken")}`,
          },
        }),
        axiosInstance.get(`/providerPhoto/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("hunterToken")}`,
          },
        }),
      ]);

      setData(profileRes?.data?.data || {});
      setBackgroundImg(bgRes?.data?.data[0]?.backgroundImg || null);
      setRating(ratingRes?.data?.data?.providerRatings || []);
      setAvgRating(ratingRes?.data?.data || 0);
      setGallery(galleryRes?.data?.data?.files || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response.status === 500 || error.response.status === 404) {
        navigate("/error");
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem("hunterToken");
    if (!token) {
      navigate("/error");
    }
    fetchData();
  }, []);

  const renderGallery = () => {
    if (gallery.length === 0) return null;

    return (
      <div className="card border-0 rounded-5 mt-4">
        <div className="card-body py-4 px-lg-4">
          <div className="d-flex align-items-center justify-content-between flex-column flex-lg-row gap-2">
            <h4 className="mb-0 text-center text-lg-start">
              Provider Work Gallery
            </h4>
          </div>
          <div className="row mt-4">
            {gallery.map((image, index) => (
              <div
                key={index}
                className="col-md-3 col-6 mb-3 position-relative"
              >
                <a className="" href={image?.url} target="_blank">
                  <img
                    src={image?.url}
                    alt="Gallery Item"
                    className="rounded-5 position-relative"
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderRatings = () => {
    if (rating?.providerRatings?.length === 0) return null;

    return (
      <>
        {rating?.providerRatings?.length > 0 && (
          <>
            <h4 className="text-muted mt-4">Hunters Reviews</h4>
            <Swiper
              navigation
              spaceBetween={50}
              modules={[Autoplay, Pagination, Navigation]}
              autoplay={{
                delay: 4500,
                disableOnInteraction: false,
              }}
              pagination
              className="swiper-review-people swiper-services mb-5"
              breakpoints={{
                640: { slidesPerView: 1, spaceBetween: 10 },
                768: { slidesPerView: 2, spaceBetween: 20 },

                1200: { slidesPerView: 3, spaceBetween: 40 },
              }}
            >
              {rating.map((item) => (
                <SwiperSlide key={item._id}>
                  <div className="card border-0 rounded-4">
                    <div className="card-body">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <img
                          src={item?.userId?.images || notFound}
                          alt="profile"
                          className="object-fit-cover"
                          style={{ width: "100px", height: "100px" }}
                        />
                        <div className="d-flex flex-row gap-1 align-items-center">
                          <div className="flex">
                            {[...Array(Math.floor(item?.rating || 0))].map(
                              (_, i) => (
                                <IoIosStar
                                  key={i}
                                  size={30}
                                  style={{ color: "#ebeb13" }}
                                />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                      <b className="mb-0 pt-2 ms-2">
                        Name:{" "}
                        {item?.userId?.name || item?.providerId?.contactName}
                      </b>
                      <p className="fw-bold text-start mx-2">{item?.review}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        )}
      </>
    );
  };

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

          <div className="bg-second pb-3">
            <div className="container">
              {/* <div className="image-shadow">
                <img
                  src={backgroundImg || notFound}
                  alt="background"
                  className="w-100"
                />
              </div> */}

              <div className="d-flex justify-content-between align-items-center pt-3 flex-column gap-3 flex-lg-row pb-lg-3">
                <div className="mw-40 order-2 mt-2 mt-lg-0 text-center text-lg-start">
                  <h3 className="fw-bold fs-1">{data?.businessName}</h3>
                  <h6>{data?.contactName}</h6>
                  <h6>ABN NO:{data?.ABN_Number}</h6>
                </div>

                <div className="position-relative order-1">
                  <div className=" ">
                    {" "}
                    {/* pos-profile service-profile*/}
                    <img
                      src={data?.images || notFound}
                      alt="profile"
                      className="profile-img"
                    />
                  </div>
                </div>

                <div className="mw-40 w-100 order-3">
                  {" "}
                  {avgRating?.avgRating !== 0 && (
                    <div className="d-flex justify-content-start align-items-center mb-3">
                      <IoIosStar size={30} style={{ color: "#ebeb13" }} />
                      <h3 className="mb-0 me-1" style={{ lineHeight: "31px" }}>
                        {avgRating?.avgRating?.toFixed(1)}
                      </h3>

                      {/* <div className="d-flex flex-row gap-1 align-items-center">
                        {[...Array(5)].map((_, i) => (
                          <IoIosStar
                            key={i}
                            size={30}
                            style={{ color: "#ebeb13" }}
                          />
                        ))}
                      </div> */}
                    </div>
                  )}
                  <div className="card green-card border-0 rounded-4 w-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex flex-column gap-3">
                          <h5 className="mb-0">Available</h5>
                          <p className="mb-0">
                            Completed {data?.jobCompleteCount}+ Jobs
                          </p>
                        </div>
                        <BsThreeDotsVertical />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-row flex-wrap justify-content-center gap-1 gap-lg-2 mt-lg-5 align-items-center profile my-4">
                {data?.businessType?.map((type, index) => (
                  <div
                    className="color-profile px-3 py-2 pt-1 rounded-5 fs-5"
                    key={index}
                  >
                    <span className="fs-6">{type}</span>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-center align-items-center mt-3 flex-column flex-column gap-3">
                <h6>{data?.about}</h6>
                <div className="d-flex align-items-center gap-4 flex-row">
                  <div className="contact">
                    <a href={`mailto:${data.email}`}>
                      <MdEmail />
                    </a>
                  </div>
                  {/* {data?.subscriptionType === "Advertising" && ( */}
                  <div className="contact">
                    <Link to={`/advertiser/chat/${id}`}>
                      <RiMessage2Fill />
                    </Link>
                  </div>
                  {/* )} */}

                  <div className="contact">
                    <a href={`tel:${data.phoneNo}`}>
                      <IoCall />
                    </a>
                  </div>
                </div>
              </div>

              {renderGallery()}
              {renderRatings()}
            </div>
          </div>

          {/* <Link to="/message">
            <Tooltip title="Message" placement="left-start">
              <div className="message">
                <MdMessage />
              </div>
            </Tooltip>
          </Link> */}
        </>
      )}
    </>
  );
}
