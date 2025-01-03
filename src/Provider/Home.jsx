import react from "react";
import LoggedHeader from "./Auth/component/loggedNavbar";
import { IoIosSearch } from "react-icons/io";
import Form from "react-bootstrap/Form";
import { MdMessage } from "react-icons/md";
import company1 from "./assets/logo/companyLogo.png";
import company2 from "./assets/logo/companyLogo1.png";
import company3 from "./assets/logo/companyLogo2.png";
import { BiCoinStack } from "react-icons/bi";
import { PiBag } from "react-icons/pi";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Button from "@mui/material/Button";
import speaker from "./assets/announcement.png";

export default function HomeProvider() {
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
      <div className="bg-second py-3">
        <div className="container top-section-main">
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
          <div className="d-flex justify-content-between align-items-center gap-3 mb-4 mt-3">
            <h2 className="fw-normal">Job Requests</h2>
            <a href="#" className="text-dark">
              See More
            </a>
          </div>
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
            <div className="col-lg-12">
              <Link to="/provider/jobspecification/1234">
                <div className="card border-0 rounded-3 px-4">
                  <div className="card-body">
                    <div className="row gy-4 gx-1 align-items-center">
                      <div className="col-lg-4">
                        <div className="d-flex flex-row gap-3 align-items-center">
                          <img src={company1} alt="company1" />
                          <div className="d-flex flex-column align-items-start gap-1">
                            <h3 className="mb-0">Electrical service</h3>
                            <h6>24/01/24</h6>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="d-flex flex-column flex-lg-row gap-2 gap-lg-4 align-items-center">
                          <div className="d-flex flex-row gap-2 align-items-center">
                            <BiCoinStack />
                            <h5 className="mb-0">$500 - $1,000</h5>
                          </div>
                          <div className="d-flex flex-row gap-2 align-items-center">
                            <PiBag />
                            <h5 className="mb-0 ">Medan, Indonesia</h5>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-2">
                        <Button
                          variant="contained"
                          className="custom-green bg-green-custom rounded-5 py-3 w-100"
                        >
                          Accept
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-lg-12">
              <Link to="/provider/jobspecification/12345">
                <div className="card border-0 rounded-3 px-4">
                  <div className="card-body">
                    <div className="row gy-4 gx-1 align-items-center">
                      <div className="col-lg-4">
                        <div className="d-flex flex-row gap-3 align-items-center">
                          <img src={company2} alt="company1" />
                          <div className="d-flex flex-column align-items-start gap-1">
                            <h3 className="mb-0">Plumbing</h3>
                            <h6>24/01/24</h6>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="d-flex flex-column flex-lg-row gap-2 gap-lg-4 align-items-center">
                          <div className="d-flex flex-row gap-2 align-items-center">
                            <BiCoinStack />
                            <h5 className="mb-0">$500 - $1,000</h5>
                          </div>
                          <div className="d-flex flex-row gap-2 align-items-center">
                            <PiBag />
                            <h5 className="mb-0 ">London, UK</h5>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-2">
                        <Button
                          variant="contained"
                          className="custom-green bg-green-custom rounded-5 py-3 w-100"
                        >
                          Accept
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-lg-12">
              <Link to="/provider/jobspecification/123456">
                <div className="card border-0 rounded-3 px-4">
                  <div className="card-body">
                    <div className="row gy-4 gx-1 align-items-center">
                      <div className="col-lg-4">
                        <div className="d-flex flex-row gap-3 align-items-center">
                          <img src={company3} alt="company1" />
                          <div className="d-flex flex-column align-items-start gap-1">
                            <h3 className="mb-0">Lawn Mowning</h3>
                            <h6>24/01/24</h6>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="d-flex flex-column flex-lg-row gap-2 gap-lg-4 align-items-center">
                          <div className="d-flex flex-row gap-2 align-items-center">
                            <BiCoinStack />
                            <h5 className="mb-0">$500 - $1,000</h5>
                          </div>
                          <div className="d-flex flex-row gap-2 align-items-center">
                            <PiBag />
                            <h5 className="mb-0 ">New Jersey, USA</h5>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-2">
                        <Button
                          variant="contained"
                          className="custom-green bg-green-custom rounded-5 py-3 w-100"
                        >
                          Accept
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
