import React, { useEffect, useState } from "react";
import LoggedHeader from "./Auth/component/loggedNavbar";
import { MdMessage, MdEmail, MdOutlineSupportAgent } from "react-icons/md";
import serviceProviderImage from "./assets/service-provider-image.png";
import profilePicture from "./assets/profilePicture.png";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosStar } from "react-icons/io";
import { IoCall } from "react-icons/io5";
import { RiMessage2Fill } from "react-icons/ri";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import Loader from "../Loader";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import reviewImg from "./assets/reviewimg.png";
import reviewImg1 from "./assets/reviewimg1.png";
import reviewImg2 from "./assets/reviewimg2.png";
import reviewImg3 from "./assets/reviewimg3.png";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import notFound from "../assets/image-not-found.png"

export default function ServiceProviderProfile() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const handleProviderProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://54.236.98.193:7777/api/provider/${id}`
      );
      setData(response?.data?.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleProviderProfile();
  }, [id]);

  console.log(data);
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
      <div className="bg-second pb-3">
        <div className="container">
          <div className="image-shadow">
            <img src={serviceProviderImage} alt="image" />
            {/* <div className="cost">
              <h5>$500 - $1,000/monthly</h5>
            </div> */}
          </div>
          <div className="d-flex justify-content-between align-items-start mt-4 flex-column gap-3 flex-lg-row ">
            <div className="mw-40 order-2 order-lg-1 mt-5 mt-lg-0 text-center text-lg-start">
              <h3 className="fw-bold fs-1">{data.contactName}</h3>
              <h6>{data.businessName}</h6>
              <p className="mb-0">{data.businessType}</p>
            </div>
            <div className="position-relative order-1 order-lg-2">
              <div className="pos-profile">
                <img src={data.images || notFound} alt="profile" className=" profile-img"/>
              </div>
            </div>

            <div className="mw-40 w-100 order-3">
              <div className="card green-card border-0 rounded-4 w-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center ">
                    <div className="d-flex flex-column gap-3">
                      <h5 className="mb-0">Available</h5>
                      <p className="mb-0">Served 0+ Clients</p>
                    </div>
                    <div className="">
                      <BsThreeDotsVertical />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-3  flex-column flex-lg-row gap-3">
            <div className="d-flex flex-row gap-4 align-items-center">
              <div className="d-flex flex-row gap-2 align-items-center">
                <IoIosStar size={30} />
                <span>4.2 RatIngs</span>
              </div>
              <div className="d-flex flex-row gap-3 align-items-center">
                <div className="circle-km"></div>
                <span>{(data?.address?.radius / 1000).toFixed(2)} km</span>
              </div>
            </div>

            <div className="d-flex align-items-center gap-4 flex-row">
              <div className="contact">
                <a href={`mailto:${data.email}`}>
                  <MdEmail />
                </a>
              </div>
              <div className="contact">
                {/* <a href={`mailto:${data.email}`}> */}
                <RiMessage2Fill />
                {/* </a> */}
              </div>
              <div className="contact">
                <a href={`tel:${data.phoneNo}`}>
                  <IoCall />
                </a>
              </div>
            </div>
          </div>
          <div className="">
            <h4 className="text-muted mt-4">Previous Rating</h4>
            <Swiper
              navigation={true}
              spaceBetween={50}
              modules={[Autoplay, Pagination, Navigation]}
              autoplay={{
                delay: 4500,
                disableOnInteraction: false,
              }}
              pagination={true}
              F
              className="swiper-review-people swiper-services mb-5"
              breakpoints={{
                640: {
                  slidesPerView: 1,
                  spaceBetween: 10,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
                1200: {
                  slidesPerView: 4,
                  spaceBetween: 40,
                },
              }}
            >
              <SwiperSlide>
                <div className="card border-0 rounded-4">
                  <div className="card-body">
                    <div className="d-flex flex-row justify-content-between align-items-center">
                      <img src={reviewImg} alt="image" />
                      <div className="d-flex flex-row gap-3 align-items-center">
                        <span>3.4</span>
                        <IoIosStar size={30} />
                      </div>
                    </div>
                    <p className="fw-bold text-center">
                      Got the best service in less time and pocket friendly
                    </p>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="card border-0 rounded-4">
                  <div className="card-body">
                    <div className="d-flex flex-row justify-content-between align-items-center">
                      <img src={reviewImg1} alt="image" />
                      <div className="d-flex flex-row gap-3 align-items-center">
                        <span>3.4</span>
                        <IoIosStar size={30} />
                      </div>
                    </div>
                    <p className="fw-bold text-center">
                      Got the best service in less time and pocket friendly
                    </p>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="card border-0 rounded-4">
                  <div className="card-body">
                    <div className="d-flex flex-row justify-content-between align-items-center">
                      <img src={reviewImg2} alt="image" />
                      <div className="d-flex flex-row gap-3 align-items-center">
                        <span>3.4</span>
                        <IoIosStar size={30} />
                      </div>
                    </div>
                    <p className="fw-bold text-center">
                      Got the best service in less time and pocket friendly
                    </p>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="card border-0 rounded-4">
                  <div className="card-body">
                    <div className="d-flex flex-row justify-content-between align-items-center">
                      <img src={reviewImg3} alt="image" />
                      <div className="d-flex flex-row gap-3 align-items-center">
                        <span>3.4</span>
                        <IoIosStar size={30} />
                      </div>
                    </div>
                    <p className="fw-bold text-center">
                      Got the best service in less time and pocket friendly
                    </p>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="card border-0 rounded-4">
                  <div className="card-body">
                    <div className="d-flex flex-row justify-content-between align-items-center">
                      <img src={reviewImg} alt="image" />
                      <div className="d-flex flex-row gap-3 align-items-center">
                        <span>3.4</span>
                        <IoIosStar size={30} />
                      </div>
                    </div>
                    <p className="fw-bold text-center">
                      Got the best service in less time and pocket friendly
                    </p>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="card border-0 rounded-4">
                  <div className="card-body">
                    <div className="d-flex flex-row justify-content-between align-items-center">
                      <img src={reviewImg} alt="image" />
                      <div className="d-flex flex-row gap-3 align-items-center">
                        <span>3.4</span>
                        <IoIosStar size={30} />
                      </div>
                    </div>
                    <p className="fw-bold text-center">
                      Got the best service in less time and pocket friendly
                    </p>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="card border-0 rounded-4">
                  <div className="card-body">
                    <div className="d-flex flex-row justify-content-between align-items-center">
                      <img src={reviewImg} alt="image" />
                      <div className="d-flex flex-row gap-3 align-items-center">
                        <span>3.4</span>
                        <IoIosStar size={30} />
                      </div>
                    </div>
                    <p className="fw-bold text-center">
                      Got the best service in less time and pocket friendly
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
    </>
  );
}
