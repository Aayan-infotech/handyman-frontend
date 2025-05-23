import React, { useState, useEffect } from "react";
import Header from "./Navbar";
import "../User/user.css";
import axiosInstance from "./axiosInstance";
import Toaster from "../Toaster";
import Loader from "../Loader";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import LoggedHeader from "./loggedNavbar";
import { getHunterUser, getProviderUser } from "../Slices/userSlice";
import { useDispatch } from "react-redux";
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

const radiusOptions = ["10", "20", "40", "80", "160"];

export default function ChangeRadius() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [radius, setRadius] = useState("");
  const [loading, setLoading] = useState(false);
  const hunterToken = localStorage.getItem("hunterToken");
  const providerToken = localStorage.getItem("ProviderToken");
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let fetchedUser = null;
        if (hunterToken) {
          const hunterResponse = await dispatch(getHunterUser());
          fetchedUser = hunterResponse?.payload?.data;
        } else if (!fetchedUser && providerToken) {
          const providerResponse = await dispatch(getProviderUser());
          fetchedUser = providerResponse?.payload?.data;
        }

        if (fetchedUser) {
          setRadius(fetchedUser?.address?.radius);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [dispatch]);
  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });
  const [selectedRadius, setSelectedRadius] = useState();

  const handleChange = (event) => {
    setSelectedRadius(parseInt(event.target.value, 10)); // Ensure number format
  };

  const handleChangeRadius = async () => {
    setLoading(true);
    const token = localStorage.getItem("hunterToken");

    if (!token) {
      setToastProps({
        message: "Authentication failed: No token provided.",
        type: "error",
        toastKey: toastProps.toastKey + 1,
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.patch(
        "/hunter/updateRadius",
        { radius: selectedRadius * 1000 }, // Send as a number
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setToastProps({
          message: "Radius updated successfully!",
          type: "success",
          toastKey: Date.now(),
        });
        setTimeout(() => {
          navigate("/myprofile");
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating radius:", error);
      setToastProps({
        message: "Failed to update radius.",
        type: "error",
        toastKey: toastProps.toastKey + 1,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-signup h-100vh ">
          <LoggedHeader />
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
                    {/* <Select
                      labelId="radius-select-label"
                      id="radius-select"
                      value={selectedRadius} // Always controlled
                      onChange={handleChange}
                      input={<OutlinedInput label="Select Radius" />}
                      MenuProps={MenuProps}
                    >
                      {radiusOptions.map((radius) => (
                        <MenuItem key={radius} value={parseInt(radius)}>
                          {radius}
                        </MenuItem>
                      ))}
                    </Select> */}

                    <Select
                      labelId="radius-select-label"
                      id="radius-select"
                      value={selectedRadius} // Always controlled
                      onChange={handleChange}
                      input={<OutlinedInput label="Select Radius" />}
                      MenuProps={MenuProps}
                    >
                      {radiusOptions.map((radius) => (
                        <MenuItem key={radius} value={parseInt(radius, 10)}>
                          {radius}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <p>
                    You have a radius of{" "}
                    {selectedRadius ? selectedRadius : radius / 1000} km
                  </p>

                  <div className="d-flex justify-content-center align-items-center">
                    <Button
                      size="large"
                      className="rounded-0 custom-green bg-green-custom w-100 text-light"
                      color="success"
                      onClick={handleChangeRadius}
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
