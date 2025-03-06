import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const handlePayment = createAsyncThunk(
  "/Payment/createPayment",
  async (
    {
      transactionId,
      transactionDate,
      transactionStatus,
      transactionAmount,
      transactionMode,
      SubscriptionId,
      SubscriptionAmount,
      type
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `http://54.236.98.193:7777/api/payment/createPayment`,
        {
          transactionId,
          transactionDate,
          transactionStatus,
          transactionAmount,
          transactionMode,
          SubscriptionId,
          SubscriptionAmount,
          type
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ProviderToken")}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data); // Handle errors and send them to the reducer
    }
  }
);

const initialState = {
  payment: [],
  status: "idle",
  error: null,
};

const PaymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(handlePayment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(handlePayment.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(handlePayment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default PaymentSlice.reducer;
