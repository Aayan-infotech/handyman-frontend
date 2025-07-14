import React, { useState, useEffect } from "react";
import Header from "./component/Navbar";
import Button from "@mui/material/Button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { FaPen } from "react-icons/fa";
import "../../User/user.css";
import { IoImageOutline } from "react-icons/io5";
import { Eye, EyeOff } from "lucide-react";
import axiosInstance from "../../components/axiosInstance";
import Toaster from "../../Toaster";
import Autocomplete from "react-google-autocomplete";
import Loader from "../../Loader";
import Select from "react-select";
import FormControl from "@mui/material/FormControl";
import { useTheme } from "@mui/material/styles";
import axios from "axios";

import MenuItem from "@mui/material/MenuItem";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { ref, set } from "firebase/database";

import { auth } from "../../Chat/lib/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import upload from "../../Chat/lib/upload";
import { realtimeDb } from "../../Chat/lib/firestore";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
function getStyles(name, personName, theme) {
  return {
    fontWeight: personName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

export default function SignUpProvider() {
  const [name, setName] = useState(localStorage.getItem("signup_name") || "");
  const [businessName, setBusinessName] = useState(
    localStorage.getItem("signup_businessName") || ""
  );
  const [email, setEmail] = useState(
    localStorage.getItem("signup_email") || ""
  );
  const [phoneNo, setPhoneNo] = useState(
    localStorage.getItem("signup_phoneNo") || ""
  );
  const [address, setAddress] = useState(
    localStorage.getItem("signup_address") || ""
  );
  const [password, setPassword] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState(
    localStorage.getItem("signup_registrationNumber") || ""
  );
  const [showPassword, setShowPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState(null); // Store the preview image
  const [selectedBusiness, setSelectedBusiness] = useState([]);
  const [businessData, setBusinessData] = useState([]);
  const [businessType, setBusinessType] = useState([]);
  const [images, setImages] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });
  const [latitude, setLatitude] = useState(
    localStorage.getItem("signup_latitude") || null
  );
  const [longitude, setLongitude] = useState(
    localStorage.getItem("signup_longitude") || null
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const guestVerify = searchParams.get("type") === "Guest" ? true : false;
  const handleBusinessChange = (selectedOption) => {
    setSelectedBusiness(selectedOption || []);
  };

  // const handleChange = (event) => {
  //   const { value } = event.target;
  //   setBusinessType(Array.isArray(value) ? value : [value]); // Ensure value is always an array
  // };

  const handleChange = (event) => {
    const { value } = event.target;
    setBusinessType(typeof value === "string" ? value.split(",") : value);
  };

  useEffect(() => {
    const handleAllData = async () => {
      try {
        const response = await axiosInstance.get("/service/getAllServices");
        if (response.status === 200) {
          setBusinessData(response?.data?.data);
        }
        console.log(response?.data);
      } catch (error) {
        console.log(error);
      }
    };
    handleAllData();
  }, []);

  const navigateToTerms = () => {
    localStorage.setItem("signup_name", name);
    localStorage.setItem("signup_businessName", businessName);
    localStorage.setItem("signup_email", email);
    localStorage.setItem("signup_phoneNo", phoneNo);
    localStorage.setItem("signup_address", address);
    localStorage.setItem("signup_registrationNumber", registrationNumber);
    localStorage.setItem("signup_latitude", latitude);
    localStorage.setItem("signup_longitude", longitude);

    navigate("/terms");
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };
  const clearSignupStorage = () => {
    localStorage.removeItem("signup_name", name);
    localStorage.removeItem("signup_businessName", businessName);
    localStorage.removeItem("signup_email", email);
    localStorage.removeItem("signup_phoneNo", phoneNo);
    localStorage.removeItem("signup_address", address);
    localStorage.removeItem("signup_registrationNumber", registrationNumber);
    localStorage.removeItem("signup_latitude", latitude);
    localStorage.removeItem("signup_longitude", longitude);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const requiredFields = {
      Name: name,
      "Business Name": businessName,
      Email: email,
      "Phone Number": phoneNo,
      Address: address,
      Password: password,
      "Business Type": selectedBusiness?.length > 0,
      "Registration Number": registrationNumber,
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
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("businessName", businessName);
    formData.append("email", email);
    formData.append("phoneNo", `+61${phoneNo}`);
    formData.append("addressLine", address);
    formData.append("password", password);
    selectedBusiness.forEach((type) => {
      formData.append("businessType", type.name);
    });
    formData.append("ABN_Number", registrationNumber);
    formData.append("userType", "provider");
    formData.append("radius", "10000");
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    if (guestVerify) {
      formData.append("isGuestMode", true);
    }

    if (images && images.length > 0) {
      formData.append("images", images[0]);
    }
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

    setLoading(true);
    try {
      const response = await axios.post(
        "http://52.20.55.193:7777/api/auth/signup",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      clearSignupStorage();
      if (response.status === 200 || response.status === 201) {
        setName("");
        setBusinessName("");
        setEmail("");
        setPhoneNo();
        setAddress("");
        setPassword("");
        setLatitude(null);
        setLongitude(null);
        setImages(null);

        // const firebaseUser = await createUserWithEmailAndPassword(
        //   auth,
        //   email,
        //   password
        // );
        // const userId = firebaseUser.user.uid;
        // console.log(userId);
        // localStorage.setItem("ProviderUId", userId);

        // await setDoc(doc(db, "providers", userId), {
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
        setLoading(false);
        setToastProps({
          message: response?.data?.message,
          type: "success",
          toastKey: Date.now(),
        });
        setTimeout(() => {
          navigate(`/provider/otp?email=${email}&type=provider`);
        }, 2000);
      }
    } catch (error) {
      setToastProps({
        message: error?.response?.data?.message,
        type: "error",
        toastKey: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  };
  const handleFileChange = (event) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

    const files = event.target.files;
    console.log(files);
    if (!files || files.length === 0) return;

    // Check each file's size
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > MAX_FILE_SIZE) {
        setSnackbarMessage("File size exceeds 5MB limit");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return; // Exit if any file is too large
      }
    }

    if (files) {
      handleImageChange(event);
    }
  };
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

  return (
    <>
      {loading === true ? (
        <Loader />
      ) : (
        <div className="bg-signup">
          <Header />
          <div className="container top-avatar login">
            <div className="d-flex justify-content-center align-items-center mt-4 flex-column gap-1">
              <h1 className="highlighted-text">Service Providers</h1>
              <div className="card shadow mb-4">
                <div className="card-body">
                  <h2 className="text-center fw-bold fs-1">Sign Up</h2>
                  <p className="text-center mt-4 mb-4">Let’s Get Started</p>
                  {images === null ? (
                    <>
                      <div className="position-relative">
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

                            // First check if a file was selected
                            if (!file) return;

                            const allowedExtensions = /\.(jpeg|jpg|png)$/i;
                            const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

                            // Check file type
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

                            // Check file size
                            if (file.size > MAX_FILE_SIZE) {
                              setToastProps({
                                message: "File size exceeds 5MB limit",
                                type: "error",
                                toastKey: Date.now(),
                              });
                              e.target.value = null; // Reset file input
                              return;
                            }

                            // If all validations pass
                            setImages(e.target.files);
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="mt-3 profile d-flex align-items-center justify-content-center flex-column">
                      <div className="position-relative">
                        <img
                          src={URL.createObjectURL(images[0]) || previewImage}
                          alt="profile"
                          className="profile-image"
                          loading="lazy"
                        />
                        <div className="position-absolute end-0 bottom-0">
                          <Form.Control
                            className="pos-image-selector2"
                            type="file"
                            onChange={handleFileChange}
                          />
                          <FaPen className="pos-image-selector3 " />
                        </div>
                      </div>
                    </div>
                  )}
                  <Form className="py-3">
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="5">
                        Name
                      </Form.Label>
                      <Col sm="7">
                        <Form.Control
                          type="text"
                          placeholder="Name"
                          value={name}
                          required
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleSignUp(e)
                          }
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
                      <Form.Label column sm="5">
                        Business Type
                      </Form.Label>
                      <Col sm="7">
                        <FormControl className="w-100 select-ion">
                          <Select
                            options={businessData.sort((a, b) =>
                              a.name.localeCompare(b.name)
                            )} // Sorted Business Names
                            getOptionLabel={(e) => e.name} // Display Business Name
                            value={selectedBusiness} // Show selected business in input box
                            onChange={handleBusinessChange} // Update state on selection
                            isClearable
                            isSearchable
                            isMulti
                            placeholder="Select a business"
                            getOptionValue={(e) => e.name} // Option Value
                            className="w-100 "
                            required
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleSignUp(e)
                            }
                          />
                          {/* <Select
                            labelId="demo-multiple-name-label"
                            id="demo-multiple-name"
                            className="pad-select"
                            multiple
                            value={businessType} // Should be an array of IDs
                            onChange={handleChange}
                            displayEmpty
                            inputProps={{ "aria-label": "Without label" }}
                            renderValue={(selected) => {
                              if (selected.length === 0) {
                                return <span>Choose Business Type</span>;
                              }
                              return selected.join(", ");
                            }}
                          >
                            <MenuItem value="" disabled>
                              Choose Business Type
                            </MenuItem>
                            {businessData.map((data) => (
                              <MenuItem key={data._id} value={data?.name}>
                                {data.name}
                              </MenuItem>
                            ))}
                          </Select> */}
                        </FormControl>
                      </Col>
                    </Form.Group>
                    {/* <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="5">
                        Service Industry
                      </Form.Label>
                      <Col sm="7">
                        <Form.Select
                          value={serviceType}
                          onChange={(e) => setServiceType(e.target.value)}
                        >
                          <option value="">Select Service</option>
                          {serviceData.length > 0 ? (
                            serviceData.map((service, index) => (
                              <option key={index} value={service}>
                                {service}
                              </option>
                            ))
                          ) : (
                            <option disabled>No services available</option>
                          )}
                        </Form.Select>
                      </Col>
                    </Form.Group> */}
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="5">
                        Business name
                      </Form.Label>
                      <Col sm="7">
                        <Form.Control
                          type="text"
                          placeholder="Business name"
                          value={businessName}
                          required
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleSignUp(e)
                          }
                          onChange={(e) => setBusinessName(e.target.value)}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="5">
                        Email Address
                      </Form.Label>
                      <Col sm="7">
                        <Form.Control
                          type="email"
                          placeholder="Email Address"
                          value={email}
                          required
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleSignUp(e)
                          }
                          onChange={(e) =>
                            setEmail(e.target.value.toLowerCase())
                          }
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="5">
                        Phone Number
                      </Form.Label>
                      <Col sm="7">
                        <div className="d-flex align-items-center">
                          <span
                            style={{
                              padding: "0.375rem 0.75rem",
                              border: "1px solid #ced4da",
                              borderRadius: "0.25rem 0 0 0.25rem",
                              backgroundColor: "#e9ecef",
                            }}
                          >
                            +61
                          </span>
                          <Form.Control
                            type="text"
                            placeholder="Phone number"
                            value={phoneNo}
                            required
                            style={{
                              borderRadius: "0 0.25rem 0.25rem 0",
                              borderLeft: "none",
                            }}
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleSignUp(e)
                            }
                            onChange={(e) => {
                              let digits = e.target.value.replace(/\D/g, "");
                              if (digits.startsWith("0")) {
                                digits = digits.substring(1); // Remove leading 0
                              }
                              setPhoneNo(digits);
                            }}
                          />
                        </div>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="5">
                        Address
                      </Form.Label>
                      <Col sm="7">
                        <Autocomplete
                          className="form-control google-remover"
                          apiKey={import.meta.env.VITE_GOOGLE_ADDRESS_KEY}
                          style={{ width: "100%" }}
                          onPlaceSelected={(place) => {
                            const formattedAddress =
                              place?.formatted_address || place?.name;
                            setAddress(formattedAddress);
                            console.log(place);
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
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="5">
                        ABN number
                      </Form.Label>
                      <Col sm="7">
                        <Form.Control
                          type="text"
                          placeholder="ABN number"
                          value={registrationNumber}
                          required
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleSignUp(e)
                          }
                          onChange={(e) =>
                            setRegistrationNumber(e.target.value)
                          }
                        />
                      </Col>
                    </Form.Group>
                    {/* <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="5">
                        Password
                      </Form.Label>
                      <Col sm="7">
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </Col>
                    </Form.Group> */}
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="5">
                        Password
                      </Form.Label>
                      <Col sm="7" className="position-relative">
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
                    <span>
                      By tapping “Sign Up” you accept our{" "}
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={navigateToTerms}
                        className="highlighted-text text-decoration-none"
                      >
                        terms and condition
                      </span>
                      {"  "}& {"  "}
                      <Link
                        to="/privacy"
                        className="highlighted-text text-decoration-none"
                      >
                        Privacy Policy
                      </Link>
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
                        to="/provider/login"
                        className="highlighted-text text-decoration-none"
                      >
                        Signin
                      </Link>
                    </span>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Toaster
        message={toastProps.message}
        type={toastProps.type}
        toastKey={toastProps.toastKey}
      />
    </>
  );
}
