import react from "react";
import LoggedHeader from "./Auth/component/loggedNavbar";
import { TbSpeakerphone } from "react-icons/tb";
import { MdMessage } from "react-icons/md";
import speaker from "./assets/announcement.png";
import arrow from "./assets/arrow.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";

export default function MainProvider() {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
  };
  return (
    <>
      <LoggedHeader />
      <div className="message">
        <Link to="/message">
          <MdMessage />
        </Link>
      </div>
      <div className="bg-second">
        <div className="container">
          <div className="top-section-main py-4 px-lg-5">
            <div className="d-flex justify-content-between flex-column flex-lg-row gap-3 align-items-center pb-3">
              <h5 className="user">Hello User</h5>
              <div className="position-relative icon-speaker">
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
              </div>
            </div>
            <div className="row py-3 gy-4 mt-4 gx-5">
              <div className="col-lg-4">
                <Link to="/post-new-job">
                  <div className="card price-card border-0 rounded-5 position-relative overflow-hidden px-4 py-5">
                    <div className="card-body d-flex flex-column gap-3 align-items-center">
                      <h2 className="mt-3">$0</h2>
                      <span className="line-white"></span>
                      <h6 className="fw-bold">Monthly</h6>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-lg-4">
                <Link to="/post-new-job">
                  <div className="card price-card border-0 rounded-5 position-relative overflow-hidden px-4 py-5">
                    <div className="card-body d-flex flex-column gap-3 align-items-center">
                      <h2 className="mt-3">$29</h2>
                      <span className="line-white"></span>
                      <h6 className="fw-bold">Pay-Per-Lead</h6>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-lg-4">
                <Link to="/post-new-job">
                  <div className="card price-card border-0 rounded-5 position-relative overflow-hidden px-4 py-5">
                    <div className="card-body d-flex flex-column gap-3 align-items-center">
                      <h2 className="mt-3">$99</h2>
                      <span className="line-white"></span>
                      <h6 className="fw-bold">Advertisement Based</h6>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
