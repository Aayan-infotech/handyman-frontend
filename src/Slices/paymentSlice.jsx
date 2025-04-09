import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../components/axiosInstance";
// export const handlePayment = createAsyncThunk(
//   "/Payment/createPayment",
//   async (
//     {
//       transactionId,
//       transactionDate,
//       transactionStatus,
//       transactionAmount,
//       transactionMode,
//       SubscriptionId,
//       SubscriptionAmount,
//       type
//     },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await axios.post(
//         `http://3.223.253.106:7777/api/payment/createPayment`,
//         {
//           transactionId,
//           transactionDate,
//           transactionStatus,
//           transactionAmount,
//           transactionMode,
//           SubscriptionId,
//           SubscriptionAmount,
//           type
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("ProviderToken")}`,
//           },
//         }
//       );

//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data); // Handle errors and send them to the reducer
//     }
//   }
// );

//divyanshi comment
// export const handlePayment = createAsyncThunk(
//   "/Payment/createPayment",
//   async (
//     {
//       transactionId,
//       transactionDate,
//       transactionStatus,
//       transactionAmount,
//       transactionMode,
//       SubscriptionId,
//       SubscriptionAmount,
//       type
//     },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await axios.post(
//         `http://3.223.253.106:7777/api/demoTransaction/transaction`,
//         {
//           transactionId,
//           transactionDate,
//           transactionStatus,
//           transactionAmount,
//           transactionMode,
//           SubscriptionId,
//           SubscriptionAmount,
//           type
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("ProviderToken")}`,
//           },
//         }
//       );

//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data); // Handle errors and send them to the reducer
//     }
//   }
// );

export const handlePayment = createAsyncThunk(
  "/Payment/createPayment",
  async (
    {
      transactionId,
      userId, // ✅ Added userId
      subscriptionPlanId, // ✅ Added subscriptionPlanId
      amount, // ✅ Added amount
      paymentMethod, // ✅ Added paymentMethod
      transactionDate,
      transactionStatus,
      transactionAmount,
      transactionMode,
      SubscriptionId,
      SubscriptionAmount,
      type,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post(
        `/demoTransaction/transaction`,
        {
          transactionId,
          userId,
          subscriptionPlanId,
          amount,
          paymentMethod,
          transactionDate,
          transactionStatus,
          transactionAmount,
          transactionMode,
          SubscriptionId,
          SubscriptionAmount,
          type,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ProviderToken")}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
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
