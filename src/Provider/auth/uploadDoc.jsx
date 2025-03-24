import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./component/Navbar";
import Button from "@mui/material/Button";
import "../../User/user.css";
import { FaCloudUploadAlt } from "react-icons/fa";
import axios from "axios";
import Toaster from "../../Toaster";
import Loader from "../../Loader";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { getProviderUser } from "../../Slices/userSlice";
import { useDispatch } from "react-redux";

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
  const location = useLocation();
  console.log(location.pathname);
  const [loading, setLoading] = useState(false);
  const [document, setDocument] = useState([]);
  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });
  const dispatch = useDispatch();
  const providerId = localStorage.getItem("ProviderId");
  const navigate = useNavigate();
  const getUploadProfile = async () => {
    try {
      if (providerId) {
        const result = await dispatch(getProviderUser());
        if (result.payload?.status === 200) {
          const { files } = result.payload.data;
          setDocument(files);
        } else {
          throw new Error("Failed to fetch user data.");
        }
      }
    } catch (error) {
      console.error("User error:", error);
      setToastProps({
        message: "Error fetching user data",
        type: "error",
        toastKey: Date.now(),
      });
    }
  };

  useEffect(() => {
    getUploadProfile();
  }, []);

  useEffect(() => {
    if (location.pathname === "/provider/upload") {
      const getUploadProfile = async () => {
        setLoading(true);
        try {
          if (providerId) {
            const result = await dispatch(getProviderUser());
            if (result.payload?.status === 200) {
              const { files } = result.payload.data;
              if (files.length === 0) {
                navigate("/provider/upload");
                setLoading(false);
                return;
              }
              navigate("/provider/pricing");
              setLoading(false);
            }
          }
        } catch (error) {
          console.error("User error:", error);
          setToastProps({
            message: "Error fetching user data",
            type: "error",
            toastKey: Date.now(),
          });
        }
      };
      getUploadProfile();
    }
  }, [location.pathname]);

  const handleFileChange = (event) => {
    const files = event.target.files;
    setDocument(files.length > 0 ? files : null);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `http://3.223.253.106:7777/api/provider/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ProviderToken")}`,
          },
        }
      );
      if (response.status === 200) {
        setLoading(false);
        setToastProps({
          message: response.message,
          type: "success",
          toastKey: Date.now(),
        });
      }
    } catch (error) {
      setLoading(false);
      setToastProps({
        message: error || "Something went wrong",
        type: "error",
        toastKey: Date.now(),
      });
    }
  };

  const handleUpload = async () => {
    if (!document || document.length === 0) {
      setToastProps({
        message: "No files uploaded",
        type: "error",
        toastKey: Date.now(),
      });
      return;
    }

    const formData = new FormData();
    Array.from(document).forEach((file) => {
      formData.append("file", file);
    });
    console.log("FormData to be sent:", Object.fromEntries(formData.entries()));
    setLoading(true);
    try {
      const response = await axios.post(
        `http://3.223.253.106:7777/api/provider/upload/${providerId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === 200) {
        setToastProps({
          message: response.data.message,
          type: "success",
          toastKey: Date.now(),
        });
        setTimeout(
          () =>
            navigate(
              location.pathname === "/provider/upload"
                ? "/provider/pricing"
                : "/provider/home"
            ),
          2000
        );
        setLoading(false);
      } else {
        setLoading(false);
        setToastProps({
          message: response.data.message,
          type: "error",
          toastKey: Date.now(),
        });
      }
    } catch (error) {
      setLoading(false);
      setToastProps({
        message: error || "Something went wrong",
        type: "error",
        toastKey: Date.now(),
      });
    }
  };

  console.log(document);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-signup h-100vh">
          <Header />
          <div className="container top-avatar login bg-center document">
            <div className="d-flex justify-content-center align-items-center mt-4 flex-column gap-1 bg-center">
              <div className="card shadow mb-4">
                <div className="card-body">
                  <h2 className="text-center fw-bold fs-1">Upload Documents</h2>
                  <p className="text-center mt-3 mb-4">Let’s Get Started</p>
                  <div className="row gx-2 gy-4">
                    {document.length > 0 ? (
                      <>
                        <div className="col-lg-9">
                          <Button
                            variant="contained"
                            color="success"
                            className="fw-semibold custom-green-outline w-100 rounded-5 mb-2 fs-6 px-1 px-lg-5"
                            size="small"
                            component="label"
                            startIcon={<FaCloudUploadAlt />}
                          >
                            Upload Documents
                            <VisuallyHiddenInput
                              type="file"
                              multiple
                              onChange={handleFileChange}
                            />
                          </Button>
                        </div>
                        <div className="col-lg-3">
                          <Button
                            onClick={handleUpload}
                            size="large"
                            className="custom-green-outline fs-6 w-100 rounded-4 bg-green-custom"
                            color="success"
                          >
                            Submit
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="col-lg-12">
                        <Button
                          variant="contained"
                          color="success"
                          className="fw-semibold custom-green-outline w-100 rounded-5 mb-2 fs-6 px-1 px-lg-5"
                          size="small"
                          component="label"
                          startIcon={<FaCloudUploadAlt />}
                        >
                          Upload Documents
                          <VisuallyHiddenInput
                            type="file"
                            multiple
                            onChange={handleFileChange}
                          />
                        </Button>
                      </div>
                    )}
                  </div>

                  {document && document.length > 0 && (
                    <div direction="row" className=" row gy-4">
                      {Array.from(document).map((file, index) => (
                        <div className="col-lg-4 py-1" key={index}>
                          <div className="card p-3 w-100">
                            <div className="card-body p-0">
                              {file.type?.includes("image") ||
                              file.name?.match(/\.(jpg|jpeg|png|gif)$/i) ||
                              file.path?.includes("image") ||
                              file.path?.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                <img
                                  src={
                                    file instanceof File
                                      ? URL.createObjectURL(file)
                                      : file.path
                                  }
                                  alt="docImage"
                                  className="object-fit-contain w-100 rounded-4"
                                  height={100}
                                />
                              ) : file.type?.includes("pdf") ||
                                file.name?.endsWith(".pdf") ? (
                                <iframe
                                  src={
                                    file instanceof File
                                      ? URL.createObjectURL(file)
                                      : file.path
                                  }
                                  className="w-100 rounded-4 "
                                  height={100}
                                  title={`PDF Preview ${index}`}
                                />
                              ) : (
                                <p className="text-center">
                                  Unsupported file type
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="d-flex justify-content-center gap-2 mt-5 align-items-center">
                    {location.pathname === "/provider/upload" ? (
                      <Button
                        variant="outlined"
                        size="large"
                        color="error"
                        onClick={() => navigate("/provider/pricing")}
                      >
                        Skip For Now
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        size="large"
                        color="error"
                        onClick={() => navigate("/provider/home")}
                      >
                        Back to Home Page
                      </Button>
                    )}
                  </div>
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
