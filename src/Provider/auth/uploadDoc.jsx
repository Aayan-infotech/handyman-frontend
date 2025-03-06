import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [document, setDocument] = useState([]);
  const [toastProps, setToastProps] = useState({ message: "", type: "", toastKey: 0 });
  const providerId = localStorage.getItem("ProviderId");
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const files = event.target.files;
    setDocument(files.length > 0 ? files : null);
  };

  const handleDelete = (indexToDelete) => {
    setDocument((prevDocs) => {
      const updatedDocs = Array.from(prevDocs).filter(
        (_, index) => index !== indexToDelete
      );
      return updatedDocs.length > 0 ? updatedDocs : null;
    });
  };

  const handleUpload = async () => {
    if (!document) return;

    const formData = new FormData();
    Array.from(document).forEach((file) => {
      formData.append("file", file);
    });
    console.log("FormData to be sent:", Object.fromEntries(formData.entries()));
setLoading(true);
    try {
      const response = await axios.post(
        `http://54.236.98.193:7777/api/provider/upload/${providerId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === 200) {
        setToastProps({ message: response.data.message, type: "success" , toastKey: Date.now() });
        setLoading(false);
        setTimeout(() => navigate("/provider/pricing"), 2000);
        
      } else {
        setLoading(false);
        setToastProps({ message: response.data.message, type: "error" , toastKey: Date.now()});
      }
    } catch (error) {
      setLoading(false);
      setToastProps({
        message: error || "Something went wrong",
        type: "error",
        toastKey: Date.now()
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
                    <Stack direction="row" className="flex-wrap gap-1">
                      {Array?.from(document).map((file, index) => (
                        <div className="py-1" key={index}>
                          <Chip
                            label={file?.name}
                            onDelete={() => handleDelete(index)}
                          />
                        </div>
                      ))}
                    </Stack>
                  )}

                  <div className="d-flex justify-content-center gap-2 mt-5 align-items-center">
                    <Button
                      variant="outlined"
                      size="large"
                      color="error"
                      onClick={() => navigate("/provider/pricing")}
                    >
                      Skip For Now
                    </Button>
                  </div>
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
