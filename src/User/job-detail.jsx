import React from "react";
import LoggedHeader from "./Auth/component/loggedNavbar";
import { MdMessage , MdOutlineSupportAgent } from "react-icons/md";
import company1 from "./assets/logo/companyLogo.png";
import Chip from "@mui/material/Chip";
import { FaRegCheckCircle } from "react-icons/fa";
import { BiCoinStack } from "react-icons/bi";
import { PiBag } from "react-icons/pi";
import { IoIosStar } from "react-icons/io";
import {Link} from "react-router-dom";


export default function JobDetail() {
  return (
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
      <div className="bg-second py-5">
        <div className="container">
          <div className="row gy-4 gx-lg-2 management">
            <div className="col-lg-6">
              <div className="d-flex flex-column gap-4 align-items-start">
                <div className="d-flex flex-row gap-2 align-items-center">
                  <img src={company1} alt="company image" />
                  <div className="d-flex flex-column align-items-start gap-1">
                    <h3 className="mb-0">Electrical service</h3>
                    <h6>24/01/24</h6>
                  </div>
                </div>
                <div className="d-flex flex-row gap-2 align-items-center flex-wrap">
                  <Chip label="Fulltime" variant="outlined" />
                  <Chip label="On-site working" variant="outlined" />
                  <Chip label="Hourly" variant="outlined" />
                  <Chip label="Hourly" variant="outlined" />
                  <Chip label="Hourly" variant="outlined" />
                </div>
                <ul className="list-unstyled d-flex flex-column gap-2">
                  <li>
                    <span>
                      <FaRegCheckCircle />
                    </span>
                    Sed ut perspiciatis unde omnis{" "}
                  </li>
                  <li>
                    <span>
                      <FaRegCheckCircle />
                    </span>
                    Doloremque laudantium
                  </li>
                  <li>
                    <span>
                      <FaRegCheckCircle />
                    </span>
                    Ipsa quae ab illo inventore
                  </li>
                  <li>
                    <span>
                      <FaRegCheckCircle />
                    </span>
                    Architecto beatae vitae dicta
                  </li>
                  <li>
                    <span>
                      <FaRegCheckCircle />
                    </span>
                    Sunt explicabo
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-5">
              <h3 className="fw-bold">Job Description</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <hr />
              <div className="d-flex flex-column gap-3 align-items-start more-info">
                <div className="d-flex flex-row gap-4 align-items-start w-100">
                  <BiCoinStack className="" />
                  <div className="d-flex flex-column gap-2 align-items-start">
                    <span className="text-muted">Estimated budget</span>
                    <b className="fw-medium fs-5">$500 - $1,000/monthly</b>
                  </div>
                </div>
                <div className="d-flex flex-row gap-4 align-items-start w-100">
                  <PiBag className="" />
                  <div className="d-flex flex-column gap-2 align-items-start">
                    <span className="text-muted">Location</span>
                    <b className="fw-medium fs-5">Medan, Indonesia</b>
                  </div>
                </div>
              </div>
              <hr />
              <div className="d-flex flex-row gap-2 flex-wrap flex-lg-nowrap gap-lg-4 align-items-center w-lg-75">
                <div className="card outline-card">
                  <div className="card-body d-flex flex-row gap-2 align-items-center">
                    <span>4.5</span>
                    <IoIosStar />
                  </div>
                </div>
                <div className="card green-card">
                  <div className="card-body d-flex flex-row gap-2 align-items-center">
                    “he was very quick & polite, happy from service
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
