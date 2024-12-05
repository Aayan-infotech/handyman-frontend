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
import facebook from "../assets/logo/facebook.png";
import google from "../assets/logo/iconGoogle.png";
export default function SignUp() {
  return (
    <>
      <div className="bg-signup">
        <Header />
        <div className="container top-avatar login">
          <div className="d-flex justify-content-center align-items-center mt-4 flex-column gap-1">
            <div className="card shadow mb-4">
              <div className="card-body">
               <h2 className="text-center fw-bold fs-1">Sign Up</h2>
                <p className="text-center mt-5 mb-4">Let’s Get Started</p>
                <Form className="py-3">
                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formPlaintextEmail"
                  >
                    <Form.Label column sm="4">
                      Name
                    </Form.Label>
                    <Col sm="6">
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
                    <Col sm="6">
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
                    <Col sm="6">
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
                    <Col sm="6">
                      <Form.Control type="email" placeholder=" Address" />
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
                    <Col sm="6">
                      <Form.Control type="password" placeholder="Password" />
                    </Col>
                  </Form.Group>
                </Form>
                <span>
                  By tapping “Sign Up” you accept our{" "}
                  <Link
                    to="/forgot-password"
                    className="highlighted-text text-decoration-none"
                  >
                    terms and condition
                  </Link>
                </span>

                <div className="d-flex justify-content-center align-items-center py-3">
                  <Button
                    variant="contained"
                    color="success"
                    className="rounded-0 custom-green bg-green-custom"
                  >
                    Signup
                  </Button>
                </div>
                <span className="w-100 d-flex justify-content-center">
                  Go back to login page?{" "}
                  <Link
                    to="/signin"
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
