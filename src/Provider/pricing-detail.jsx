import React, { useState, useEffect } from "react";
import LoggedHeader from "./Auth/component/loggedNavbar";
import { MdMessage } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { FaRegCircleCheck } from "react-icons/fa6";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { getProviderUser } from "../Slices/userSlice";
import Loader from "../Loader";
import axios from "axios"; // Import axios

export default function PricingProvider() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false); // Define loading state
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.user?.data);

  useEffect(() => {
    dispatch(getProviderUser()).then(() => {
      setName(user.contactName);
    });
  }, []);
  console.log(id);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://44.196.64.110:7777/api/subscription/getSubscriptionById/${id}`
        );
        setData(res?.data?.data);
        setTitle(res?.data?.data?.title);
        setDescription(res?.data?.data?.description);
        console.log(data);

        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  console.log(data);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <LoggedHeader />
          <div className="">
            <div className="message">
              <Link to="/message">
                <MdMessage />
              </Link>
            </div>
            <div className="bg-second fixed-curl">
              <div className="container">
                <div className="top-section-main py-4 px-lg-5">
                  <h3 className="pb-3">Hello {name}</h3>
                  <h2 className="fw-bold fs-1 mt-4">{title}</h2>
                  <div className="row mt-5 px-3 px-lg-0">
                    <div className="col-lg-4 mx-auto pt-4">
                      <div className="d-flex flex-column gap-4">
                        <div className="d-flex flex-row gap-2 align-items-center justify-content-between price-detail">
                          <h2>
                            <span className="highlighted-text">30GB</span> Per
                            Month
                          </h2>
                          <FaRegCircleCheck />
                        </div>
                        <div className="d-flex flex-row gap-2 align-items-center justify-content-between price-detail">
                          <h2>
                            <span className="highlighted-text">5TB</span> Per
                            Month
                          </h2>
                          <FaRegCircleCheck />
                        </div>
                        <div className="d-flex flex-row gap-2 align-items-center justify-content-between price-detail">
                          <h2>
                            <span className="highlighted-text">1</span> CPU’s
                          </h2>
                          <FaRegCircleCheck />
                        </div>
                        <span className="text-dark">{title}</span>
                        <Link
                          to="/provider/payment"
                          className="text-decoration-none "
                        >
                          <Button
                            variant="contained"
                            className="custom-green bg-green-custom rounded-5 py-3 w-100"
                          >
                            Purchase
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
