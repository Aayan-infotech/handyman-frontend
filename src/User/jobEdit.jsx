import React, { useState, useEffect } from "react";
import LoggedHeader from "./Auth/component/loggedNavbar";
import { MdMessage } from "react-icons/md";
import Form from "react-bootstrap/Form";
import Button from "@mui/material/Button";
import { Link, useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import Tooltip from "@mui/material/Tooltip";

import {
  LocalizationProvider,
  MobileTimePicker,
  MobileDatePicker,
  DatePicker,
} from "@mui/x-date-pickers";
import Modal from "react-bootstrap/Modal";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField, Stack } from "@mui/material";
import axiosInstance from "../components/axiosInstance";
import Autocomplete from "react-google-autocomplete";
import Toaster from "../Toaster";
import Loader from "../Loader";
import FormControl from "@mui/material/FormControl";
import { useTheme } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { MdOutlineSupportAgent } from "react-icons/md";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { FaTrash } from "react-icons/fa";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight: personName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

const extractCity = (addressComponents) => {
  for (let component of addressComponents) {
    if (component.types.includes("locality")) {
      return component.long_name; // City name
    }
    if (component.types.includes("administrative_area_level_1")) {
      return component.long_name; // Fallback if locality is not found
    }
  }
  return "";
};

export default function JobEdit() {
  const { id } = useParams();
  const [startTime, setStartTime] = useState(dayjs().hour(9).minute(0));
  const [endTime, setEndTime] = useState(dayjs().hour(17).minute(0));
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("");
  const [radius, setRadius] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [show, setShow] = useState(false);
  const [modalMode, setModalMode] = useState("view"); // 'view' or 'add'
  const [newDocuments, setNewDocuments] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = (mode) => {
    setModalMode(mode);
    setShow(true);
  };
  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });
  const [selectedRadius, setSelectedRadius] = useState("");

  const handleChangeRadius = (event) => {
    setSelectedRadius(event.target.value);
  };
  const radiusOptions = ["10", "20", "40", "80", "160"];

  const [businessType, setBusinessType] = useState([]);
  const [requirements, setRequirements] = useState("");
  const [documents, setDocuments] = useState([]);
  const [businessData, setBusinessData] = useState([]);
  const [time, setTime] = useState(dayjs());
  const token = localStorage.getItem("hunterToken");
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { value } = event.target;
    setBusinessType(typeof value === "string" ? value.split(",") : value);
  };

  // Fetch job details and business types
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch business types
        const servicesResponse = await axiosInstance.get(
          "/service/getAllServices",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (servicesResponse.status === 200) {
          setBusinessData(servicesResponse?.data?.data);
        }

        // Fetch job details if ID exists
        if (id) {
          const jobResponse = await axiosInstance.get(
            `/jobpost/jobpost-details/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (jobResponse.status === 200) {
            const jobData = jobResponse.data.data;
            setTitle(jobData.title);
            setBudget(jobData.estimatedBudget);
            setSelectedRadius(jobData?.jobLocation?.jobRadius / 1000); // Convert back to km
            setAddress(jobData.jobLocation.jobAddressLine);
            setDocuments(jobData.documents || []);
            setLatitude(jobData?.jobLocation?.location?.coordinates[1]);
            setLongitude(jobData?.jobLocation?.location?.coordinates[0]);
            setCity(jobData?.jobLocation?.city);
            setBusinessType(jobData.businessType || []);
            setRequirements(jobData.requirements);

            // Convert UNIX timestamps to dayjs objects
            if (jobData.timeframe) {
              setStartTime(dayjs.unix(jobData.timeframe.from));
              setEndTime(dayjs.unix(jobData.timeframe.to));
            }

            if (jobData.date) {
              setTime(dayjs(jobData.date));
            }
          }
        }
      } catch (error) {
        console.log(error);
        setToastProps({
          message: "Failed to fetch job details",
          type: "error",
          toastKey: Date.now(),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("longitude", longitude);
    formData.append("latitude", latitude);
    formData.append("jobRadius", selectedRadius * 1000);
    formData.append("jobAddressLine", address);
    formData.append("estimatedBudget", budget);
    formData.append("city", city);
    businessType.forEach((type) => {
      formData.append("businessType[]", type);
    });

    formData.append("requirements", requirements);
    formData.append("timeframe[from]", startTime.unix());
    formData.append("timeframe[to]", endTime.unix());
    formData.append("date", time.toISOString());

    // Add existing documents
    documents.forEach((file) => {
      if (file instanceof File || file instanceof Blob) {
        formData.append("documents", file);
      } else if (file.url) {
        // If it's an existing file from server, you might want to handle differently
        // Maybe send the URL or ID to keep it
        formData.append("existingDocuments[]", file.url);
      }
    });

    // Add new documents
    Array.from(newDocuments).forEach((file) => {
      formData.append("documents", file);
    });

    try {
      const response = await axiosInstance.put(`/jobpost/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        setToastProps({
          message: response?.data?.message || "Job updated successfully",
          type: "success",
          toastKey: Date.now(),
        });
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      }
    } catch (error) {
      setToastProps({
        message:
          error?.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to update job",
        type: "error",
        toastKey: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddFiles = (e) => {
    const files = Array.from(e.target.files);
    setNewDocuments(files);
  };

  const handleSaveNewFiles = () => {
    setDocuments([...documents, ...newDocuments]);
    setNewDocuments([]);
    handleClose();
  };

  const handleDeleteFile = (index) => {
    const updatedDocuments = [...documents];
    updatedDocuments.splice(index, 1);
    setDocuments(updatedDocuments);
  };


  return (
    <>
      {loading === true ? (
        <Loader />
      ) : (
        <>
          <LoggedHeader />
          {/* <Link to="/support/chat/1">
            <Tooltip title="Admin chat" placement="left-start">
              <div className="admin-message">
                <MdOutlineSupportAgent />
              </div>
            </Tooltip>
          </Link> */}

          <Link to="/message">
            <Tooltip title="Admin chat" placement="left-start">
              <div className="message">
                <MdMessage />
              </div>
            </Tooltip>
          </Link>

          <div className="bg-second py-3">
            <div className="container">
              <div className="top-section-main py-4">
                <h1 className="text-center fw-normal">
                  {id ? "Edit Your Job" : "Create New Job"}
                </h1>
                <div className="row gy-5 align-items-center align-items-lg-start form-post-job mt-2">
                  <div className="col-lg-4">
                    <Form.Control
                      type="text"
                      placeholder="Job Title"
                      className="input1"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="col-lg-4">
                    <Autocomplete
                      className="form-control input1"
                      apiKey={import.meta.env.VITE_GOOGLE_ADDRESS_KEY}
                      style={{ width: "100%" }}
                      onPlaceSelected={(place) => {
                        const formattedAddress =
                          place?.formatted_address || place?.name;
                        setAddress(formattedAddress);
                        setLatitude(place.geometry.location.lat());
                        setLongitude(place.geometry.location.lng());
                        const extractedCity = extractCity(
                          place.address_components
                        );
                        setCity(extractedCity);
                      }}
                      options={{
                        types: ["address"],
                      }}
                      defaultValue={address}
                    />
                  </div>
                  <div className="col-lg-4">
                    <Form.Control
                      type="Number"
                      placeholder="Estimated budget"
                      className="input1"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                    />
                  </div>
                  <div className="col-lg-4">
                    <FormControl className="w-100 mt-lg-2">
                      <Select
                        className="input1 bg-white p-1"
                        id="demo-multiple-radius"
                        input={<OutlinedInput />}
                        value={selectedRadius}
                        onChange={handleChangeRadius}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        renderValue={(selected) => {
                          if (!selected) {
                            return <span>Choose Provider Radius</span>;
                          }
                          return selected; // Display in km
                        }}
                      >
                        <MenuItem value="" disabled>
                          Choose Provider Radius
                        </MenuItem>
                        {radiusOptions.map((data, index) => (
                          <MenuItem key={index} value={data}>
                            {data} km
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="col-lg-4">
                    <FormControl className="w-100 mt-lg-2">
                      <Select
                        className="input1 bg-white p-1"
                        id="demo-multiple-name"
                        multiple
                        input={<OutlinedInput />}
                        value={businessType}
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
                            {data?.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className={` col-lg-4`}>
                    <Form.Control
                      type="file"
                      className="input1"
                      onChange={(e) => setDocuments(Array.from(e.target.files))}
                      multiple
                    />
                    {documents.length > 0 && (
                      <div className="d-flex flex-row gap-3 mt-3">
                        <button
                          className="btn btn-info btn-sm w-100"
                          onClick={() => handleShow("view")}
                        >
                          See
                        </button>
                        <button
                          className="btn btn-success btn-sm w-100"
                          onClick={() => handleShow("add")}
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="col-lg-4">
                    <div className="card outline-card-none">
                      <div className="card-body d-flex flex-column align-items-center">
                        <label className="text-secondary mb-2 fs-6 text-center w-100">
                          Choose Date
                        </label>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <MobileDatePicker
                            value={time}
                            className="standard-input"
                            shouldDisableDate={(date) =>
                              date.isBefore(dayjs(), "day")
                            }
                            onChange={(newValue) => setTime(newValue)}
                            renderInput={(params) => <TextField {...params} />}
                          />
                        </LocalizationProvider>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="card outline-card-none">
                      <div className="card-body">
                        <label className="text-secondary mb-2 fs-6 text-center w-100">
                          TimeStamp
                        </label>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <Stack
                            spacing={2}
                            direction="row"
                            className="standard-input"
                          >
                            <MobileTimePicker
                              value={startTime}
                              onChange={(newValue) => setStartTime(newValue)}
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                            />
                            <MobileTimePicker
                              value={endTime}
                              onChange={(newValue) => setEndTime(newValue)}
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                            />
                          </Stack>
                        </LocalizationProvider>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <Form.Control
                      as="textarea"
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      rows={3}
                      placeholder="requirements ......."
                    />
                  </div>

                  <div className="col-lg-4 mx-auto pt-4">
                    <Button
                      variant="contained"
                      color="success"
                      className="custom-green py-3 w-100 rounded-5 bg-green-custom"
                      onClick={id ? handleUpdate : handleAdd}
                    >
                      {id ? "Update Job" : "Post Job"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === "view"
              ? "Your Uploaded Documents"
              : "Add More Documents"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalMode === "view" ? (
            <div className="mt-2">
              {documents.length > 0 ? (
                <>
                  <h6>Uploaded Files:</h6>
                  <div className="row">
                    {documents.map((file, index) => {
                      // Handle both string URLs and File objects
                      const isFileObject =
                        file instanceof File || file instanceof Blob;
                      const fileUrl = isFileObject
                        ? URL.createObjectURL(file)
                        : file.url || file;
                      const fileName = isFileObject
                        ? file.name
                        : fileUrl.split("/").pop();

                      // Determine file type
                      const fileExtension = fileName
                        .split(".")
                        .pop()
                        .toLowerCase();
                      const isImage = [
                        "jpg",
                        "jpeg",
                        "png",
                        "webp",
                        "gif",
                      ].includes(fileExtension);
                      const isPDF = fileExtension === "pdf";

                      return (
                        <div className="col-md-4 mb-3" key={index}>
                          <div className="card h-100">
                            <div className="card-body p-2">
                              {isImage ? (
                                <img
                                  src={fileUrl}
                                  alt={fileName}
                                  className="img-fluid"
                                  style={{
                                    height: "150px",
                                    objectFit: "cover",
                                  }}
                                />
                              ) : isPDF ? (
                                <embed
                                  src={fileUrl}
                                  width="100%"
                                  height="150px"
                                  type="application/pdf"
                                />
                              ) : (
                                <div
                                  className="document-preview d-flex align-items-center justify-content-center bg-light"
                                  style={{ height: "150px" }}
                                >
                                  <i className="fas fa-file-alt fa-3x text-secondary"></i>
                                </div>
                              )}
                              <div className="mt-2 d-flex justify-content-between align-items-center">
                                <small
                                  className="text-truncate"
                                  style={{ maxWidth: "70%" }}
                                >
                                  {fileName}
                                </small>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleDeleteFile(index)}
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p>No documents uploaded yet</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <Form.Control
                type="file"
                className="mb-3"
                onChange={handleAddFiles}
                multiple
              />
              {newDocuments.length > 0 && (
                <div className="mt-3">
                  <h6>Files to be added:</h6>
                  <ul className="list-group">
                    {Array.from(newDocuments).map((file, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        {file.name}
                        <span className="badge bg-primary rounded-pill">
                          {(file.size / 1024).toFixed(2)} KB
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleClose}>
            Close
          </button>
          {modalMode === "add" && newDocuments.length > 0 && (
            <button className="btn btn-success" onClick={handleSaveNewFiles}>
              Add Files
            </button>
          )}
        </Modal.Footer>
      </Modal>
      <Toaster
        message={toastProps.message}
        type={toastProps.type}
        toastKey={toastProps.toastKey}
      />
    </>
  );
}
