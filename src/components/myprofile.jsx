import React, { useState, useEffect } from "react";
import LoggedHeader from "./loggedNavbar";
import {
  MdMessage,
  MdOutlineWork,
  MdOutlineSupportAgent,
} from "react-icons/md";
import serviceProviderImage from "../assets/service-provider-image.png";
import profilePicture from "../assets/profilePicture.png";
import "swiper/css";
import "swiper/css/navigation";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { PiCircleHalfFill } from "react-icons/pi";
import Button from "react-bootstrap/Button";
import { FiEdit } from "react-icons/fi";
import { CiLogout } from "react-icons/ci";
import { IoCallSharp, IoLocationSharp } from "react-icons/io5";
import { IoMdMail } from "react-icons/io";
import { CiBadgeDollar } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { getHunterUser, getProviderUser } from "../Slices/userSlice";
import { getAddress } from "../Slices/addressSlice";
import Loader from "../Loader";
import axios from "axios";
import Toaster from "../Toaster";
import notFound from "./assets/noprofile.png";

export default function MyProfile() {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAdress] = useState("");
  const [loading, setLoading] = useState(false);
  const [businessType, setBusinessType] = useState([]);
  const [profile, setProfile] = useState("");
  const id =
    localStorage.getItem("hunterId") || localStorage.getItem("ProviderId");
  const hunterToken = localStorage.getItem("hunterToken");
  const providerToken = localStorage.getItem("ProviderToken");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });
  const user = useSelector((state) => state?.user?.user?.data);
  const providerId = localStorage.getItem("ProviderId");
  const hunterId = localStorage.getItem("hunterId");

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      try {
        let fetchedUser = null;

        if (hunterToken) {
          const hunterResponse = await dispatch(getHunterUser());
          fetchedUser = hunterResponse?.payload?.data;
          console.log(fetchedUser);
        } else if (providerToken) {
          const providerResponse = await dispatch(getProviderUser());
          fetchedUser = providerResponse?.payload?.data;
        }

        if (fetchedUser) {
          setName(fetchedUser.contactName || fetchedUser.name || "");
          setNumber(fetchedUser.phoneNo || "");
          setEmail(fetchedUser.email || "");
          setAdress(fetchedUser.address?.addressLine || "");
          setBusinessType(fetchedUser.businessType || []);
          setProfile(fetchedUser.images || "");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [dispatch, hunterToken, providerToken]);

  const signOut = async () => {
    try {
      const token = hunterToken || providerToken;
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.post(
        "http://54.236.98.193:7777/api/auth/logout",
        {
          userType: hunterToken ? "hunter" : "provider",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setToastProps({
          message: "You have been Logged Out",
          type: "success",
          toastKey: Date.now(),
        });
        localStorage.removeItem("hunterToken");
        localStorage.removeItem("hunterEmail");
        localStorage.removeItem("hunterName");
        localStorage.removeItem("hunterId");
        localStorage.removeItem("ProviderToken");
        localStorage.removeItem("ProviderEmail");
        localStorage.removeItem("ProviderName");
        localStorage.removeItem("ProviderId");

        setTimeout(() => navigate("/welcome"), 2000);
      }
    } catch (error) {
      console.log(error);
      setToastProps({
        message: error?.response?.data?.message || "Logout failed",
        type: "error",
        toastKey: Date.now(),
      });
    }
  };

  const deleteAccount = async () => {
    try {
      const token = hunterToken || providerToken;
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.delete(
        `http://54.236.98.193:7777/api/DeleteAccount/${
          providerId ? "provider" : "hunter"
        }/${providerId || hunterId}`
      );

      if (response.status === 200) {
        setToastProps({
          message: "You have been Deleted your Account",
          type: "success",
          toastKey: Date.now(),
        });
        localStorage.removeItem("hunterToken");
        localStorage.removeItem("hunterEmail");
        localStorage.removeItem("hunterName");
        localStorage.removeItem("hunterId");
        localStorage.removeItem("ProviderToken");
        localStorage.removeItem("ProviderEmail");
        localStorage.removeItem("ProviderName");
        localStorage.removeItem("ProviderId");
        localStorage.removeItem("ProviderUId");
        localStorage.removeItem("Guest");
        localStorage.removeItem("hunterUId");
        localStorage.removeItem("ProviderUId");
        localStorage.clear();
        setTimeout(() => navigate("/welcome"), 2000);
      }
    } catch (error) {
      console.log(error);
      setToastProps({
        message: error?.response?.data?.message || "Logout failed",
        type: "error",
        toastKey: Date.now(),
      });
    }
  };

  const Location = useLocation();
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <LoggedHeader />
          <Link to={`/${hunterToken ? "support" : "provider"}/chat/1`}>
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
                {/* <div className="exper">
                  <h5 className="fs-5 fw-medium">2 YEARS</h5>
                </div> */}
              </div>
              <div className="row gy-4 gx-lg-3">
                <div className="col-lg-3">
                  <div className="position-relative ">
                    <div className="pos-profile start-0 mx-auto">
                      <img
                        src={profile || notFound}
                        alt="profile"
                        className="profile-img"
                      />
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
                      {providerToken ? (
                        <Link to="/provider/edit/upload" className="mw-20">
                          <Button
                            variant="dark"
                            className="d-flex gap-2 align-items-center w-100 justify-content-center"
                          >
                            <FiEdit />
                            Edit Document
                          </Button>
                        </Link>
                      ) : null}
                      <Button
                        variant="danger"
                        className="d-flex gap-2 align-items-center  mw-20 justify-content-center"
                        onClick={signOut}
                      >
                        <CiLogout />
                        Logout
                      </Button>
                      <Button
                        variant="outline-danger"
                        className="d-flex gap-2 align-items-center  mw-20 justify-content-center"
                        onClick={deleteAccount}
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-lg-center gap-4 gap-lg-5 flex-column flex-lg-row mt-3 flex-wrap">
                <div className="contact">
                  <a href={`tel::${number}`} className="text-dark">
                    <IoCallSharp className="me-2" />
                    {number}
                  </a>
                </div>
                <div className="contact">
                  <a className="text-dark d-flex flex-row flex-wrap gap-2 address-wrap align-items-lg-center">
                    <IoLocationSharp className="" />
                    <span>{address}</span>
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
                  {businessType.map((type, index) => (
                    <div
                      className="color-profile px-3 py-2 pt-1 rounded-5 fs-5"
                      key={index}
                    >
                      <span className="fs-6">{type}</span>
                    </div>
                  ))}
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
                  <Link to="/change-radius">
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
                  </Link>
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
                  className={`${
                    Location.pathname.includes("provider")
                      ? "col-lg-2"
                      : "col-lg-3"
                  }`}
                >
                  <Link
                    to={`${
                      Location.pathname.includes("provider")
                        ? "/provider/job-history"
                        : "/home"
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
                                <MdOutlineWork />
                              </div>
                            </div>
                          </div>

                          <div className="d-flex flex-row gap-3 align-items-center">
                            <span className="text-success text-center">
                              {Location.pathname.includes("provider")
                                ? " Job History"
                                : "Privacy Policy"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                <div
                  className={`${
                    Location.pathname.includes("provider")
                      ? "col-lg-2"
                      : "d-none"
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

      <Toaster
        message={toastProps.message}
        type={toastProps.type}
        toastKey={toastProps.toastKey}
      />
    </>
  );
}
