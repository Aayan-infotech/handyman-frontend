import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getProviderNearbyJobs = createAsyncThunk(
  "/Provider/getProviderNearbyJobs",
  async (
    { businessType, services, latitude, longitude, radius, page, limit },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `http://44.196.64.110:7777/api/provider/getNearbyJobs`,
        {
          businessType,
          services,
          latitude,
          longitude,
          radius,
          page,
          limit,
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
  provider: [],
  status: "idle",
  error: null,
};

const ProviderSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProviderNearbyJobs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getProviderNearbyJobs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(getProviderNearbyJobs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default ProviderSlice.reducer;
