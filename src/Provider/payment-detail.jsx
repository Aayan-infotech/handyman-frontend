import React from "react";
import LoggedHeader from "./auth/component/loggedNavbar";
import { Link } from "react-router-dom";
import { MdMessage , MdOutlineSupportAgent } from "react-icons/md";
import { CiBank } from "react-icons/ci";
import { FaWifi } from "react-icons/fa";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";

export default function PaymentDetail() {
  return (
    <>
        <LoggedHeader />
                           <Link to="/provider/chat/1">
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
              <div className="col-lg-4  price-line-line">
                <h5 className="fw-medium mb-4">Payment Options</h5>
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

              <div className="col-lg-7 offset-lg-1">
                <h5 className="fw-medium mb-4 text-center">
                  Enter card details
                </h5>
                <div className="d-flex justify-content-center align-items-center flex-column w-100">
                  <div className="card rounded-5 border-0 w-100">
                    <div className="card-body text-center">
                      <div className="row">
                        <div className="col-lg-8 mx-auto">
                          <Box
                            component="form"
                            noValidate
                            autoComplete="off"
                            className="w-100 d-flex flex-column gap-4"
                          >
                            <TextField
                              id="standard-basic"
                              label="Card Name"
                              variant="standard"
                              className="w-100"
                            />
                            <TextField
                              id="standard-basic"
                              label="Card Number"
                              variant="standard"
                              className="w-100"
                            />
                            <div className="d-flex justify-content-between gap-5 flex-row">
                              <TextField
                                id="standard-basic"
                                label="Expiry Date"
                                variant="standard"
                                className="w-100"
                              />
                              <TextField
                                id="standard-basic"
                                label="CVV"
                                variant="standard"
                                className="w-100"
                              />
                            </div>
                            <FormGroup>
                              <FormControlLabel
                                required
                                control={<Checkbox />}
                                label="I agree to the Terms and Conditions"
                              />
                              <FormControlLabel
                                required
                                control={<Checkbox />}
                                label="Save card details"
                              />
                            </FormGroup>
                            <Link to="/provider/home">
                            <Button
                              variant="contained"
                              className="custom-green bg-green-custom rounded-5 py-3 w-100 mt-4"
                            >
                              Pay Now
                            </Button>
                            </Link>
                          </Box>
                        </div>
                      </div>
                    </div>
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
