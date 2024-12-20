import react from "react";
import LoggedHeader from "./Auth/component/loggedNavbar";
import { MdMessage } from "react-icons/md";
import { GoDownload } from "react-icons/go";
import Form from "react-bootstrap/Form";
import Button from "@mui/material/Button";
import {Link} from "react-router-dom";

export default function NewJob() {
  return (
    <>
      <LoggedHeader />
      <div className="message"><Link to="/message">
        <MdMessage />
</Link>
      </div>
      <div className="bg-second py-3">
        <div className="container">
          <div className="top-section-main py-4">
            <h1 className="text-center fw-normal">
              Fill the form to post the job!
            </h1>
            <div className="row gy-5 align-items-center align-items-lg-start form-post-job">
              <div className="col-lg-4">
                <div className="d-flex align-items-center justify-content-center flex-row gap-3">
                  <div className="download">
                    <GoDownload />
                  </div>
                  <span className="fw-medium fs-4">Upload Picture</span>
                </div>
              </div>
              <div className="col-lg-4">
                <Form.Control
                  type="text"
                  placeholder="Job Title"
                  className="mt-lg-3"
                />
              </div>
              <div className="col-lg-4">
                <Form.Control
                  type="text"
                  placeholder="Location"
                  className="mt-lg-3"
                />
              </div>
              <div className="col-lg-4">
                <Form.Control type="text" placeholder="Estimated budget" />
              </div>
              <div className="col-lg-4">
                <Form.Select aria-label="Default select example">
                  <option>Select radius for provider</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </Form.Select>
              </div>
              <div className="col-lg-4">
                <Form.Select aria-label="Default select example">
                  <option>Select Service</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </Form.Select>
              </div>
              <div className="col-lg-4">
                <Form.Select aria-label="Default select example">
                  <option>Select Service Type</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </Form.Select>
              </div>
              <div className="col-lg-4">
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="requirements ......."
                />
              </div>
              <div className="col-lg-4">
                <Form.Control type="file" />
                
              </div>
              <div className="col-lg-4 mx-auto pt-4">
                <Button
                  variant="contained"
                  color="success"
                  className="custom-green py-3 w-100 rounded-5 bg-green-custom"
                >
                 Post JOB
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
