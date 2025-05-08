import React, { useState, useEffect } from "react";
import LoggedHeader from "./auth/component/loggedNavbar";
import { MdMessage, MdOutlineSupportAgent } from "react-icons/md";

import { Select, MenuItem, FormControl, InputLabel, Box } from "@mui/material";

import { Link, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../components/axiosInstance";
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
    const getUploadProfile = async () => {
      setLoading(true);
      try {
        if (providerId) {
          const result = await dispatch(getProviderUser());
          if (result.payload?.status === 200) {
            const subscriptionStatus = result.payload.data.subscriptionStatus;
            setSubscriptionStatus(subscriptionStatus);
            if (location.pathname === "/provider/pricing") {
              if (subscriptionStatus === 1) {
                navigate("/provider/home");
                return;
              }
            }
          }
        }
      } catch (error) {
        console.error("User error:", error);
      } finally {
        setLoading(false);
      }
    };
    getUploadProfile();
  }, [location.pathname, providerId, dispatch, navigate]);

  const handleCoupon = async () => {
    try {
      const response = await axiosInstance.post("/voucher/apply", {
        code: voucher,
        userId: providerId,
      });
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
        const response = await axiosInstance.get("/voucher");
        setVoucherOptions(response.data.data || []); // Assuming the data comes in a 'data' property
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
      setLoading(false);
    };

    fetchVouchers();
  }, []);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(
          "/SubscriptionNew/subscription-type"
        );
        if (res?.data?.status === 200) {
          setData(res?.data?.data);
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    if (location.pathname === "/provider/pricing") {
      if (subscriptionStatus === 0) {
        getData();
      }
    }
    if (location.pathname === "/provider/subscription") {
      getData();
    }
  }, [subscriptionStatus]);

  return (
    <>
      {loading === true ? (
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
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {/* Voucher Dropdown */}
                      <Form.Control
                        placeholder="  Do you have any voucher?"
                        value={voucher}
                        onChange={(e) => setVoucher(e.target.value)}
                        style={{ borderRadius: "20px 0px 0px 20px" }}
                      />
                      <Button
                        variant="contained"
                        color="success"
                        className="custom-green bg-green-custom"
                        onClick={handleCoupon}
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
