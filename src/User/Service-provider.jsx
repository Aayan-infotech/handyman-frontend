import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getAddress } from "../Slices/addressSlice";
import LoggedHeader from "./Auth/component/loggedNavbar";
import { IoIosSearch } from "react-icons/io";
import Form from "react-bootstrap/Form";
import { MdMessage, MdOutlineSupportAgent } from "react-icons/md";
// import company1 from "./assets/logo/companyLogo.png";
// import company2 from "./assets/logo/companyLogo1.png";
// import company3 from "./assets/logo/companyLogo2.png";
import { BiCoinStack } from "react-icons/bi";
import { PiBag } from "react-icons/pi";
import { Link } from "react-router-dom";
import Loader from "../Loader";
import Toaster from "../Toaster";
import { GrMapLocation } from "react-icons/gr";
import NoData from "../assets/no_data_found.gif";

export default function ServiceProvider() {
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState([]);
  const [latitude, setLatitude] = useState(26.86223751316575);
  const [longitude, setLongitude] = useState(80.99808160498773);
  // const [latitude, setLatitude] = useState(null);
  // const [longitude, setLongitude] = useState(null);
  const [toastProps, setToastProps] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const address = useSelector((state) => state?.address?.address?.[0]);

  // Fetch address and set latitude/longitude
  useEffect(() => {
    dispatch(getAddress());
  }, [dispatch]);

  // Update latitude & longitude when address changes
  // useEffect(() => {
  //   if (address?.location?.coordinates) {
  //     setLatitude(address.location.coordinates[0]);
  //     setLongitude(address.location.coordinates[1]);
  //   }
  // }, [address]);

  // Fetch service providers only after latitude & longitude are set
  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      handleAllData();
    }
  }, [latitude, longitude]);

  const handleAllData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://54.236.98.193:7777/api/hunter/getNearbyServiceProviders",
        { latitude, longitude }
      );
      console.log(response);
      if (response.status === 200) {
        setLoading(false);
        setData(response?.data?.data || []);
        setToastProps({ message: response?.data?.message, type: "success" });
      }
      if (response.data.data.length === 0) {
        setToastProps({
          message: "No service provider available in your area",
          type: "info",
        });
        setLoading(false);
        setData([]);
      }
    } catch (error) {
      setToastProps({
        message: error?.response?.data?.error || "Failed to fetch data",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  console.log(data);

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
              <div className="d-flex justify-content-start align-items-center">
                <div className="position-relative icon">
                  <IoIosSearch className="mt-1" />
                  <Form.Control
                    placeholder="search for something"
                    className="search"
                  />
                </div>
              </div>
              {data.length === 0 ? (
                <div className="d-flex justify-content-center flex-column gap-1 align-items-center">
                  <img src={NoData} alt="noData" className="w-nodata"/>
                </div>
              ) : (
                <div className="row mt-4 gy-4 management">
                  {data?.map((provider, index) => (
                    <div key={provider._id} className="col-lg-12">
                      <Link to={`/service-profile/${provider._id}`}>
                        <div className="card border-0 rounded-3 px-4">
                          <div className="card-body">
                            <div className="row gy-4 gx-1 align-items-center">
                              <div className="col-lg-4">
                                <div className="d-flex flex-row gap-3 align-items-center">
                                  <div className="d-flex flex-column align-items-start gap-1">
                                    <h3 className="mb-0">
                                      {provider.businessName}
                                    </h3>
                                    <h6>
                                      {provider.businessType?.[0] ||
                                        "No Category"}
                                    </h6>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-8">
                                <div className="d-flex flex-column flex-lg-row gap-2 gap-lg-4 align-items-center">
                                  <div className="d-flex flex-row gap-2 align-items-center">
                                    <GrMapLocation />
                                    <h5 className="mb-0 d-flex flex-row gap-2 align-items-center">
                                      <span>
                                        {(provider.distance / 1000).toFixed(2)}{" "}
                                      </span>
                                      <span>km</span>
                                    </h5>
                                  </div>
                                  <div className="d-flex flex-row gap-2 align-items-center">
                                    <PiBag />
                                    <h5 className="mb-0">
                                      {provider.address.addressLine}
                                    </h5>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <Toaster message={toastProps.message} type={toastProps.type} />
        </>
      )}
    </>
  );
}
