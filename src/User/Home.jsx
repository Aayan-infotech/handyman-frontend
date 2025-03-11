import React, { useState, useEffect } from "react";
import LoggedHeader from "./Auth/component/loggedNavbar";
import { MdMessage, MdOutlineSupportAgent } from "react-icons/md";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import arrow from "./assets/arrow.png";
import pillai from "./assets/pillai.png";
import bag from "./assets/bag.png";
import grassCutting from "./assets/grassCutting.png";
import acRepair from "./assets/acRepair.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import Toaster from "../Toaster";

export default function Main() {
  const name = localStorage.getItem("hunterName");
  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
  };
  useEffect(() => {}, []);
  console.log(name);
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
      <div className="bg-second">
        <div className="container">
          <div className="top-section-main py-4 px-lg-5">
            <div className="d-flex justify-content-between flex-column flex-lg-row gap-3 align-items-center pb-3">
              <h5 className="user">Hello {name}</h5>
              {/* <div className="position-relative icon-speaker">
                <img src={speaker} alt="speaker" />
                <Slider {...settings} className="mySwiper">
                  <div>
                    <span>
                      10% Discount on Plumbing Services before Christmas, grab
                      this opportunity by clicking on the lorem ipsum dolar ajab
                      kar lorem inpsume
                    </span>
                  </div>
                  <div>
                    <span>
                      10% Discount on Plumbing Services before Christmas, grab
                      this opportunity by clicking on the lorem ipsum dolar ajab
                      kar lorem inpsume
                    </span>
                  </div>
                  <div>
                    <span>
                      10% Discount on Plumbing Services before Christmas, grab
                      this opportunity by clicking on the lorem ipsum dolar ajab
                      kar lorem inpsume
                    </span>
                  </div>
                  <div>
                    <span>
                      10% Discount on Plumbing Services before Christmas, grab
                      this opportunity by clicking on the lorem ipsum dolar ajab
                      kar lorem inpsume
                    </span>
                  </div>
                  <div>
                    <span>
                      10% Discount on Plumbing Services before Christmas, grab
                      this opportunity by clicking on the lorem ipsum dolar ajab
                      kar lorem inpsume
                    </span>
                  </div>
                </Slider>
              </div> */}
            </div>
            <div className="row py-3 gy-4">
              <div className="col-lg-3">
                <Link to="/post-new-job">
                  <div className="card green-card border-0 rounded-4 position-relative overflow-hidden h-200">
                    <div className="card-body">
                      <div className="d-flex flex-column align-items-start gap-2">
                        <div className="d-flex flex-row gap-1 align-items-center">
                          <div className="dots"></div>
                          <div className="dots"></div>
                          <div className="dots"></div>
                          <div className="dots"></div>
                        </div>
                        <div className="d-flex flex-row gap-1 align-items-center">
                          <div className="dots"></div>
                          <div className="dots"></div>
                          <div className="dots"></div>
                          <div className="dots"></div>
                        </div>
                      </div>
                      <h3 className="mt-3">New Job</h3>
                      <h6>Post New Job</h6>
                      <div className="pos-design-icon">
                        <img src={arrow} alt="arrow" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-lg-3">
                <Link to="/service-provider">
                  <div className="card blue-card border-0 rounded-4 position-relative overflow-hidden h-200">
                    <div className="card-body">
                      <div className="d-flex flex-column align-items-start gap-2">
                        <div className="d-flex flex-row gap-1 align-items-center">
                          <div className="dots"></div>
                          <div className="dots"></div>
                          <div className="dots"></div>
                          <div className="dots"></div>
                        </div>
                        <div className="d-flex flex-row gap-1 align-items-center">
                          <div className="dots"></div>
                          <div className="dots"></div>
                          <div className="dots"></div>
                          <div className="dots"></div>
                        </div>
                      </div>
                      <h3 className="mt-3">Services</h3>
                      <h6>Service Provider</h6>
                      <div className=" pos-design-pillai">
                        <img src={pillai} alt="arrow" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-lg-6">
                <Link to="/job-management">
                  <div className="card green-card border-0 rounded-4 position-relative overflow-hidden h-200">
                    <div className="card-body">
                      <div className="d-flex flex-column align-items-start gap-2">
                        <div className="d-flex flex-row gap-1 align-items-center">
                          <div className="dots"></div>
                          <div className="dots"></div>
                          <div className="dots"></div>
                          <div className="dots"></div>
                        </div>
                        <div className="d-flex flex-row gap-1 align-items-center">
                          <div className="dots"></div>
                          <div className="dots"></div>
                          <div className="dots"></div>
                          <div className="dots"></div>
                        </div>
                      </div>
                      <h2 className="mt-3 fs-1">Job Management</h2>
                      <h6>Manage Jobs</h6>
                      <div className=" pos-design-bag ">
                        <img src={bag} alt="arrow" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
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
                  <SwiperSlide>
                    <div className="card green-card border-0 rounded-4 position-relative overflow-hidden mh-200">
                      <div className="card-body">
                        <div className="d-flex flex-column align-items-start gap-2">
                          <div className="d-flex flex-row gap-1 align-items-center">
                            <div className="dots"></div>
                            <div className="dots"></div>
                            <div className="dots"></div>
                            <div className="dots"></div>
                          </div>
                          <div className="d-flex flex-row gap-1 align-items-center">
                            <div className="dots"></div>
                            <div className="dots"></div>
                            <div className="dots"></div>
                            <div className="dots"></div>
                          </div>
                        </div>
                        <h3 className="mt-3">Grass Cutting</h3>

                        <div className="pos-design-icon">
                          <img src={grassCutting} alt="grassCutting" />
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="card green-card border-0 rounded-4 position-relative overflow-hidden mh-200">
                      <div className="card-body">
                        <div className="d-flex flex-column align-items-start gap-2">
                          <div className="d-flex flex-row gap-1 align-items-center">
                            <div className="dots"></div>
                            <div className="dots"></div>
                            <div className="dots"></div>
                            <div className="dots"></div>
                          </div>
                          <div className="d-flex flex-row gap-1 align-items-center">
                            <div className="dots"></div>
                            <div className="dots"></div>
                            <div className="dots"></div>
                            <div className="dots"></div>
                          </div>
                        </div>
                        <h3 className="mt-3">Painting</h3>
                        <h6>Post New Job</h6>
                        <div className="pos-design-icon">
                          <img src={pillai} alt="arrow" />
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Toaster
        message={toastProps.message}
        type={toastProps.type}
        toastKey={toastProps.toastKey}
      />
    </>
  );
}
