import React, { useState, useEffect } from "react";
import LoggedHeader from "./auth/component/loggedNavbar";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../components/axiosInstance";
import Loader from "../Loader";
import { useDispatch, useSelector } from "react-redux";
import { getProviderUser } from "../Slices/userSlice";
import Toaster from "../Toaster";
import { FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";
import { useParams } from "react-router-dom";
export default function Pricingwithtype() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [subscriptionTypes, setSubscriptionTypes] = useState([]); // To store subscription types
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



  // Fetch subscription plans based on selected type
  useEffect(() => {

    const getData = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(
          `/SubscriptionNew/subscriptionPlansByType/${id}`
        );
        if (res?.data?.status === 200) {
          setData(res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    getData();

  }, []);

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

              
                </div>

                <div className="row py-3 gy-4 mt-lg-4">
                  {data?.map((item) => (
                    <div className="col-lg-4 col-md-6" key={item._id}>
                      <Link
                        to={`/provider/pricing-detail/${item._id}`}
                        className="d-flex h-100"
                      >
                        <div className="h-100 card price-card border-0 rounded-5 position-relative overflow-hidden px-4 py-5">
                          <div className="card-body d-flex flex-column gap-3 align-items-center">
                            <h3 className="mt-3 text-center">{item.planName || "Plan Name"}</h3>
                            <h5 className="mt-3">${item.amount || "0"}</h5>
                            <h4>KM Radius: {item.kmRadius || "N/A"}</h4>
                            <span className="line-white"></span>
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
