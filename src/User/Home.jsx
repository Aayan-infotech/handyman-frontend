import react from "react";
import LoggedHeader from "./Auth/component/loggedNavbar";
import { TbSpeakerphone } from "react-icons/tb";
import Form from "react-bootstrap/Form";
import speaker from "./assets/announcement.png";
// import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
// import "swiper/css";
// import "swiper/css/navigation";
// import { Navigation } from "swiper/modules";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

export default function Main() {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
  };
  return (
    <>
      <LoggedHeader />
      <div className="bg-second">
        <div className="container">
          <div className="top-section-main py-4">
            <div className="d-flex justify-content-between flex-column flex-lg-row gap-3 align-items-center">
              <h5 className="user">Hello User</h5>
              <div className="position-relative icon-speaker">
                <img src={speaker} alt="speaker" />
                {/* <Swiper
                  direction="vertical" // Enable vertical sliding
                  navigation // Enable navigation buttons
                  modules={[Navigation]}
                  className="mySwiper"
                >
                  <SwiperSlide>
                    <span>
                      10% Discount on Plumbing Services before Christmas, grab
                      this opportunity by clicking on heaven we can get the
                      illuminati illuminati illuminati illuminati illuminati
                      illuminati
                    </span>
                  </SwiperSlide>
                  <SwiperSlide>
                    <span>
                      10% Discount on Plumbing Services before Christmas, grab
                      this opportunity by clicking on heaven we can get the
                      illuminati illuminati illuminati illuminati illuminati
                      illuminati
                    </span>
                  </SwiperSlide>
                  <SwiperSlide>
                    <span>
                      10% Discount on Plumbing Services before Christmas, grab
                      this opportunity by clicking on heaven we can get the
                      illuminati illuminati illuminati illuminati illuminati
                      illuminati
                    </span>
                  </SwiperSlide>
                </Swiper> */}

                <Slider {...settings} className="mySwiper">
                  <div>
                    <span>10% Discount on Plumbing Services before Christmas, grab this opportunity by clicking on the lorem ipsum dolar ajab kar lorem inpsume</span>
                  </div>
                  <div>
                    <span>10% Discount on Plumbing Services before Christmas, grab this opportunity by clicking on the lorem ipsum dolar ajab kar lorem inpsume</span>
                  </div>
                  <div>
                    <span>10% Discount on Plumbing Services before Christmas, grab this opportunity by clicking on the lorem ipsum dolar ajab kar lorem inpsume</span>
                  </div>
                  <div>
                    <span>10% Discount on Plumbing Services before Christmas, grab this opportunity by clicking on the lorem ipsum dolar ajab kar lorem inpsume</span>
                  </div>
                  <div>
                    <span>10% Discount on Plumbing Services before Christmas, grab this opportunity by clicking on the lorem ipsum dolar ajab kar lorem inpsume</span>
                  </div>
                  
                 
                </Slider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
