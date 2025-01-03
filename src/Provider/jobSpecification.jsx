import react, { useState } from "react";
import LoggedHeader from "./Auth/component/loggedNavbar";
import { MdMessage, MdEmail, MdCall } from "react-icons/md";
import company1 from "./assets/logo/companyLogo.png";
import Chip from "@mui/material/Chip";
import { FaRegCheckCircle } from "react-icons/fa";
import { BiCoinStack } from "react-icons/bi";
import { PiBag } from "react-icons/pi";
import { IoIosStar } from "react-icons/io";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Modal from "react-bootstrap/Modal";

export default function JobSpecification() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <LoggedHeader />
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
                <div className="d-flex flex-row gap-4 align-items-center pb-3 pt-2">
                  <div className="contact">
                    <Link to="/provider/home">
                      <MdMessage />
                    </Link>
                  </div>
                  <div className="contact">
                    <Link to="/provider/home">
                      <MdEmail />
                    </Link>
                  </div>
                  <div className="contact">
                    <Link to="/provider/home">
                      <MdCall />
                    </Link>
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
            <div className="col-lg-6">
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
              <div className="d-flex flex-row gap-2 flex-wrap flex-lg-nowrap gap-lg-4 align-items-center w-75">
                <Button
                  variant="contained"
                  className="custom-green bg-red-outline rounded-5 py-3 w-50"
                >
                  Reject
                </Button>
                <Button
                  variant="contained"
                  onClick={handleShow}
                  className="custom-green bg-green-custom rounded-5 py-3 w-100"
                >
                  Accept
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title>Job Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3 className="text-center">
            Job Request <br /> Accepted
          </h3>
        </Modal.Body>
        <Link to="/provider/chat/1234" className="mx-auto w-75">
          <Button
            variant="contained"
            className="custom-green bg-green-custom rounded-5 py-3 w-100 mb-4"
          >
            Message
          </Button>
        </Link>
      </Modal>
    </>
  );
}
