import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { handleChangePassword } from "../Slices/userSlice";
import { useNavigate, useParams, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Header from "./Navbar";
import LoggedHeader from "./loggedNavbar";
import Button from "@mui/material/Button";
import logo from "../assets/logo.png";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import "../User/user.css";
import Toaster from "../Toaster";
import Loader from "../Loader";

export default function ChangePassword() {
  const [toastProps, setToastProps] = useState({ message: "", type: "", toastKey: 0 });
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const token =
    localStorage.getItem("hunterToken") ||
    localStorage.getItem("ProviderToken");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await dispatch(
        handleChangePassword({ id, oldPassword, newPassword })
      );
      if (handleChangePassword.fulfilled.match(result)) {
        setToastProps({
          message: "Password changed Successfully",
          type: "success",
          toastKey: Date.now()
        });
        setLoading(false);
        const hunterToken = localStorage.getItem("hunterToken");
        const providerToken = localStorage.getItem("ProviderToken");

        if (hunterToken) {
          setTimeout(() => {
            navigate("/myprofile");
          }, 2000);
        } else if (providerToken) {
          setTimeout(() => {
            navigate("/provider/myprofile");
          }, 2000);
        } else {
          console.error("No token found!");
          setToastProps({
            message: "An error occurred. Please try again.",
            type: "error",
            toastKey: Date.now()
          });
        }
      } else {
        const errorMessage =
          result.payload.message ||
          "Failed to change password. Please check your credentials.";
        setToastProps({ message: errorMessage, type: "error", toastKey: Date.now() });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setToastProps({ message: error, type: "error", toastKey: Date.now() });
      setLoading(false);
    }
  };

  return (
    <>
      {loading === true ? (
        <Loader />
      ) : (
        <div className="bg-welcome">
          {!token ? <Header /> : <LoggedHeader />}

          <div className="container top-avatar login">
            <div className="d-flex justify-content-center align-items-center mt-4 flex-column gap-1">
              <div className="card shadow">
                <div className="card-body">
                  <h2 className="text-center fw-bold fs-1">Change Password</h2>
                  <p className="text-center mt-5 mb-4">
                    Please enter new password to change password
                  </p>
                  <Form className="py-3" onSubmit={handleSubmit}>
                    {" "}
                    {/* Add onSubmit handler */}
                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="oldPassword"
                    >
                      <Form.Label column sm="5" className="px-lg-0">
                        Enter Old Password
                      </Form.Label>
                      <Col sm="7">
                        <Form.Control
                          type="password"
                          placeholder="Enter Old Password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          required // Add required attribute for validation
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="newPassword"
                    >
                      <Form.Label column sm="5" className="px-lg-0">
                        Enter New Password
                      </Form.Label>
                      <Col sm="7">
                        <Form.Control
                          type="password"
                          placeholder="Enter New Password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required // Add required attribute for validation
                        />
                      </Col>
                    </Form.Group>
                    <div className="d-flex justify-content-center align-items-center py-1">
                      <Button
                        variant="contained"
                        color="success"
                        type="submit"
                        className="rounded-0 custom-green bg-green-custom"
                      >
                        Reset
                      </Button>
                    </div>
                  </Form>

                  <span className="my-3 justify-content-center d-flex w-100">
                    Go back to login page?{" "}
                    <Link
                      to="/login"
                      className="highlighted-text text-decoration-none"
                    >
                      Sign in
                    </Link>
                  </span>
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
