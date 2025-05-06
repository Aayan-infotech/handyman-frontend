import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Toaster from "../Toaster";
import Row from "react-bootstrap/Row";
import "../User/user.css";
import { IoImageOutline } from "react-icons/io5";
import LoggedHeader from "./loggedNavbar";
import { useDispatch } from "react-redux";
import Autocomplete from "react-google-autocomplete";
import { getHunterUser, getProviderUser } from "../Slices/userSlice";
import axiosInstance from "./axiosInstance";
import Loader from "../Loader";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { ref, set } from "firebase/database";
import { FaPen } from "react-icons/fa";
import { auth, db } from "../Chat/lib/firestore";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";
import { realtimeDb } from "../Chat/lib/firestore";
import notFound from "./assets/noprofile.png";

export default function EditProfile() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState(null);
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const hunterToken = localStorage.getItem("hunterToken");
  const providerToken = localStorage.getItem("ProviderToken");
  const hunterId = localStorage.getItem("hunterId");
  const providerId = localStorage.getItem("ProviderId");
  const providerUid = localStorage.getItem("ProviderUId");
  const hunterUid = localStorage.getItem("hunterUId");
  const [businessData, setBusinessData] = useState([]);
  const [businessType, setBusinessType] = useState([]);
  const [images, setImages] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); // Store the preview image

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });

  const navigate = useNavigate();
  const location = useLocation();

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

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        let fetchedUser = null;
        if (hunterToken) {
          const hunterResponse = await dispatch(getHunterUser());
          fetchedUser = hunterResponse?.payload?.data;
        } else if (!fetchedUser && providerToken) {
          const providerResponse = await dispatch(getProviderUser());
          fetchedUser = providerResponse?.payload?.data;
        }

        if (fetchedUser) {
          setName(fetchedUser?.contactName || fetchedUser?.name || "");
          setImages(fetchedUser?.images || "");
          setNumber(fetchedUser?.phoneNo || "");
          setEmail(fetchedUser?.email || "");
          setAddress(fetchedUser?.address?.addressLine || "");
          setBusinessName(fetchedUser?.businessName || "");
          setRegistrationNumber(fetchedUser?.ABN_Number || "");
          setLatitude(fetchedUser?.address?.location?.coordinates[1] || "");
          setLongitude(fetchedUser?.address?.location?.coordinates[0] || "");

          setBusinessType(
            Array.isArray(fetchedUser.businessType)
              ? fetchedUser?.businessType
              : []
          );
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [dispatch, hunterToken, providerToken]);

  useEffect(() => {
    if (businessData.length > 0 && businessType.length > 0) {
      // Check if businessType IDs exist in businessData
      const validBusinessTypes = businessType.filter((id) =>
        businessData.some((service) => service._id === id)
      );
      setBusinessType(validBusinessTypes);
    }
  }, [businessData]);

  console.log(businessType);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    {
      localStorage.getItem("ProviderId")
        ? formData.append("contactName", name)
        : formData.append("name", name);
    }
    formData.append("phoneNo", number);
    formData.append("email", email);
    formData.append("addressLine", address);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("ABN_Number", registrationNumber);

    // Append each business type separately
    businessType.forEach((type) => {
      formData.append("businessType[]", type);
    });

    formData.append("businessName", businessName);

    if (images && images instanceof FileList && images.length > 0) {
      formData.append("images", images[0]);
    } else if (typeof images === "string") {
      formData.append("images", images);
    }

    try {
      const response = await axiosInstance.put(
        `/${providerId ? "Prvdr" : "hunter"}/updateById/${
          providerId ? providerId : hunterId
        }`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${providerToken || hunterToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setLoading(false);
        setToastProps({
          message: response?.data?.message,
          type: "success",
          toastKey: Date.now(),
        });
        navigate(providerToken ? `/provider/myprofile` : `/myprofile`);
      }
    } catch (error) {
      setLoading(false);
      setToastProps({
        message: error?.response?.data?.error,
        type: "error",
        toastKey: Date.now(),
      });
    }
  };

  useEffect(() => {
    if (images && typeof images === "string") {
      setPreviewImage(images); // Use the existing image URL
    }
  }, [images]);

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

  console.log(images);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-signup">
          <LoggedHeader />
          <div className="container top-avatar login">
            <div className="d-flex justify-content-center align-items-center mt-4 flex-column gap-1">
              <div className="card shadow mb-4">
                <div className="card-body">
                  <h2 className="text-center fw-bold fs-1">Edit Profile</h2>
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
                      <div className="position-relative">
                        <img
                          src={previewImage || notFound}
                          alt="profile"
                          className="profile-image edit-profile"
                        />
                        <div className="position-absolute end-0 bottom-0">
                          <Form.Control
                            className="pos-image-selector2"
                            type="file"
                            onChange={handleImageChange}
                          />
                          <FaPen className="pos-image-selector3 "/>
                        </div>
                      </div>
                    </div>
                  )}
                  <Form className="py-3" onSubmit={handleSubmit}>
                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formPlaintextName"
                    >
                      <Form.Label column sm="4">
                        Name
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          type="text"
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
                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formPlaintextPhone"
                    >
                      <Form.Label column sm="4">
                        Phone Number
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          type="text"
                          placeholder="Phone number"
                          value={number ? `+0${number}` : ""}
                          onChange={(e) => {
                            let inputValue = e.target.value;

                            // Remove all non-digit characters
                            inputValue = inputValue.replace(/\D/g, "");

                            // If the input starts with +0, remove the + and keep the 0
                            if (inputValue.startsWith("0")) {
                              inputValue = inputValue.substring(1); // Remove the leading 0
                              setNumber(inputValue);
                            }
                          }}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formPlaintextEmail"
                    >
                      <Form.Label column sm="4">
                        Email Address
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control type="email" value={email} disabled />
                      </Col>
                    </Form.Group>
                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formPlaintextAddress"
                    >
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
                    {providerToken && (
                      <Form.Group
                        as={Row}
                        className="mb-3"
                        controlId="formPlaintextAddress"
                      >
                        <Form.Label column sm="4">
                          Business Name
                        </Form.Label>
                        <Col sm="8">
                          <Form.Control
                            type="text"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                          />
                        </Col>
                      </Form.Group>
                    )}
                    {providerToken && (
                      <Form.Group
                        as={Row}
                        className="mb-3"
                        controlId="formPlaintextAddress"
                      >
                        <Form.Label column sm="4">
                          ABN Number
                        </Form.Label>
                        <Col sm="8">
                          <Form.Control
                            type="text"
                            value={registrationNumber}
                            onChange={(e) =>
                              setRegistrationNumber(e.target.value)
                            }
                          />
                        </Col>
                      </Form.Group>
                    )}
                    {providerToken && (
                      <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="4">
                          Change Business Type
                        </Form.Label>
                        <Col sm="8">
                          <FormControl className="w-100 select-ion">
                            <Select
                              labelId="demo-multiple-name-label"
                              id="demo-multiple-name"
                              multiple
                              value={businessType}
                              onChange={handleChange}
                              renderValue={(selected) => selected.join(", ")}
                            >
                              {businessData.map((data) => (
                                <MenuItem key={data._id} value={data.name}>
                                  {data.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Col>
                      </Form.Group>
                    )}
                    {providerToken && businessType.length > 0 && (
                      <div className="business-type-cards mt-3">
                        <h5>Selected Business Types:</h5>
                        <div className="d-flex flex-wrap gap-2">
                          {businessType.map((type, index) => (
                            <div
                              key={index}
                              className="rounded-5 custom-green bg-green-custom"
                              style={{ color: "white" }}
                            >
                              {type}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="d-flex justify-content-center align-items-center py-3">
                      <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        className="rounded-0 custom-green bg-green-custom w-100"
                      >
                        Save
                      </Button>
                    </div>
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
