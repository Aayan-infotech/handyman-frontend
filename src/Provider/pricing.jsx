import React, { useState, useEffect } from "react";
import LoggedHeader from "./auth/component/loggedNavbar";
import { MdMessage, MdOutlineSupportAgent } from "react-icons/md";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader";
import { useDispatch, useSelector } from "react-redux";
import { getProviderUser } from "../Slices/userSlice";

export default function MainProvider() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  const name = localStorage.getItem("ProviderName");
  const dispatch = useDispatch();
  const token = localStorage.getItem("ProviderToken");
  const user = useSelector((state) => state?.user?.user?.data);
  const navigate = useNavigate();
  const location = useLocation();
  const providerId = localStorage.getItem("ProviderId");

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

  useEffect(() => {
    if (subscriptionStatus === 0) {
      const getData = async () => {
        setLoading(true);
        try {
          const res = await axios.get(
            "http://3.223.253.106:7777/api/SubscriptionNew/subscription-plans"
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
          <Link to="/provider/admin/chat/">
            <div className="admin-message">
              <MdOutlineSupportAgent />
            </div>
          </Link>
          <div className="message">
            <Link to="/provider/message">
              <MdMessage />
            </Link>
          </div>
          <div className="bg-second">
            <div className="container">
              <div className="top-section-main py-4 px-lg-5">
                <div className="d-flex justify-content-between flex-column flex-lg-row gap-3 align-items-center pb-3">
                  <h5 className="user">Hello {name}</h5>
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
                            <h3 className="mt-3 text-center">
                              {item.planName}
                            </h3>
                            <h5 className="mt-3">${item.amount}</h5>
                            <h4>KM Radius: {item.kmRadius}</h4>
                            <span className="line-white"></span>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: item.description,
                              }}
                            ></div>
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
    </>
  );
}
