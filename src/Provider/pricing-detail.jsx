import react from "react";
import LoggedHeader from "./Auth/component/loggedNavbar";
import { MdMessage } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaRegCircleCheck } from "react-icons/fa6";
import Button from "@mui/material/Button";

export default function PricingProvider() {
  return (
    <>
      <LoggedHeader />
      <div className="message">
        <Link to="/provider/message">
          <MdMessage />
        </Link>
      </div>
      <div className="bg-second fixed-curl">
        <div className="container">
          <div className="top-section-main py-4 px-lg-5">
            <h3 className="pb-3">Hello Anshuman</h3>
            <h2 className="fw-bold fs-1 mt-4">Monthly</h2>
            <div className="row mt-5 px-3 px-lg-0">
              <div className="col-lg-4 mx-auto pt-4">
                <div className="d-flex flex-column gap-4">
                  <div className="d-flex flex-row gap-2 align-items-center justify-content-between price-detail">
                    <h2>
                      <span className="highlighted-text">30GB</span> Per Month
                    </h2>
                    <FaRegCircleCheck />
                  </div>
                  <div className="d-flex flex-row gap-2 align-items-center justify-content-between price-detail">
                    <h2>
                      <span className="highlighted-text">5TB</span> Per Month
                    </h2>
                    <FaRegCircleCheck />
                  </div>
                  <div className="d-flex flex-row gap-2 align-items-center justify-content-between price-detail">
                    <h2>
                      <span className="highlighted-text">1</span> CPU’s
                    </h2>
                    <FaRegCircleCheck />
                  </div>
                  <Button variant="contained" className="custom-green bg-green-custom rounded-5 py-3" >
                  Purchase
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
