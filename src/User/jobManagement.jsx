import react, { useState, useEffect } from "react";
import LoggedHeader from "./Auth/component/loggedNavbar";
import { IoIosSearch } from "react-icons/io";
import Form from "react-bootstrap/Form";
import { MdMessage } from "react-icons/md";
import company1 from "./assets/logo/companyLogo.png";
import company2 from "./assets/logo/companyLogo1.png";
import company3 from "./assets/logo/companyLogo2.png";
import { BiCoinStack } from "react-icons/bi";
import { PiBag } from "react-icons/pi";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import Toaster from "../Toaster";
import Loader from "../Loader";
import noData from "../assets/no_data_found.gif";

export default function JobManagement() {
  const [data, setData] = useState([]);
  const [toastProps, setToastProps] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const provider = searchParams.get("provider");
  const providerId = localStorage.getItem("ProviderId");

  const handleProviderJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://44.196.64.110:7777/api/jobpost/getJobPostByUserId`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ProviderToken")}`,
          },
        }
      );
      if (res.status === 200) {
        setToastProps({ message: res.data.message, type: "success" });
        setData(res.data.data);
        setLoading(false);
      }
    } catch (error) {
      setToastProps({ message: error.message, type: "error" });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (provider) {
      handleProviderJobs();
    }
  }, []);
  return (
    <>
      {loading && <Loader />}
      <LoggedHeader />
      <div className="message">
        <Link to="/message">
          <MdMessage />
        </Link>
      </div>
      <div className="bg-second py-3">
        <div className="container">
          <div className="d-flex justify-content-start align-items-center">
            <div className="position-relative icon ">
              <IoIosSearch className="mt-1" />
              <Form.Control
                placeholder="search for something"
                className="search"
              />
            </div>
          </div>
          <div className="row mt-4 gy-4 management">
            <div className="col-lg-12">
              {data.length === 0 && (
                <div className="d-flex justify-content-center align-items-center flex-column gap-3">
                  <img src={noData} alt="image" />
                </div>
              )}
              {data.map((item) => {
                <Link to="/job-detail/1234">
                  <div className="card border-0 rounded-3 px-4">
                    <div className="card-body">
                      <div className="row gy-4 gx-1 align-items-center">
                        <div className="col-lg-4">
                          <div className="d-flex flex-row gap-3 align-items-center">
                            <img src={company1} alt="company1" />
                            <div className="d-flex flex-column align-items-start gap-1">
                              <h3 className="mb-0">Electrical service</h3>
                              <h6>24/01/24</h6>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="d-flex flex-column flex-lg-row gap-2 gap-lg-4 align-items-center">
                            <div className="d-flex flex-row gap-2 align-items-center">
                              <BiCoinStack />
                              <h5 className="mb-0">$500 - $1,000</h5>
                            </div>
                            <div className="d-flex flex-row gap-2 align-items-center">
                              <PiBag />
                              <h5 className="mb-0 ">Medan, Indonesia</h5>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-2">
                          <div className="">
                            <h5 className="mb-0 text-success text-center text-lg-start">
                              Completed
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>;
              })}
            </div>
          </div>
        </div>
      </div>

      <Toaster message={toastProps.message} type={toastProps.type} />
    </>
  );
}
