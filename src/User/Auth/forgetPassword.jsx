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
export default function ForgetPassword() {
  return (
    <>
      <div className="bg-welcome">
        <Header />
        <div className="container top-avatar login">
          <div className="d-flex justify-content-center align-items-center mt-4 flex-column gap-1">
            <div className="card shadow">
              <div className="card-body">
               <h2 className="text-center fw-bold fs-1">Reset Password</h2>
                <p className="text-center mt-5 mb-4">Please enter your registered email to reset password</p>
                <Form className="py-3">
                  <Form.Group
                    as={Row}
                    className="mb-3 "
                    controlId="formPlaintextEmail"
                  >
                    <Form.Label column sm="4">
                    Email Address
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control type="email" placeholder="Email Address" />
                    </Col>
                  </Form.Group>

                 
                </Form>
               
                <div className="d-flex justify-content-center align-items-center py-1">
                  <Button
                    variant="contained"
                    color="success"
                    className="rounded-0 custom-green bg-green-custom"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
            <span className="my-3">
             
              <Link
                to="/login"
                className="highlighted-text text-decoration-none"
              >
                Sign in
              </Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
