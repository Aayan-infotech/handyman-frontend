import React, { useState, useEffect } from "react";
import Header from "./component/Navbar";
import Button from "@mui/material/Button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import "../../User/user.css";
import { IoImageOutline } from "react-icons/io5";
import { Eye, EyeOff } from "lucide-react";
import axiosInstance from "../../components/axiosInstance";
import Toaster from "../../Toaster";
import Autocomplete from "react-google-autocomplete";
import Loader from "../../Loader";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import { useTheme } from "@mui/material/styles";
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

function getStyles(name, personName, theme) {
  return {
    fontWeight: personName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

export default function SignUpProvider() {
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState();
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [businessData, setBusinessData] = useState([]);
  const [businessType, setBusinessType] = useState([]);
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [images, setImages] = useState(null);
  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const guestVerify = searchParams.get("type") === "Guest" ? true : false;

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

  console.log("guestVerify", guestVerify);

  const handleSignUp = async (e) => {
    e.preventDefault();

    const requiredFields = {
      Name: name,
      "Business Name": businessName,
      Email: email,
      "Phone Number": phoneNo,
      Address: address,
      Password: password,
      "Business Type": businessType?.length > 0,
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

    console.log("guestVerify", guestVerify);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("businessName", businessName);
    formData.append("email", email);
    formData.append("phoneNo", phoneNo);
    formData.append("addressLine", address);
    formData.append("password", password);
    businessType.forEach((type) => {
      formData.append("businessType[]", type);
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
      const response = await axiosInstance.post("/auth/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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
      console.log(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

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
                      </div>
                    </>
                  ) : (
                    <div className="mt-3 profile d-flex align-items-center justify-content-center flex-column">
                      <img
                        src={URL.createObjectURL(images[0])}
                        alt="profile"
                        className="profile-image"
                      />
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
                          onChange={(e) => {
                            const words = e.target.value.trim().split(/\s+/);
                            const filteredValue = e.target.value.replace(
                              /[0-9]/g,
                              ""
                            );

                            if (words.length <= 5 || e.target.value === "") {
                              // Capitalize first letter of each word and make the rest lowercase
                              const capitalizedValue = filteredValue
                                .toLowerCase()
                                .split(" ")
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                )
                                .join(" ");

                              setName(capitalizedValue);
                            }
                          }}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="5">
                        Business Industry
                      </Form.Label>
                      <Col sm="7">
                        <FormControl className="w-100 select-ion">
                          <Select
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
                          </Select>
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
                        <Form.Control
                          type="text"
                          placeholder="Phone number"
                          value={phoneNo ? `+61${phoneNo}` : ""}
                          onChange={(e) => {
                            const rawValue = e.target.value;
                            // Remove any existing "+61" prefix to avoid duplication
                            const sanitizedValue = rawValue.replace(
                              /^\+0/,
                              ""
                            );
                            // Allow only digits after the prefix
                            const digitsOnly = sanitizedValue.replace(
                              /\D/g,
                              ""
                            );
                            setPhoneNo(digitsOnly);
                          }}
                        />
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
                          placeholder="Registration number"
                          value={registrationNumber}
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
                      <Link
                        to="/terms"
                        className="highlighted-text text-decoration-none"
                      >
                        terms and conditions
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
                        to="/Provider/login"
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
      <Toaster
        message={toastProps.message}
        type={toastProps.type}
        toastKey={toastProps.toastKey}
      />
    </>
  );
}
