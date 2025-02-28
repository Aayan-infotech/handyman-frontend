import React from "react";
import error from "./assets/404icon.png";
import SplitText from "./splitText";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
export default function Error() {
  const navigate = useNavigate();

  const providerId = localStorage.getItem("ProviderId");
  const hunterId = localStorage.getItem("hunterId");
  return (
    <div className="error bg-second error-100vh">
      <div className="container error-100vh">
        <div className="row align-items-lg-center gx-lg-5 error-100vh">
          <div className="col-lg-6">
            <img src={error} alt="404" className="w-100 h-100 object-fit-cover" />
          </div>
          <div className="col-lg-6">
            <div className="d-flex justify-content-center">
              <SplitText
                text="404 | Page Not Found"
                className="fs-1 fw-bold "
                delay={150}
                animationFrom={{
                  opacity: 0,
                  transform: "translate3d(0,50px,0)",
                }}
                animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
                easing="easeOutCubic"
                threshold={0.2}
                rootMargin="-50px"
              />
            </div>

            <Button
              variant="text"
              color="success"
              className="fw-semibold custom-green-outline w-100 rounded-5 fs-5 mt-4"
              size="small"
              onClick={
                providerId
                  ? () => navigate(`/provider/home`)
                  : () => navigate(`/home`)
              }
            >
              Back to Home Page
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
