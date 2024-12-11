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
export default function Login() {
  return (
    <>
      <div className="bg-welcome">
        <Header />
        <div className="container top-avatar login">
          <div className="d-flex justify-content-center align-items-center mt-4 flex-column gap-1">
            <div className="card shadow">
              <div className="card-body">
                <h2 className="text-center fw-bold fs-1">LOGIN</h2>
                <p className="text-center mt-5 mb-4">Great You are Back</p>
                <Form className="py-3">
                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formPlaintextEmail"
                  >
                    <Form.Label column sm="3">
                      Email
                    </Form.Label>
                    <Col sm="7">
                      <Form.Control type="email" placeholder="Email Address" />
                    </Col>
                  </Form.Group>

                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formPlaintextPassword"
                  >
                    <Form.Label column sm="3">
                      Password
                    </Form.Label>
                    <Col sm="7">
                      <Form.Control type="password" placeholder="Password" />
                    </Col>
                  </Form.Group>
                </Form>
                <Link
                  to="/forgot-password"
                  className="highlighted-text text-decoration-none text-end d-flex justify-content-end py-3"
                >
                  Forgot Password
                </Link>
                <div className="d-flex justify-content-center align-items-center py-3">
                  <Link
                    to="/home"
                    className=" text-decoration-none  "
                  >
                    <Button
                      variant="contained"
                      color="success"
                      className="rounded-0 custom-green bg-green-custom"
                    >
                      Login
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <span>Or sign in with</span>
            <div className="d-flex flex-row gap-3 align-items-center icons-color mt-2 mb-4">
              <div className="card shadow-lg rounded-5 border-0 d-flex align-items-center py-2 px-5 w-fit-content">
                <Link to="/">
                  <img src={google} alt="google" className="" />
                </Link>
              </div>
              <div className="card shadow-lg rounded-5 border-0 d-flex align-items-center  py-2 px-5 w-fit-content">
                <Link to="/">
                  <img src={facebook} alt="facebook" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
