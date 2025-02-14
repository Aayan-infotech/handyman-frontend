import react from "react";
import Container from "react-bootstrap/Container";
import Header from "./component/Navbar";
import Button from "@mui/material/Button";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import "../user.css";
import { IoImageOutline } from "react-icons/io5";
import LoggedHeader from "./component/loggedNavbar";
export default function EditProfile() {
  return (
    <>
      <div className="bg-signup">
        <LoggedHeader />
        <div className="container top-avatar login">
          <div className="d-flex justify-content-center align-items-center mt-4 flex-column gap-1">
            <div className="card shadow mb-4">
              <div className="card-body">
                <h2 className="text-center fw-bold fs-1">Edit Profile</h2>
                <div className="my-3 profile d-flex align-items-center justify-content-center flex-column">
                  <div className="color-profile d-flex flex-column justify-content-center align-items-center">
                    <IoImageOutline />
                    <span className="fs-6">Upload</span>
                  </div>
                </div>

                <Form className="py-3">
                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formPlaintextEmail"
                  >
                    <Form.Label column sm="4">
                      Name
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control type="text" placeholder="Henry" />
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formPlaintextEmail"
                  >
                    <Form.Label column sm="4">
                      Phone Number
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control type="text" placeholder="Phone number" />
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formPlaintextEmail"
                  >
                    <Form.Label column sm="4">
                      Email Address
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control type="email" placeholder="Email Address" />
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formPlaintextEmail"
                  >
                    <Form.Label column sm="4">
                      Address
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control type="email" placeholder=" Address" />
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formPlaintextEmail"
                  >
                    <Form.Label column sm="4">
                      Rate/Month
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control type="email" placeholder=" Rate/Month" />
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formPlaintextPassword"
                  >
                    <Form.Label column sm="4">
                      Password
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control type="password" placeholder="Password" />
                    </Col>
                  </Form.Group>
                  {/* <div className="d-flex flex-row flex-wrap justify-content-between gap-3 gap-lg-1 align-items-center profile">
                    <div className="color-profile px-3 py-2 pt-1 rounded-5 fs-5">
                      <span className="fs-6">Electrical</span>
                    </div>
                    <div className="color-profile px-3 py-2 pt-1 rounded-5 fs-5">
                      <span className="fs-6">Electronics</span>
                    </div>
                    <div className="color-profile px-3 py-2 pt-1 rounded-5 fs-5">
                      <span className="fs-6">Mechanics</span>
                    </div>
                    <div className="color-profile px-3 py-2 pt-1 rounded-5 fs-5">
                      <span className="fs-6">Plumbing</span>
                    </div>
                  </div> */}
                </Form>

                <div className="d-flex justify-content-center align-items-center py-3">
                  <Link to="/home" className=" text-decoration-none  ">
                    <Button
                      variant="contained"
                      color="success"
                      className="rounded-0 custom-green bg-green-custom"
                    >
                      Save
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
