import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./component/Navbar";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import "../user.css";
// import { Form, Col } from "react-bootstrap";
import { FaPen } from "react-icons/fa";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { IoImageOutline } from "react-icons/io5";
import axiosInstance from "../../components/axiosInstance";
import Autocomplete from "react-google-autocomplete";
import Toaster from "../../Toaster";
import Loader from "../../Loader";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { ref, set } from "firebase/database";

import { auth, db } from "../../Chat/lib/firestore";
import {
  collection,
  query,
  where,
  getDocs,
  // setDoc,
  // doc,
} from "firebase/firestore";
import upload from "../../Chat/lib/upload";
import { realtimeDb } from "../../Chat/lib/firestore";

export default function SignUp() {
  const { state } = useLocation();

  const [name, setName] = useState(localStorage.getItem("signup_name") || "");
  const [email, setEmail] = useState(
    localStorage.getItem("signup_email") || ""
  );
  const [password, setPassword] = useState("");
  const [previewImage, setPreviewImage] = useState(
    localStorage.getItem("signup_previewImage") || null
  );
  const [phoneNo, setPhoneNo] = useState(
    localStorage.getItem("signup_phoneNo") || ""
  );
  const [address, setAddress] = useState(
    localStorage.getItem("signup_address") || ""
  );
  const [latitude, setLatitude] = useState(
    localStorage.getItem("signup_latitude") || null
  );
  const [longitude, setLongitude] = useState(
    localStorage.getItem("signup_longitude") || null
  );
  const [images, setImages] = useState(null);

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });

  const navigate = useNavigate();

  const userType = "hunter";
  const radius = "10000";

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    const allowedExtensions = /\.(jpeg|jpg|png)$/i;
    if (!allowedExtensions.test(file.name)) {
      setToastProps({
        message: "Invalid file type. Only JPEG, JPG, and PNG are allowed.",
        type: "error",
        toastKey: Date.now(),
      });
      e.target.value = null; // Reset file input
      return;
    }

    if (file) {
      setImages(e.target.files); // Store the file list
      setPreviewImage(URL.createObjectURL(file)); // Create a preview URL
    }
  };

  useEffect(() => {
    if (images && typeof images === "string") {
      setPreviewImage(images); // Use the existing image URL
    }
  }, [images]);

  const navigateToTerms = () => {
    localStorage.setItem("signup_name", name);
    localStorage.setItem("signup_email", email);
    localStorage.setItem("signup_phoneNo", phoneNo);
    localStorage.setItem("signup_address", address);
    localStorage.setItem("signup_latitude", latitude);
    localStorage.setItem("signup_longitude", longitude);
    navigate("/terms", {
      state: {
        name,
        email,
        password,
        phoneNo,
        address,
        latitude,
        longitude,
        images: images ? Array.from(images) : null,
        previewImage,
      },
    });
  };

  // Clear localStorage after successful submission
  const clearSignupStorage = () => {
    localStorage.removeItem("signup_name");
    localStorage.removeItem("signup_email");
    localStorage.removeItem("signup_phoneNo");
    localStorage.removeItem("signup_address");
    localStorage.removeItem("signup_latitude");
    localStorage.removeItem("signup_longitude");
    localStorage.removeItem("signup_previewImage");
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phoneNo", `+61${phoneNo}`);
    formData.append("addressLine", address);
    formData.append("password", password);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    if (images && images.length > 0) {
      formData.append("images", images[0]);
    }
    formData.append("userType", userType);
    formData.append("radius", radius);

    const requiredFields = {
      Name: name,
      Email: email,
      "Phone Number": phoneNo,
      Address: address,
      Password: password,

      // Image: images, // if needed
    };

    const missing = Object.entries(requiredFields)
      .filter(([_, v]) => !v)
      .map(([k]) => k);

    if (missing.length) {
      setToastProps({
        message: `Please fill: ${missing.join(", ")}`,
        type: "error",
        toastKey: Date.now(),
      });
      setLoading(false);
      return;
    }
    // console.log(images[0]);

    // if (!images.length || !images[0]) {
    //   setToastProps({
    //     message: "Please upload an avatar!",
    //     type: "error",
    //     toastKey: Date.now(),
    //   });
    //   setLoading(false);
    //   return;
    // }

    // const usersRef = collection(db, "hunters");
    // try {
    //   const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    //   if (signInMethods.length > 0) {
    //     setToastProps({
    //       message: "Email already in use, please log in or use another email",
    //       type: "error",
    //       toastKey: Date.now(),
    //     });
    //     setLoading(false);
    //     return;
    //   }
    // } catch (error) {
    //   console.error("Error checking email:", error);
    //   setToastProps({
    //     message: "Error checking email",
    //     type: "error",
    //     toastKey: Date.now(),
    //   });
    //   setLoading(false);
    //   return;
    // }

    try {
      const response = await axios.post(
        "http://18.209.91.97:7777/api/auth/signup",

        formData
      );
      clearSignupStorage();
      if (response.status === 200 || response.status === 201) {
        // const firebaseUser = await createUserWithEmailAndPassword(
        //   auth,
        //   email,
        //   password
        // );
        // const userId = firebaseUser.user.uid;
        // console.log(userId);
        // localStorage.setItem("hunterUId", userId);

        // await setDoc(doc(db, "hunters", userId), {
        //   name,
        //   email,
        //   phoneNo,
        //   address,
        //   latitude,
        //   longitude,
        //   id: userId,
        //   blocked: [],
        // });

        // await set(ref(realtimeDb, "userchats/" + userId), { chats: [] });
        setToastProps({
          message: response?.data?.message,
          type: "success",
          toastKey: Date.now(),
        });
        setTimeout(() => {
          navigate(`/otp?email=${email}`);
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      setToastProps({
        message: error.response?.data?.error || error.response?.data?.message,
        type: "error",
        toastKey: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadFromStorage = async () => {
      const storedPreview = localStorage.getItem("signup_previewImage");
      if (storedPreview) {
        setPreviewImage(storedPreview);
      }
    };

    loadFromStorage();
  }, []);
  return (
    <>
      {loading === true ? (
        <Loader />
      ) : (
        <div className="bg-signup">
          <Header />
          <div className="container top-avatar login">
            <div className="d-flex justify-content-center align-items-center mt-4 flex-column gap-1">
              <h1 className="highlighted-text">Service Hunters</h1>
              <div className="card shadow mb-4">
                <div className="card-body">
                  <h2 className="text-center fw-bold fs-1">Sign Up</h2>
                  <div className="position-relative">
                    {images === null ? (
                      <>
                        <div className="mt-3 profile d-flex align-items-center justify-content-center flex-column">
                          <div className="color-profile d-flex flex-column justify-content-center align-items-center">
                            <IoImageOutline />
                            <span className="fs-6">Upload</span>
                          </div>
                        </div>
                        <Form.Control
                          className="pos-image-selector"
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;

                            const allowedExtensions = /\.(jpeg|jpg|png)$/i;
                            if (!allowedExtensions.test(file.name)) {
                              setToastProps({
                                message:
                                  "Invalid file type. Only JPEG, JPG, and PNG are allowed.",
                                type: "error",
                                toastKey: Date.now(),
                              });
                              e.target.value = null; // Reset file input
                              return;
                            }

                            setImages(e.target.files);
                          }}
                        />
                      </>
                    ) : (
                      <div className="mt-3 profile d-flex align-items-center justify-content-center flex-column">
                        <div className="position-relative">
                          <img
                            src={URL.createObjectURL(images[0]) || previewImage}
                            alt="profile"
                            className="profile-image"
                          />
                          <div className="position-absolute end-0 bottom-0">
                            <Form.Control
                              className="pos-image-selector2"
                              type="file"
                              onChange={handleImageChange}
                            />
                            <FaPen className="pos-image-selector3 " />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-center mt-3 mb-4">Let’s Get Started</p>
                  <Form className="py-3">
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="4">
                        Name
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          required
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleSignUp(e)
                          }
                          type="text"
                          placeholder="Name"
                          value={name}
                          onChange={(e) => {
                            const cursorPosition = e.target.selectionStart; // Save cursor position
                            const originalValue = e.target.value;

                            const words = originalValue.trim().split(/\s+/);
                            const filteredValue = originalValue.replace(
                              /[0-9]/g,
                              ""
                            );

                            if (words.length <= 5 || originalValue === "") {
                              // Capitalize first letter of each word
                              const capitalizedValue = filteredValue
                                .toLowerCase()
                                .split(" ")
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                )
                                .join(" ");

                              setName(capitalizedValue);

                              // Restore cursor position after state update
                              setTimeout(() => {
                                e.target.selectionStart = cursorPosition;
                                e.target.selectionEnd = cursorPosition;
                              }, 0);
                            }
                          }}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="4">
                        Phone Number
                      </Form.Label>
                      <Col sm="8">
                        <div className="d-flex">
                          <Form.Control
                            type="text"
                            placeholder="Phone number"
                            value={`+61${phoneNo}`} 
                            required
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleSignUp(e)
                            }
                            onChange={(e) => {
                              let inputValue = e.target.value;

                              // Always ensure +61 is present
                              if (!inputValue.startsWith("+61")) {
                                inputValue =
                                  "+61" + inputValue.replace(/^\+61/, "");
                              }

                              // Get the part after +61
                              let digitsAfterPrefix = inputValue.substring(3);

                              // Remove all non-digit characters
                              digitsAfterPrefix = digitsAfterPrefix.replace(
                                /\D/g,
                                ""
                              );

                              // Ensure first digit after +61 is not 0
                              if (
                                digitsAfterPrefix.length > 0 &&
                                digitsAfterPrefix.charAt(0) === "0"
                              ) {
                                digitsAfterPrefix =
                                  digitsAfterPrefix.substring(1);
                              }

                             
                              setPhoneNo(digitsAfterPrefix);
                            }}
                          />
                        </div>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="4">
                        Email Address
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          type="email"
                          required
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleSignUp(e)
                          }
                          placeholder="Email Address"
                          value={email}
                          onChange={(e) =>
                            setEmail(e.target.value.toLowerCase())
                          }
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="4">
                        Address
                      </Form.Label>
                      <Col sm="8">
                        <Autocomplete
                          className="form-control"
                          apiKey={import.meta.env.VITE_GOOGLE_ADDRESS_KEY}
                          style={{ width: "100%" }}
                          onPlaceSelected={(place) => {
                            const formattedAddress =
                              place?.formatted_address || place?.name;
                            setAddress(formattedAddress);
                            setLatitude(place.geometry.location.lat());
                            setLongitude(place.geometry.location.lng());
                          }}
                          options={{
                            types: ["address"],
                          }}
                          defaultValue={address}
                        />
                      </Col>
                    </Form.Group>
                    {/* <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formPlaintextPassword"
                    >
                      <Form.Label column sm="4">
                        Password
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </Col>
                    </Form.Group> */}

                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formPlaintextPassword"
                    >
                      <Form.Label column sm="4">
                        Password
                      </Form.Label>
                      <Col sm="8" className="position-relative">
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={password}
                          required
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleSignUp(e)
                          }
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: "absolute",
                            right: "20px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                          }}
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </span>
                      </Col>
                    </Form.Group>
                  </Form>
                  <span>
                    By tapping “Sign Up” you accept our{" "}
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={navigateToTerms}
                      className="highlighted-text text-decoration-none"
                    >
                      terms and condition
                    </span>
                  </span>

                  <div className="d-flex justify-content-center align-items-center py-3">
                    <Button
                      onClick={handleSignUp}
                      variant="contained"
                      color="success"
                      className="rounded-0 custom-green bg-green-custom"
                    >
                      Signup
                    </Button>
                  </div>
                  <span className="w-100 d-flex justify-content-center">
                    Go back to login page?{" "}
                    <Link
                      to="/login"
                      className="highlighted-text text-decoration-none"
                    >
                      Signin
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Toaster
        message={toastProps.message}
        type={toastProps.type}
        toastKey={toastProps.toastKey}
      />
    </>
  );
}
