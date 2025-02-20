import react, { useState, useEffect } from "react";
import LoggedHeader from "./Auth/component/loggedNavbar";
import { MdMessage } from "react-icons/md";
import { GoDownload } from "react-icons/go";
import Form from "react-bootstrap/Form";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField, Stack } from "@mui/material";
import axios from "axios";
import Autocomplete from "react-google-autocomplete";
import Toaster from "../Toaster";
import Loader from "../Loader";

export default function NewJob() {
  const [startTime, setStartTime] = useState(dayjs().hour(9).minute(0));
  const [endTime, setEndTime] = useState(dayjs().hour(17).minute(0));
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("");
  const [radius, setRadius] = useState("");
  const [address, setAddress] = useState("");
  const [toastProps, setToastProps] = useState({ message: "", type: "" });
  const [businessType, setBusinessType] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [requirements, setRequirements] = useState("");
  const [documents, setDocuments] = useState([]);
  const [businessData, setBusinessData] = useState([]);
  const [serviceData, setServiceData] = useState("");
  console.log(localStorage.getItem("hunterToken"));

  useEffect(() => {
    const handleAllData = async () => {
      try {
        const response = await axios.get(
          "http://54.236.98.193:7777/api/service/getAllServices"
        );
        if (response.status === 201) {
          setBusinessData(response?.data?.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    handleAllData();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("longitude", longitude);
    formData.append("latitude", latitude);
    formData.append("jobRadius", radius);
    formData.append("jobAddressLine", address);
    formData.append("estimatedBudget", budget);
    formData.append("businessType", businessType);
    formData.append("services", serviceType);
    formData.append("requirements", requirements);
    formData.append("timeframe[from]", startTime.toISOString());
    formData.append("timeframe[to]", endTime.toISOString());

    // Append each selected file correctly
    documents.forEach((file) => {
      formData.append("documents", file);
    });

    console.log("FormData to be sent:", Object.fromEntries(formData.entries()));

    try {
      const response = await axios.post(
        "http://54.236.98.193:7777/api/jobpost/jobpost",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("hunterToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setToastProps({ message: response?.data?.message, type: "success" });
        setLoading(false);
        setTimeout(() => {
          setToastProps({ message: "", type: "" });
        }, 2000);
      }
    } catch (error) {
      setToastProps({ message: error?.response?.data?.error, type: "error" });
      setLoading(false);
    }
  };

  return (
    <>
      {loading === true ? (
        <Loader />
      ) : (
        <>
          <LoggedHeader />
          <div className="message">
            <Link to="/message">
              <MdMessage />
            </Link>
          </div>
          <div className="bg-second py-3">
            <div className="container">
              <div className="top-section-main py-4">
                <h1 className="text-center fw-normal">
                  Fill the form to post the job!
                </h1>
                <div className="row gy-5 align-items-center align-items-lg-start form-post-job mt-2">
                  {/* <div className="col-lg-4">
                <div className="d-flex align-items-center justify-content-center flex-row gap-3">
                  <div className="download">
                    <GoDownload />
                  </div>
                  <span className="fw-medium fs-4">Upload Picture</span>
                </div>
              </div> */}
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
                      apiKey="AIzaSyDg2wdDb3SFR1V_3DO2mNVvc01Dh6vR5Mc"
                      style={{ width: "100%" }}
                      onPlaceSelected={(place) => {
                        const formattedAddress =
                          place.formatted_address || place.name;
                        setAddress(formattedAddress);
                        setLatitude(place.geometry.location.lat());
                        setLongitude(place.geometry.location.lng());
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
                    <Form.Control
                      type="Number"
                      placeholder="Radius for Provider"
                      className="input1"
                      value={radius}
                      onChange={(e) => setRadius(e.target.value)}
                    />
                  </div>
                  <div className="col-lg-4">
                    <Form.Select
                      value={businessType}
                      onChange={(e) => {
                        const selectedBusiness = e.target.value;
                        setBusinessType(selectedBusiness);

                        // Find the selected business object
                        const businessObj = businessData.find(
                          (b) => b.name === selectedBusiness
                        );

                        // If found, update serviceData with its services
                        setServiceData(businessObj ? businessObj.services : []);
                      }}
                    >
                      <option value="">Select Industry</option>
                      {businessData.map((data) => (
                        <option key={data._id} value={data.name}>
                          {data.name}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                  <div className="col-lg-4">
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
                  <div className="col-lg-4">
                    <Form.Control
                      type="file"
                      className="input1"
                      onChange={(e) => setDocuments(Array.from(e.target.files))}
                      multiple
                    />
                  </div>
                  <div className="col-lg-4 mx-auto pt-4">
                    <Button
                      variant="contained"
                      color="success"
                      className="custom-green py-3 w-100 rounded-5 bg-green-custom"
                      onClick={handleAdd}
                    >
                      Post JOB
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <Toaster message={toastProps.message} type={toastProps.type} />
    </>
  );
}
