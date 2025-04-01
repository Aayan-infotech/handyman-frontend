import React, { useState, useEffect } from "react";
import LoggedHeader from "./Auth/component/loggedNavbar";
import { MdMessage } from "react-icons/md";
import Form from "react-bootstrap/Form";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  LocalizationProvider,
  MobileTimePicker,
  MobileDatePicker,
  DatePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField, Stack } from "@mui/material";
import axios from "axios";
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
  const [city, setCity] = useState("");
  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });
  const [selectedRadius, setSelectedRadius] = useState();

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
        const response = await axios.get(
          "http://3.223.253.106:7777/api/service/getAllServices"
        );
        if (response.status === 200) {
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
    formData.append("city", city);
    businessType.forEach((type) => {
      formData.append("businessType[]", type);
    });

    formData.append("requirements", requirements);
    formData.append("timeframe[from]", startTime.unix());
    formData.append("timeframe[to]", endTime.unix());
    formData.append("date", time.toISOString());

    // Append each selected file correctly
    // documents.forEach((file) => {
    //   formData.append("documents[]", file);
    // });

    Array.from(documents).forEach((file) => {
      formData.append("documents", file);
    });

    console.log("FormData to be sent:", Object.fromEntries(formData.entries()));

    try {
      const response = await axios.post(
        "http://3.223.253.106:7777/api/jobpost/jobpost",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setToastProps({
          message: response?.data?.message,
          type: "success",
          toastKey: Date.now(),
        });
        setLoading(false);
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      }
    } catch (error) {
      setToastProps({
        message: error?.response?.data?.error || error.response?.data?.message,
        type: "error",
        toastKey: Date.now(),
      });
      setLoading(false);
    }
  };

  console.log(businessType);

  return (
    <>
      {loading === true ? (
        <Loader />
      ) : (
        <>
          <LoggedHeader />
          <Link to="/support/chat/1">
            <div className="admin-message">
              <MdOutlineSupportAgent />
            </div>
          </Link>
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
                        // renderValue={(selected) =>
                        //   selected
                        //     .map(
                        //       (id) =>
                        //         businessData.find((data) => data._id === id)
                        //           ?.name
                        //     )
                        //     .join(", ")
                        // }
                        renderValue={(selected) => {
                          if (!selected) {
                            return <span>Choose Provider Radius</span>;
                          }
                          return selected;
                        }}
                      >
                        <MenuItem value="" disabled>
                          Choose Provider Radius
                        </MenuItem>
                        {radiusOptions.map((data, index) => (
                          <MenuItem key={index} value={data}>
                            {data}
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
                        // renderValue={(selected) =>
                        //   selected
                        //     .map(
                        //       (id) =>
                        //         businessData.find((data) => data._id === id)
                        //           ?.name
                        //     )
                        //     .join(", ")
                        // }
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
                  <div className="col-lg-4">
                    <Form.Control
                      type="file"
                      className="input1"
                      onChange={(e) => setDocuments(Array.from(e.target.files))}
                      multiple
                    />
                  </div>
                  <div className="col-lg-4">
                    <div className="card outline-card-none">
                      <div className="card-body d-flex flex-column align-items-center">
                        <label className="text-secondary mb-2 fs-6 text-center w-100">
                          Choose Date
                        </label>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <MobileDatePicker
                            defaultValue={dayjs()}
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

      <Toaster
        message={toastProps.message}
        type={toastProps.type}
        toastKey={toastProps.toastKey}
      />
    </>
  );
}
