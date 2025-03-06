import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Toaster from "../Toaster";
import Row from "react-bootstrap/Row";
import "../User/user.css";
import { IoImageOutline } from "react-icons/io5";
import LoggedHeader from "../User/Auth/component/loggedNavbar";
import { useDispatch } from "react-redux";
import Autocomplete from "react-google-autocomplete";
import { getHunterUser, getProviderUser } from "../Slices/userSlice";
import axios from "axios";
import Loader from "../Loader";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { ref, set } from "firebase/database";

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
export default function EditProfile() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
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
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [toastProps, setToastProps] = useState({ message: "", type: "", toastKey: 0 });

  const navigate = useNavigate();
  const location = useLocation();
  // const handleChange = (event) => {
  //   const { value } = event.target;
  //   setBusinessType((prev) => {
  //     const selectedValues = Array.isArray(value) ? value : [value];

  //     // Merge old and new selections, ensuring uniqueness
  //     return Array.from(new Set([...prev, ...selectedValues]));
  //   });
  // };

  const handleChange = (event) => {
    const { value } = event.target;
    setBusinessType(typeof value === "string" ? value.split(",") : value);
  };

  useEffect(() => {
    const handleAllData = async () => {
      try {
        const response = await axios.get(
          "http://54.236.98.193:7777/api/service/getAllServices"
        );
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
        } else if (providerToken) {
          const providerResponse = await dispatch(getProviderUser());
          fetchedUser = providerResponse?.payload?.data;
        }

        if (fetchedUser) {
          setName(fetchedUser?.contactName || fetchedUser?.name || "");
          setNumber(fetchedUser?.phoneNo || "");
          setEmail(fetchedUser?.email || "");
          setAddress(fetchedUser?.address?.addressLine || "");
          setBusinessName(fetchedUser?.businessName || "");
          setRegistrationNumber(fetchedUser?.ABN_Number || "");
          setLatitude(fetchedUser?.address?.location?.coordinates[0] || "");
          setLongitude(fetchedUser?.address?.location?.coordinates[1] || "");

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
    formData.append("name", name);
    formData.append("phoneNo", number);
    formData.append("email", email);
    formData.append("addressLine", address);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("ABN_Number", registrationNumber);
    formData.append("userType", providerId ? "provider" : "hunter");
    formData.append("businessName", businessName);

    businessType.forEach((type) => {
      formData.append("businessType[]", type);
    });

    try {
      // Update Backend API
      const response = await axios.put(
        `http://54.236.98.193:7777/api/auth/update/${
          providerId ? providerId : hunterId
        }`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${providerToken || hunterToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        const userUId = providerUid || hunterUid;
        // Update Firestore Database
        if (providerToken) {
          await setDoc(doc(db, "providers", userUId), {
            name,
            email,
            phoneNo: number,
            address,
            latitude,
            longitude,

            blocked: [],
          });

          // Update Realtime Database
        } else {
          await setDoc(doc(db, "hunters", userUId), {
            name,
            email,
            phoneNo: number,
            address,
            latitude,
            longitude,
            blocked: [],
          });
        }
        await set(ref(realtimeDb, "userchats/" + userUId), { chats: [] });
        setLoading(false);
        setToastProps({ message: response?.data?.message, type: "success" , toastKey: Date.now() });
        if (providerToken) {
          navigate(`/provider/home`);
        } else {
          navigate(`/home`);
        }
      }
    } catch (error) {
      setLoading(false);
      setToastProps({ message: error, type: "error", toastKey: Date.now() });
    }
  };

  return (
    <>
      {loading === true ? (
        <Loader />
      ) : (
        <div className="bg-signup">
          <LoggedHeader />
          <div className="container top-avatar login">
            <div className="d-flex justify-content-center align-items-center mt-4 flex-column gap-1">
              <div className="card shadow mb-4">
                <div className="card-body">
                  <h2 className="text-center fw-bold fs-1">Edit Profile</h2>
                  <div className="my-3 profile d-flex align-items-center justify-content-center flex-column">
                    <div className="color-profile d-flex flex-column justify-content-center align-items-center">
                      <IoImageOutline />
                      <span className="fs-6">Upload</span>
                    </div>
                  </div>
                  <Form className="py-3">
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
                          onChange={(e) => setName(e.target.value)}
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
                          value={number}
                          onChange={(e) => setNumber(e.target.value)}
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
                        <Form.Control
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
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
                      <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="4">
                          Business Industry
                        </Form.Label>
                        <Col sm="8">
                          <FormControl className="w-100 select-ion">
                            <Select
                              labelId="demo-multiple-name-label"
                              id="demo-multiple-name"
                              multiple
                              value={businessType} // Should be an array of IDs
                              onChange={handleChange}
                              renderValue={(selected) => selected.join(", ")}
                              // renderValue={(selected) =>
                              //   selected
                              //     .map(
                              //       (id) =>
                              //         businessData.find((data) => data.name === id)
                              //           ?.name
                              //     )
                              //     .join(", ")
                              // }
                            >
                              {businessData.map((data) => (
                                <MenuItem key={data._id} value={data?.name}>
                                  {data.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
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
                          Registration Number
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
                    <div className="d-flex justify-content-center align-items-center py-3">
                      <Button
                        onClick={handleSubmit}
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

     <Toaster message={toastProps.message} type={toastProps.type} toastKey={toastProps.toastKey} />
    </>
  );
}
