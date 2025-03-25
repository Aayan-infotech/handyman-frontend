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
import { FaLock, FaPen } from "react-icons/fa";
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
import { Modal } from "react-bootstrap";
export default function MyProfile() {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [backgroundImg, setBackgroundImg] = useState("");
  const [showModal, setShowModal] = useState(false); //NEW
  const [description, setDescription] = useState(""); //NEW
  const [aboutText, setAboutText] = useState(""); // Store "about" text after saving
  const [selectedFile, setSelectedFile] = useState(null);

  const userId =
    localStorage.getItem("hunterId") || localStorage.getItem("ProviderId"); //new
  const userType = localStorage.getItem("hunterToken") ? "Hunter" : "Provider"; // new

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

  // new
  useEffect(() => {
    if (userId) {
      fetchBackgroundImage();
    }
  }, [userId]);

  const fetchBackgroundImage = async () => {
    try {
      const response = await axios.get(
        `http://3.223.253.106:7777/api/backgroundImg/${userId}`
      );
      setBackgroundImg(response.data.data[0].backgroundImg);
    } catch (error) {
      console.error("Error fetching background image:", error);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];

    console.log(file, ".....file");
    if (!file) return;

    const formData = new FormData();
    formData.append("backgroundImg", file);
    formData.append("userType", userType);
    formData.append("userId", userId);

    try {

      const response = await axios.post(
        "http://3.223.253.106:7777/api/backgroundImg/upload",
        formData
      );
      console.log(response, "response");
      fetchBackgroundImage(); // Refresh image after upload
    } catch (error) {
      console.error("Error uploading background image:", error);
    }
  };

  useEffect(() => {
    axios
      .get(`http://3.223.253.106:7777/api/provider/about/${userId}`)
      .then((response) => {
        if (response.data.data.length > 0) {
          setAboutText(response.data.data[0].about);
        }
      })
      .catch((error) => console.error("Error fetching about data:", error));
  }, []);

  // Function to handle save (POST request)
  const handleSave = () => {
    axios
      .post(`http://3.223.253.106:7777/api/provider/about/${userId}`, {
        about: description,
      })
      .then((response) => {
        if (response.data.success) {
          setAboutText(response.data.data[0].about); // Set new about text
          setShowModal(false); // Close modal
        }
      })
      .catch((error) => console.error("Error updating about:", error));
  };

 const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]); // Sirf ek file select karega
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("files", selectedFile);
    formData.append("userId",providerId); // Replace with actual userId

    try {
      const response = await axios.post(
        "http://3.223.253.106:7777/api/providerPhoto/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Upload Successful!");
      console.log(response.data);
    } catch (error) {
      console.error("Upload Failed:", error);
      alert("Upload Failed!");
    }
  };

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
        "http://3.223.253.106:7777/api/auth/logout",
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
        `http://3.223.253.106:7777/api/DeleteAccount/${providerId ? "provider" : "delete"
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
          <Link
            to={`/${hunterToken ? "support/chat/1" : "provider/admin/chat/"}`}
          >
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
              <div className="profile-container">
                <div className="image-shadow">
                  <img
                    className="w-100 "
                    src={backgroundImg || "default-image.jpg"}
                    alt="background"
                  />
                  <div className="exper">
                    <FaPen
                      className="text-dark"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        document.getElementById("fileInput").click()
                      }

                    />
                    <input
                      type="file"
                      id="fileInput"
                      style={{ display: "none" }}
                      onChange={handleImageUpload}
                      accept="image/*"
                    />
                  </div>
                </div>
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
                  <div className="mt-5 mt-lg-0 text-center text-lg-start">
                    <h3 className="fw-bold fs-1">{name}</h3>
                    <h5
                      className="text-muted"
                      style={{ textTransform: "capitalize" }}
                    >
                      {user?.userType}
                    </h5>

                    {aboutText ? (
                      <p className="mt-3">{aboutText}</p> // Show updated "about" text
                    ) : (
                      <button
                        className="btn btn-primary mt-3"
                        onClick={() => setShowModal(true)}
                      >
                        Added Description
                      </button>
                    )}
                  </div>

                  {/* Modal Component */}
                  <Modal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    centered
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Add Description</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Enter your description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      ></textarea>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        variant="secondary"
                        onClick={() => setShowModal(false)}
                      >
                        Close
                      </Button>
                      <Button variant="primary" onClick={handleSave}>
                        Save
                      </Button>
                    </Modal.Footer>
                  </Modal>
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

          
<div className="card border-0 rounded-5">
      <div className="card-body py-4 px-lg-4 d-flex align-items-center justify-content-between">
        <h4 className="mb-0">Added your work gallery here</h4>
        <input type="file" onChange={handleFileChange} />
        <Button
          variant="contained"
          color="success"
          className="rounded-0 custom-green bg-green-custom text-light rounded-3"
          onClick={handleUpload}
        >
          ADD
        </Button>
      </div>
    </div>

              {/* <div className="card border-0 rounded-5 ">
                <div className="card-body py-4 px-lg-4 d-flex align-items-center justify-content-between">
                  <h4 className="mb-0">Added your work gallery here</h4>
                  <Button
                    variant="contained"
                    color="success"
                    className="rounded-0 custom-green bg-green-custom text-light rounded-3"
                  >
                    ADD
                  </Button>
                </div>
              </div> */}



              <div className="row gy-4 my-4">
                <div
                  className={` ${Location.pathname.includes("provider")
                      ? "col-lg-2"
                      : "col-lg-3"
                    }`}
                >
                  {hunterToken ? (
                    <Link to={`/changePassword/${id}`}>
                      <div className="card border-0 rounded-5 h-100">
                        <div className="card-body">
                          <div
                            className={`d-flex gap-3 align-items-center justify-content-center ${Location.pathname.includes("provider")
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
                            className={`d-flex gap-3 align-items-center justify-content-center ${Location.pathname.includes("provider")
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
                  className={` ${Location.pathname.includes("provider")
                      ? "d-none"
                      : "col-lg-3"
                    }`}
                >
                  <Link to="/change-radius">
                    <div className="card border-0 rounded-5 h-100">
                      <div className="card-body">
                        <div
                          className={`d-flex gap-3 align-items-center justify-content-center ${Location.pathname.includes("provider")
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
                  className={` ${Location.pathname.includes("provider")
                      ? "col-lg-2"
                      : "col-lg-3"
                    }`}
                >
                  <div className="card border-0 rounded-5 h-100">
                    <div className="card-body">
                      <div
                        className={`d-flex gap-3 align-items-center justify-content-center ${Location.pathname.includes("provider")
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
                  className={`${Location.pathname.includes("provider")
                      ? "col-lg-2"
                      : "col-lg-3"
                    }`}
                >
                  <Link
                    to={`${Location.pathname.includes("provider")
                        ? "/provider/job-history"
                        : "/home"
                      }`}
                  >
                    <div className="card border-0 rounded-5 h-100">
                      <div className="card-body">
                        <div
                          className={`d-flex gap-3 align-items-center justify-content-center ${Location.pathname.includes("provider")
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
                  className={`${Location.pathname.includes("provider")
                      ? "col-lg-2"
                      : "d-none"
                    }`}
                >
                  <div className="card border-0 rounded-5 h-100">
                    <div className="card-body">
                      <div
                        className={`d-flex gap-3 align-items-center justify-content-center ${Location.pathname.includes("provider")
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
