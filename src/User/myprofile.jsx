import react from "react";
import LoggedHeader from "./Auth/component/loggedNavbar";
import { MdMessage, MdEmail } from "react-icons/md";
import serviceProviderImage from "./assets/service-provider-image.png";
import profilePicture from "./assets/profilePicture.png";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosStar } from "react-icons/io";
import { IoCall } from "react-icons/io5";
import { RiMessage2Fill } from "react-icons/ri";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import reviewImg from "./assets/reviewimg.png";
import reviewImg1 from "./assets/reviewimg1.png";
import reviewImg2 from "./assets/reviewimg2.png";
import reviewImg3 from "./assets/reviewimg3.png";
import { Link } from "react-router-dom";

export default function MyProfile() {
  return (
    <>
      <LoggedHeader />
      <div className="message">
        <Link to="/message">
          <MdMessage />
        </Link>
      </div>
      <div className="bg-second pb-3">
        <div className="container">
          <div className="image-shadow">
            <img src={serviceProviderImage} alt="image" />
            <div className="exper">
              <h5 className="fs-3 fw-medium">2 YEARS</h5>
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
