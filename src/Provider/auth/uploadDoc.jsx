import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./component/Navbar";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import "../../User/user.css";
import { IoImageOutline } from "react-icons/io5";
import axios from "axios";
import Autocomplete from "react-google-autocomplete";
import Toaster from "../../Toaster";
import Loader from "../../Loader";
import { FaCloudUploadAlt } from "react-icons/fa";
import { styled } from "@mui/material/styles";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function Upload() {
  const [loading, setLoading] = useState(false);
  const [document, setDocument] = useState(null);
  const [toastProps, setToastProps] = useState({ message: "", type: "" });

  const navigate = useNavigate();

  const userType = "hunter";
  const radius = "50";

  console.log(document);

  return (
    <>
      {loading === true ? (
        <Loader />
      ) : (
        <div className="bg-signup h-100vh">
          <Header />
          <div className="container top-avatar login bg-center">
            <div className="d-flex justify-content-center align-items-center mt-4 flex-column gap-1 bg-center">
              <div className="card shadow mb-4">
                <div className="card-body">
                  <h2 className="text-center fw-bold fs-1">Upload Documents</h2>

                  <p className="text-center mt-3 mb-4">Let’s Get Started</p>
                  <Button
                    variant="contained"
                    color="success"
                    className="fw-semibold custom-green-outline w-100 rounded-5 mb-2 fs-6  px-1 px-lg-5"
                    size="small"
                    component="label"
                    role={undefined}
                    tabIndex={-1}
                    startIcon={<FaCloudUploadAlt />}
                  >
                    Upload Documents
                    <VisuallyHiddenInput
                      type="file"
                      onChange={(event) => setDocument(event.target.files)}
                      multiple
                    />
                  </Button>
                  <div className="d-flex justify-content-center gap-2 mt-5 justify-content-lg-between flex-column flex-lg-row align-items-center">
                    <Button
                      variant="outlined"
                      size="large"
                      className=""
                      color="error"
                      onClick={() => {
                        setTimeout(() => {
                          navigate("/provider/pricing");
                        }, 4000);
                      }}
                    >
                      Skip For Now
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      className=""
                      color="success"
                      disabled
                    >
                      Go to Subscription
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Toaster message={toastProps.message} type={toastProps.type} />
    </>
  );
}
