import React, { useState, useEffect } from "react";
import LoggedHeader from "./auth/component/loggedNavbar";
import { TbSpeakerphone } from "react-icons/tb";
import { MdMessage } from "react-icons/md";
import speaker from "./assets/announcement.png";
import arrow from "./assets/arrow.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader";
import Toaster from "../Toaster";
import { useDispatch, useSelector } from "react-redux";
import { getProviderUser } from "../Slices/userSlice";

export default function MainProvider() {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
  };
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const name = localStorage.getItem("ProviderName")
  const dispatch = useDispatch();
  const token = localStorage.getItem("ProviderToken");
  const user = useSelector((state) => state?.user?.user?.data);
  
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "http://54.236.98.193:7777/api/subscription/getAllSubscription"
        );
        setData(res?.data?.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
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
                  <h5 className="user">Hello {name}</h5>
                  <div className="position-relative icon-speaker">
                    <img src={speaker} alt="speaker" />
                    <Slider {...settings} className="mySwiper">
                      <div>
                        <span>
                          10% Discount on Plumbing Services before Christmas,
                          grab this opportunity by clicking on the lorem ipsum
                          dolar ajab kar lorem inpsume
                        </span>
                      </div>
                      <div>
                        <span>
                          10% Discount on Plumbing Services before Christmas,
                          grab this opportunity by clicking on the lorem ipsum
                          dolar ajab kar lorem inpsume
                        </span>
                      </div>
                      <div>
                        <span>
                          10% Discount on Plumbing Services before Christmas,
                          grab this opportunity by clicking on the lorem ipsum
                          dolar ajab kar lorem inpsume
                        </span>
                      </div>
                      <div>
                        <span>
                          10% Discount on Plumbing Services before Christmas,
                          grab this opportunity by clicking on the lorem ipsum
                          dolar ajab kar lorem inpsume
                        </span>
                      </div>
                      <div>
                        <span>
                          10% Discount on Plumbing Services before Christmas,
                          grab this opportunity by clicking on the lorem ipsum
                          dolar ajab kar lorem inpsume
                        </span>
                      </div>
                    </Slider>
                  </div>
                </div>
                <div className="row py-3 gy-4 mt-4 gx-5">
                  {data?.map((item) => (
                    <div className="col-lg-4" key={item._id}>
                      <Link to={`/provider/pricing-detail/${item._id}`}>
                        <div className="card price-card border-0 rounded-5 position-relative overflow-hidden px-4 py-5">
                          <div className="card-body d-flex flex-column gap-3 align-items-center">
                            <h2 className="mt-3">${item.amount}</h2>
                            <span className="line-white"></span>
                            <h6 className="fw-bold">{item.title}</h6>
                            <div dangerouslySetInnerHTML={{ __html: item.description}}></div>
                          
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
