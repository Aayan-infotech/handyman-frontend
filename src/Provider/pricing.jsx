import React, { useState, useEffect } from "react";
import LoggedHeader from "./auth/component/loggedNavbar";
import { MdMessage, MdOutlineSupportAgent } from "react-icons/md";

import { Select, MenuItem, FormControl, InputLabel, Box } from "@mui/material";

import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader";
import { useDispatch, useSelector } from "react-redux";
import { getProviderUser } from "../Slices/userSlice";
import Button from "@mui/material/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Toaster from "../Toaster";
export default function MainProvider() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [voucher, setVoucher] = useState("");
  const [voucherOptions, setVoucherOptions] = useState([]);
  const name = localStorage.getItem("ProviderName");
  const dispatch = useDispatch();
  const token = localStorage.getItem("ProviderToken");
  const user = useSelector((state) => state?.user?.user?.data);
  const navigate = useNavigate();
  const location = useLocation();
  const providerId = localStorage.getItem("ProviderId");
  const [toastProps, setToastProps] = useState({
    message: "",
    type: "",
    toastKey: 0,
  });
  useEffect(() => {
    if (location.pathname === "/provider/pricing") {
      const getUploadProfile = async () => {
        try {
          if (providerId) {
            setLoading(true);
            const result = await dispatch(getProviderUser());
            if (result.payload?.status === 200) {
              const subscriptionStatus = result.payload.data.subscriptionStatus;

              setSubscriptionStatus(subscriptionStatus);
              if (subscriptionStatus === 1) {
                navigate("/provider/home");
                setLoading(false);
                return;
              }
              navigate("/provider/pricing");
              setLoading(false);
            }
          }
        } catch (error) {
          console.error("User error:", error);
        }
      };
      getUploadProfile();
    }
  }, [location.pathname]);

  console.log(subscriptionStatus);

  const handleCoupon = async () => {
    try {
      const response = await axios.post(
        "http://3.223.253.106:7777/api/voucher/apply",
        { code: voucher, userId: providerId }
      );
      console.log(response);
      setVoucher("");
      setToastProps({
        message: "Copon Applied Successfully",
        type: "success",
        toastKey: Date.now(),
      });
      setTimeout(() => {
        navigate("/provider/home");
      }, 2000);
    } catch (error) {
      console.log(error);
      setToastProps({
        message: error?.response?.data?.message,
        type: "error",
        toastKey: Date.now(),
      });
    }
  };

  // Fetch voucher options from the API
  useEffect(() => {
    const fetchVouchers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://3.223.253.106:7777/api/voucher"
        );
        setVoucherOptions(response.data.data || []); // Assuming the data comes in a 'data' property
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
      setLoading(false);
    };

    fetchVouchers();
  }, []);

  useEffect(() => {
    if (subscriptionStatus === 1) {
      const getData = async () => {
        setLoading(true);
        try {
          const res = await axios.get(
            "http://3.223.253.106:7777/api/SubscriptionNew/subscription-type"
          );
          if (res?.data?.status === 200) {
            setData(res?.data?.data);
          }
        } catch (error) {
          console.log(error);
        }
        setLoading(false);
      };
      getData();
    }
  }, [subscriptionStatus]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <LoggedHeader />

          <div className="bg-second">
            <div className="container">
              <div className="top-section-main py-4 px-lg-5">
                <div className="row ">
                  <div className="col-lg-4">
                    <h5 className="user d-flex justify-content-center justify-content-lg-start">
                      Hello {name}
                    </h5>
                  </div>

                  <div className="col-lg-4 ms-auto">
                    <Box display="flex" alignItems="center" gap={2}>
                      {/* Voucher Dropdown */}
                      <FormControl
                        fullWidth
                        variant="standard"
                        style={{ borderRadius: "20px 0px 0px 20px" }}
                      >
                        <InputLabel id="voucher-select-label">
                          Do you have any voucher?
                        </InputLabel>
                        <Select
                          labelId="voucher-select-label"
                          id="voucher-select"
                          value={voucher}
                          onChange={(e) => setVoucher(e.target.value)}
                          label="Voucher"
                          className="border-0"
                        >
                          {loading ? (
                            <MenuItem disabled>Loading...</MenuItem>
                          ) : voucherOptions.length > 0 ? (
                            voucherOptions.map((voucherOption) => (
                              <MenuItem
                                key={voucherOption._id}
                                value={voucherOption.code}
                              >
                                {voucherOption.code} -{" "}
                                {voucherOption.description}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>No vouchers available</MenuItem>
                          )}
                        </Select>
                      </FormControl>

                      {/* Apply Button */}
                      <Button
                        variant="contained"
                        color="success"
                        className="custom-green bg-green-custom"
                        onClick={handleCoupon}
                        style={{ marginTop: "10px" }}
                      >
                        Apply
                      </Button>
                    </Box>
                  </div>
                </div>
              </div>
            </div>
            <div className="container-fluid">
              <div className="top-section-main py-4 px-lg-5">
                <div className="row">
                  {/* Add Heading here */}
                  <div className="col-12">
                    <h2 className="text-center">Choose Your Plan Type</h2>
                  </div>
                </div>

                <div className="row py-3 gy-4">
                  {data?.map((item) => (
                    <div className="col-lg-4 col-md-6" key={item._id}>
                      <Link
                        to={`/provider/pricingtype/${item._id}`}
                        className="d-flex h-100 w-100"
                      >
                        <div className="h-100 w-100 card price-card border-0 rounded-5 position-relative overflow-hidden px-4 py-15">
                          <div className="card-body d-flex flex-column gap-3 align-items-center">
                            <h3 className="mt-3 text-center">{item.type}</h3>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
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
