import react, { useState, useEffect } from "react";
import LoggedHeader from "./Auth/component/loggedNavbar";
import { MdMessage } from "react-icons/md";
import serviceProviderImage from "./assets/service-provider-image.png";
import profilePicture from "./assets/profilePicture.png";
import "swiper/css";
import "swiper/css/navigation";
import { Link, useLocation } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { PiCircleHalfFill } from "react-icons/pi";
import Button from "react-bootstrap/Button";
import { FiEdit } from "react-icons/fi";
import { CiLogout } from "react-icons/ci";
import { IoCallSharp, IoLocationSharp } from "react-icons/io5";
import { IoMdMail } from "react-icons/io";
import { CiBadgeDollar } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { getHunterUser } from "../Slices/userSlice";
import Loader from "../Loader";
import axios from "axios"; // Import axios

export default function MyProfile() {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const id =
    localStorage.getItem("hunterId") || localStorage.getItem("ProviderId");
  const hunterToken = localStorage.getItem("hunterToken");
  const providerToken = localStorage.getItem("ProviderToken");
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.user?.data);
  useEffect(() => {
    setLoading(true);
    dispatch(getHunterUser())
      .then(() => {
        setName(user?.name);
        setNumber(user?.phoneNo);
        setEmail(user?.email);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch, user]);
  const Location = useLocation();
  console.log(Location);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
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
                  <h5 className="fs-5 fw-medium">2 YEARS</h5>
                </div>
              </div>
              <div className="row gy-4 gx-lg-3">
                <div className="col-lg-3">
                  <div className="position-relative ">
                    <div className="pos-profile start-0 mx-auto">
                      <img src={profilePicture} alt="profile" />
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="  mt-5 mt-lg-0 text-center text-lg-start">
                    <h3 className="fw-bold fs-1">{name}</h3>
                    <h5 className="text-muted">Developer</h5>
                    <p className="mb-0">
                      Duis aute irure dolor in reprehenderit in voluptate velit
                      esse cillum dolore eu
                    </p>
                  </div>
                </div>

                <div className="col-lg-3">
                  <div className="w-100 ">
                    <div className="d-flex flex-column justify-content-between gap-3 align-items-center align-items-lg-end mt-lg-1">
                      {hunterToken ? (
                        <Link to="/editProfile" className="mw-20">
                          <Button
                            variant="dark"
                            className="d-flex gap-2 align-items-center w-100 justify-content-center"
                          >
                            <FiEdit />
                            Edit Profile
                          </Button>
                        </Link>
                      ) : (
                        <Link to="/provider/editProfile" className="mw-20">
                          <Button
                            variant="dark"
                            className="d-flex gap-2 align-items-center w-100 justify-content-center"
                          >
                            <FiEdit />
                            Edit Profile
                          </Button>
                        </Link>
                      )}

                      <Button
                        variant="danger"
                        className="d-flex gap-2 align-items-center  mw-20 justify-content-center"
                      >
                        <CiLogout />
                        Logout
                      </Button>
                      <Button
                        variant="outline-danger"
                        className="d-flex gap-2 align-items-center  mw-20 justify-content-center"
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-center gap-4 gap-lg-5 flex-column flex-lg-row mt-3">
                <div className="contact">
                  <a href="tel:+0173761786" className="text-dark">
                    <IoCallSharp className="me-2" />
                    {number}
                  </a>
                </div>
                <div className="contact">
                  <a className="text-dark">
                    <IoLocationSharp className="me-2" />
                    xyz city, USA 200187
                  </a>
                </div>
                <div className="contact">
                  <a href={`mailto:${email}`} className="text-dark">
                    <IoMdMail className="me-2" />
                    {email}
                  </a>
                </div>
              </div>

              {Location.pathname.includes("provider") ? (
                <div className="d-flex flex-row flex-wrap justify-content-lg-start justify-content-center gap-1 gap-lg-2 align-items-center profile my-4">
                  <div className="color-profile px-3 py-2 pt-1 rounded-5 fs-5">
                    <span className="fs-6">Electrical</span>
                  </div>
                  <div className="color-profile px-3 py-2 pt-1 rounded-5 fs-5">
                    <span className="fs-6">Electronics</span>
                  </div>
                  <div className="color-profile px-3 py-2 pt-1 rounded-5 fs-5">
                    <span className="fs-6">Mechanics</span>
                  </div>
                  <div className="color-profile px-3 py-2 pt-1 rounded-5 fs-5">
                    <span className="fs-6">Plumbing</span>
                  </div>
                </div>
              ) : (
                ""
              )}
              <div className="row gy-4 my-4">
                <div
                  className={` ${
                    Location.pathname.includes("provider")
                      ? "col-lg-2"
                      : "col-lg-3"
                  }`}
                >
                  {hunterToken ? (
                    <Link to={`/changePassword/${id}`}>
                      <div className="card border-0 rounded-5 h-100">
                        <div className="card-body">
                          <div
                            className={`d-flex gap-3 align-items-center justify-content-center ${
                              Location.pathname.includes("provider")
                                ? "flex-column"
                                : "flex-row"
                            }`}
                          >
                            <div className="circle-container">
                              <div className="progress-circle">
                                <div className="lock-icon">
                                  <FaLock />
                                </div>
                              </div>
                            </div>

                            <div className="d-flex flex-row gap-3 align-items-center">
                              <span className="text-success text-center">
                                Change Password
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <Link to={`/provider/changePassword/${id}`}>
                      <div className="card border-0 rounded-5 h-100">
                        <div className="card-body">
                          <div
                            className={`d-flex gap-3 align-items-center justify-content-center ${
                              Location.pathname.includes("provider")
                                ? "flex-column"
                                : "flex-row"
                            }`}
                          >
                            <div className="circle-container">
                              <div className="progress-circle">
                                <div className="lock-icon">
                                  <FaLock />
                                </div>
                              </div>
                            </div>

                            <div className="d-flex flex-row gap-3 align-items-center">
                              <span className="text-success text-center">
                                Change Password
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
                <div
                  className={` ${
                    Location.pathname.includes("provider")
                      ? "col-lg-2"
                      : "col-lg-3"
                  }`}
                >
                  <div className="card border-0 rounded-5 h-100">
                    <div className="card-body">
                      <div
                        className={`d-flex gap-3 align-items-center justify-content-center ${
                          Location.pathname.includes("provider")
                            ? "flex-column"
                            : "flex-row"
                        }`}
                      >
                        <div className="circle-container">
                          <div className="progress-circle">
                            <div className="lock-icon">
                              <PiCircleHalfFill />
                            </div>
                          </div>
                        </div>

                        <div className="d-flex flex-row gap-3 align-items-center">
                          <span className="text-success text-center">
                            Radius Setting
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={` ${
                    Location.pathname.includes("provider")
                      ? "col-lg-2"
                      : "col-lg-3"
                  }`}
                >
                  <div className="card border-0 rounded-5 h-100">
                    <div className="card-body">
                      <div
                        className={`d-flex gap-3 align-items-center justify-content-center ${
                          Location.pathname.includes("provider")
                            ? "flex-column"
                            : "flex-row"
                        }`}
                      >
                        <div className="circle-container">
                          <div className="progress-circle">
                            <div className="lock-icon">
                              <FaLock />
                            </div>
                          </div>
                        </div>

                        <div className="d-flex flex-row gap-3 align-items-center">
                          <span className="text-success text-center">
                            Notification setting
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={` ${
                    Location.pathname.includes("provider")
                      ? "col-lg-2"
                      : "col-lg-3"
                  }`}
                >
                  <div className="card border-0 rounded-5 h-100">
                    <div className="card-body">
                      <div
                        className={`d-flex gap-3 align-items-center justify-content-center ${
                          Location.pathname.includes("provider")
                            ? "flex-column"
                            : "flex-row"
                        }`}
                      >
                        <div className="circle-container">
                          <div className="progress-circle">
                            <div className="lock-icon">
                              <FaLock />
                            </div>
                          </div>
                        </div>

                        <div className="d-flex flex-row gap-3 align-items-center">
                          <span className="text-success text-center">
                            Privacy Setting
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={` ${
                    Location.pathname.includes("provider")
                      ? "col-lg-2"
                      : "col-lg-3"
                  }`}
                >
                  <div className="card border-0 rounded-5 h-100">
                    <div className="card-body">
                      <div
                        className={`d-flex gap-3 align-items-center justify-content-center ${
                          Location.pathname.includes("provider")
                            ? "flex-column"
                            : "flex-row"
                        }`}
                      >
                        <div className="circle-container">
                          <div className="progress-circle">
                            <div className="lock-icon">
                              <CiBadgeDollar />
                            </div>
                          </div>
                        </div>

                        <div className="d-flex flex-row gap-3 align-items-center">
                          <span className="text-success text-center">
                            Manange Subscription
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
