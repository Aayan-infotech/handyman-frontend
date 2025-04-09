import React, { useState, useEffect, useCallback } from "react";
import LoggedHeader from "./Auth/component/loggedNavbar";
import { MdMessage, MdOutlineSupportAgent } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import Toaster from "../Toaster";
import axiosInstance from "../components/axiosInstance";
import { getHunterUser } from "../Slices/userSlice";
import { useDispatch } from "react-redux";
import Loader from "../Loader";
import { LuDot } from "react-icons/lu";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import noData from "../assets/no_data_found.gif";
export default function ServicesProvider() {
  //   const [businessType, setBusinessType] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [radius, setRadius] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const businessType = searchParams.get("businessType");
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const providerResponse = await dispatch(getHunterUser());
        const fetchedUser = providerResponse?.payload?.data;
        console.log(fetchedUser);
        if (fetchedUser) {
          const lat = fetchedUser?.address?.location?.coordinates[1] || "";
          const lng = fetchedUser?.address?.location?.coordinates[0] || "";
          const rad = fetchedUser?.address?.radius || "";
          setLatitude(lat);
          setLongitude(lng);
          setRadius(rad);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [dispatch]);

  console.log(businessType);
  const handleProviderNearby = useCallback(async () => {
    setLoading(true);
    if (!latitude || !longitude || !radius || !businessType) return;
    try {
      const decodedBusinessType = decodeURIComponent(businessType);
      const res = await axiosInstance.post(
        `/provider/byBusinessType`,

        {
          businessType: [decodedBusinessType],
          lat: latitude,
          lng: longitude,
          radius: radius,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("hunterToken")}`,
          },
        }
      );
      if (res?.data?.status === 200) {
        setData(res?.data?.data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching nearby providers:", error);
      setLoading(false);
    }
  }, [latitude, longitude, radius, businessType]);

  useEffect(() => {
    handleProviderNearby();
  }, [handleProviderNearby]);

  const filterAddressPatterns = (address) => {
    if (!address) return address;

    // Regular expression to match patterns like C-84, D-19, etc.
    const pattern = /^.*?,\s*/;

    return address.replace(pattern, "").trim();
  };

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
          <div className="container">
            <div className="row gy-4 my-4">
              {data.length === 0 ? (
                <div className="text-center">
                  <img src={noData} alt="No data found" className="img-fluid" />
                </div>
              ) : (
                <>
                  {data.map((text, index) => (
                    <div className="col-lg-4" key={index}>
                      <Link
                        to={`/service-profile/${text._id}`}
                        className="text-decoration-none"
                      >
                        <div className="card rounded-0 h-100 rounded-5 border-0 shadow">
                          <div className="card-body p-4">
                            <div className="d-flex justify-content-end align-items-center flex-row mb-4">
                              <span className="border-full-time">
                                from {(text?.distance / 1000).toFixed(2)} km
                                Away
                              </span>
                            </div>
                            <b>{text.businessName}</b>{" "}
                            <div className="d-flex justify-content-start align-items-center flex-row my-2 flex-wrap">
                              <span>{text.contactName}</span>{" "}
                              <LuDot className="text-secondary fs-4" />
                              <span>
                                {filterAddressPatterns(
                                  text.address.addressLine
                                )}
                              </span>{" "}
                            </div>
                            <span className="text-secondary">
                              Email:{text.email}{" "}
                            </span>
                            <div className="d-flex gap-2 mt-3 flex-wrap">
                              {text.businessType.map((tag, index) => (
                                <Chip
                                  label={tag}
                                  key={index}
                                  className="light-green"
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
