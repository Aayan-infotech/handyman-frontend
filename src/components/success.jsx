import React, { useEffect } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "./axiosInstance";
import { useLocation } from "react-router-dom";

const PaymentSuccessPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);
  const sessionId = searchParams.get("session_id");

  const handlePaymentSuccess = async () => {
    try {
      const response = await axiosInstance.get(`/stripe/session/${sessionId}`);
      if (response.status === 200) {
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handlePaymentSuccess();
  }, [sessionId]);
  return (
    <Container maxWidth="md" className="mt-5">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        p={4}
        className="shadow rounded bg-white"
      >
        <CheckCircleIcon
          style={{ fontSize: 80, color: "#4CAF50" }}
          className="mb-3"
        />
        <Typography variant="h3" component="h1" className="mb-3 text-success">
          Payment Successful!
        </Typography>
        <Typography variant="h5" component="h2" className="mb-4">
          Thank you for your purchase
        </Typography>
        <Typography variant="body1" className="mb-4">
          Your payment has been processed successfully.
        </Typography>
        <Box display="flex" gap={2} className="mt-3">
          <Button
            variant="contained"
            color="success"
            size="large"
            href="/provider/home"
            className="custom-green bg-green-custom rounded-5 py-3 w-100 px-5"
          >
            View Home
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default PaymentSuccessPage;
