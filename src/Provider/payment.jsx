import React from "react";
import LoggedHeader from "./auth/component/loggedNavbar";
import { Link } from "react-router-dom";
import { MdMessage , MdOutlineSupportAgent } from "react-icons/md";
import { AiFillWallet } from "react-icons/ai";
import { SlPaypal } from "react-icons/sl";
import { FaApplePay } from "react-icons/fa";
import { CiBank } from "react-icons/ci";
import { FaWifi } from "react-icons/fa";
import Button from "@mui/material/Button";

export default function Payment() {
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
      <div className="bg-second ">
        <div className="container">
          <div className="top-section-main py-4 px-lg-5">
            <div className="row gy-4 price-line gx-lg-5">
              <div className="col-lg-3">
                <h5 className="fw-medium mb-4">Payment Options</h5>
                <div className="d-flex flex-column gap-3 align-items-center justify-content-center">
                  <div className="card rounded-5 border-0 card-wallet  py-4 px-5">
                    <div className="card-body text-center">
                      <AiFillWallet className="fs-70" />
                    </div>
                  </div>
                  <div className="card rounded-5 border-0   py-4 px-5">
                    <div className="card-body text-center">
                      <SlPaypal className="fs-70" />
                    </div>
                  </div>
                  <div className="card rounded-5 border-0   py-4 px-5">
                    <div className="card-body text-center">
                      <FaApplePay className="fs-70" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4  ">
                <h5 className="fw-medium mb-4 text-center">Select your card</h5>
                <div className="d-flex flex-column gap-3 align-items-center justify-content-center">
                  <div className="card rounded-3 border-0 card-wallet w-100 debit-card ">
                    <div className="card-body text-center p-2">
                      <div className="d-flex justify-content-start align-items-center gap-1 flex-row mb-3">
                        <CiBank className="fs-3" />
                        <h6 className="mb-0">FYI Bank</h6>
                      </div>
                      <span className="text-start d-flex w-100">
                        0000 2363 8364 8269
                      </span>
                      <div className="d-flex justify-content-center align-items-center gap-5 flex-row mt-4">
                        <span className="valid-thru">5/23</span>
                        <span>633</span>
                      </div>
                      <h6 className="mt-3 d-flex w-100">Okechukwu ozioma</h6>
                    </div>
                  </div>
                  <div className="card rounded-3 border-0 card-wallet w-100 credit-card ">
                    <div className="card-body text-center p-2">
                      <div className="d-flex justify-content-between align-items-center gap-1 flex-row mb-3">
                        <div className="d-flex flex-row gap-2 align-items-center justify-content-center ">
                          <CiBank className="fs-3" />
                          <h6 className="mb-0">FYI Bank</h6>
                        </div>
                        <h6 className="mb-0">CREDIT</h6>
                      </div>
                      <div className="text-start d-flex w-100 justify-content-between align-items-center gap-2">
                        <span>0000 2363 8364 8269</span>
                        <span>
                          <FaWifi
                            className="fs-5"
                            style={{ transform: "rotate(90deg)" }}
                          />
                        </span>
                      </div>
                      <div className="d-flex justify-content-center align-items-center gap-5 flex-row mt-4">
                        <span className="valid-thru">5/23</span>
                        <span>633</span>
                      </div>
                      <h6 className="mt-3 d-flex w-100">Okechukwu ozioma</h6>
                    </div>
                  </div>
                  <div className="card rounded-3 border-0 card-wallet w-100 credit-card ">
                    <div className="card-body text-center p-2">
                      <div className="d-flex justify-content-between align-items-center gap-1 flex-row mb-3">
                        <div className="d-flex flex-row gap-2 align-items-center justify-content-center ">
                          <CiBank className="fs-3" />
                          <h6 className="mb-0">FYI Bank</h6>
                        </div>
                        <h6 className="mb-0">CREDIT</h6>
                      </div>
                      <div className="text-start d-flex w-100 justify-content-between align-items-center gap-2">
                        <span>0000 2363 8364 8269</span>
                        <span>
                          <FaWifi
                            className="fs-5"
                            style={{ transform: "rotate(90deg)" }}
                          />
                        </span>
                      </div>
                      <div className="d-flex justify-content-center align-items-center gap-5 flex-row mt-4">
                        <span className="valid-thru">5/23</span>
                        <span>633</span>
                      </div>
                      <h6 className="mt-3 d-flex w-100">Okechukwu ozioma</h6>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-5 ">
                <h5 className="fw-medium mb-4 text-center">Billing Details</h5>
                <div className="d-flex justify-content-center align-items-center flex-column gap-3">
                  <div className="card rounded-3 border-0 card-wallet selected-card w-75">
                    <div className="card-body text-center p-2">
                      <div className="d-flex justify-content-start align-items-center gap-1 flex-row mb-3">
                        <CiBank className="fs-3" />
                        <h6 className="mb-0">FYI Bank</h6>
                      </div>
                      <span className="text-start d-flex w-100">
                        0000 2363 8364 8269
                      </span>
                      <div className="d-flex justify-content-center align-items-center gap-5 flex-row mt-4">
                        <span className="valid-thru">5/23</span>
                        <span>633</span>
                      </div>
                      <h6 className="mt-3 d-flex w-100">Okechukwu ozioma</h6>
                    </div>
                  </div>
                  <div className="mt-5 w-100">
                    <div className="d-flex justify-content-between align-items-center gap-3 px-lg-4">
                      <span className="text-muted fs-5">Custom bag</span>
                      <span className="text-muted fs-5">$50</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center gap-3 mt-2 px-lg-4">
                      <span className="text-muted fs-5">Delivery charge</span>
                      <span className="text-muted fs-5">$5</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between align-items-center gap-3 mt-2 px-lg-4">
                      <span className="text-muted fs-5">Total Amount</span>
                      <span className="text-muted fs-5">$55</span>
                    </div>
                    <Link to="/provider/paymentdetail/123">
                    <Button
                      variant="contained"
                      className="custom-green bg-green-custom rounded-5 py-3 w-100 mt-4"
                    >
                      continue
                    </Button>
                    </Link>
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
