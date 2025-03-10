import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./Navbar";
import "../User/user.css";
import axios from "axios";
import Toaster from "../Toaster";
import Loader from "../Loader";
import { getProviderUser } from "../Slices/userSlice";
import { useDispatch } from "react-redux";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";

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

const radiusOptions = ["10 km", "20 km", "40 km", "80 km", "160 km"];

export default function ChangeRadius() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });
  const [selectedRadius, setSelectedRadius] = useState([]);
  const dispatch = useDispatch();
  const providerId = localStorage.getItem("ProviderId");
  const navigate = useNavigate();
  const theme = useTheme();

  const handleChange = (event) => {
    const { value } = event.target;
    setSelectedRadius(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-signup h-100vh ">
          <Header />
          <div className="container top-avatar login bg-center document">
            <div className="d-flex justify-content-center align-items-center mt-4 flex-column gap-1 bg-center">
              <div className="card shadow mb-4">
                <div className="card-body">
                  <h2 className="text-center fw-bold fs-1">Change Radius</h2>
                  <p className="text-center mt-3 mb-4">Let’s Get Started</p>
                  <FormControl className="w-100" sx={{ m: 1 }}>
                    <InputLabel id="radius-select-label">
                      Select Radius
                    </InputLabel>
                    <Select
                      labelId="radius-select-label"
                      id="radius-select"
                      multiple
                      value={selectedRadius}
                      onChange={handleChange}
                      input={<OutlinedInput label="Select Radius" />}
                      MenuProps={MenuProps}
                    >
                      {radiusOptions.map((radius) => (
                        <MenuItem key={radius} value={radius}>
                          {radius}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <div className="d-flex justify-content-center align-items-center">
                    <Button
                      size="large"
                      className="rounded-0 custom-green bg-green-custom w-100 text-light"
                      color="success"
                    >
                      Submit
                    </Button>
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
