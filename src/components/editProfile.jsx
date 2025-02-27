import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import "../User/user.css";
import { IoImageOutline } from "react-icons/io5";
import LoggedHeader from "../User/Auth/component/loggedNavbar";
import { useDispatch } from "react-redux";
import { getHunterUser, getProviderUser } from "../Slices/userSlice";
import axios from "axios";
import Loader from "../Loader";

export default function EditProfile() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [rate, setRate] = useState("");
  const [password, setPassword] = useState("");
  const hunterToken = localStorage.getItem("hunterToken");
  const providerToken = localStorage.getItem("ProviderToken");
  const hunterId = localStorage.getItem("hunterId");

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
          setName(fetchedUser.contactName || fetchedUser.name || "");
          setNumber(fetchedUser.phoneNo || "");
          setEmail(fetchedUser.email || "");
          setAddress(fetchedUser.address?.addressLine || "");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [dispatch, hunterToken, providerToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phoneNo", number);
    formData.append("email", email);
    formData.append("address", address);
    // formData.append("rate", rate);
console.log(name)
    try {
      const response = await axios.put(
        `http://localhost:7777/api/hunter/updateById/${hunterId}`,
        formData
      );
      console.log(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error updating user data:", error);
    }
  };

  return (
    <>
      {loading && <Loader />}
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
                      <Form.Control
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formPlaintextRate"
                  >
                    <Form.Label column sm="4">
                      Rate/Month
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        type="number"
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                      />
                    </Col>
                  </Form.Group>
                  <div className="d-flex justify-content-center align-items-center py-3">
                    <Button
                      type="submit"
                      variant="contained"
                      color="success"
                      className="rounded-0 custom-green bg-green-custom"
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
    </>
  );
}
