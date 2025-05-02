import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import "bootstrap/dist/css/bootstrap.min.css";

const PaymentFailedPage = () => {
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
        <ErrorIcon
          style={{ fontSize: 80, color: "#F44336" }}
          className="mb-3"
        />
        <Typography variant="h3" component="h1" className="mb-3 text-danger">
          Payment Failed
        </Typography>
        <Typography variant="h5" component="h2" className="mb-4">
          We couldn't process your payment
        </Typography>
        <Typography variant="body1" className="mb-4">
          Your payment was not successful. Please check your payment details and
          try again.
        </Typography>
        <Box display="flex" gap={2} className="mt-3">
          <Button
            variant="contained"
            color="error"
            size="large"
            className="custom-green bg-green-custom rounded-5 py-3 w-100 px-5"
            href="/provider/pricing"
          >
            Try Again
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default PaymentFailedPage;
