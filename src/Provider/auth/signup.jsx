import react from "react";
import Container from "react-bootstrap/Container";
import Header from "./component/Navbar";
import Button from "@mui/material/Button";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import "../../User/user.css";
import facebook from "../assets/logo/facebook.png";
import google from "../assets/logo/iconGoogle.png";
import { IoImageOutline } from "react-icons/io5";

export default function SignUpProvider() {
  return (
    <>
      <div className="bg-signup">
        <Header />
        <div className="container top-avatar login">
          <div className="d-flex justify-content-center align-items-center mt-4 flex-column gap-1">
            <h1 className="highlighted-text">Service Provider</h1>
            <div className="card shadow mb-4">
              <div className="card-body">
                <h2 className="text-center fw-bold fs-1">Sign Up</h2>
                <p className="text-center mt-4 mb-4">Let’s Get Started</p>
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
                    <Form.Label column sm="5">
                      Name
                    </Form.Label>
                    <Col sm="7">
                      <Form.Control type="text" placeholder="Henry" />
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formPlaintextEmail"
                  >
                    <Form.Label column sm="5">
                      Select Industry
                    </Form.Label>
                    <Col sm="7">
                      <Form.Select aria-label="Default select example">
                        <option>Industry</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </Form.Select>
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formPlaintextEmail"
                  >
                    <Form.Label column sm="5">
                      Business name
                    </Form.Label>
                    <Col sm="7">
                      <Form.Control type="text" placeholder="Business name" />
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formPlaintextEmail"
                  >
                    <Form.Label column sm="5">
                      Business type
                    </Form.Label>
                    <Col sm="7">
                      <Form.Select aria-label="Default select example">
                        <option>Business type</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </Form.Select>
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formPlaintextEmail"
                  >
                    <Form.Label column sm="5">
                      Email Address
                    </Form.Label>
                    <Col sm="7">
                      <Form.Control type="email" placeholder="Email Address" />
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formPlaintextEmail"
                  >
                    <Form.Label column sm="5">
                      Contact Name
                    </Form.Label>
                    <Col sm="7">
                      <Form.Control type="text" placeholder="Contact Name" />
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formPlaintextEmail"
                  >
                    <Form.Label column sm="5">
                      Phone Number
                    </Form.Label>
                    <Col sm="7">
                      <Form.Control type="text" placeholder="Phone number" />
                    </Col>
                  </Form.Group>

                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formPlaintextEmail"
                  >
                    <Form.Label column sm="5">
                      Address
                    </Form.Label>
                    <Col sm="7">
                      <Form.Control type="email" placeholder=" Address" />
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formPlaintextEmail"
                  >
                    <Form.Label column sm="5">
                      Registration number
                    </Form.Label>
                    <Col sm="7">
                      <Form.Control
                        type="email"
                        placeholder=" Registration number"
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formPlaintextPassword"
                  >
                    <Form.Label column sm="5">
                      Password
                    </Form.Label>
                    <Col sm="7">
                      <Form.Control type="password" placeholder="Password" />
                    </Col>
                  </Form.Group>
                </Form>
                <span>
                  By tapping “Sign Up” you accept our{" "}
                  <Link
                    to="/Provider/forgot-password"
                    className="highlighted-text text-decoration-none"
                  >
                    terms and condition
                  </Link>
                </span>

                <div className="d-flex justify-content-center align-items-center py-3">
                  <Link to="/provider/pricing" className=" text-decoration-none  ">
                    <Button
                      variant="contained"
                      color="success"
                      className="rounded-0 custom-green bg-green-custom"
                    >
                      Signup
                    </Button>
                  </Link>
                </div>
                <span className="w-100 d-flex justify-content-center">
                  Go back to login page?{" "}
                  <Link
                    to="/Provider/login"
                    className="highlighted-text text-decoration-none"
                  >
                    Signin
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
